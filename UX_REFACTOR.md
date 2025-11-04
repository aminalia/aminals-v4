# Breeding UX Refactor Plan - Hybrid Design-Based Voting

## Overview
Refactor the breeding system from trait-category voting to complete design voting with placement controls, supporting both browsing existing designs and creating new ones.

## Background

### Old System (Trait-Based Voting)
- Users voted on individual genes per trait category (background, arms, tail, etc.)
- `bulkVoteOnGenes()` allowed voting on 8 separate trait categories
- `proposeGene()` added individual genes to specific trait categories
- Voting was per-trait with trait types (0-7)

### New System (Design-Based Voting)
- Users vote on **complete Aminal designs** (1-10 genes with placement metadata)
- `voteOnDesign(auctionId, designId)` votes for an entire design
- `proposeDesign(auctionId, geneIds[10], placements[10])` submits complete designs
- Parent designs are automatically added as proposals
- No more trait categories - genes are flexible arrays with placement info

## Phase 1: Core Component Architecture

### 1. **DesignBuilder Component** (New)
**Purpose**: Visual editor for creating/modifying Aminal designs

**Features**:
- **Gene Slots Panel** (left): Up to 10 gene slots with add/remove controls
  - Each slot shows: gene preview thumbnail, gene ID, remove button
  - "Add Gene" button opens gene picker modal
  - Empty slots show ∅ placeholder
  - Drag to reorder slots (affects layer order)

- **Canvas** (center): SVG preview with interactive controls
  - Display all genes in correct layering order
  - Click gene to select it for editing
  - Visual indicators for selected gene
  - Real-time preview as changes are made
  - Zoom controls for detailed editing

- **Placement Controls** (right): Per-gene transformation controls
  - X offset slider (-500 to 500)
  - Y offset slider (-500 to 500)
  - Scale slider (10% to 200%)
  - Rotation slider (-180° to 180°)
  - Reset to default button
  - Only active when a gene is selected
  - Show current values numerically

**Props**:
```typescript
interface DesignBuilderProps {
  initialGeneIds?: bigint[];
  initialPlacements?: GeneMetadata[];
  availableGenes: Gene[]; // Parent genes by default
  onDesignChange: (geneIds: bigint[], placements: GeneMetadata[]) => void;
  disabled?: boolean;
  maxGenes?: number; // Default 10
}
```

**State Management**:
```typescript
interface DesignBuilderState {
  geneIds: bigint[]; // 0 = empty slot
  placements: GeneMetadata[];
  selectedGeneIndex: number | null;
  isDirty: boolean;
}
```

---

### 2. **DesignGallery Component** (New)
**Purpose**: Browse and vote on submitted design proposals

**Features**:
- Grid of design cards showing:
  - Full Aminal preview (rendered SVG)
  - Design ID and proposer (or "Parent Design" badge)
  - Vote count and percentage of total
  - "Vote" button with voting power display
  - "View/Edit" button to open in DesignBuilder (creates remix)
  - Visual badge for winning design (🏆)
  - Visual indicator for user's current vote (✓)

- Sorting/Filtering options:
  - Sort by: Most votes | Newest first | Parent designs first
  - Filter by: All | Parent designs only | Community proposals

- Empty states:
  - No proposals yet: "Be the first to propose a design!"
  - No votes yet: "No votes cast yet. Start voting!"

**Props**:
```typescript
interface DesignGalleryProps {
  auctionId: string;
  designs: AminalDesign[];
  userVotedDesignId?: bigint;
  userVotingPower: bigint;
  onVote: (designId: bigint) => void;
  onViewDesign: (design: AminalDesign) => void;
  disabled?: boolean;
  isLoading?: boolean;
}
```

**Design Card Layout**:
```
┌─────────────────────────────────┐
│  ┌─────────────────────────┐   │
│  │                         │   │ [🏆 if winning]
│  │   Aminal Preview SVG    │   │ [✓ if user voted]
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  Design #123                    │
│  Proposed by: 0x1234... [Badge]│
│                                 │
│  ❤️ 450 votes (35%)            │
│                                 │
│  [Vote with 15 ❤️] [View]      │
└─────────────────────────────────┘
```

