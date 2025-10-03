# Frontend Query Verification Report

## Summary

All 6 critical frontend pages analyzed. **Verified safe to proceed with schema optimizations** with the critical exception that `GeneNFT.proposalsUsingGene` must be preserved (though can be optimized).

---

## Page-by-Page Analysis

### ✅ `/breeding/index.tsx`
**Queries Used**: `GeneAuctionsList`

**Fields Used**:
- `auction.aminalOne/Two` (for display)
- `auction.childAminal` (for completed auctions)
- `auction.finished`, `auction.totalLove`, `auction.blockTimestamp`

**Proposed Changes Impact**: ✅ No breaking changes
- Removing `winningGeneIds` is safe (not used)
- All other fields are used

---

### ✅ `/breeding/[auctionId].tsx`
**Queries Used**: `GeneAuction`, `GeneProposalsList`

**Fields Used**:
- Parent Aminal trait IDs (backId, armId, etc.) - Lines 62-78
- Proposals with gene SVG for preview - Lines 209-220
- Votes for statistics

**Proposed Changes Impact**: ✅ No breaking changes
- All auction data is actively used for building trait selector
- Proposals are used for displaying community genes

---

### ✅ `/aminals/[id].tsx`
**Queries Used**: `AminalByContractAddress`

**Fields Used**:
- `aminal.parentOne/parentTwo` - Lines 299-325 (lineage display)
- Energy, love, ethBalance - Lines 213-231
- Gene IDs for traits - Lines 374-460
- Feeds and skillUsed events

**Proposed Changes Impact**: ✅ No breaking changes
- Does NOT use `breedingEventsAsParent*` (safe to remove)
- Does NOT use `auctions` derived field (safe to remove)

---

### 🔴 `/genes/index.tsx` - **CRITICAL DEPENDENCY**
**Queries Used**: `GeneNftsList`

**Fields Used**:
- `proposalsUsingGene` - **Lines 189-198** for "Most Used" sorting
  ```tsx
  aminalCount={
    gene.proposalsUsingGene
      ? new Set([
          ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalOne.id),
          ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalTwo.id),
        ]).size
      : 0
  }
  ```

**Proposed Changes Impact**: 🔴 **BREAKING if removed**
- `proposalsUsingGene` is **ESSENTIAL** for sorting genes by usage
- Can be optimized (fetch only IDs) but CANNOT be removed
- Frontend refactor required if query is changed

---

### 🔴 `/genes/[id].tsx` - **CRITICAL DEPENDENCY**
**Queries Used**: `GeneNftById`

**Fields Used**:
- `proposalsUsingGene` - **Lines 76-91** for displaying Aminals with this gene
  ```tsx
  const uniqueAminals = gene.proposalsUsingGene
    ? Array.from(
        new Set([
          ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalOne),
          ...gene.proposalsUsingGene.map((p: any) => p.auction.aminalTwo),
        ].map((a) => a.id))
      )
    : [];
  ```
- Full Aminal data needed for `AminalCard` display - Lines 228-260

**Proposed Changes Impact**: 🔴 **BREAKING if removed**
- `proposalsUsingGene` is **ESSENTIAL** for showing which Aminals use this gene
- Full Aminal data (tokenURI, energy, love) required for card display
- **Must keep full data for detail page queries**

---

### ✅ `/profile/[address].tsx`
**Queries Used**: `UserProfile`, `UserEarnings`

**Fields Used**:
- `user.lovers` (Aminals loved)
- `user.genesCreated` (with payouts)
- `user.geneVotes` (voting activity)
- `user.genesOwned`

**Proposed Changes Impact**: ✅ No breaking changes
- Does NOT use `user.geneProposals` (safe to remove)
- All other user fields are actively used

---

## Critical Library Dependencies

### `/lib/gene-transformers.ts`
**Lines 50-88**: Core gene sorting logic

**Depends on**: `proposalsUsingGene` with nested auction + Aminal data

**Current implementation**:
```typescript
const aCount = a.proposalsUsingGene
  ? new Set([
      ...a.proposalsUsingGene.map((p: any) => p.auction.aminalOne.id),
      ...a.proposalsUsingGene.map((p: any) => p.auction.aminalTwo.id),
    ]).size
  : 0;
```

**Optimization opportunity**: Could work with ID-only data
```typescript
// Would work with: proposalsUsingGene { auction { aminalOne { id }, aminalTwo { id } } }
const aCount = a.proposalsUsingGene
  ? new Set([
      ...a.proposalsUsingGene.map((p: any) => p.auction.aminalOne.id),
      ...a.proposalsUsingGene.map((p: any) => p.auction.aminalTwo.id),
    ]).size
  : 0;
```

