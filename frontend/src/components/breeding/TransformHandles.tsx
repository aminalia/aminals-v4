/**
 * TransformHandles Component
 * Visual handles for resizing and rotating selected genes
 *
 * Features:
 * - Corner handles for resizing
 * - Rotation handle above selection
 * - Visual feedback during transform
 */

import { useCallback, useEffect, useState } from 'react';
import type { GeneMetadata } from '../../types/breeding';

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

  // Calculate handle positions with adaptive sizing
  const centerX = 500 + offsetX;
  const centerY = 500 + offsetY;

  // Adaptive base size (handles more gene sizes better)
  const baseSize = 500; // Increased from 400 to better accommodate genes
  const scaledSize = baseSize * (scale / 100);

  // Apply rotation to bounding box (approximate)
  const rotationRadians = (rotation * Math.PI) / 180;
  const rotatedWidth =
    Math.abs(scaledSize * Math.cos(rotationRadians)) +
    Math.abs(scaledSize * Math.sin(rotationRadians));
  const rotatedHeight =
    Math.abs(scaledSize * Math.sin(rotationRadians)) +
    Math.abs(scaledSize * Math.cos(rotationRadians));

  const halfWidth = rotatedWidth / 2;
  const halfHeight = rotatedHeight / 2;

  // Bounding box corners (accounting for rotation)
  const topLeft = { x: centerX - halfWidth, y: centerY - halfHeight };
  const topRight = { x: centerX + halfWidth, y: centerY - halfHeight };
  const bottomLeft = { x: centerX - halfWidth, y: centerY + halfHeight };
  const bottomRight = { x: centerX + halfWidth, y: centerY + halfHeight };

  // Rotation handle (adaptive distance based on size)
  const rotationHandleDistance = Math.max(30, halfHeight + 30);
  const rotationHandle = {
    x: centerX,
    y: centerY - halfHeight - rotationHandleDistance,
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
        width={rotatedWidth}
        height={rotatedHeight}
        fill="none"
        stroke="rgb(var(--energy))"
        strokeWidth="2"
        strokeDasharray="8,4"
        opacity="0.7"
        pointerEvents="none"
      />

      {/* Corner handles (for scale) - IMPROVED */}
      {[topLeft, topRight, bottomLeft, bottomRight].map((corner, i) => (
        <g key={`corner-${i}`}>
          {/* Larger hit area */}
          <circle
            cx={corner.x}
            cy={corner.y}
            r="12"
            fill="transparent"
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={handleScaleMouseDown}
          />
          {/* Visible handle with shadow */}
          <circle
            cx={corner.x}
            cy={corner.y}
            r="8"
            fill="white"
            stroke="rgb(var(--energy))"
            strokeWidth="3"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
            style={{ cursor: 'nwse-resize', pointerEvents: 'none' }}
          />
        </g>
      ))}

      {/* Rotation handle - IMPROVED */}
      <g>
        {/* Line from center to rotation handle */}
        <line
          x1={centerX}
          y1={centerY - halfHeight}
          x2={rotationHandle.x}
          y2={rotationHandle.y}
          stroke="rgb(var(--energy))"
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.6"
          pointerEvents="none"
        />
        {/* Larger hit area */}
        <circle
          cx={rotationHandle.x}
          cy={rotationHandle.y}
          r="16"
          fill="transparent"
          style={{ cursor: 'grab' }}
          onMouseDown={handleRotateMouseDown}
        />
        {/* Visible handle with shadow */}
        <circle
          cx={rotationHandle.x}
          cy={rotationHandle.y}
          r="12"
          fill="white"
          stroke="rgb(var(--energy))"
          strokeWidth="3"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
          style={{ cursor: 'grab', pointerEvents: 'none' }}
        />
        {/* Rotation icon - larger */}
        <text
          x={rotationHandle.x}
          y={rotationHandle.y + 5}
          textAnchor="middle"
          fontSize="16"
          fill="rgb(var(--energy))"
          fontWeight="bold"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          ↻
        </text>
      </g>

      {/* Transform info overlay - IMPROVED */}
      {transformState && (
        <g>
          {/* Larger, more visible background */}
          <rect
            x={centerX - 80}
            y={centerY - 30}
            width="160"
            height="60"
            fill="rgba(0, 0, 0, 0.9)"
            rx="8"
            stroke="rgb(var(--energy))"
            strokeWidth="2"
            pointerEvents="none"
          />
          {/* Value with label */}
          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            fontSize="11"
            fill="rgba(255,255,255,0.7)"
            fontWeight="normal"
            pointerEvents="none"
          >
            {transformState.type === 'scale' ? 'Scale' : 'Rotation'}
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            fontSize="20"
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