---

### 3. **GenePickerModal Component** (New)
**Purpose**: Select genes to add to design

**Features**:
- Tabbed interface:
  - **Parent Genes** (default): Genes from both parents
  - **All Genes**: Browse entire gene registry
  - **My Genes**: User's owned gene NFTs
  - **Manual Entry**: Enter gene ID directly

- Search and filter:
  - Search by gene ID
  - Filter by usage count (popular genes)

- Grid display with:
  - Gene preview (SVG thumbnail)
  - Gene ID
  - Creator address (truncated)
  - Usage count in Aminals
  - Select button

**Props**:
```typescript
interface GenePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGene: (gene: Gene) => void;
  parentGenes: Gene[];
  excludeGeneIds?: bigint[]; // Already used in design
  userAddress?: string;
}
```

---

### 4. **ProposeDesignButton Component** (Refactored)
**Purpose**: Submit complete design as proposal

**Features**:
- Prominent cost display:
  ```
  Propose Design
  Cost: 10 ❤️ + 10 ⚡ (from each parent)
  ```
- Validate design before submission:
  - Must have 1-10 genes
  - All gene IDs must be valid (registered in GeneRegistry)
  - Check user has sufficient love/energy
- Submit to `proposeDesign()` contract function
- Loading states during transaction
- Success toast: "🧬 Design #123 proposed! Community can now vote."
- Error handling:
  - Invalid genes
  - Insufficient love/energy
  - Transaction failures

**Props**:
```typescript
interface ProposeDesignButtonProps {
  auctionId: string;
  geneIds: bigint[10]; // Array of 10, with 0 for empty slots
  placements: GeneMetadata[10];
  disabled?: boolean;
  onSuccess?: (designId: bigint) => void;
}
```

**Validation Logic**:
```typescript
function validateDesign(geneIds: bigint[], placements: GeneMetadata[]): {
  isValid: boolean;
  error?: string;
} {
  const nonEmptyGenes = geneIds.filter(id => id !== 0n);

  if (nonEmptyGenes.length === 0) {
    return { isValid: false, error: "Design must have at least 1 gene" };
  }

  if (nonEmptyGenes.length > 10) {
    return { isValid: false, error: "Design cannot have more than 10 genes" };
  }

  // Check all genes are valid via GeneRegistry
  // Check user has sufficient love/energy

  return { isValid: true };
}
```

---

### 5. **VoteOnDesignButton Component** (Replaces BulkVoteButton)
**Purpose**: Vote for a complete design

**Features**:
- Display user's voting power: "Vote with 15 ❤️"
- Show current vote status:
  - If this is user's vote: "✓ Your Vote (Change?)"
  - If user voted elsewhere: "Change Vote"
  - If no vote: "Vote"
- Call `voteOnDesign(auctionId, designId)`
- Handle vote changes (automatically removes previous vote)
- Loading states: "Casting vote..." → "Confirming..."
- Success feedback: "✓ Vote cast successfully!"
- Disabled states:
  - Auction ended
  - No voting power
  - User wallet not connected

**Props**:
```typescript
interface VoteOnDesignButtonProps {
  auctionId: string;
  designId: bigint;
  userVotingPower: bigint;
  isCurrentVote: boolean;
  disabled?: boolean;
  onSuccess?: () => void;
}
```

---

## Phase 2: Page Layout Refactor

