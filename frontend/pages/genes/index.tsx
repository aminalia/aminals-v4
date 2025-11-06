import { Button } from '@components/ui/Button';
import { TRAIT_CATEGORIES } from '@constants/trait-categories';
import { CategoryFilter, GeneFilter, GeneSort, useGenes } from '@hooks';
import { useHasMounted } from '@hooks/useHasMounted';
import { cn } from '@lib/utils';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../_layout';

// Import dynamically to avoid module resolution issues
const TraitCard = dynamic(() => import('../../src/components/TraitCard'), {
  ssr: false,
});

const CreateGenePage = dynamic(
  () =>
    import('../../src/components/CreateGenePage').then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
  }
);

const TraitsPage: NextPage = () => {
  const hasMounted = useHasMounted();
  const { address } = useAccount();
  const [filter, setFilter] = useState<GeneFilter>('all');
  const [sort, setSort] = useState<GeneSort>('aminals-count');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: genes,
    isLoading: isLoadingGenes,
    error: genesError,
    isError: isGenesError,
  } = useGenes(filter, sort, category, address);

  console.log('Genes data:', genes);
  console.log('Genes loading:', isLoadingGenes);
  console.log('Genes error:', genesError);
  console.log('Is genes error:', isGenesError);
  console.log(
    'Ponder URL:',
    process.env.NEXT_PUBLIC_PONDER_URL || 'http://localhost:42069/sql'
  );

  return (
    <Layout>
      <div className="py-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Genes Gallery</h1>
              <p className="text-muted-foreground">
                Browse and discover unique genes for Aminals
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
            <div className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {genes?.length || 0} Genes found
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter:</span>
                <div className="flex gap-2">
                  <button
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full font-medium transition-colors',
                      filter === 'all'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-card border border-border text-foreground hover:bg-muted'
                    )}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full font-medium transition-colors',
                      filter === 'yours'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-card border border-border text-foreground hover:bg-muted',
                      // Only apply disabled styles after mount to prevent hydration mismatch
                      hasMounted && !address && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => setFilter('yours')}
                    disabled={hasMounted && !address}
                  >
                    Your Genes
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                  className="px-3 py-1.5 text-sm rounded-full border border-border bg-card text-foreground font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as GeneSort)}
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
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
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
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-card border border-border text-foreground hover:bg-muted'
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

          {isLoadingGenes ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isGenesError ? (
            <div className="text-center py-12 bg-destructive/10 rounded-lg">
              <p className="text-destructive">
                Error loading genes: {genesError?.message || 'Unknown error'}
              </p>
              <p className="text-sm text-destructive mt-2">
                Check the console for more details.
              </p>
            </div>
          ) : !genes || genes.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                No genes found matching your filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {genes.map((gene: any) => (
                <TraitCard
                  key={gene.id}
                  trait={gene}
                  aminalCount={gene.aminalCount || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Gene Page */}
      <CreateGenePage
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
