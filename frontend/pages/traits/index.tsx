import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { cn } from '@/lib/utils';
import {
  CategoryFilter,
  TraitFilter,
  TraitSort,
  useTraits,
} from '@/resources/traits';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Layout from '../_layout';

// Import dynamically to avoid module resolution issues
const TraitCard = dynamic(() => import('../../src/components/trait-card'), {
  ssr: false,
});

const CreateGeneModal = dynamic(() => import('../../src/components/create-gene-modal').then(mod => ({ default: mod.default })), {
  ssr: false,
});

const TraitsPage: NextPage = () => {
  const { address } = useAccount();
  const [filter, setFilter] = useState<TraitFilter>('all');
  const [sort, setSort] = useState<TraitSort>('aminals-count');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: traits, isLoading: isLoadingTraits, error: traitsError, isError: isTraitsError } = useTraits(
    filter,
    sort,
    category
  );

  console.log('Traits data:', traits);
  console.log('Traits loading:', isLoadingTraits);
  console.log('Traits error:', traitsError);
  console.log('Is traits error:', isTraitsError);

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Traits Gallery</h1>
              <p className="text-gray-600">
                Browse and discover unique traits for Aminals
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="self-start sm:self-auto"
            >
              ✨ Create New Gene
            </Button>
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

          {/* Category Filters */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              <button
                className={cn(
                  'px-3 py-1.5 text-sm rounded-full font-medium transition-colors flex items-center gap-1',
                  category === 'all'
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => setCategory('all')}
              >
                <span>🔍</span>
                <span>All Categories</span>
              </button>

              {/* Generate a button for each trait category */}
              {Object.entries(TRAIT_CATEGORIES).map(
                ([key, { name, emoji }]) => (
                  <button
                    key={key}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full font-medium transition-colors flex items-center gap-1',
                      category === key
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    )}
                    onClick={() => setCategory(key as CategoryFilter)}
                  >
                    <span>{emoji}</span>
                    <span>{name}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {isLoadingTraits ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isTraitsError ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600">
                Error loading traits: {traitsError?.message || 'Unknown error'}
              </p>
              <p className="text-sm text-red-500 mt-2">
                Check the console for more details.
              </p>
            </div>
          ) : !traits || traits.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No traits found matching your filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {traits.map((trait: any) => (
                <TraitCard
                  key={trait.id}
                  trait={trait}
                  aminalCount={trait.aminalsUsingGene?.length || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Gene Modal */}
      <CreateGeneModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Refresh the traits list after successful creation
          window.location.reload();
        }}
      />
    </Layout>
  );
};

export default TraitsPage;
