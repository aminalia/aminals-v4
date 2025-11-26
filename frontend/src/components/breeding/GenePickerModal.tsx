/**
 * GenePickerModal Component
 * Modal for selecting genes from available genes, browsing all genes, or creating new ones
 */

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
import { CategoryFilter, GeneFilter, useGenes } from '@hooks';
import { cn } from '@lib/utils';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import type { Gene } from '../../types/breeding';
import CreateGenePage from '../CreateGenePage';

export interface GenePickerModalProps {
  availableGenes: Gene[];
  onSelectGene: (gene: Gene) => void;
  onClose: () => void;
}

export default function GenePickerModal({
  availableGenes,
  onSelectGene,
  onClose,
}: GenePickerModalProps) {
  const { address } = useAccount();
  const [view, setView] = useState<'parent' | 'all'>('parent');
  const [showCreateGene, setShowCreateGene] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<GeneFilter>('all');

  // Fetch all genes (unfiltered) for category discovery
  const { data: allGenesUnfiltered } = useGenes(
    'all',
    'created-at',
    'all',
    address
  );

  // Fetch filtered genes based on selected category and owner filter
  const { data: allGenes, isLoading: isLoadingAllGenes } = useGenes(
    ownerFilter,
    'created-at',
    selectedCategory as CategoryFilter,
    address
  );

  // Build category options dynamically from gene data
  const categoryOptions: SelectOption[] = useMemo(() => {
    const suggestedKeys = Object.keys(SUGGESTED_CATEGORIES);
    const discoveredCategories = new Set<string>();

    if (allGenesUnfiltered) {
      for (const gene of allGenesUnfiltered) {
        if (gene.category) {
          discoveredCategories.add(gene.category);
        }
      }
    }

    const result: SelectOption[] = [];
    const addedKeys = new Set<string>();

    // Add suggested categories that exist in data
    for (const key of suggestedKeys) {
      const count =
        allGenesUnfiltered?.filter(
          (g) => g.category?.toLowerCase() === key.toLowerCase()
        ).length || 0;
      if (count > 0) {
        result.push({
          value: key,
          label: getCategoryLabel(key),
          emoji: getCategoryEmoji(key),
          count,
        });
        addedKeys.add(key.toLowerCase());
      }
    }

    // Add discovered categories not in suggested
    for (const cat of discoveredCategories) {
      if (!addedKeys.has(cat.toLowerCase())) {
        const count =
          allGenesUnfiltered?.filter(
            (g) => g.category?.toLowerCase() === cat.toLowerCase()
          ).length || 0;
        result.push({
          value: cat,
          label: getCategoryLabel(cat),
          emoji: getCategoryEmoji(cat),
          count,
        });
      }
    }

    result.sort((a, b) => (b.count || 0) - (a.count || 0));
    return result;
  }, [allGenesUnfiltered]);

  // Determine which genes to show - map allGenes to Gene type if needed
  const genesToShow: Gene[] = useMemo(() => {
    if (view === 'parent') {
      return availableGenes;
    }

    if (!allGenes) {
      return [];
    }

    // Map GeneNFT to Gene type
    return allGenes.map((gene) => ({
      id: gene.id,
      tokenId: gene.tokenId.toString(),
      owner: {
        id: gene.ownerId,
        address: gene.ownerId,
      },
      creator: {
        id: gene.creatorId,
        address: gene.creatorId,
      },
      svg: gene.svg || '',
      name: gene.name || undefined,
      description: gene.description || undefined,
      totalEarnings: gene.totalEarnings,
    }));
  }, [view, availableGenes, allGenes]);

  const handleSelectGene = (gene: Gene) => {
    onSelectGene(gene);
    onClose();
  };

  const handleCreateGeneSuccess = () => {
    setShowCreateGene(false);
    // Optionally could refetch genes here
  };

  if (showCreateGene) {
    return (
      <CreateGenePage
        isOpen={showCreateGene}
        onClose={() => setShowCreateGene(false)}
        onSuccess={handleCreateGeneSuccess}
        preSelectedCategory={selectedCategory}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold">Select Gene</h3>
            <p className="text-xs text-muted-foreground">
              Choose from parent genes or browse the entire gene registry
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* View Toggle */}
        <div className="px-6 pt-4 pb-2 border-b border-border">
          <div className="flex gap-2">
            <button
              onClick={() => setView('parent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'parent'
                  ? 'bg-energy text-energy-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              Parent Genes ({availableGenes.length})
            </button>
            <button
              onClick={() => setView('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'all'
                  ? 'bg-energy text-energy-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              All Genes
            </button>
            <div className="flex-1" />
            <Button
              variant="energy"
              size="sm"
              onClick={() => setShowCreateGene(true)}
            >
              ✨ Create New Gene
            </Button>
          </div>
        </div>

        {/* Filters (only for "all" view) */}
        {view === 'all' && (
          <div className="px-6 py-3 border-b border-border">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <SearchableSelect
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Categories"
                searchPlaceholder="Search"
                allOption={{
                  value: 'all',
                  label: 'All Categories',
                  emoji: '🧬',
                }}
                className="w-48"
              />

              {/* Owner Toggle */}
              <div className="flex rounded-lg border border-border bg-card p-0.5">
                <button
                  className={cn(
                    'px-3 py-1 text-xs rounded-md font-medium transition-all',
                    ownerFilter === 'all'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => setOwnerFilter('all')}
                >
                  All
                </button>
                <button
                  className={cn(
                    'px-3 py-1 text-xs rounded-md font-medium transition-all',
                    ownerFilter === 'yours'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                    !address && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => address && setOwnerFilter('yours')}
                  disabled={!address}
                  title={!address ? 'Connect wallet to filter' : undefined}
                >
                  My Genes
                </button>
              </div>

              <span className="text-sm text-muted-foreground ml-auto">
                {genesToShow.length} genes
              </span>
            </div>
          </div>
        )}

        {/* Gene Grid */}
        <div className="flex-1 overflow-auto p-6">
          {view === 'all' && isLoadingAllGenes ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy"></div>
                <div className="text-muted-foreground">Loading genes...</div>
              </div>
            </div>
          ) : genesToShow.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">🧬</div>
              <h3 className="text-lg font-semibold mb-2">No genes found</h3>
              <p className="text-sm">
                {view === 'parent'
                  ? 'No genes available from parents'
                  : ownerFilter === 'yours'
                  ? "You don't own any genes yet"
                  : 'No genes found in this category'}
              </p>
              {view === 'all' && (
                <Button
                  variant="energy"
                  size="sm"
                  onClick={() => setShowCreateGene(true)}
                  className="mt-4"
                >
                  {ownerFilter === 'yours'
                    ? 'Create your first gene'
                    : 'Create the first one'}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {genesToShow.map((gene) => (
                <button
                  key={gene.id}
                  className="group relative aspect-square bg-muted rounded-lg border-2 border-border hover:border-energy transition-all overflow-hidden hover:shadow-lg"
                  onClick={() => handleSelectGene(gene)}
                >
                  <svg
                    viewBox="0 0 1000 1000"
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: gene.svg || '' }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="text-xs text-white font-medium text-center truncate">
                      {gene.name || `Gene #${gene.tokenId}`}
                    </div>
                  </div>
                  {/* Hover indicator */}
                  <div className="absolute inset-0 bg-energy/0 group-hover:bg-energy/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-energy text-energy-foreground px-3 py-1.5 rounded-full text-xs font-medium">
                      Select
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
