import AminalGrid from '@/components/aminal-grid';
import { cn } from '@/lib/utils';
import { AminalFilter, AminalSort, useAminals } from '@/resources/aminals';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from './_layout';

const HomePage: NextPage = () => {
  const { address } = useAccount();
  const [filter, setFilter] = useState<AminalFilter>('all');
  const [sort, setSort] = useState<AminalSort>('most-loved');

  const { data: aminals, isLoading: isLoadingAminals } = useAminals(
    address as string,
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
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            {!address ? (
              <div className="flex items-center justify-center h-[50vh] text-gray-500 bg-gray-50 rounded-lg py-12">
                Connect your wallet to view your Aminals
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
                  {/* Count */}
                  <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {aminals?.length || 0} Aminals found
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Filter:</span>
                      <div className="flex gap-2">
                        <button
                          className={cn(
                            'px-3 py-1.5 text-sm rounded-full font-medium transition-colors',
                            filter === 'all'
                              ? 'bg-gray-900 text-white hover:bg-gray-800'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                          )}
                          onClick={() => setFilter('all')}
                        >
                          All
                        </button>
                        <button
                          className={cn(
                            'px-3 py-1.5 text-sm rounded-full font-medium transition-colors',
                            filter === 'loved'
                              ? 'bg-gray-900 text-white hover:bg-gray-800'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                          )}
                          onClick={() => setFilter('loved')}
                        >
                          Lovers
                        </button>
                      </div>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Sort by:</span>
                      <select
                        className="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as AminalSort)}
                      >
                        <option value="most-loved">Most Loved</option>
                        <option value="least-loved">Least Loved</option>
                        <option value="oldest">Oldest</option>
                        <option value="youngest">Youngest</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isLoadingAminals ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : aminals?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      No Aminals found matching your filter.
                    </p>
                  </div>
                ) : (
                  <AminalGrid aminals={aminals || []} />
                )}
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
