# Aminal Designer UX Specification

This document outlines the design and implementation of the enhanced Aminal Designer interface for creating and editing Aminal designs during breeding auctions.

## Overview

The Aminal Designer is a visual editor that allows users to create unique Aminal designs by composing gene NFTs with custom placement (position, scale, rotation). The designer prioritizes ease of use, direct manipulation, and creative freedom.

## Core Concepts

### Gene Slots
- **Slot Count**: 9 slots (matching contract MAX_GENES = 9)
- **Layer Order**: Slot 0 (background/back) → Slot 8 (foreground/front)
- **Empty Slots**: Represented as 0n (bigint zero)
- **Placement Metadata**: Each slot has associated transform properties

### Placement Properties
```typescript
interface GeneMetadata {
  offsetX: number;   // -500 to 500 (canvas units)
  offsetY: number;   // -500 to 500 (canvas units)
  scale: number;     // 10 to 400 (percentage, 100 = 1:1)
  rotation: number;  // -180 to 180 (degrees)
}
```

### Canvas
- **Viewport**: 1000x1000 coordinate system
- **Origin**: Center (500, 500)
- **Coordinate System**: SVG coordinate space

## User Interface Layout

### Three-Panel Layout

```
┌─────────────┬──────────────────────┬─────────────┐
│             │                      │             │
│   Gene      │                      │  Placement  │
│   Slots     │      Canvas          │  Controls   │
│   Panel     │      Preview         │   Panel     │
│             │                      │             │
│  (256px)    │      (flex-1)        │  (256px)    │
└─────────────┴──────────────────────┴─────────────┘
```

#### Left Panel: Gene Slots (256px fixed)
- List of 9 gene slots
- Add/remove genes
- Reorder layers (↑↓)
- Gene thumbnails
- Selected state indication

#### Center Panel: Interactive Canvas (flexible)
- SVG preview of composed design
- Click-to-select genes
- Drag-to-move genes
- Transform handles (resize/rotate)
- Visual selection indicators
- Zoom/pan controls

#### Right Panel: Placement Controls (256px fixed)
- Numerical controls for selected gene
- X/Y position sliders
- Scale slider
- Rotation slider
- Reset button
- Quick actions

## Interactive Features

### 1. Selection

**Mouse/Touch Selection**
- Click gene on canvas to select
- Click slot in left panel to select
- Selected gene highlighted with:
  - Bounding box outline (energy color)
  - Transform handles (corners + rotation)
  - Semi-transparent overlay outside selection

**Visual Feedback**
```
┌─────────────┐
│   Gene      │  ← Selected in list (highlighted)
└─────────────┘

    Canvas:
    ┌──────────────┐
    │ ┌──┐    ┌──┐ │  ← Transform handles
    │ │  Gene  │  │
    │ └──────────┘ │  ← Bounding box
    └──────────────┘
```

**Keyboard Selection**
- `Tab` - Select next gene
- `Shift+Tab` - Select previous gene
- `1-9` - Select gene by slot number

### 2. Movement

**Mouse Drag**
- Click and drag gene on canvas
- Real-time preview while dragging
- Cursor changes to move cursor
- Updates offsetX/offsetY

**Keyboard Movement**
- `Arrow Keys` - Move 10px
- `Shift+Arrow` - Move 1px (fine tune)
- `Ctrl+Arrow` - Move 50px (large steps)

**Snap-to-Grid** (optional feature)
- Toggle button in controls
- Snaps to 50px grid
- Shows grid overlay when enabled

**Alignment Guides** (optional feature)
- Show guides when near center (500, 500)
- Show guides when aligned with other genes
- Magnetic snapping (5px threshold)

### 3. Scaling

**Mouse Resize**
- Drag corner handles to resize
- Maintains aspect ratio
- Drag from center of edge for uniform scaling
- Shows scale percentage during drag

**Keyboard Resize**
- `+` or `=` - Scale up 10%
- `-` - Scale down 10%
- `Shift++` - Scale up 1%
- `Shift+-` - Scale down 1%

