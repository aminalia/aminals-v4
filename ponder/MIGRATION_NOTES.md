# Ponder Indexer Migration Guide

## Overview

The indexer needs to be updated to reflect the change from **8-category fixed gene system** to **1-10 flexible gene system** with per-Aminal placement metadata.

## Schema Changes Complete ✅

The `ponder.schema.ts` has been updated with:
- `aminal.genes` (flexible 1-10 array) replacing `aminal.traits` (fixed 8 array)
- `geneNFT` table no longer has `traitType`, `offsetX`, `offsetY`, `scale`, `rotation`
- `aminalGene.slotIndex` (0-9) replacing `traitType` (0-7)
- `designProposal` table replacing `geneProposal` table
- `designVote` table replacing `geneVote` table
- Auction voting now for complete designs instead of per-trait genes

## Indexer Changes Needed (`src/index.ts`)

### 1. Import Statements
**Line 18**: Change `geneProposal` to `designProposal`
**Line 19**: Change `geneVote` to `designVote`

### 2. AminalSpawned Handler (Lines ~100-145)
**Current**: Creates Aminal with 8-element `traits` array
**Needed**:
- Change `traits` to `genes`
- Support 1-10 genes (not fixed 8)
- Update `normalizeTraitArray()` to `normalizeGeneArray()` and handle 10-element arrays
- Update `aminalGene` insertions:
  - Remove `traitType` parameter
  - Add `slotIndex` (0-9) instead
  - Update `makeAminalGeneId()` function signature

### 3. GeneCreated Handler (Lines ~300-310)
**Current**: Stores `traitType` (category) and placement metadata
**Needed**:
- **Remove** `traitType: Number(category)` - genes no longer have categories
- **Remove** `offsetX`, `offsetY`, `scale`, `rotation` fields
- These are now stored per-Aminal in design proposals, not globally per-gene

### 4. VotingCreated Handler (Lines ~370-450)
**Current**: Caches parent traits as 16-element array (8 per parent)
**Needed**:
- Update comment from "8 traits" to "up to 10 genes"
- Change `parentGeneIds` to support up to 20 elements (10 per parent)
- Handle variable-length gene arrays (parents may have different gene counts)

### 5. DesignProposed Event (NEW - replaces GeneProposed)
**Current**: `GeneProposed` event creates single gene proposal per trait slot
**Needed**: Complete rewrite for `DesignProposed` event
```typescript
ponder.on("GeneAuction:DesignProposed", async ({ event, context }) => {
  const { auctionId, designIndex, geneIds, placements, proposer } = event.args;

  // Create design proposal
  await db.insert(designProposal).values({
    id: makeDesignId(auctionId, designIndex),
    auctionId: makeAuctionId(auctionId),
    designIndex: Number(designIndex),
    proposerId: normalizeAddress(proposer),
    geneIds: normalizeGeneArray(geneIds), // 1-10 genes
    placements: JSON.stringify(placements), // Serialize placement metadata
    votes: 0n,
    removeVotes: 0n,
    removed: false,
    blockNumber,
    blockTimestamp,
    transactionHash,
  });
});
```

### 6. DesignVoted Event (NEW - replaces GeneVoted)
**Current**: `GeneVoted` updates individual gene proposal votes
**Needed**: Rewrite for complete design voting
```typescript
ponder.on("GeneAuction:DesignVoted", async ({ event, context }) => {
  const { auctionId, designIndex, voter, votingPower } = event.args;

  const proposalId = makeDesignId(auctionId, designIndex);

  // Create vote record
  await db.insert(designVote).values({
    id: makeVoteId(transactionHash, logIndex),
    auctionId: makeAuctionId(auctionId),
    proposalId,
    voterId: normalizeAddress(voter),
    isRemoveVote: false,
    votingPower,
    ...timestamps
  });

  // Update design vote count
  await db.update(designProposal, { id: proposalId })
    .set((row) => ({ votes: row.votes + votingPower }));
});
```

### 7. Remove Old Event Handlers
**Delete**:
- `GeneProposed` handler
- `GeneVoted` handler
- `RemoveVotecast` handler (if separate from design voting)
- `GeneRemoved` handler
- `BulkVoteCast` handler (most complex - voting is now per-design, not per-trait)

### 8. Utility Functions to Update

**`normalizeTraitArray()`** → **`normalizeGeneArray()`**
- Change from 8-element to 10-element array support
- Handle variable-length arrays (1-10 genes)

**`makeProposalId()`** → **`makeDesignId()`**
- Old: `${auctionId}-${traitType}-${geneId}`
- New: `${auctionId}-${designIndex}`

**`makeAminalGeneId()`**
- Old: `${aminalAddress}-${geneId}-${traitType}`
- New: `${aminalAddress}-${geneId}-${slotIndex}`

**`assertValidParentGeneIds()`**
- Update to expect up to 20 genes instead of 16

## Event ABI Changes Needed

Update `ponder.config.ts` or ABI files to reflect new events:
- Add `DesignProposed` event
- Add `DesignVoted` event
- Add `DesignRemovalVoted` event (if applicable)
- Remove old gene-specific voting events

## Testing Checklist

After implementing changes:
- [ ] Aminal spawning creates correct `genes` array (1-10 elements)
- [ ] Gene creation doesn't store placement/category
- [ ] Auction creation caches up to 20 parent genes
- [ ] Design proposals store geneIds and placements correctly
- [ ] Design voting updates vote counts
- [ ] Settlement creates child with winning design
- [ ] AminalGene join table uses slotIndex correctly

## Migration Path

1. Update schema (✅ DONE)
2. Update utility functions in `src/utils/`
3. Update event handlers in `src/index.ts`
4. Test with local deployment
5. Re-index from scratch (schema changes are breaking)

## Notes

- This is a **breaking change** - requires full re-index
- Old data is incompatible with new schema
- Frontend will need simultaneous updates to query new schema
