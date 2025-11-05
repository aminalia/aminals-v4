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

## Indexer Changes Complete ✅

Most indexer changes in `src/index.ts` have been completed:

### ✅ Completed Changes:

1. **Import Statements** - Removed `geneProposal`, `geneVote` imports
2. **AminalSpawned Handler** - Updated to use 10-gene arrays with `slotIndex`
3. **GeneCreated Handler** - Removed category and placement metadata
4. **VotingCreated Handler** - Updated to cache 20 parent genes (10 per parent)
5. **Utility Functions** - Updated `normalizeGeneArray()`, `makeDesignId()`, `makeAminalGeneId()`
6. **Validation Functions** - Updated for 10-gene system with proper validation
7. **Constants** - Removed trait categories, added slot index constants
8. **Config** - Updated `ponder.config.ts` to use `uint256[10]` in AminalSpawned event
9. **Removed Old Handlers** - Deleted all per-gene voting handlers (GeneProposed, GeneVoteCast, GeneRemovalVote, GeneRemoved, BulkVoteCast)

### ⚠️ Not Yet Implemented:

New design-based voting handlers need to be implemented once the contracts emit these events:

### DesignProposed Event Handler (NEW - replaces GeneProposed)
**Status**: Contract needs to emit this event first
**Implementation**:
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

### DesignVoted Event Handler (NEW - replaces GeneVoted)
**Status**: Contract needs to emit this event first
**Implementation**:
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

## Contract Updates Still Needed

The smart contracts need to be updated to emit the new design-based voting events:
- `DesignProposed(uint256 auctionId, uint256 designIndex, uint256[10] geneIds, GeneMetadata[10] placements, address proposer)`
- `DesignVoted(uint256 auctionId, uint256 designIndex, address voter, uint256 votingPower)`
- `DesignRemovalVoted(uint256 auctionId, uint256 designIndex, address voter, uint256 votingPower)` (if applicable)

Once these events are emitted by the contracts, the handlers can be implemented following the examples in this document.

## Testing Checklist

Completed:
- [x] Aminal spawning creates correct `genes` array (1-10 elements)
- [x] Gene creation doesn't store placement/category
- [x] Auction creation caches up to 20 parent genes
- [x] AminalGene join table uses slotIndex correctly
- [x] Type checking passes
- [x] Codegen succeeds

Pending (waiting for contract updates):
- [ ] Design proposals store geneIds and placements correctly
- [ ] Design voting updates vote counts
- [ ] Settlement creates child with winning design

## Migration Path

1. ✅ Update schema
2. ✅ Update utility functions in `src/utils/`
3. ✅ Update event handlers in `src/index.ts` (except design voting)
4. ⚠️ Update contracts to emit design-based voting events
5. ⚠️ Implement design voting handlers
6. ⚠️ Test with local deployment
7. ⚠️ Re-index from scratch (schema changes are breaking)

## Notes

- This is a **breaking change** - requires full re-index
- Old data is incompatible with new schema
- Frontend will need simultaneous updates to query new schema