### Breeding Auction Page Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header Section                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ [← Back to Breeding] [#123]                                     │ │
│ │                                                                  │ │
│ │ Aminal #5 × Aminal #12                                          │ │
│ │ [Countdown: 23:45:12 remaining] or [End Auction] or [Complete] │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Tab Navigation                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [📊 Browse Designs]  [✨ Create New Design]                    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────── TAB: BROWSE DESIGNS ─────────────────────────┐
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ VoteStats Component (Refactored)                             │  │
│  │ ┌──────────────────────────────────────────────────────────┐ │  │
│  │ │ 📊 Quick Stats:                                          │ │  │
│  │ │ • 15 unique voters  • 450 ❤️ votes  • 65% turnout       │ │  │
│  │ └──────────────────────────────────────────────────────────┘ │  │
│  │                                                              │  │
│  │ ┌──────────────────────────────────────────────────────────┐ │  │
│  │ │ 🏆 Current Winning Design                                │ │  │
│  │ │ ┌────────────┐ Design #5 by 0x1234...                   │ │  │
│  │ │ │  Preview   │ 180 votes (40%)                          │ │  │
│  │ │ │    SVG     │ Leading by 35 votes                      │ │  │
│  │ │ └────────────┘                                           │ │  │
│  │ └──────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Filter/Sort Controls                                         │  │
│  │ Sort: [Most votes ▼]  Filter: [All designs ▼]               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ DesignGallery Component                                      │  │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │  │
│  │ │ Design 1 │ │ Design 2 │ │ Design 3 │ │ Design 4 │        │  │
│  │ │  [Vote]  │ │  [Vote]  │ │  [Vote]  │ │  [Vote]  │        │  │
│  │ │  [View]  │ │  [View]  │ │  [View]  │ │  [View]  │        │  │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │  │
│  │                                                              │  │
│  │ [Load More Designs...]                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

┌───────────────────── TAB: CREATE NEW DESIGN ───────────────────────┐
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 💡 Quick Start Templates                                     │  │
│  │ [Start with Parent 1] [Start with Parent 2] [Start Fresh]   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 💰 Cost to Propose: 10 ❤️ + 10 ⚡ (from each parent)         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ DesignBuilder Component                                      │  │
│  │ ┌─────────────┬───────────────────┬─────────────────┐       │  │
│  │ │ Gene Slots  │     Canvas        │  Placement      │       │  │
│  │ │             │    Preview        │  Controls       │       │  │
│  │ │ ┌─────────┐ │                   │                 │       │  │
│  │ │ │[+Add]   │ │  ┌─────────────┐  │ Selected:       │       │  │
│  │ │ └─────────┘ │  │             │  │ Gene #123       │       │  │
│  │ │             │  │             │  │                 │       │  │
│  │ │ Gene #123   │  │   Aminal    │  │ X: [━━●━━━] 50  │       │  │
│  │ │ [×]         │  │   Preview   │  │ Y: [━━━━●━] 25  │       │  │
│  │ │             │  │             │  │ Scale: [━●━━━] │       │  │
│  │ │ Gene #456   │  │             │  │         80%     │       │  │
│  │ │ [×]         │  │             │  │ Rotation: [●━━] │       │  │
│  │ │             │  │             │  │          -45°   │       │  │
│  │ │ Gene #789   │  └─────────────┘  │                 │       │  │
│  │ │ [×]         │                    │ [Reset]         │       │  │
│  │ │             │  [Zoom: ━━●━━━]    │                 │       │  │
│  │ └─────────────┴───────────────────┴─────────────────┘       │  │
│  │                                                              │  │
│  │  [Preview Design] [Propose Design (10❤️ + 10⚡)]            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ If Auction Finished & Child Born                                    │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🎉 New Aminal Has Been Born!                                   │ │
│ │ ┌────────────┐ Aminal #25                                      │ │
│ │ │  Child     │ Born from Auction #123                         │ │
│ │ │  Preview   │ Winning Design: #5                             │ │
│ │ └────────────┘ [View Aminal Page →]                            │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 3: Data Layer Updates

### GraphQL Schema Considerations

**Check if subgraph needs updates to query:**
- Design proposals with full gene arrays (uint256[10])
- Placement metadata per design (GeneMetadata[10])
- Design voting data (votes per design, not per gene)
- Design removal votes
- Winning design ID and tied designs

**Possible new subgraph entities:**
```graphql
type DesignProposal @entity {
  id: ID! # auctionId-designId
  auction: Auction!
  designId: BigInt!
  proposer: Bytes!
  geneIds: [BigInt!]! # Array of up to 10
  # Placements stored as separate fields or JSON
  placementsData: String! # JSON string of GeneMetadata[]
  votes: BigInt!
  removed: Boolean!
  timestamp: BigInt!
}

type DesignVote @entity {
  id: ID! # tx-hash-log-index
  auction: Auction!
  design: DesignProposal!
  voter: User!
  votingPower: BigInt!
  timestamp: BigInt!
}
```

