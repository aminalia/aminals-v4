import AminalGrid from '@/components/aminal-grid';
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {address && (
                <div className="text-sm text-gray-500">
                  {aminals?.length || 0} Aminals found
                </div>
              )}

              {address && (
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filter:</span>
                    <div className="flex rounded-md overflow-hidden border border-gray-200">
                      <button
                        className={`px-3 py-1.5 text-sm ${
                          filter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setFilter('all')}
                      >
                        All
                      </button>
                      <button
                        className={`px-3 py-1.5 text-sm ${
                          filter === 'loved'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setFilter('loved')}
                      >
                        Lovers
                      </button>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-200 bg-white"
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
              )}
            </div>

            {!address ? (
              <div className="flex items-center justify-center h-[50vh] text-gray-500">
                Connect your wallet to view your Aminals
              </div>
            ) : isLoadingAminals ? (
              <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div className="text-gray-500">Loading your Aminals...</div>
                </div>
              </div>
            ) : aminals?.length === 0 ? (
              <div className="flex items-center justify-center h-[50vh] text-gray-500">
                No Aminals found
              </div>
            ) : (
              <AminalGrid aminals={aminals || []} />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
