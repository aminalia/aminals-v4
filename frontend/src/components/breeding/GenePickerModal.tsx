/**
 * GenePickerModal Component
 * Modal for selecting genes from available genes, browsing all genes, or creating new ones
 */

import { Button } from '@components/ui/Button';
import { CategoryFilter, useGenes } from '@hooks';
import type { Gene } from '@types/breeding';
import { useMemo, useState } from 'react';
import CreateGenePage from '../CreateGenePage';

const CATEGORIES = [
  { id: 0, label: 'Background', emoji: '🌄' },
  { id: 1, label: 'Arms', emoji: '💪' },
  { id: 2, label: 'Tail', emoji: '🦎' },
  { id: 3, label: 'Ears', emoji: '👂' },
  { id: 4, label: 'Body', emoji: '🎨' },
  { id: 5, label: 'Face', emoji: '😊' },
  { id: 6, label: 'Mouth', emoji: '👄' },
  { id: 7, label: 'Misc', emoji: '✨' },
];

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
  const [view, setView] = useState<'parent' | 'all'>('parent');
  const [showCreateGene, setShowCreateGene] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  // Get category key for the API
  const categoryKey = useMemo(() => {
    return selectedCategory.toString() as CategoryFilter;
  }, [selectedCategory]);

  // Fetch all genes when in "all" view (only fetch when view is "all")
  const shouldFetchAll = view === 'all';
  const { data: allGenes, isLoading: isLoadingAllGenes } = useGenes(
    'all',
    'newest',
    categoryKey
  );

  // Determine which genes to show
  const genesToShow = view === 'parent' ? availableGenes : allGenes || [];

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

        {/* Category Filter (only for "all" view) */}
        {view === 'all' && (
          <div className="px-6 py-3 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    selectedCategory === category.id
                      ? 'bg-energy/20 text-energy border border-energy/30'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  <span>{category.emoji}</span>
                  <span>{category.label}</span>
                </button>
              ))}
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
                  : 'No genes found in this category'}
              </p>
              {view === 'all' && (
                <Button
                  variant="energy"
                  size="sm"
                  onClick={() => setShowCreateGene(true)}
                  className="mt-4"
                >
                  Create the first one
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
                    dangerouslySetInnerHTML={{ __html: gene.svg }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="text-xs text-white font-medium text-center">
                      Gene #{gene.tokenId}
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
