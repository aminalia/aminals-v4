import { cn } from '@/lib/utils';
import { TraitFilter, TraitSort, useTraits } from '@/resources/traits';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../_layout';

// Import dynamically to avoid module resolution issues
const TraitCard = dynamic(() => import('../../src/components/trait-card'), {
  ssr: false,
});

const TraitsPage: NextPage = () => {
  const { address } = useAccount();
  const [filter, setFilter] = useState<TraitFilter>('all');
  const [sort, setSort] = useState<TraitSort>('aminals-count');

  const { data: traits, isLoading: isLoadingTraits } = useTraits(filter, sort);

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Traits Gallery</h1>
            <p className="text-gray-600">
              Browse and discover unique traits for Aminals
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
            {/* Count */}
            <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {traits?.length || 0} Traits found
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
                      filter === 'yours'
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    )}
                    onClick={() => setFilter('yours')}
                    disabled={!address}
                  >
                    Your Traits
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  className="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as TraitSort)}
                >
                  <option value="aminals-count">Most Used</option>
                  <option value="created-at">Most Recent</option>
                </select>
              </div>
            </div>
          </div>

          {isLoadingTraits ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !traits || traits.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No traits found matching your filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {traits.map((trait) => (
                <TraitCard
                  key={trait.id}
                  trait={trait}
                  aminalCount={trait.aminals?.length || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TraitsPage;
