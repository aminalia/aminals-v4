# Frontend Refactor Plan: GraphQL to Ponder Migration

## Overview

Migrate the Aminals frontend from The Graph Protocol (GraphQL) to Ponder's SQL-over-HTTP approach using `@ponder/react` and `@ponder/client`. This refactor will enable real-time updates and improve performance.

**Status**: Planning Phase
**Backwards Compatibility**: Not required (already mid-refactor)
**Goal**: Complete migration with live query support for real-time data updates

## Current State Analysis

### Existing GraphQL Infrastructure

**Dependencies to Remove:**
- `@graphprotocol/client-cli` - GraphQL client generation
- `graphql` - GraphQL runtime
- `.graphclient/` directory - Generated GraphQL client
- `graphclient:build` script - Build process

**Current Data Layer** (`frontend/src/resources/`):

**Summary: 18 total hooks, 2 unused (to be deleted)**

1. **aminals.ts** - 4 hooks using GraphQL:
   - ✅ `useAminals(userAddress, filter, sort)` - List with filtering/sorting
     - Used in: pages/index.tsx, components/breeding-modal.tsx
   - ❌ **`useAminal(aminalId)`** - Single by ID - **UNUSED - DELETE**
   - ✅ `useAminalForChat(contractAddress, userAddress)` - Chat-specific data
     - Used in: pages/aminals/[id]/chat/index.tsx, pages/aminals/[id]/chat/[chatId].tsx
   - ✅ `useAminalByContractAddress(contractAddress, userAddress)` - Detail view
     - Used in: pages/aminals/[id].tsx

2. **auctions.ts** - 5 hooks using GraphQL:
   - ✅ `useAuctions()` - List all auctions
     - Used in: pages/breeding/index.tsx, components/vote-stats.tsx
   - ✅ `useAuction(auctionId)` - Single auction
     - Used in: pages/breeding/[auctionId].tsx, components/vote-stats.tsx
   - ✅ `useAuctionProposeGenes(auctionId)` - Proposals for auction
     - Used in: pages/breeding/[auctionId].tsx
   - ❌ **`useProposeGenes()`** - All proposals across auctions - **UNUSED - DELETE**
   - ✅ `useAuctionVotes(auctionId)` - Votes for auction
     - Used in: components/vote-stats.tsx

3. **genes.ts** - 3 hooks using GraphQL:
   - ✅ `useGenes(filter, sort, category)` - List with filtering
     - Used in: pages/genes/index.tsx, components/propose-gene-modal.tsx
   - ✅ `useGene(id)` - Single gene
     - Used in: pages/genes/[id].tsx
   - ✅ `useGenesByIds(ids[])` - Batch fetch genes
     - Used in: pages/aminals/[id].tsx, pages/breeding/[auctionId].tsx

4. **skills.ts** - 2 hooks using GraphQL:
   - ❌ **`useSkillUsage()`** - Global skill usage data - **UNUSED - DELETE**
   - ❌ **`useSkills()`** - Deprecated alias - **UNUSED - DELETE**

5. **user-profile.ts** - 3 hooks using raw GraphQL fetch:
   - ✅ `useUserProfile(address)` - Complete profile
     - Used in: pages/profile/[address].tsx
   - ✅ `useUserEarnings(address)` - Gene creator earnings
     - Used in: pages/profile/[address].tsx
   - ❌ **`useUserActivity(address)`** - Recent user activity - **UNUSED - DELETE**

6. **gene-proposals.ts** - 1 hook using GraphQL:
   - ✅ `useGeneProposalsByAuctionId(auctionId)` - Filtered proposals
     - Used in: components/genes-list.tsx

**Client-Side Transformers:**
- `frontend/src/lib/dataTransformers.ts` - Aminal filtering/sorting
- `frontend/src/lib/geneTransformers.ts` - Gene filtering/sorting/categorization

**Note:** These files use kebab-case currently but should be renamed to camelCase as part of this refactor.

**Key Pages Using Data:**
- `pages/index.tsx` - Aminals grid with filter/sort
- `pages/aminals/[id].tsx` - Individual Aminal detail
- `pages/aminals/[id]/chat/*.tsx` - Chat interfaces
- `pages/breeding/index.tsx` - Active auctions
- `pages/breeding/[auctionId].tsx` - Auction detail
- `pages/genes/index.tsx` - Genes grid with filter/sort
- `pages/genes/[id].tsx` - Gene detail
- `pages/profile/[address].tsx` - User profile
- `pages/leaderboard/index.tsx` - Aminal leaderboard

