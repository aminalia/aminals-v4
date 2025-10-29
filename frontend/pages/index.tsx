import AminalGrid from '@components/AminalGrid';
import { ContentContainer } from '@components/layout/ContentContainer';
import { NoAminalsFound } from '@components/ui/EmptyState';
import { AminalsFilterBar } from '@components/ui/FilterBar';
import { PageLoadingSpinner } from '@components/ui/LoadingSpinner';
import { AminalFilter, AminalSort, useAminals } from '@hooks';
import { useHasMounted } from '@hooks/useHasMounted';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from './_layout';

const HomePage: NextPage = () => {
  const hasMounted = useHasMounted();
  const { address } = useAccount();
  const [filter, setFilter] = useState<AminalFilter>('all');
  const [sort, setSort] = useState<AminalSort>('most-loved');

  const { data: aminals, isLoading: isLoadingAminals } = useAminals(
    address || '',
    filter,
    sort
  );

  return (
    <>
      <Head>
        <title>Aminals</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Layout>
        <div className="py-8">
          <ContentContainer layout="single" gap="lg">
            <AminalsFilterBar
              activeFilter={filter}
              onFilterChange={(value) => setFilter(value as AminalFilter)}
              activeSort={sort}
              onSortChange={(value) => setSort(value as AminalSort)}
              resultsCount={aminals?.length || 0}
              actions={
                hasMounted && !address ? (
                  <div className="text-sm text-primary bg-primary/10 px-3 py-2 rounded-full">
                    💡 Connect your wallet to interact with Aminals
                  </div>
                ) : null
              }
            />

            {isLoadingAminals ? (
              <PageLoadingSpinner />
            ) : aminals?.length === 0 ? (
              <NoAminalsFound />
            ) : (
              <AminalGrid aminals={aminals || []} />
            )}
          </ContentContainer>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