### React Query Hooks

**New hooks needed:**

```typescript
// Get all design proposals for an auction
export const useDesignProposals = (auctionId: string) => {
  return useQuery({
    queryKey: ['designs', auctionId],
    queryFn: async () => {
      // Query subgraph for all designs in auction
      // Return DesignProposal[]
    },
    enabled: !!auctionId,
  });
};

// Get specific design details
export const useDesign = (auctionId: string, designId: bigint) => {
  return useQuery({
    queryKey: ['design', auctionId, designId.toString()],
    queryFn: async () => {
      // Call getDesign(auctionId, designId) on contract
      // or query subgraph
    },
    enabled: !!auctionId && designId > 0n,
  });
};

// Get user's voting power for an auction
export const useUserVotingPower = (auctionId: string, userAddress?: string) => {
  return useQuery({
    queryKey: ['votingPower', auctionId, userAddress],
    queryFn: async () => {
      // Call getUserVotingPower(auctionId, userAddress) on contract
    },
    enabled: !!auctionId && !!userAddress,
  });
};

// Get which design user voted for
export const useUserVotedDesign = (auctionId: string, userAddress?: string) => {
  return useQuery({
    queryKey: ['userVote', auctionId, userAddress],
    queryFn: async () => {
      // Call getUserVotedDesign(auctionId, userAddress) on contract
      // Returns designId
    },
    enabled: !!auctionId && !!userAddress,
  });
};

// Get design voting stats and winning info
export const useDesignVotes = (auctionId: string) => {
  return useQuery({
    queryKey: ['designVotes', auctionId],
    queryFn: async () => {
      // Call getAuctionVoting(auctionId) on contract
      // Returns: highestVotes, winningDesignId, proposedDesignIds, tiedDesignIds
    },
    enabled: !!auctionId,
  });
};

// Get genes by IDs (for rendering designs)
export const useGenesByIds = (geneIds: string[]) => {
  return useQuery({
    queryKey: ['genesByIds', geneIds.sort().join(',')],
    queryFn: async () => {
      // Query subgraph for gene data by IDs
      // Return Gene[] with svg, metadata
    },
    enabled: geneIds.length > 0,
  });
};
```

---

## Phase 4: VoteStats Refactor

### Design-Focused Stats (Primary)

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ 📊 Auction Statistics                                    │
├──────────────────────────────────────────────────────────┤
│ ┌────────────┬────────────┬────────────┬────────────┐   │
│ │ 15 Voters  │ 450 Votes  │ 65% Turnout│ 8 Designs  │   │
│ └────────────┴────────────┴────────────┴────────────┘   │
├──────────────────────────────────────────────────────────┤
│ 🏆 Current Winner                                        │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ┌──────────┐  Design #5                           │  │
│ │ │ Preview  │  Proposed by 0x1234... (Parent 1)    │  │
│ │ │   SVG    │  180 votes (40%)                     │  │
│ │ └──────────┘  Leading by 35 votes                 │  │
│ └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│ 📈 Top Designs                                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 1st: Design #5 - 180 votes (40%) ███████████████  │  │
│ │ 2nd: Design #12 - 145 votes (32%) ███████████     │  │
│ │ 3rd: Design #3 - 90 votes (20%) ████████          │  │
│ │ Others: 35 votes (8%) ███                          │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Quick stats grid (voters, votes, turnout, designs)
- Winning design prominently displayed with preview
- Top 3-5 designs with vote bars
- Vote distribution chart
- Time-based stats (votes over time)

### Optional: Gene Popularity Analysis (Secondary)