### Ponder Schema Structure

**Key Breaking Change:** Aminal traits changed from 8 separate fields to a single array:
- **Old**: `backId`, `armId`, `tailId`, `earsId`, `bodyId`, `faceId`, `mouthId`, `miscId`
- **New**: `traits[0..7]` (array with indices 0-7 for BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC)

**Available Tables:**
- `factory` - Factory contract state
- `aminal` - Individual Aminals with traits array
- `user` - User addresses
- `relationship` - Love relationships (many-to-many)
- `geneNFT` - Gene trait NFTs
- `geneAuction` - Breeding auctions
- `geneProposal` - Gene proposals in auctions
- `geneVote` - Individual votes
- `geneCreatorPayout` - Creator payments
- `feedEvent` - Feeding events (immutable)
- `skillUsedEvent` - Skill usage events (immutable)

**Relations Available:**
- Full nested querying via Drizzle ORM relations
- Efficient joins for related data

## Migration Plan

### Phase 1: Setup & Dependencies

**1.1 Install Ponder Packages**
```bash
npm install @ponder/react @ponder/client
```

**1.2 Remove GraphQL Dependencies**
```bash
npm uninstall @graphprotocol/client-cli graphql
```

**1.3 Update package.json Scripts**
- Remove: `graphclient:build`
- Update: `build:all` to remove graphclient build step

**1.4 Create Ponder Client Configuration**

Create `frontend/src/lib/ponderClient.ts` (camelCase):
```typescript
import { createClient } from "@ponder/client";
import * as schema from "../../../ponder/ponder.schema";

// Determine Ponder server URL based on environment
const PONDER_URL = process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069/sql";

export const ponderClient = createClient(PONDER_URL, { schema });
```

**1.5 Setup PonderProvider in _app.tsx**

Update `frontend/pages/_app.tsx`:
```typescript
import { PonderProvider } from "@ponder/react";
import { ponderClient } from "@/lib/ponderClient";

// Wrap app with PonderProvider
<PonderProvider client={ponderClient}>
  {/* existing providers */}
</PonderProvider>
```

### Phase 2: Create New Hook Structure

**2.1 Create Hook Directory Structure**

Move all hooks from `frontend/src/resources/` to `frontend/src/hooks/` with proper TypeScript conventions (camelCase):
```
frontend/src/hooks/
├── useAminals.ts       # Aminal queries
├── useAuctions.ts      # Auction queries
├── useGenes.ts         # Gene queries
├── useUser.ts          # User profile queries
├── useGeneProposals.ts # Gene proposal queries
└── index.ts            # Barrel exports
```

**Note:** Following TypeScript best practices:
- camelCase for file names (not kebab-case)
- Hook files named after the primary hook export
- Clear, descriptive names matching functionality

**2.2 Update Query Key Factory**

Update `frontend/src/lib/queryClient.ts` (camelCase) to use Ponder-specific keys:
- Keep existing structure but update naming for clarity
- Add keys for live queries (e.g., `aminals.live()`)

### Phase 3: Migrate Hooks to Ponder

**Note:** Skip unused hooks marked for deletion above. Only migrate the 13 actively used hooks.

#### 3.1 Aminal Hooks (`useAminals.ts`) - 3 hooks to migrate

**Breaking Change Handler:** Create trait array accessor utilities:
```typescript
// Trait indices enum for type safety
export enum TraitIndex {
  BACK = 0,
  ARM = 1,
  TAIL = 2,
  EARS = 3,
  BODY = 4,
  FACE = 5,
  MOUTH = 6,
  MISC = 7,
}

// Helper to get trait by type
export const getTrait = (aminal: Aminal, traitType: TraitIndex): bigint => {
  return aminal.traits[traitType];
};
```

**Hook Migrations:**

1. **`useAminals(userAddress, filter, sort)`** ✅
   - Use `usePonderQuery` with live updates
   - Move filtering/sorting to SQL WHERE/ORDER BY clauses where possible
   - Keep client-side transformers for complex filtering
   - Enable `live: true` for real-time updates

2. ~~**`useAminal(aminalId)`**~~ ❌ DELETE - UNUSED

3. **`useAminalForChat(contractAddress, userAddress)`** ✅
   - Optimized query with only chat-relevant fields
   - Include user relationship for love stats

