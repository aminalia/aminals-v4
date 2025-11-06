/**
 * InteractiveCanvas Component
 * SVG canvas with click-to-select, drag-to-move, and transform capabilities
 *
 * Features:
 * - Click genes to select them
 * - Visual selection indicators
 * - Drag selected gene to move
 * - Transform handles for resize/rotate
 */

import type { Gene, GeneMetadata } from '../../types/breeding';
import { useCallback, useEffect, useRef, useState } from 'react';
import TransformHandles from './TransformHandles';

export interface InteractiveCanvasProps {
  geneIds: bigint[];
  placements: GeneMetadata[];
  selectedIndex: number | null;
  genes: Gene[];
  onSelect: (index: number) => void;
  onUpdatePlacement: (index: number, placement: Partial<GeneMetadata>) => void;
  disabled?: boolean;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialOffsetX: number;
  initialOffsetY: number;
  geneIndex: number;
}

export default function InteractiveCanvas({
  geneIds,
  placements,
  selectedIndex,
  genes,
  onSelect,
  onUpdatePlacement,
  disabled = false,
}: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  // Get gene by ID
  const getGeneById = useCallback(
    (geneId: bigint): Gene | undefined => {
      return genes.find((g) => BigInt(g.tokenId) === geneId);
    },
    [genes]
  );

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  // Handle mouse down on gene
  const handleGeneMouseDown = useCallback(
    (e: React.MouseEvent, index: number) => {
      if (disabled) return;
      e.stopPropagation();

      // Select the gene
      onSelect(index);

      // Start drag operation
      const svgCoords = screenToSVG(e.clientX, e.clientY);
      setDragState({
        isDragging: true,
        startX: svgCoords.x,
        startY: svgCoords.y,
        initialOffsetX: placements[index].offsetX,
        initialOffsetY: placements[index].offsetY,
        geneIndex: index,
      });
    },
    [disabled, onSelect, placements, screenToSVG]
  );

  // Handle mouse move (drag)
  useEffect(() => {
    if (!dragState || !dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const svgCoords = screenToSVG(e.clientX, e.clientY);
      const deltaX = svgCoords.x - dragState.startX;
      const deltaY = svgCoords.y - dragState.startY;

      onUpdatePlacement(dragState.geneIndex, {
        offsetX: dragState.initialOffsetX + deltaX,
        offsetY: dragState.initialOffsetY + deltaY,
      });
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, onUpdatePlacement, screenToSVG]);

  // Render gene with placement transforms
  const renderGeneWithPlacement = useCallback(
    (geneId: bigint, placement: GeneMetadata, index: number) => {
      const gene = getGeneById(geneId);
      if (!gene || !gene.svg) return null;

      const { offsetX, offsetY, scale, rotation } = placement;
      const isSelected = selectedIndex === index;

      return (
        <g
          key={`gene-${index}`}
          transform={`translate(${offsetX}, ${offsetY}) rotate(${rotation}, 500, 500) scale(${scale / 100})`}
          onMouseDown={(e) => handleGeneMouseDown(e, index)}
          style={{
            cursor: disabled ? 'default' : 'move',
            pointerEvents: disabled ? 'none' : 'auto',
          }}
          className={isSelected ? 'gene-selected' : 'gene-unselected'}
        >
          <g dangerouslySetInnerHTML={{ __html: gene.svg }} />
        </g>
      );
    },
    [getGeneById, selectedIndex, handleGeneMouseDown, disabled]
  );

  // Render transform handles for selected gene
  const renderTransformHandles = useCallback(() => {
    if (selectedIndex === null || selectedIndex < 0) return null;

    const geneId = geneIds[selectedIndex];
    if (geneId === 0n) return null;

    const placement = placements[selectedIndex];

    return (
      <TransformHandles
        placement={placement}
        onUpdatePlacement={(updates) =>
          onUpdatePlacement(selectedIndex, updates)
        }
        disabled={disabled}
      />
    );
  }, [
    selectedIndex,
    geneIds,
    placements,
    onUpdatePlacement,
    disabled,
  ]);

  const geneCount = geneIds.filter((id) => id !== 0n).length;

  return (
    <div className="flex-1 bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Preview</h3>
        {selectedIndex !== null && selectedIndex >= 0 && (
          <span className="text-xs text-muted-foreground">
            Selected: Slot {selectedIndex + 1}
          </span>
        )}
      </div>

      <div
        ref={canvasRef}
        className="aspect-square bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center"
        style={{ cursor: dragState?.isDragging ? 'move' : 'default' }}
      >
        {geneCount === 0 ? (
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">🎨</div>
            <div className="text-sm">Add genes to start designing</div>
            <div className="text-xs mt-1 text-muted-foreground">
              Click genes to select and drag to move
            </div>
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox="0 0 1000 1000"
            className="w-full h-full"
            style={{ touchAction: 'none' }}
          >
            {/* Render genes in layer order (0 = back, 8 = front) */}
            {geneIds.map((geneId, index) => {
              if (geneId === 0n) return null;
              return renderGeneWithPlacement(geneId, placements[index], index);
            })}

            {/* Transform handles for selected gene */}
            {renderTransformHandles()}
          </svg>
        )}
      </div>

      {/* Helper text */}
      {geneCount > 0 && (
        <div className="mt-2 text-[10px] text-muted-foreground text-center">
          Click a gene to select • Drag to move • Use controls on the right
        </div>
      )}

      <style jsx>{`
        .gene-unselected {
          opacity: 1;
          transition: opacity 0.2s;
        }
        .gene-unselected:hover {
          opacity: 0.8;
        }
        .gene-selected {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