**Expandable section:**
```
┌──────────────────────────────────────────────────────────┐
│ ▼ Gene Popularity Analysis                               │
├──────────────────────────────────────────────────────────┤
│ Most Used Genes (appears in multiple top designs):      │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Gene #123 - Used in 5 designs (3 in top 5)        │  │
│ │ Gene #456 - Used in 4 designs (2 in top 5)        │  │
│ │ Gene #789 - Used in 3 designs (1 in top 5)        │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Purpose:** Help users understand which genes are popular and may influence their design choices.

---

## Phase 5: Implementation Order

### Sprint 1: Foundation (Days 1-3)
**Goal:** Set up component structure and data layer

- [ ] **Day 1: Types & Contracts**
  - [ ] Create TypeScript types for `GeneMetadata`, `AminalDesign`
  - [ ] Update contract types with `wagmi:generate`
  - [ ] Create placeholder hooks (`useDesignProposals`, `useUserVotingPower`, etc.)
  - [ ] Test contract read functions in console

- [ ] **Day 2: Component Shells**
  - [ ] Create `DesignBuilder.tsx` component shell
  - [ ] Create `DesignGallery.tsx` component shell
  - [ ] Create `GenePickerModal.tsx` component shell
  - [ ] Create `DesignCard.tsx` component (used in gallery)
  - [ ] Set up basic props and state management

- [ ] **Day 3: Data Integration**
  - [ ] Implement GraphQL queries for designs (if subgraph ready)
  - [ ] Implement contract read hooks fully
  - [ ] Test data fetching with real auction
  - [ ] Create mock data for development if needed

### Sprint 2: Design Builder (Days 4-6)
**Goal:** Complete visual editor for creating designs

- [ ] **Day 4: Gene Slots Panel**
  - [ ] Implement gene slots list UI
  - [ ] Add/remove gene functionality
  - [ ] Gene reordering (drag & drop or buttons)
  - [ ] Connect to GenePickerModal
  - [ ] Visual indicators for selected gene

- [ ] **Day 5: Canvas Preview**
  - [ ] SVG rendering with proper layering
  - [ ] Click-to-select genes on canvas
  - [ ] Highlight selected gene
  - [ ] Zoom controls
  - [ ] Real-time updates as placement changes

- [ ] **Day 6: Placement Controls**
  - [ ] X/Y offset sliders with live preview
  - [ ] Scale slider with live preview
  - [ ] Rotation slider with live preview
  - [ ] Numeric value display
  - [ ] Reset button per control
  - [ ] "Reset All" button
  - [ ] Connect all controls to selected gene

### Sprint 3: Gallery & Voting (Days 7-9)
**Goal:** Enable browsing and voting on designs

- [ ] **Day 7: Design Gallery**
  - [ ] Grid layout with design cards
  - [ ] Design card UI (preview, stats, buttons)
  - [ ] Sort controls (most votes, newest, parent first)
  - [ ] Filter controls (all, parent, community)
  - [ ] Loading states
  - [ ] Empty states

- [ ] **Day 8: Voting System**
  - [ ] Create `VoteOnDesignButton` component
  - [ ] Implement `voteOnDesign` contract call
  - [ ] Show user's voting power
  - [ ] Show current vote status
  - [ ] Handle vote changes
  - [ ] Loading/success/error states
  - [ ] Toast notifications

- [ ] **Day 9: View/Remix Flow**
  - [ ] "View Design" opens in DesignBuilder (read-only)
  - [ ] "Remix" button to enable editing
  - [ ] Switch between gallery and builder
  - [ ] Preserve design state when switching tabs

### Sprint 4: Propose Design (Days 10-11)
**Goal:** Enable submitting new designs

- [ ] **Day 10: Propose Flow**
  - [ ] Create `ProposeDesignButton` component
  - [ ] Design validation logic
  - [ ] Cost calculation and display
  - [ ] Check user balance (love/energy)
  - [ ] Implement `proposeDesign` contract call
  - [ ] Loading states during transaction

- [ ] **Day 11: Polish & Feedback**
  - [ ] Success/error handling
  - [ ] Toast notifications
  - [ ] Cost indicators throughout UI
  - [ ] Quick start templates (parent 1, parent 2, fresh)
  - [ ] Help tooltips
  - [ ] Keyboard shortcuts (undo, redo, etc.)

### Sprint 5: Page Integration (Days 12-13)
**Goal:** Integrate all components into breeding page

- [ ] **Day 12: Page Layout**
  - [ ] Create tab navigation (Browse/Create)
  - [ ] Integrate DesignGallery in Browse tab
  - [ ] Integrate DesignBuilder in Create tab
  - [ ] State management between tabs
  - [ ] URL state persistence (tab selection)

- [ ] **Day 13: Header & Status**
  - [ ] Update header with parent info
  - [ ] Countdown timer integration
  - [ ] Auction status (active/ended/settled)
  - [ ] "End Auction" button when time expires
  - [ ] Finished state with child Aminal display
  - [ ] Responsive layout for mobile

### Sprint 6: Stats & Polish (Days 14-15)
**Goal:** Complete VoteStats and final polish

- [ ] **Day 14: VoteStats Refactor**
  - [ ] Refactor to show design-level statistics
  - [ ] Quick stats grid
  - [ ] Winning design display
  - [ ] Top designs bar chart
  - [ ] Optional: Gene popularity analysis
  - [ ] Empty states (no votes yet)

- [ ] **Day 15: Final Polish**
  - [ ] Add tooltips throughout
  - [ ] Help text and onboarding
  - [ ] Accessibility (keyboard nav, ARIA labels)
  - [ ] Responsive design testing
  - [ ] Cross-browser testing
  - [ ] Performance optimization
  - [ ] Bug fixes

### Sprint 7: Testing & Deployment (Days 16-17)
**Goal:** Comprehensive testing and deployment

- [ ] **Day 16: Testing**
  - [ ] End-to-end testing (create, propose, vote, settle)
  - [ ] Edge cases (empty designs, invalid genes, etc.)
  - [ ] Transaction failure scenarios
  - [ ] Loading state coverage
  - [ ] Mobile UX testing

- [ ] **Day 17: Deployment**
  - [ ] Deploy to staging
  - [ ] User acceptance testing
  - [ ] Fix critical bugs
  - [ ] Deploy to production
  - [ ] Monitor for issues

---

## Technical Considerations

### Contract Function Signatures

```solidity
// Propose a complete design with up to 10 genes
function proposeDesign(
  uint256 auctionId,
  uint256[10] calldata geneIds,      // 0 = empty slot
  GeneMetadata[10] calldata placements
) external validVoting(auctionId)

