/**
 * DesignBuilder Component
 * Visual editor for creating/modifying Aminal designs with 1-10 genes
 *
 * Features:
 * - Gene slots panel (add/remove/reorder genes)
 * - Canvas preview with SVG rendering
 * - Placement controls (x, y, scale, rotation) per gene
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  DesignBuilderState,
  GeneMetadata,
  Gene,
} from '@types/breeding';
import {
  createEmptyDesign,
  DEFAULT_PLACEMENT,
  countGenes,
} from '@hooks';
import GenePickerModal from './GenePickerModal';

export interface DesignBuilderProps {
  initialGeneIds?: bigint[];
  initialPlacements?: GeneMetadata[];
  availableGenes?: Gene[]; // Parent genes by default
  onDesignChange?: (geneIds: bigint[], placements: GeneMetadata[]) => void;
  disabled?: boolean;
  maxGenes?: number; // Default 10
}

export default function DesignBuilder({
  initialGeneIds = [],
  initialPlacements = [],
  availableGenes = [],
  onDesignChange,
  disabled = false,
  maxGenes = 10,
}: DesignBuilderProps) {
  // Initialize state
  const [design, setDesign] = useState<DesignBuilderState>(() => {
    if (initialGeneIds.length > 0) {
      // Pad to 10 slots
      const paddedGeneIds = [...initialGeneIds];
      while (paddedGeneIds.length < 10) {
        paddedGeneIds.push(0n);
      }

      const paddedPlacements = [...initialPlacements];
      while (paddedPlacements.length < 10) {
        paddedPlacements.push(DEFAULT_PLACEMENT);
      }

      return {
        geneIds: paddedGeneIds.slice(0, 10),
        placements: paddedPlacements.slice(0, 10),
        selectedGeneIndex: null,
        isDirty: false,
      };
    }
    return createEmptyDesign();
  });

  const [showGenePickerIndex, setShowGenePickerIndex] = useState<number | null>(null);

  // Cache for genes that have been added to the design (including custom genes)
  const [geneCache, setGeneCache] = useState<Map<string, Gene>>(new Map());

  // Initialize cache with availableGenes (parent genes)
  useEffect(() => {
    if (availableGenes && availableGenes.length > 0) {
      setGeneCache((prev) => {
        const newCache = new Map(prev);
        availableGenes.forEach((gene) => {
          newCache.set(gene.tokenId.toString(), gene);
        });
        return newCache;
      });
    }
  }, [availableGenes]);

  // Notify parent of changes
  useEffect(() => {
    if (design.isDirty && onDesignChange) {
      onDesignChange(design.geneIds, design.placements);
    }
  }, [design.geneIds, design.placements, design.isDirty, onDesignChange]);

  // Add gene to first empty slot
  const handleAddGene = useCallback((gene: Gene) => {
    // Add gene to cache
    setGeneCache((prev) => {
      const newCache = new Map(prev);
      newCache.set(gene.tokenId.toString(), gene);
      return newCache;
    });

    setDesign((prev) => {
      const firstEmptyIndex = prev.geneIds.findIndex((id) => id === 0n);
      if (firstEmptyIndex === -1) return prev; // No empty slots

      const newGeneIds = [...prev.geneIds];
      const newPlacements = [...prev.placements];

      newGeneIds[firstEmptyIndex] = BigInt(gene.tokenId);
      newPlacements[firstEmptyIndex] = { ...DEFAULT_PLACEMENT };

      return {
        ...prev,
        geneIds: newGeneIds,
        placements: newPlacements,
        selectedGeneIndex: firstEmptyIndex,
        isDirty: true,
      };
    });
    setShowGenePickerIndex(null);
  }, []);

  // Remove gene from specific slot
  const handleRemoveGene = useCallback((index: number) => {
    if (disabled) return;

    setDesign((prev) => {
      const newGeneIds = [...prev.geneIds];
      newGeneIds[index] = 0n;

      return {
        ...prev,
        geneIds: newGeneIds,
        selectedGeneIndex: prev.selectedGeneIndex === index ? null : prev.selectedGeneIndex,
        isDirty: true,
      };
    });
  }, [disabled]);

  // Select gene for editing placement
  const handleSelectGene = useCallback((index: number) => {
    if (disabled) return;
    setDesign((prev) => ({ ...prev, selectedGeneIndex: index }));
  }, [disabled]);

  // Update placement for a specific gene
  const handleUpdatePlacement = useCallback(
    (index: number, placementUpdate: Partial<GeneMetadata>) => {
      if (disabled) return;

      setDesign((prev) => {
        const newPlacements = [...prev.placements];
        newPlacements[index] = {
          ...newPlacements[index],
          ...placementUpdate,
        };

        return {
          ...prev,
          placements: newPlacements,
          isDirty: true,
        };
      });
    },
    [disabled]
  );

  // Move gene from one slot to another (reorder)
  const handleMoveGene = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled || fromIndex === toIndex) return;

      setDesign((prev) => {
        const newGeneIds = [...prev.geneIds];
        const newPlacements = [...prev.placements];

        // Swap genes and their placements
        [newGeneIds[fromIndex], newGeneIds[toIndex]] = [
          newGeneIds[toIndex],
          newGeneIds[fromIndex],
        ];
        [newPlacements[fromIndex], newPlacements[toIndex]] = [
          newPlacements[toIndex],
          newPlacements[fromIndex],
        ];

        return {
          ...prev,
          geneIds: newGeneIds,
          placements: newPlacements,
          isDirty: true,
        };
      });
    },
    [disabled]
  );

  // Reset placement to default for selected gene
  const handleResetPlacement = useCallback(() => {
    if (design.selectedGeneIndex === null) return;
    handleUpdatePlacement(design.selectedGeneIndex, DEFAULT_PLACEMENT);
  }, [design.selectedGeneIndex, handleUpdatePlacement]);

  // Helper to get gene data by ID
  const getGeneById = useCallback(
    (geneId: bigint): Gene | undefined => {
      // First check the cache (for custom genes added from "All Genes")
      const cached = geneCache.get(geneId.toString());
      if (cached) return cached;

      // Fall back to availableGenes (parent genes)
      return availableGenes.find((g) => BigInt(g.tokenId) === geneId);
    },
    [availableGenes, geneCache]
  );

  // Render gene SVG with placement transforms
  const renderGeneWithPlacement = useCallback(
    (geneId: bigint, placement: GeneMetadata) => {
      const gene = getGeneById(geneId);
      if (!gene || !gene.svg) return '';

      const { offsetX, offsetY, scale, rotation } = placement;

      return `
        <g transform="translate(${offsetX}, ${offsetY}) rotate(${rotation}, 500, 500) scale(${scale / 100})">
          ${gene.svg}
        </g>
      `;
    },
    [getGeneById]
  );

  const geneCount = countGenes(design.geneIds);
  const selectedGene =
    design.selectedGeneIndex !== null
      ? design.geneIds[design.selectedGeneIndex]
      : null;
  const selectedPlacement =
    design.selectedGeneIndex !== null
      ? design.placements[design.selectedGeneIndex]
      : null;

  return (
    <div
      className={`flex flex-col lg:flex-row gap-4 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
    >
      {/* Gene Slots Panel (Left) */}
      <div className="w-full lg:w-64 bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Gene Slots</h3>
          <span className="text-xs text-muted-foreground">
            {geneCount}/10 genes
          </span>
        </div>

        {/* Gene Slots List */}
        <div className="space-y-2">
          {design.geneIds.map((geneId, index) => {
            const gene = geneId !== 0n ? getGeneById(geneId) : null;
            return (
              <div
                key={index}
                className={`p-2 rounded border transition-colors cursor-pointer ${
                  design.selectedGeneIndex === index
                    ? 'border-energy bg-energy/10'
                    : 'border-border hover:border-energy/50'
                } ${geneId === 0n ? 'opacity-50' : ''}`}
                onClick={() => !disabled && handleSelectGene(index)}
              >
                {geneId === 0n ? (
                  <div
                    className="text-xs text-center py-1 text-muted-foreground cursor-pointer hover:text-energy"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGenePickerIndex(index);
                    }}
                  >
                    + Add to slot {index + 1}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Gene preview thumbnail */}
                    {gene?.svg && (
                      <div className="w-8 h-8 bg-muted rounded border border-border overflow-hidden flex-shrink-0">
                        <svg
                          viewBox="0 0 1000 1000"
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ __html: gene.svg }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        Gene #{geneId.toString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Slot {index + 1}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {/* Move up */}
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveGene(index, index - 1);
                          }}
                          className="text-xs text-muted-foreground hover:text-energy"
                          disabled={disabled}
                          title="Move up (back layer)"
                        >
                          ↑
                        </button>
                      )}
                      {/* Move down */}
                      {index < 9 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveGene(index, index + 1);
                          }}
                          className="text-xs text-muted-foreground hover:text-energy"
                          disabled={disabled}
                          title="Move down (front layer)"
                        >
                          ↓
                        </button>
                      )}
                      {/* Remove */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGene(index);
                        }}
                        className="text-xs text-destructive hover:text-destructive/80"
                        disabled={disabled}
                        title="Remove gene"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Gene Button */}
        {geneCount < maxGenes && (
          <button
            className="w-full mt-3 py-2 text-sm border border-dashed border-border rounded hover:border-energy hover:bg-energy/5 transition-colors"
            onClick={() => {
              const firstEmptyIndex = design.geneIds.findIndex((id) => id === 0n);
              setShowGenePickerIndex(firstEmptyIndex);
            }}
            disabled={disabled}
          >
            + Add Gene
          </button>
        )}

        {/* Gene Picker Modal */}
        {showGenePickerIndex !== null && (
          <GenePickerModal
            availableGenes={availableGenes}
            onSelectGene={handleAddGene}
            onClose={() => setShowGenePickerIndex(null)}
          />
        )}
      </div>

      {/* Canvas Preview (Center) */}
      <div className="flex-1 bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold mb-3">Preview</h3>
        <div className="aspect-square bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
          {geneCount === 0 ? (
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">🎨</div>
              <div className="text-sm">Add genes to start designing</div>
            </div>
          ) : (
            <svg
              viewBox="0 0 1000 1000"
              className="w-full h-full"
              dangerouslySetInnerHTML={{
                __html: design.geneIds
                  .map((geneId, index) => {
                    if (geneId === 0n) return '';
                    return renderGeneWithPlacement(
                      geneId,
                      design.placements[index]
                    );
                  })
                  .join(''),
              }}
            />
          )}
        </div>
      </div>

      {/* Placement Controls (Right) */}
      <div className="w-full lg:w-64 bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold mb-3">Placement</h3>

        {selectedGene === null || selectedGene === 0n ? (
          <div className="text-xs text-muted-foreground text-center py-8">
            Select a gene to adjust placement
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-medium mb-2">
              Gene #{selectedGene.toString()}
            </div>

            {/* X Offset */}
            <div>
              <label className="text-xs text-muted-foreground">
                X Offset: {selectedPlacement?.offsetX || 0}
              </label>
              <input
                type="range"
                min="-500"
                max="500"
                value={selectedPlacement?.offsetX || 0}
                onChange={(e) =>
                  handleUpdatePlacement(design.selectedGeneIndex!, {
                    offsetX: Number(e.target.value),
                  })
                }
                className="w-full"
                disabled={disabled}
              />
            </div>

            {/* Y Offset */}
            <div>
              <label className="text-xs text-muted-foreground">
                Y Offset: {selectedPlacement?.offsetY || 0}
              </label>
              <input
                type="range"
                min="-500"
                max="500"
                value={selectedPlacement?.offsetY || 0}
                onChange={(e) =>
                  handleUpdatePlacement(design.selectedGeneIndex!, {
                    offsetY: Number(e.target.value),
                  })
                }
                className="w-full"
                disabled={disabled}
              />
            </div>

            {/* Scale */}
            <div>
              <label className="text-xs text-muted-foreground">
                Scale: {selectedPlacement?.scale || 100}%
              </label>
              <input
                type="range"
                min="10"
                max="400"
                value={selectedPlacement?.scale || 100}
                onChange={(e) =>
                  handleUpdatePlacement(design.selectedGeneIndex!, {
                    scale: Number(e.target.value),
                  })
                }
                className="w-full"
                disabled={disabled}
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="text-xs text-muted-foreground">
                Rotation: {selectedPlacement?.rotation || 0}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={selectedPlacement?.rotation || 0}
                onChange={(e) =>
                  handleUpdatePlacement(design.selectedGeneIndex!, {
                    rotation: Number(e.target.value),
                  })
                }
                className="w-full"
                disabled={disabled}
              />
            </div>

            {/* Reset Button */}
            <button
              className="w-full text-xs py-2 border border-border rounded hover:bg-muted transition-colors"
              onClick={handleResetPlacement}
              disabled={disabled}
            >
              Reset Placement
            </button>

            {/* Info */}
            <div className="text-[10px] text-muted-foreground mt-4 space-y-1">
              <div>• Use sliders to adjust position and appearance</div>
              <div>• Layer order: Slot 1 (back) → Slot 10 (front)</div>
              <div>• Use ↑↓ in gene slots to reorder layers</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