**Slider Control**
- Range: 10% to 400%
- Default: 100%
- Shows live preview

### 4. Rotation

**Mouse Rotate**
- Drag rotation handle (circular handle above selection)
- Rotates around center point
- Shows angle indicator during rotation
- Snaps to 15° increments when Shift held

**Keyboard Rotate**
- `R` + drag - Rotate mode
- `[` - Rotate counter-clockwise 15°
- `]` - Rotate clockwise 15°
- `Shift+[` - Rotate counter-clockwise 1°
- `Shift+]` - Rotate clockwise 1°

**Slider Control**
- Range: -180° to 180°
- Default: 0°
- Shows live preview

### 5. Layer Management

**Reordering**
- Click ↑↓ buttons in slot list
- Drag-and-drop slots (future feature)
- Keyboard shortcuts:
  - `Ctrl+[` - Move layer back
  - `Ctrl+]` - Move layer forward
  - `Ctrl+Shift+[` - Move to back
  - `Ctrl+Shift+]` - Move to front

**Layer Visualization**
- Slot numbers indicate layer order
- Preview on canvas reflects layer order
- Selected layer highlighted in list

### 6. Undo/Redo

**History Stack**
- Records every placement change
- Records gene additions/removals
- Records layer reordering
- Max 50 history states

**Keyboard Shortcuts**
- `Ctrl/Cmd+Z` - Undo
- `Ctrl/Cmd+Shift+Z` or `Ctrl/Cmd+Y` - Redo

**UI Indicators**
- Undo/redo buttons in toolbar
- Disabled state when stack empty
- Tooltip shows action to undo/redo

### 7. Additional Actions

**Copy/Paste Placement**
- `Ctrl/Cmd+C` - Copy selected gene's placement
- `Ctrl/Cmd+V` - Paste placement to selected gene

**Reset Placement**
- Button in controls panel
- Keyboard: `Ctrl/Cmd+0`
- Resets to default: `{offsetX: 0, offsetY: 0, scale: 100, rotation: 0}`

**Delete Gene**
- Click × button in slot list
- Keyboard: `Delete` or `Backspace`
- Removes gene from slot (sets to 0n)

**Duplicate Gene** (future feature)
- `Ctrl/Cmd+D` - Duplicates selected gene to next empty slot
- Copies both gene ID and placement

## Preset Layouts

Quick-start templates for common designs:

**Parent 1 Template**
- Loads genes from Parent 1 Aminal
- Default placements (centered)

**Parent 2 Template**
- Loads genes from Parent 2 Aminal
- Default placements (centered)

**Centered Layout**
- All genes at (0, 0) with default scale/rotation
- Good starting point for composition

**Grid Layout** (future feature)
- Arranges genes in 3×3 grid
- Useful for seeing all genes at once

**Random Layout** (future feature)
- Random positions, scales, and rotations
- Fun for experimental designs

## Component Architecture

### Component Hierarchy
```
DesignBuilder (main)
├── GeneSlotsPanel
│   ├── GeneSlot × 9
│   └── GenePickerModal
├── InteractiveCanvas
│   ├── CanvasRenderer (SVG)
│   ├── SelectionOverlay
│   ├── TransformHandles
│   └── CanvasControls (zoom/pan)
└── PlacementControlsPanel
    ├── PositionSliders
    ├── ScaleSlider
    ├── RotationSlider
    ├── ResetButton
    └── QuickActionsBar
```

### Key State Management
```typescript
interface DesignBuilderState {
  geneIds: bigint[9];              // Gene token IDs (0n = empty)
  placements: GeneMetadata[9];     // Transform properties
  selectedGeneIndex: number | null; // Currently selected slot
  isDirty: boolean;                 // Has unsaved changes
  history: HistoryState[];          // Undo/redo stack
  historyIndex: number;             // Current position in history
}

interface HistoryState {
  geneIds: bigint[9];
  placements: GeneMetadata[9];
  timestamp: number;
  action: string; // Description of the action
}
```