// Vote on a complete design (uses full voting power)
function voteOnDesign(
  uint256 auctionId,
  uint256 designId
) external validVoting(auctionId)

// Get design details
function getDesign(
  uint256 auctionId,
  uint256 designId
) external view validVoting(auctionId) returns (AminalDesign memory)

// Get auction voting info
function getAuctionVoting(
  uint256 auctionId
) external view validVoting(auctionId) returns (AuctionVoteInfo memory)

// Get user's voting power
function getUserVotingPower(
  uint256 auctionId,
  address user
) external view validVoting(auctionId) returns (uint256)

// Get which design user voted for
function getUserVotedDesign(
  uint256 auctionId,
  address user
) external view validVoting(auctionId) returns (uint256 designId)
```

### Data Structures

```solidity
struct GeneMetadata {
  int16 offsetX;   // -500 to 500 (centered at 0)
  int16 offsetY;   // -500 to 500 (centered at 0)
  uint16 scale;    // 10 to 200 (100 = 100% = default)
  int16 rotation;  // -180 to 180 (degrees)
}

struct AminalDesign {
  uint256[10] geneIds;        // Up to 10 gene NFT IDs (0 = unused)
  address proposer;           // Who proposed (address(0) = parent)
  uint256 votes;              // Total voting power
  bool removed;               // Whether removed by community
  GeneMetadata[10] placements; // Placement for each gene
}

struct AuctionVoteInfo {
  uint256 highestVotes;       // Highest vote count
  uint256 winningDesignId;    // Current winner
  uint256[] proposedDesignIds; // All proposed designs
  uint256[] tiedDesignIds;    // Designs tied for first
}
```

### TypeScript Types

```typescript
export interface GeneMetadata {
  offsetX: number;   // -500 to 500
  offsetY: number;   // -500 to 500
  scale: number;     // 10 to 200
  rotation: number;  // -180 to 180
}

export const DEFAULT_PLACEMENT: GeneMetadata = {
  offsetX: 0,
  offsetY: 0,
  scale: 100,
  rotation: 0,
};