**Frontend refactor**: Minor - just counting IDs, doesn't need full objects

---

## Optimization Recommendations with Frontend Impact

### ✅ Safe to Remove (Zero Frontend Impact)

| Item | Frontend Usage |
|------|----------------|
| `BreedAminalEvent` | ❌ Never imported or queried |
| `Aminal.breedingEventsAsParent*` | ❌ Not in any GraphQL queries |
| `Aminal.auctions` | ❌ Not in any GraphQL queries |
| `User.geneProposals` | ❌ Not in any GraphQL queries |
| `GeneAuction.winningGeneIds` | ⚠️ In contract types but never queried |
| Transaction hashes (on events) | ❌ Never displayed in UI |

---

### ⚠️ Can Optimize (Requires Frontend Changes)

#### 1. `GeneNFT.proposalsUsingGene` - Reduce nested data for list queries

**Current query** (genes.graphql:1-53):
```graphql
proposalsUsingGene {
  auction {
    aminalOne { id, contractAddress, aminalIndex, tokenURI, energy, totalLove }
    aminalTwo { id, contractAddress, aminalIndex, tokenURI, energy, totalLove }
  }
}
```

**Optimized for GeneNftsList**:
```graphql
proposalsUsingGene {
  auction {
    aminalOne { id }
    aminalTwo { id }
  }
}
```

**Frontend changes**:
- ✅ `/lib/gene-transformers.ts` - Already only uses IDs for counting
- ✅ `/genes/index.tsx` - Already only needs IDs for counting
- ❌ `/genes/[id].tsx` - Needs FULL Aminal data for cards

**Solution**: Split into two queries:
- `GeneNftsList` - ID-only (for gallery/sorting)
- `GeneNftById` - Full data (for detail page)

---

#### 2. Add limits to unbounded relationships

**Changes needed**:

**user-profile.graphql:48**:
```graphql
# BEFORE
geneVotes { ... }

# AFTER
geneVotes(first: 50, orderBy: blockTimestamp, orderDirection: desc) { ... }
```

**Frontend impact**: ✅ Already handles partial data, just shows "Recent Votes"

---

## Implementation Checklist

### Phase 1: Safe Removals (No Frontend Changes)
- [ ] Remove `BreedAminalEvent` entity
  - [ ] Remove from schema.graphql (lines 85-94)
  - [ ] Remove handler from factory.ts (lines 168-205)
  - [ ] Remove event from subgraph.yaml (lines 58-59)
- [ ] Remove unused derived fields:
  - [ ] `Aminal.breedingEventsAsParentOne`
  - [ ] `Aminal.breedingEventsAsParentTwo`
  - [ ] `Aminal.auctions`
  - [ ] `User.geneProposals`
- [ ] Remove unused metadata:
  - [ ] `AminalFactory.geneAuction`, `genes`, `loveVRGDA`
  - [ ] `GeneAuction.winningGeneIds`, `endBlockNumber`, `endTransactionHash`

### Phase 2: Frontend-Coordinated Optimizations
- [ ] Split `GeneNftsList` query to use ID-only proposalsUsingGene
- [ ] Keep `GeneNftById` with full nested data
- [ ] Test gene gallery sorting still works
- [ ] Test gene detail pages display Aminals correctly
- [ ] Add `first` limits to unbounded relationships

---

## Testing Requirements

Before deploying schema changes:

1. **Gene Gallery** (`/genes`):
   - [ ] "Most Used" sorting works
   - [ ] Gene cards display correctly
   - [ ] "Your Genes" filter works

2. **Gene Detail** (`/genes/[id]`):
   - [ ] Shows all Aminals using this gene
   - [ ] Aminal cards render with images
   - [ ] Stats display correctly

3. **Breeding Auctions** (`/breeding`, `/breeding/[id]`):
   - [ ] Auction list loads
   - [ ] Trait selector shows parent and community genes
   - [ ] Voting works

4. **User Profile** (`/profile/[address]`):
   - [ ] Loved Aminals display
   - [ ] Created genes display
   - [ ] Recent votes display

5. **Aminal Detail** (`/aminals/[id]`):
   - [ ] Parent lineage displays
   - [ ] Traits display
   - [ ] No errors related to removed fields

---

## Conclusion

✅ **Schema optimizations are safe to implement** with the following critical requirements:

1. **KEEP** `GeneNFT.proposalsUsingGene` - Essential for core functionality
2. **OPTIMIZE** by splitting queries (ID-only for lists, full data for details)
3. **TEST** gene gallery and detail pages after any `proposalsUsingGene` changes
4. All other proposed removals have **zero frontend impact**

The bulk vote optimization (caching parent traits) has **zero frontend impact** and is safe to implement immediately.
