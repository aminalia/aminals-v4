import { Button } from '@components/ui/Button';
import {
  SearchableSelect,
  type SelectOption,
} from '@components/ui/SearchableSelect';
import {
  getCategoryEmoji,
  getCategoryLabel,
  SUGGESTED_CATEGORIES,
} from '@constants/trait-categories';
import { CategoryFilter, GeneFilter, GeneSort, useGenes } from '@hooks';
import { useHasMounted } from '@hooks/useHasMounted';
import { cn } from '@lib/utils';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../_layout';

// Import dynamically to avoid module resolution issues
const GeneCard = dynamic(() => import('../../src/components/GeneCard'), {
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

  // Fetch all genes first (unfiltered by category) to discover categories
  const { data: allGenes, isLoading: isLoadingAllGenes } = useGenes(
    filter,
    sort,
    'all',
    address
  );

  // Then apply category filter for display
  const {
    data: genes,
    isLoading: isLoadingGenes,
    error: genesError,
    isError: isGenesError,
  } = useGenes(filter, sort, category, address);

  // Build hybrid category list: suggested categories + discovered from data
  const categoryOptions: SelectOption[] = useMemo(() => {
    // Start with suggested categories
    const suggestedKeys = Object.keys(SUGGESTED_CATEGORIES);

    // Discover unique categories from the data
    const discoveredCategories = new Set<string>();
    if (allGenes) {
      for (const gene of allGenes) {
        if (gene.category) {
          discoveredCategories.add(gene.category);
        }
      }
    }

    // Combine: suggested first (if they exist in data), then any additional discovered
    const result: SelectOption[] = [];
    const addedKeys = new Set<string>();

    // Add suggested categories that exist in the data
    for (const key of suggestedKeys) {
      const matchingGenes =
        allGenes?.filter(
          (g) => g.category?.toLowerCase() === key.toLowerCase()
        ) || [];
      if (matchingGenes.length > 0) {
        result.push({
          value: key,
          label: getCategoryLabel(key),
          emoji: getCategoryEmoji(key),
          count: matchingGenes.length,
        });
        addedKeys.add(key.toLowerCase());
      }
    }

    // Add any discovered categories not in suggested
    for (const cat of discoveredCategories) {
      if (!addedKeys.has(cat.toLowerCase())) {
        const count =
          allGenes?.filter(
            (g) => g.category?.toLowerCase() === cat.toLowerCase()
          ).length || 0;
        result.push({
          value: cat,
          label: getCategoryLabel(cat),
          emoji: getCategoryEmoji(cat),
          count,
        });
        addedKeys.add(cat.toLowerCase());
      }
    }

    // Sort by count (most used first)
    result.sort((a, b) => (b.count || 0) - (a.count || 0));

    return result;
  }, [allGenes]);

  // Total count for "All" option
  const totalGeneCount = allGenes?.length || 0;

  const isLoading = isLoadingGenes || isLoadingAllGenes;

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

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-muted/50 rounded-xl">
            {/* Left side - Category & Owner filters */}
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              {/* Category Select */}
              <SearchableSelect
                options={categoryOptions}
                value={category}
                onChange={(val) => setCategory(val as CategoryFilter)}
                placeholder="All Categories"
                searchPlaceholder="Search"
                allOption={{
                  value: 'all',
                  label: 'All Categories',
                  emoji: '🧬',
                }}
                className="sm:w-48"
              />

              {/* Owner Toggle */}
              <div className="flex rounded-lg border border-border bg-card p-0.5">
                <button
                  className={cn(
                    'px-4 py-1.5 text-sm rounded-md font-medium transition-all',
                    filter === 'all'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setFilter('all')}
                >
                  All Genes
                </button>
                <button
                  className={cn(
                    'px-4 py-1.5 text-sm rounded-md font-medium transition-all',
                    filter === 'yours'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                    hasMounted && !address && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => setFilter('yours')}
                  disabled={hasMounted && !address}
                  title={
                    !address ? 'Connect wallet to view your genes' : undefined
                  }
                >
                  My Genes
                </button>
              </div>
            </div>

            {/* Right side - Sort & Count */}
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 text-sm rounded-lg border border-border bg-card text-foreground font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                value={sort}
                onChange={(e) => setSort(e.target.value as GeneSort)}
              >
                <option value="aminals-count">Most Used</option>
                <option value="most-profitable">Most Profitable</option>
                <option value="created-at">Newest</option>
              </select>

              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {genes?.length || 0} results
              </span>
            </div>
          </div>

          {isLoading ? (
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
                <GeneCard
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
