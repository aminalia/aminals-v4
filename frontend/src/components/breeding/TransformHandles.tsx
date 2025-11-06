/**
 * TransformHandles Component
 * Visual handles for resizing and rotating selected genes
 *
 * Features:
 * - Corner handles for resizing
 * - Rotation handle above selection
 * - Visual feedback during transform
 */

import type { GeneMetadata } from '../../types/breeding';
import { useCallback, useEffect, useState } from 'react';

export interface TransformHandlesProps {
  placement: GeneMetadata;
  onUpdatePlacement: (placement: Partial<GeneMetadata>) => void;
  disabled?: boolean;
}

type HandleType = 'scale' | 'rotate' | null;

interface TransformState {
  type: HandleType;
  startX: number;
  startY: number;
  startValue: number;
}

export default function TransformHandles({
  placement,
  onUpdatePlacement,
  disabled = false,
}: TransformHandlesProps) {
  const [transformState, setTransformState] = useState<TransformState | null>(
    null
  );

  const { offsetX, offsetY, scale, rotation } = placement;

  // Calculate handle positions
  const centerX = 500 + offsetX;
  const centerY = 500 + offsetY;
  const size = 1000 * (scale / 100);
  const halfSize = size / 2;

  // Bounding box corners
  const topLeft = { x: centerX - halfSize, y: centerY - halfSize };
  const topRight = { x: centerX + halfSize, y: centerY - halfSize };
  const bottomLeft = { x: centerX - halfSize, y: centerY + halfSize };
  const bottomRight = { x: centerX + halfSize, y: centerY + halfSize };

  // Rotation handle (above center)
  const rotationHandle = {
    x: centerX,
    y: centerY - halfSize - 30,
  };

  // Handle mouse down on scale handle
  const handleScaleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.stopPropagation();

      setTransformState({
        type: 'scale',
        startX: e.clientX,
        startY: e.clientY,
        startValue: scale,
      });
    },
    [disabled, scale]
  );

  // Handle mouse down on rotation handle
  const handleRotateMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.stopPropagation();

      setTransformState({
        type: 'rotate',
        startX: e.clientX,
        startY: e.clientY,
        startValue: rotation,
      });
    },
    [disabled, rotation]
  );

  // Handle mouse move for transforms
  useEffect(() => {
    if (!transformState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (transformState.type === 'scale') {
        // Calculate scale based on vertical mouse movement
        const deltaY = transformState.startY - e.clientY;
        const scaleDelta = deltaY * 0.5; // Sensitivity
        const newScale = Math.max(
          10,
          Math.min(400, transformState.startValue + scaleDelta)
        );

        onUpdatePlacement({ scale: newScale });
      } else if (transformState.type === 'rotate') {
        // Calculate rotation based on horizontal mouse movement
        const deltaX = e.clientX - transformState.startX;
        const rotationDelta = deltaX * 0.5; // Sensitivity
        let newRotation = transformState.startValue + rotationDelta;

        // Normalize to -180 to 180
        while (newRotation > 180) newRotation -= 360;
        while (newRotation < -180) newRotation += 360;

        onUpdatePlacement({ rotation: newRotation });
      }
    };

    const handleMouseUp = () => {
      setTransformState(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [transformState, onUpdatePlacement]);

  if (disabled) return null;

  return (
    <g className="transform-handles" pointerEvents="auto">
      {/* Bounding box */}
      <rect
        x={topLeft.x}
        y={topLeft.y}
        width={size}
        height={size}
        fill="none"
        stroke="rgb(var(--energy))"
        strokeWidth="2"
        strokeDasharray="8,4"
        opacity="0.7"
        pointerEvents="none"
      />

      {/* Corner handles (for scale) */}
      {[topLeft, topRight, bottomLeft, bottomRight].map((corner, i) => (
        <g key={`corner-${i}`}>
          <circle
            cx={corner.x}
            cy={corner.y}
            r="8"
            fill="white"
            stroke="rgb(var(--energy))"
            strokeWidth="2"
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={handleScaleMouseDown}
          />
        </g>
      ))}

      {/* Rotation handle */}
      <g>
        {/* Line from center to rotation handle */}
        <line
          x1={centerX}
          y1={centerY - halfSize}
          x2={rotationHandle.x}
          y2={rotationHandle.y}
          stroke="rgb(var(--energy))"
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.5"
          pointerEvents="none"
        />
        {/* Rotation handle circle */}
        <circle
          cx={rotationHandle.x}
          cy={rotationHandle.y}
          r="10"
          fill="white"
          stroke="rgb(var(--energy))"
          strokeWidth="2"
          style={{ cursor: 'grab' }}
          onMouseDown={handleRotateMouseDown}
        />
        {/* Rotation icon */}
        <text
          x={rotationHandle.x}
          y={rotationHandle.y + 4}
          textAnchor="middle"
          fontSize="12"
          fill="rgb(var(--energy))"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          ↻
        </text>
      </g>

      {/* Transform info overlay */}
      {transformState && (
        <g>
          <rect
            x={centerX - 60}
            y={centerY - 20}
            width="120"
            height="40"
            fill="rgba(0, 0, 0, 0.8)"
            rx="4"
            pointerEvents="none"
          />
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            fontSize="14"
            fill="white"
            fontWeight="bold"
            pointerEvents="none"
          >
            {transformState.type === 'scale'
              ? `${Math.round(scale)}%`
              : `${Math.round(rotation)}°`}
          </text>
        </g>
      )}
    </g>
  );
}