### New Components to Create

**1. InteractiveCanvas.tsx**
```typescript
interface InteractiveCanvasProps {
  geneIds: bigint[9];
  placements: GeneMetadata[9];
  selectedIndex: number | null;
  genes: Gene[];
  onSelect: (index: number) => void;
  onUpdatePlacement: (index: number, placement: Partial<GeneMetadata>) => void;
  disabled?: boolean;
}
```

**2. TransformHandles.tsx**
```typescript
interface TransformHandlesProps {
  bounds: DOMRect;
  scale: number;
  rotation: number;
  onDrag: (deltaX: number, deltaY: number) => void;
  onResize: (scale: number) => void;
  onRotate: (rotation: number) => void;
}
```

**3. SelectionOverlay.tsx**
```typescript
interface SelectionOverlayProps {
  bounds: DOMRect;
  rotation: number;
}
```

**4. CanvasControls.tsx**
```typescript
interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}
```

## Implementation Phases

### Phase 1: Foundation (Critical) ✓
- [x] Fix gene slot count from 10 to 9
- [x] Update all validation and helper functions
- [x] Ensure ProposeDesignButton compatibility
- [x] Update UI text and labels

### Phase 2: Interactive Selection
- [ ] Add click-to-select on canvas
- [ ] Create SelectionOverlay component
- [ ] Add visual highlight for selected gene
- [ ] Update right panel to show selected gene info
- [ ] Keyboard selection (Tab, 1-9)

### Phase 3: Direct Manipulation
- [ ] Create InteractiveCanvas component
- [ ] Implement drag-to-move
- [ ] Create TransformHandles component
- [ ] Implement resize handles
- [ ] Implement rotation handle
- [ ] Add keyboard movement (arrows)

### Phase 4: History & Shortcuts
- [ ] Implement undo/redo stack
- [ ] Add keyboard shortcuts (Cmd+Z, etc.)
- [ ] Add undo/redo buttons to UI
- [ ] Add copy/paste functionality
- [ ] Add delete shortcut

### Phase 5: Polish & Features
- [ ] Add zoom/pan controls
- [ ] Add snap-to-grid toggle
- [ ] Add alignment guides
- [ ] Add preset layouts
- [ ] Add ghost preview while dragging
- [ ] Add info tooltips

### Phase 6: Mobile & Accessibility
- [ ] Test touch gestures
- [ ] Implement pinch-to-zoom
- [ ] Make panels collapsible on mobile
- [ ] Add ARIA labels
- [ ] Test screen reader compatibility
- [ ] Add keyboard-only navigation

## Technical Considerations

### Performance
- Use `useMemo` for expensive SVG rendering
- Debounce slider updates during drag
- Use `requestAnimationFrame` for smooth animations
- Lazy render genes outside viewport when zoomed out

### Browser Compatibility
- Test on Chrome, Firefox, Safari, Edge
- Fallback for browsers without pointer events
- Polyfills for older browsers if needed

### Mobile Considerations
- Touch events instead of mouse events
- Larger hit targets for handles (min 44×44px)
- Prevent page scroll while dragging on canvas
- Responsive layout (stack panels vertically)

### Accessibility
- All interactive elements keyboard accessible
- Focus indicators visible
- ARIA labels for screen readers
- Skip to canvas/controls links
- Announce state changes to screen readers

## Design Tokens

### Colors
```typescript
// Selection
selectionOutline: 'rgb(var(--energy))'      // #10b981 (green)
selectionHandle: 'rgb(var(--energy))'
selectionBackground: 'rgba(var(--energy), 0.1)'

// Transform handles
handleFill: '#ffffff'
handleStroke: 'rgb(var(--energy))'
handleSize: 12 // pixels

// Hover states
hoverOutline: 'rgba(var(--energy), 0.5)'
```

### Spacing
- Canvas padding: 16px
- Panel padding: 16px
- Gene slot gap: 8px
- Control gap: 16px