export interface AminalDesign {
  geneIds: bigint[]; // Length 10, 0 = empty
  proposer: string;  // Address
  votes: bigint;
  removed: boolean;
  placements: GeneMetadata[];
}

export interface DesignWithMetadata extends AminalDesign {
  designId: bigint;
  auctionId: bigint;
  genes: Gene[]; // Fetched gene data with SVG
  isParentDesign: boolean;
  parentIndex?: number; // 1 or 2 if parent design
}
```

### SVG Rendering with Placement

```typescript
function renderGeneWithPlacement(
  geneSvg: string,
  placement: GeneMetadata
): string {
  // Wrap gene SVG in transform group
  return `
    <g transform="
      translate(${placement.offsetX}, ${placement.offsetY})
      rotate(${placement.rotation}, 500, 500)
      scale(${placement.scale / 100})
    ">
      ${geneSvg}
    </g>
  `;
}

function renderDesign(design: DesignWithMetadata): string {
  return `
    <svg viewBox="0 0 1000 1000">
      ${design.genes
        .map((gene, i) =>
          gene.tokenId !== '0'
            ? renderGeneWithPlacement(gene.svg, design.placements[i])
            : ''
        )
        .join('')}
    </svg>
  `;
}
```

---

## Open Questions & Decisions

### 1. Gene Layer Ordering
**Question:** Should users be able to control layer order, or is it fixed?

**Options:**
- **Fixed order:** Layer based on array position (index 0 = back, index 9 = front)
- **User control:** Drag-and-drop to reorder layers

**Decision:** ✅ User control - drag-and-drop to reorder layers in the gene slots panel.

**Rationale:** Gives users full creative control over layering, essential for complex designs.

---

### 2. Design Gene Count Limits
**Question:** Contract allows 1-10 genes. Should UI recommend a range?

**Options:**
- No restrictions, let creativity flow
- Suggest "3-8 genes for best results"
- Warn if <2 or >8 genes

**Decision:** ✅ No restrictions or recommendations. Show gene count (1-10 genes used).

**Rationale:** Let creativity flow. Community will discover what works best.

---

### 3. Parent Design Editing
**Question:** Can users edit parent designs as starting points?

**Options:**
- **Yes, "Remix" button:** Load parent design, allow edits, propose as new design
- **No:** Users can only view parent designs, not edit

**Decision:** ✅ Yes, add "Start with Parent 1/2" quick start templates.

**Rationale:** Encourages participation, reduces barrier to entry, common UX pattern in creative tools.

---

### 4. Canvas Zoom & Pan
**Question:** Should canvas support zoom/pan for detailed editing?

**Options:**
- **Zoom only:** Slider to zoom in/out (50%-200%)
- **Zoom + Pan:** Click-drag to pan around zoomed canvas
- **No zoom:** Fixed view

**Decision:** ✅ Keep it simple - no zoom/pan initially. Fixed 1:1 view of full canvas.

**Rationale:** Simpler to build, users can still see full design. Add zoom in v2 if needed.

---

### 5. Mobile UX
**Question:** How should DesignBuilder work on mobile devices?

**Layout Options:**
- **Stacked:** Gene Slots → Canvas → Controls (vertical scroll)
- **Tabbed:** Tabs for Slots/Canvas/Controls (one at a time)
- **Simplified:** Mobile gets simplified builder

**Decision:** ✅ Stack vertically - Gene Slots → Canvas → Controls (vertical scroll).

**Rationale:** Most intuitive for mobile, all sections accessible via scroll.

---

### 6. Design Preview Mode
**Question:** Should there be a "preview only" mode separate from editor?

**Decision:** Yes, viewing an existing design shows read-only builder with "Remix" button.

**Rationale:** Reuses DesignBuilder component, clear path to remix/improve designs.

---

### 7. Undo/Redo
**Question:** Should design builder have undo/redo functionality?

**Decision:** v2 feature, start with manual resets only.

**Rationale:** Nice-to-have but not critical, adds complexity.

---

### 8. Design Naming
**Question:** Should users be able to name their designs?

**Options:**
- Yes, optional name field
- No, just use "Design #123"

**Decision:** No names initially, just Design IDs.

**Rationale:** Reduces form friction, can add in v2 if desired.

---

### 9. Gas Optimization
**Question:** Should UI help users optimize gas costs?

**Ideas:**
- Show estimated gas for propose/vote
- Batch operations where possible
- Suggest using fewer genes for lower gas

**Decision:** Show costs in love/energy, not gas. Gas transparency in v2.

**Rationale:** Keep focus on game mechanics (love/energy), not blockchain details.

---

### 10. Design Collaboration
**Question:** Can multiple users collaborate on a design before proposing?

**Decision:** No, designs are individual proposals.

**Rationale:** Scope creep, complex to implement, can add in v2.

---

## Success Metrics

### User Experience Metrics
- [ ] Users can browse all design proposals in <5 seconds
- [ ] Users can create a new design in <2 minutes
- [ ] Users can adjust gene placement (x, y, scale, rotation) intuitively
- [ ] Users can vote on a design in <30 seconds
- [ ] Cost of proposing (10❤️ + 10⚡ per parent) is clearly visible
- [ ] Mobile UX is usable (touch controls, responsive layout)

### Technical Metrics
- [ ] Page loads in <3 seconds
- [ ] Design builder updates in <100ms
- [ ] Contract interactions have clear loading/error states
- [ ] Zero critical bugs in production

### Engagement Metrics
- [ ] % of auctions with >1 community-proposed design (target: 50%+)
- [ ] % of auctions with >10 votes (target: 70%+)
- [ ] Average designs per auction (target: 3-5)
- [ ] Remix rate: % of designs that are remixes vs. fresh (target: 30%+)

---

## Migration Plan

### Backward Compatibility
**Note:** The new contracts are fundamentally different from the old trait-based system. There is no migration path for existing auctions - they must be settled under old rules or manually migrated.

**Options:**
1. **Hard cutoff:** After date X, only new design-based auctions
2. **Parallel systems:** Support both old and new auction types
3. **Force settle:** Settle all old auctions, start fresh

**Recommendation:** Force settle old auctions if any exist, then deploy new system.

---

## Appendix: Component File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── breeding/
│   │   │   ├── DesignBuilder.tsx          (New)
│   │   │   ├── DesignGallery.tsx          (New)
│   │   │   ├── DesignCard.tsx             (New)
│   │   │   ├── GenePickerModal.tsx        (New)
│   │   │   ├── GeneSlotsPanel.tsx         (New - part of builder)
│   │   │   ├── DesignCanvas.tsx           (New - part of builder)
│   │   │   ├── PlacementControls.tsx      (New - part of builder)
│   │   │   ├── ProposeDesignButton.tsx    (Refactored)
│   │   │   ├── VoteOnDesignButton.tsx     (New - replaces BulkVoteButton)
│   │   │   ├── VoteStats.tsx              (Refactored)
│   │   │   ├── TraitSelector.tsx          (DEPRECATED - remove)
│   │   │   └── BulkVoteButton.tsx         (DEPRECATED - remove)
│   │   ├── actions/
│   │   │   └── EndAuctionButton.tsx       (Keep - still needed)
│   │   └── ...
│   ├── hooks/
│   │   ├── useDesignProposals.ts          (New)
│   │   ├── useDesign.ts                   (New)
│   │   ├── useUserVotingPower.ts          (New)
│   │   ├── useUserVotedDesign.ts          (New)
│   │   ├── useDesignVotes.ts              (New)
│   │   └── ...
│   └── types/
│       ├── breeding.ts                     (New - GeneMetadata, AminalDesign, etc.)
│       └── ...
├── pages/
│   └── breeding/
│       └── [auctionId].tsx                 (Heavy refactor)
└── ...
```

---

## Resources & References

- **Contract:** `/workspace/src/genes/GeneAuction.sol`
- **Current Page:** `/workspace/frontend/pages/breeding/[auctionId].tsx`
- **Design System:** `/workspace/frontend/src/theme/`
- **Plan Doc:** `/workspace/PLAN.md`

---

**Last Updated:** 2025-11-04
**Status:** Planning Phase
**Next Steps:** Review with team, begin Sprint 1 implementation