4. **`useAminalByContractAddress(contractAddress, userAddress)`** ✅
   - Similar to useAminal but with user-specific data
   - Join with relationship table for user's love

#### 3.2 Auction Hooks (`useAuctions.ts`) - 4 hooks to migrate

1. **`useAuctions()`** ✅
   - List recent auctions with live updates
   - Order by creation time descending
   - Include aminal parents data

2. **`useAuction(auctionId)`** ✅
   - Single auction with full details
   - Include proposals, votes, and parent aminals
   - Enable live updates for active auctions

3. **`useAuctionProposeGenes(auctionId)`** ✅
   - Proposals for specific auction with vote counts
   - Include gene NFT data
   - Live updates for voting

4. ~~**`useProposeGenes()`**~~ ❌ DELETE - UNUSED

5. **`useAuctionVotes(auctionId)`** ✅
   - Vote records for auction
   - Join with voter and proposal data

#### 3.3 Gene Hooks (`useGenes.ts`) - 3 hooks to migrate

**Breaking Change:** Gene IDs are now hex strings, not BigInt token IDs

1. **`useGenes(filter, sort, category)`** ✅
   - List genes with live updates
   - Move sorting to SQL (e.g., ORDER BY totalEarnings DESC)
   - Filter by traitType for category
   - Client-side filter for "owned" (match ownerId)

2. **`useGene(id)`** ✅
   - Single gene by hex ID
   - Include owner, creator, proposals, payouts
   - Live updates for earnings

3. **`useGenesByIds(ids[])`** ✅
   - Batch fetch using WHERE id IN (...)
   - Used for Aminal trait display

#### 3.4 User Profile Hooks (`useUser.ts`) - 2 hooks to migrate

1. **`useUserProfile(address)`** ✅
   - Query user with all relations
   - Include: lovers, genesCreated, genesOwned, geneVotes
   - Efficient joins via Drizzle relations

2. **`useUserEarnings(address)`** ✅
   - User's genes with payout history
   - Aggregate totalEarnings from payouts

3. ~~**`useUserActivity(address)`**~~ ❌ DELETE - UNUSED

#### 3.5 Gene Proposals Hook (`useGeneProposals.ts`) - 1 hook to migrate

1. **`useGeneProposalsByAuctionId(auctionId)`** ✅
   - Proposals filtered by auction ID
   - Include gene NFT data and vote stats
   - Can be merged into `useAuctionProposeGenes` if functionality overlaps

**Note:** skills.ts hooks are completely unused and will be deleted without migration.

### Phase 4: Update Data Transformers

**4.1 Update Aminal Transformers**

`frontend/src/lib/dataTransformers.ts` (camelCase):
- Update to handle traits array instead of individual fields
- Create backward-compatible getters (e.g., `getBackId(aminal)` → `aminal.traits[0]`)
- Keep existing filter/sort logic but adapt to new schema

**4.2 Update Gene Transformers**

`frontend/src/lib/geneTransformers.ts` (camelCase):
- Update category filtering to use traitType integer
- Adapt to hex-based IDs

### Phase 5: Update Components

**5.1 Update Trait Access Patterns**

Search and replace across all components:
```typescript
// OLD
aminal.backId
aminal.armId
// ... etc

// NEW
aminal.traits[TraitIndex.BACK]
aminal.traits[TraitIndex.ARM]
// ... etc
```

**Files to Update:**
- `frontend/src/components/aminalCard.tsx` (rename to camelCase)
- `frontend/src/components/breedingModal.tsx` (rename to camelCase)
- `frontend/src/components/voteStats.tsx` (rename to camelCase)
- `frontend/pages/aminals/[id].tsx`
- Any component displaying traits

**Note:** All component files should be renamed to camelCase during this refactor for consistency.

**5.2 Update Type Imports**

Replace GraphQL types with Ponder schema types:
```typescript
// OLD
import { Aminal } from "../../.graphclient";

// NEW
import { aminal } from "../../../ponder/ponder.schema";
type Aminal = typeof aminal.$inferSelect;
```

**5.3 Update Hook Imports**

```typescript
// OLD
import { useAminals } from "@/resources/aminals";

// NEW (following camelCase conventions)
import { useAminals } from "@/hooks/useAminals";
// OR (using barrel export)
import { useAminals } from "@/hooks";
```

### Phase 6: Enable Live Queries

**6.1 Identify Real-Time Critical Queries**