### Typography
- Slot label: 12px medium
- Control label: 12px normal
- Canvas info: 14px medium
- Keyboard shortcuts: 11px monospace

## User Feedback Messages

### Success Messages
- "Design updated" (on placement change)
- "Gene added to slot {n}"
- "Gene removed from slot {n}"
- "Layer reordered"
- "Placement reset"
- "Design proposed successfully!"

### Error Messages
- "Design must have 1-9 genes"
- "All slots are full"
- "Invalid gene selection"
- "Cannot move layer (already at front/back)"
- "Failed to propose design"

### Info Messages
- "Click a gene to select it"
- "Drag gene to move"
- "Use arrow keys for precise movement"
- "{n}/9 genes used"
- "Layer {n} selected"

## Testing Checklist

### Functionality
- [ ] Can add genes to all 9 slots
- [ ] Can remove genes from any slot
- [ ] Can reorder layers
- [ ] Can select gene by clicking canvas
- [ ] Can select gene by clicking slot list
- [ ] Can drag gene on canvas
- [ ] Can resize with handles
- [ ] Can rotate with handle
- [ ] Can use keyboard shortcuts
- [ ] Undo/redo works correctly
- [ ] Can propose design with 1-9 genes
- [ ] Cannot propose design with 0 genes
- [ ] Parent templates load correctly

### Visual
- [ ] Selected gene clearly highlighted
- [ ] Transform handles visible and aligned
- [ ] Bounding box accurate
- [ ] Canvas renders genes in correct order
- [ ] Sliders update in real-time
- [ ] Loading states show correctly
- [ ] Empty states show correctly

### Responsive
- [ ] Works on desktop (1920×1080)
- [ ] Works on laptop (1366×768)
- [ ] Works on tablet (768×1024)
- [ ] Works on mobile (375×667)
- [ ] Panels stack correctly on small screens
- [ ] Touch gestures work on mobile

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces changes
- [ ] Color contrast meets WCAG AA
- [ ] All interactive elements have labels

### Performance
- [ ] Canvas renders smoothly while dragging
- [ ] No lag when updating sliders
- [ ] Page loads quickly
- [ ] No memory leaks
- [ ] Works with 9 high-res SVG genes

## Future Enhancements

### Advanced Features
- [ ] Multi-select (Shift+click)
- [ ] Group genes together
- [ ] Lock layers (prevent editing)
- [ ] Hide layers (toggle visibility)
- [ ] Blend modes between layers
- [ ] Opacity per gene
- [ ] Flip horizontal/vertical
- [ ] Filter effects (blur, shadow, etc.)

### Collaboration
- [ ] Share design link
- [ ] Import design from existing Aminal
- [ ] Save draft designs locally
- [ ] Design templates gallery
- [ ] Community design showcase

### Quality of Life
- [ ] Color picker for genes (if applicable)
- [ ] Search genes by name
- [ ] Favorite genes
- [ ] Recent genes list
- [ ] Design complexity score
- [ ] Estimated gas cost

## Glossary

- **Gene**: An NFT representing a visual trait (SVG)
- **Slot**: One of 9 positions in the design array
- **Placement**: Transform properties (position, scale, rotation)
- **Layer**: Visual stacking order (slot 0 = back, slot 8 = front)
- **Canvas**: The interactive SVG preview area
- **Transform Handle**: Visual control for direct manipulation
- **History Stack**: Undo/redo state management
- **Gene Picker**: Modal for selecting genes to add

## References

- Smart Contract: `/workspace/src/AminalFactory.sol` (MAX_GENES = 9)
- Frontend Component: `/workspace/frontend/src/components/breeding/DesignBuilder.tsx`
- Propose Button: `/workspace/frontend/src/components/breeding/ProposeDesignButton.tsx`
- Gene Picker: `/workspace/frontend/src/components/breeding/GenePickerModal.tsx`
- Auction Page: `/workspace/frontend/pages/breeding/[auctionId].tsx`

---

**Version**: 1.0
**Last Updated**: 2025-11-05
**Status**: Implementation in progress
