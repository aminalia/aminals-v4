/**
 * DesignBuilder Component
 * Visual editor for creating/modifying Aminal designs with 1-9 genes
 *
 * Features:
 * - Gene slots panel (add/remove/reorder genes)
 * - Canvas preview with SVG rendering
 * - Placement controls (x, y, scale, rotation) per gene
 */

import { countGenes, createEmptyDesign, DEFAULT_PLACEMENT } from '@hooks';
import { useCallback, useEffect, useState } from 'react';
import type {
  DesignBuilderState,
  Gene,
  GeneMetadata,
  HistoryState,
} from '../../types/breeding';
import GenePickerModal from './GenePickerModal';
import InteractiveCanvas from './InteractiveCanvas';

export interface DesignBuilderProps {
  initialGeneIds?: bigint[];
  initialPlacements?: GeneMetadata[];
  availableGenes?: Gene[]; // Parent genes by default
  onDesignChange?: (geneIds: bigint[], placements: GeneMetadata[]) => void;
  disabled?: boolean;
  maxGenes?: number; // Default 9
}

export default function DesignBuilder({
  initialGeneIds = [],
  initialPlacements = [],
  availableGenes = [],
  onDesignChange,
  disabled = false,
  maxGenes = 9,
}: DesignBuilderProps) {
  // Initialize state
  const [design, setDesign] = useState<DesignBuilderState>(() => {
    if (initialGeneIds.length > 0) {
      // Pad to 9 slots
      const paddedGeneIds = [...initialGeneIds];
      while (paddedGeneIds.length < 9) {
        paddedGeneIds.push(0n);
      }

      const paddedPlacements = [...initialPlacements];
      while (paddedPlacements.length < 9) {
        paddedPlacements.push(DEFAULT_PLACEMENT);
      }

      return {
        geneIds: paddedGeneIds.slice(0, 9),
        placements: paddedPlacements.slice(0, 9),
        selectedGeneIndex: null,
        isDirty: false,
        history: [],
        historyIndex: -1,
      };
    }
    return createEmptyDesign();
  });

  const [showGenePickerIndex, setShowGenePickerIndex] = useState<number | null>(
    null
  );

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<{
    index: number;
    position: 'before' | 'after';
  } | null>(null);

  // Long press state for opening gene picker
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const MAX_HISTORY = 50; // Maximum number of history states

  // Cache for genes that have been added to the design (including custom genes)
  const [geneCache, setGeneCache] = useState<Map<string, Gene>>(new Map());

  // Initialize history with the current state (only once on mount)
  useEffect(() => {
    if (design.history.length === 0) {
      setDesign((prev) => ({
        ...prev,
        history: [
          {
            geneIds: [...prev.geneIds],
            placements: [...prev.placements],
            timestamp: Date.now(),
          },
        ],
        historyIndex: 0,
      }));
    }
  }, []); // Empty dependency array - run only once on mount

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

  // Save current state to history (now unused, keeping for reference)
  const saveToHistory = useCallback(() => {
    setDesign((prev) => {
      // Create history snapshot
      const snapshot: HistoryState = {
        geneIds: [...prev.geneIds],
        placements: [...prev.placements],
        timestamp: Date.now(),
      };

      // Remove any history after current index (if we're not at the end)
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);

      // Add new snapshot
      newHistory.push(snapshot);

      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, [MAX_HISTORY]);

  // Undo
  const handleUndo = useCallback(() => {
    if (disabled) return;

    setDesign((prev) => {
      if (prev.historyIndex <= 0) return prev;

      const newIndex = prev.historyIndex - 1;
      const state = prev.history[newIndex];

      return {
        ...prev,
        geneIds: [...state.geneIds],
        placements: [...state.placements],
        historyIndex: newIndex,
        isDirty: true,
      };
    });
  }, [disabled]);

  // Redo
  const handleRedo = useCallback(() => {
    if (disabled) return;

    setDesign((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const newIndex = prev.historyIndex + 1;
      const state = prev.history[newIndex];

      return {
        ...prev,
        geneIds: [...state.geneIds],
        placements: [...state.placements],
        historyIndex: newIndex,
        isDirty: true,
      };
    });
  }, [disabled]);

  const canUndo = design.historyIndex > 0;
  const canRedo = design.historyIndex < design.history.length - 1;

  // Notify parent of changes
  useEffect(() => {
    if (design.isDirty && onDesignChange) {
      onDesignChange(design.geneIds, design.placements);
    }
  }, [design.geneIds, design.placements, design.isDirty, onDesignChange]);

  // Add gene to first empty slot
  const handleAddGene = useCallback(
    (gene: Gene) => {
      // Add gene to cache
      setGeneCache((prev) => {
        const newCache = new Map(prev);
        newCache.set(gene.tokenId.toString(), gene);
        return newCache;
      });

      setDesign((prev) => {
        const firstEmptyIndex = prev.geneIds.findIndex((id) => id === 0n);
        if (firstEmptyIndex === -1) return prev; // No empty slots

        // Save current state to history before making changes
        const snapshot: HistoryState = {
          geneIds: [...prev.geneIds],
          placements: [...prev.placements],
          timestamp: Date.now(),
        };
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(snapshot);

        // Make the change
        const newGeneIds = [...prev.geneIds];
        const newPlacements = [...prev.placements];
        newGeneIds[firstEmptyIndex] = BigInt(gene.tokenId);
        newPlacements[firstEmptyIndex] = { ...DEFAULT_PLACEMENT };

        return {
          ...prev,
          geneIds: newGeneIds,
          placements: newPlacements,
          selectedGeneIndex: firstEmptyIndex,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        };
      });
      setShowGenePickerIndex(null);
    },
    []
  );

  // Remove gene from specific slot
  const handleRemoveGene = useCallback(
    (index: number) => {
      if (disabled) return;

      setDesign((prev) => {
        // Save current state to history before making changes
        const snapshot: HistoryState = {
          geneIds: [...prev.geneIds],
          placements: [...prev.placements],
          timestamp: Date.now(),
        };
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(snapshot);

        // Make the change
        const newGeneIds = [...prev.geneIds];
        newGeneIds[index] = 0n;

        return {
          ...prev,
          geneIds: newGeneIds,
          selectedGeneIndex:
            prev.selectedGeneIndex === index ? null : prev.selectedGeneIndex,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
        };
      });
    },
    [disabled]
  );

  // Select gene for editing placement
  const handleSelectGene = useCallback(
    (index: number) => {
      if (disabled) return;
      setDesign((prev) => ({ ...prev, selectedGeneIndex: index }));
    },
    [disabled]
  );

  // Update placement for a specific gene (called during drag/slider adjustments)
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

  // Save history before drag starts (called by InteractiveCanvas)
  const handleCanvasDragStart = useCallback(() => {
    setDesign((prev) => {
      // Save current state to history
      const snapshot: HistoryState = {
        geneIds: [...prev.geneIds],
        placements: [...prev.placements],
        timestamp: Date.now(),
      };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(snapshot);

      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  // Move gene from one slot to another (reorder)
  const handleMoveGene = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled || fromIndex === toIndex) return;

      setDesign((prev) => {
        // Save current state to history before making changes
        const snapshot: HistoryState = {
          geneIds: [...prev.geneIds],
          placements: [...prev.placements],
          timestamp: Date.now(),
        };
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(snapshot);

        // Make the change
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
          history: newHistory,
          historyIndex: newHistory.length - 1,
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

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (index: number) => {
      if (disabled) return;
      setDraggedIndex(index);
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (disabled || draggedIndex === null) return;

      // Calculate if drop should be before or after based on mouse position
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const height = rect.height;
      const position = mouseY < height / 2 ? 'before' : 'after';

      setDropPosition({ index, position });
    },
    [disabled, draggedIndex]
  );

  const handleDragEnd = useCallback(() => {
    if (draggedIndex !== null && dropPosition !== null) {
      // Calculate the target index based on drop position
      let targetIndex = dropPosition.index;

      // If dropping after, increment target index
      if (dropPosition.position === 'after') {
        targetIndex += 1;
      }

      // Adjust if we're moving from before to after
      if (draggedIndex < targetIndex) {
        targetIndex -= 1;
      }

      // Only move if position actually changed
      if (draggedIndex !== targetIndex) {
        setDesign((prev) => {
          // Save current state to history before making changes
          const snapshot: HistoryState = {
            geneIds: [...prev.geneIds],
            placements: [...prev.placements],
            timestamp: Date.now(),
          };
          const newHistory = prev.history.slice(0, prev.historyIndex + 1);
          newHistory.push(snapshot);

          // Make the change
          const newGeneIds = [...prev.geneIds];
          const newPlacements = [...prev.placements];

          // Remove from old position
          const [movedGeneId] = newGeneIds.splice(draggedIndex, 1);
          const [movedPlacement] = newPlacements.splice(draggedIndex, 1);

          // Insert at new position
          newGeneIds.splice(targetIndex, 0, movedGeneId);
          newPlacements.splice(targetIndex, 0, movedPlacement);

          return {
            ...prev,
            geneIds: newGeneIds,
            placements: newPlacements,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            isDirty: true,
          };
        });
      }
    }
    setDraggedIndex(null);
    setDropPosition(null);
  }, [draggedIndex, dropPosition]);

  const handleDragLeave = useCallback(() => {
    setDropPosition(null);
  }, []);

  // Long press / click handlers for gene picker
  const handleMouseDown = useCallback(
    (index: number) => {
      if (disabled) return;
      const timer = setTimeout(() => {
        setShowGenePickerIndex(index);
      }, 500); // 500ms long press
      setLongPressTimer(timer);
    },
    [disabled]
  );

  const handleMouseUp = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handleMouseLeave = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handleDoubleClick = useCallback(
    (index: number) => {
      if (disabled) return;
      setShowGenePickerIndex(index);
    },
    [disabled]
  );

  // Cleanup long press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

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

  const geneCount = countGenes(design.geneIds);
  const selectedGene =
    design.selectedGeneIndex !== null
      ? design.geneIds[design.selectedGeneIndex]
      : null;
  const selectedPlacement =
    design.selectedGeneIndex !== null
      ? design.placements[design.selectedGeneIndex]
      : null;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      // Check if Ctrl/Cmd is pressed
      const isMod = e.ctrlKey || e.metaKey;

      // Undo: Ctrl/Cmd+Z
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y
      if ((isMod && e.key === 'z' && e.shiftKey) || (isMod && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }

      // Delete: Delete or Backspace (when gene is selected)
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        design.selectedGeneIndex !== null
      ) {
        e.preventDefault();
        handleRemoveGene(design.selectedGeneIndex);
      }

      // Arrow key nudging (when gene is selected)
      if (!isMod && design.selectedGeneIndex !== null) {
        const nudgeAmount = e.shiftKey ? 1 : 10; // Fine control with Shift

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          handleUpdatePlacement(design.selectedGeneIndex, {
            offsetY: (selectedPlacement?.offsetY || 0) - nudgeAmount,
          });
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          handleUpdatePlacement(design.selectedGeneIndex, {
            offsetY: (selectedPlacement?.offsetY || 0) + nudgeAmount,
          });
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handleUpdatePlacement(design.selectedGeneIndex, {
            offsetX: (selectedPlacement?.offsetX || 0) - nudgeAmount,
          });
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleUpdatePlacement(design.selectedGeneIndex, {
            offsetX: (selectedPlacement?.offsetX || 0) + nudgeAmount,
          });
        }
      }

      // Scale shortcuts: [ to decrease, ] to increase
      if (e.key === '[' && design.selectedGeneIndex !== null) {
        e.preventDefault();
        const newScale = Math.max(10, (selectedPlacement?.scale || 100) - 5);
        handleUpdatePlacement(design.selectedGeneIndex, { scale: newScale });
      }
      if (e.key === ']' && design.selectedGeneIndex !== null) {
        e.preventDefault();
        const newScale = Math.min(400, (selectedPlacement?.scale || 100) + 5);
        handleUpdatePlacement(design.selectedGeneIndex, { scale: newScale });
      }

      // Reset shortcut: R key
      if (e.key === 'r' && !isMod && design.selectedGeneIndex !== null) {
        e.preventDefault();
        handleResetPlacement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    disabled,
    design.selectedGeneIndex,
    selectedPlacement,
    handleUndo,
    handleRedo,
    handleRemoveGene,
    handleUpdatePlacement,
    handleResetPlacement,
  ]);

  // Get all genes that are currently in the design (for canvas rendering)
  const genesInDesign = design.geneIds
    .filter((id) => id !== 0n)
    .map((id) => getGeneById(id))
    .filter((gene): gene is Gene => gene !== undefined);

  return (
    <div
      className={`flex flex-col lg:flex-row gap-4 ${
        disabled ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      {/* Gene Slots Panel (Left) */}
      <div className="w-full lg:w-64 bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Gene Slots</h3>
          <span className="text-xs text-muted-foreground">
            {geneCount}/9 genes
          </span>
        </div>

        {/* Gene Slots List */}
        <div className="space-y-2">
          {design.geneIds.map((geneId, index) => {
            const gene = geneId !== 0n ? getGeneById(geneId) : null;
            const isDragging = draggedIndex === index;
            const showDropBefore =
              dropPosition?.index === index &&
              dropPosition?.position === 'before';
            const showDropAfter =
              dropPosition?.index === index &&
              dropPosition?.position === 'after';

            return (
              <div key={index} className="relative">
                {/* Drop indicator line - BEFORE */}
                {showDropBefore && (
                  <div className="absolute -top-1 left-0 right-0 z-10 h-0.5 bg-energy rounded-full shadow-lg shadow-energy/50 animate-pulse" />
                )}

                <div
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDoubleClick={() => handleDoubleClick(index)}
                  className={`p-2 rounded border transition-all ${
                    design.selectedGeneIndex === index
                      ? 'border-energy bg-energy/10'
                      : 'border-border hover:border-energy/50'
                  } ${geneId === 0n ? 'opacity-50' : ''} ${
                    isDragging ? 'opacity-50 scale-95' : ''
                  }`}
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
                    {/* Drag handle */}
                    <div
                      draggable={!disabled}
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(index);
                      }}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex flex-col gap-1 py-1 px-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-energy transition-colors"
                      title="Drag to reorder"
                    >
                      <div className="w-3 h-0.5 bg-current rounded-full"></div>
                      <div className="w-3 h-0.5 bg-current rounded-full"></div>
                      <div className="w-3 h-0.5 bg-current rounded-full"></div>
                    </div>
                    {/* Gene preview thumbnail and info - supports long press */}
                    <div
                      className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                      onMouseDown={() => handleMouseDown(index)}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={() => handleMouseDown(index)}
                      onTouchEnd={handleMouseUp}
                    >
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
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveGene(index);
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-xs text-destructive hover:text-destructive/80"
                      disabled={disabled}
                      title="Remove gene"
                    >
                      ×
                    </button>
                  </div>
                )}
                </div>

                {/* Drop indicator line - AFTER */}
                {showDropAfter && (
                  <div className="absolute -bottom-1 left-0 right-0 z-10 h-0.5 bg-energy rounded-full shadow-lg shadow-energy/50 animate-pulse" />
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
              const firstEmptyIndex = design.geneIds.findIndex(
                (id) => id === 0n
              );
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

      {/* Canvas Preview (Center) - Now Interactive */}
      <InteractiveCanvas
        geneIds={design.geneIds}
        placements={design.placements}
        selectedIndex={design.selectedGeneIndex}
        genes={genesInDesign}
        onSelect={handleSelectGene}
        onUpdatePlacement={handleUpdatePlacement}
        onDragStart={handleCanvasDragStart}
        disabled={disabled}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

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
              <div className="font-semibold mb-1">💡 Tips & Shortcuts:</div>
              <div>• Drag genes by handle to reorder slots</div>
              <div>• Double-click or hold slot to change gene</div>
              <div>• Click gene to select, drag to move on canvas</div>
              <div>• Arrow keys: nudge ±10px (Shift for ±1px)</div>
              <div>• [ / ] keys: scale ±5%</div>
              <div>• R key: reset placement</div>
              <div>• Ctrl/Cmd+Z: undo • Ctrl/Cmd+Shift+Z: redo</div>
              <div>• Use sliders for precise adjustments</div>
              <div>• Layer order: Slot 1 (back) → Slot 9 (front)</div>
              <div>• Delete/Backspace: remove selected gene</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