Enable `live: true` for:
- ✅ Active auction details and voting
- ✅ Aminal stats (energy, love, balance)
- ✅ Skill usage events
- ✅ Gene auction proposals/votes
- ❌ Static lists (genes, all aminals) - use polling instead
- ❌ Historical data (user profile) - no live updates needed

**6.2 Configure Live Query Options**

```typescript
// Example: Live auction updates
const { data: auction } = usePonderQuery({
  queryFn: (db) =>
    db.select()
      .from(schema.geneAuction)
      .where(eq(schema.geneAuction.id, auctionId)),
  live: true, // Enable server-sent events
});
```

**6.3 Fallback Strategy**

For less critical data, use polling:
```typescript
const { data } = usePonderQuery({
  queryFn: (db) => /* query */,
  refetchInterval: 10000, // Poll every 10s instead of live
});
```

### Phase 7: Testing & Validation

**7.1 Test Each Page**

Checklist:
- [ ] Homepage (index.tsx) - Aminals grid, filtering, sorting
- [ ] Aminal detail (/aminals/[id]) - Stats, traits, actions
- [ ] Chat pages (/aminals/[id]/chat/*) - Real-time data
- [ ] Breeding index (/breeding) - Auction list
- [ ] Auction detail (/breeding/[auctionId]) - Voting, proposals
- [ ] Genes index (/genes) - Gene grid, filtering
- [ ] Gene detail (/genes/[id]) - Gene stats, aminals using it
- [ ] Profile (/profile/[address]) - User data, earnings
- [ ] Leaderboard (/leaderboard) - Sorted aminals

**7.2 Test Live Updates**

For pages with live queries:
1. Open page in browser
2. Perform on-chain action (feed, vote, etc.)
3. Verify UI updates without manual refresh

**7.3 Performance Testing**

- Monitor network requests (should see SSE connections for live queries)
- Verify query deduplication (TanStack Query caching)
- Check bundle size impact

### Phase 8: Cleanup

**8.1 Remove GraphQL Files**

Delete:
- `.graphclient/` directory
- `frontend/src/resources/` directory (after migration)
- `.graphclientrc.yml` config file
- GraphQL query files (*.graphql)

**8.2 Update Documentation**

Update:
- `frontend/CLAUDE.md` - Document new Ponder approach
- `frontend/README.md` - Update setup instructions

**8.3 Environment Variables**

Add to `.env.example` and deployment config:
```bash
NEXT_PUBLIC_PONDER_URL=http://localhost:42069/sql
```

## Migration Checklist

### Dependencies
- [ ] Install @ponder/react @ponder/client
- [ ] Remove @graphprotocol/client-cli graphql
- [ ] Update package.json scripts

### Infrastructure
- [ ] Create ponderClient.ts configuration (camelCase)
- [ ] Setup PonderProvider in _app.tsx
- [ ] Add NEXT_PUBLIC_PONDER_URL environment variable

### Hooks Migration (13 active hooks)
- [ ] Create hooks directory structure
- [ ] Migrate useAminals.ts (3 hooks - skip 1 unused)
- [ ] Migrate useAuctions.ts (4 hooks - skip 1 unused)
- [ ] Migrate useGenes.ts (3 hooks - all used)
- [ ] Migrate useUser.ts (2 hooks - skip 1 unused)
- [ ] Migrate useGeneProposals.ts (1 hook)
- [ ] Delete unused hooks: useAminal, useProposeGenes, useUserActivity, useSkills, useSkillUsage
- [ ] Create barrel exports in hooks/index.ts

### Data Transformers & File Renaming
- [ ] Rename data-transformers.ts → dataTransformers.ts
- [ ] Rename gene-transformers.ts → geneTransformers.ts
- [ ] Update dataTransformers.ts for traits array
- [ ] Update geneTransformers.ts for new schema
- [ ] Create trait utility helpers
- [ ] Rename query-client.ts → queryClient.ts
- [ ] Rename component files to camelCase (aminal-card.tsx → aminalCard.tsx, etc.)

### Component Updates
- [ ] Rename all component files to camelCase
- [ ] Update all import paths after renaming
- [ ] Update all trait access patterns (backId → traits[0])
- [ ] Update type imports from GraphQL to Ponder
- [ ] Update hook imports from resources to hooks
- [ ] Test all pages

### Live Queries
- [ ] Enable live updates for auctions
- [ ] Enable live updates for aminal stats
- [ ] Configure polling for static data

### Testing
- [ ] Test all pages for functionality
- [ ] Test live update behavior
- [ ] Performance testing

### Cleanup
- [ ] Delete .graphclient/ directory
- [ ] Delete resources/ directory
- [ ] Delete .graphclientrc.yml
- [ ] Update documentation

## Breaking Changes Summary

### Schema Changes

1. **Aminal Traits → Array**
   - Old: 8 separate fields (`backId`, `armId`, etc.)
   - New: Single `traits` array with 8 indices
   - Migration: Create enum and helper functions

2. **ID Format Changes**
   - Gene IDs: Now hex strings (contract + tokenId)
   - Auction IDs: Hex strings (composite key)
   - User IDs: Hex addresses

3. **Relationship Structure**
   - Lovers: Now separate `relationship` table
   - Join required for user-specific love data

4. **Event Tables**
   - Feed/skill events: Now separate immutable tables
   - Better for historical queries

### API Changes

1. **Import Paths**
   ```typescript
   // Old
   import { useAminals } from "@/resources/aminals";
   import { Aminal } from "../../.graphclient";

   // New
   import { useAminals } from "@/hooks";
   import { aminal } from "../../../ponder/ponder.schema";
   type Aminal = typeof aminal.$inferSelect;
   ```

2. **Query Syntax**
   ```typescript
   // Old
   const { data } = useAminals(address, filter, sort);

   // New (same API, different implementation)
   const { data } = useAminals(address, filter, sort);
   ```

3. **Trait Access**
   ```typescript
   // Old
   const backGene = aminal.backId;

   // New
   import { TraitIndex } from "@/hooks";
   const backGene = aminal.traits[TraitIndex.BACK];
   ```

## Benefits of Migration

### Performance Improvements
- **Live Updates**: Real-time data via server-sent events
- **Efficient Queries**: SQL-based filtering/sorting on server
- **Reduced Bundle Size**: No GraphQL codegen bloat
- **Better Caching**: TanStack Query integration

### Developer Experience
- **Type Safety**: Zero-codegen type inference from Ponder schema
- **Simpler Queries**: SQL syntax vs GraphQL
- **Better Debugging**: Direct SQL queries, easier to optimize
- **Flexible Relations**: Drizzle ORM for complex joins

### User Experience
- **Real-Time Updates**: See changes without refreshing
- **Faster Load Times**: Optimized SQL queries
- **Smoother Interactions**: Live auction voting, stat updates

## Risks & Mitigation

### Risk 1: Ponder Server Availability
- **Mitigation**: Implement error boundaries, fallback loading states
- **Mitigation**: Configure retry logic in TanStack Query

### Risk 2: Live Query Connection Issues
- **Mitigation**: Graceful degradation to polling
- **Mitigation**: Show connection status indicator

### Risk 3: Breaking Changes in Trait Access
- **Mitigation**: Create compatibility layer with getters
- **Mitigation**: Comprehensive testing of all components

### Risk 4: Migration Complexity
- **Mitigation**: Migrate one hook file at a time
- **Mitigation**: Keep old code until new code is tested
- **Mitigation**: Use feature flags if needed

## Timeline Estimate

- **Phase 1 (Setup)**: 1 hour
- **Phase 2 (Hook Structure)**: 30 minutes
- **Phase 3 (Hook Migration)**: 3-5 hours (13 hooks instead of 18)
- **Phase 4 (Transformers)**: 1-2 hours
- **Phase 5 (Components)**: 3-4 hours
- **Phase 6 (Live Queries)**: 1-2 hours
- **Phase 7 (Testing)**: 2-3 hours
- **Phase 8 (Cleanup)**: 1 hour

**Total Estimated Time**: 12-18 hours (reduced by ~2 hours due to 5 fewer hooks)

## Success Criteria

✅ All pages render correctly with Ponder data
✅ Filtering and sorting work as before
✅ Live updates function on auction and aminal pages
✅ No performance regression (ideally improvement)
✅ Type safety maintained or improved
✅ All GraphQL dependencies removed
✅ Documentation updated

## Next Steps

1. Review this plan with team
2. Set up Ponder server URL (environment variable)
3. Begin Phase 1: Setup & Dependencies
4. Migrate hooks incrementally, testing each
5. Update components systematically
6. Enable live queries for critical features
7. Test thoroughly before cleanup
8. Deploy and monitor

---

**Document Version**: 1.0
**Created**: 2025-10-04
**Status**: Ready for Review
