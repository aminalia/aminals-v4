# Graph Indexing Optimization - Quick Reference

## 🎯 Main Bottleneck: Bulk Vote Handler (30-40% improvement potential)

**File**: `graph/src/gene-auction.ts:483-652`

**Problem**: Loads 2 parent Aminals on every bulk vote to check parent traits (8 trait categories × complex conditionals)

**Solution**: Cache parent trait IDs in GeneAuction entity during auction creation

```typescript
// Add to schema.graphql
type GeneAuction @entity {
  # ... existing fields
  parentGeneIds: [BigInt!]! # [16 total: 8 from each parent]
}
```

---

## ✅ Safe to Remove (Won't Break Frontend)

| Entity/Field | Location | Reason |
|--------------|----------|--------|
| `BreedAminalEvent` (entire entity) | schema.graphql:85-94 | Never queried by frontend |
| `Aminal.breedingEventsAsParentOne` | schema.graphql:56-57 | Not used |
| `Aminal.breedingEventsAsParentTwo` | schema.graphql:58-59 | Not used |
| `Aminal.auctions` (derived) | schema.graphql:60 | Not used |
| `AminalFactory.geneAuction` | schema.graphql:4 | Hardcoded constant |
| `AminalFactory.genes` | schema.graphql:5 | Hardcoded constant |
| `AminalFactory.loveVRGDA` | schema.graphql:6 | Hardcoded constant |
| `GeneAuction.winningGeneIds` | schema.graphql:131 | Stored on child Aminal |
| `GeneAuction.endBlockNumber` | schema.graphql:143 | Unused metadata |
| `GeneAuction.endTransactionHash` | schema.graphql:145 | Unused metadata |
| `User.geneProposals` | schema.graphql:72 | Never queried |

**Estimated Impact**: 5-10% reduction in write operations

---

## 🔴 MUST NOT Remove

| Entity/Field | Reason |
|--------------|--------|
| `GeneNFT.proposalsUsingGene` | **CRITICAL**: Used for gene sorting ("Most Used") and displaying Aminals on gene detail pages |
| `Aminal.tokenURI` | **ESSENTIAL**: Required for displaying Aminals in UI |

---

## ⚠️ Frontend Query Optimizations (Requires Refactoring)

### 1. Optimize `proposalsUsingGene` queries

**Current** (genes.graphql:19-40):
```graphql
proposalsUsingGene {
  auction {
    aminalOne { id, contractAddress, aminalIndex, tokenURI, energy, totalLove }
    aminalTwo { id, contractAddress, aminalIndex, tokenURI, energy, totalLove }
  }
}
```

**Optimized for list queries**:
```graphql
proposalsUsingGene {
  auction {
    aminalOne { id }  # Only ID for counting
    aminalTwo { id }
  }
}
```

**Keep full data for detail query** (GeneNftById)

**Frontend changes required**: Update `/lib/gene-transformers.ts` lines 50-88 to count IDs only

---

### 2. Add limits to unbounded relationships

**user-profile.graphql**:
```graphql
# BEFORE
geneVotes { ... }

# AFTER
geneVotes(first: 50, orderBy: blockTimestamp, orderDirection: desc) { ... }
```

---

## 📊 Performance Estimates

| Optimization | Impact | Risk |
|--------------|--------|------|
| Cache parent traits in bulk votes | **30-40%** faster bulk votes | Low - just add field |
| Remove unused entities/fields | **5-10%** less writes | Low - not queried |
| Optimize proposalsUsingGene queries | **15-25%** faster queries | Medium - needs frontend refactor |
| Add query limits | **10-15%** faster queries | Low - prevents unbounded fetches |

**Total Estimated Improvement**: 30-40% on bulk votes (main bottleneck), 10-20% overall

---

## 🚀 Implementation Priority

### Phase 1: High Impact, Low Risk
1. ✅ Add `parentGeneIds` cache to GeneAuction entity
2. ✅ Update `handleVotingCreated` to store parent trait IDs
3. ✅ Update `handleBulkVoteCast` to use cached data instead of loading parents

### Phase 2: Easy Wins
4. ✅ Remove `BreedAminalEvent` entity (schema + handler + subgraph.yaml)
5. ✅ Remove unused AminalFactory fields
6. ✅ Remove unused derived relationships from Aminal/User

### Phase 3: Query Optimizations (Requires Testing)
7. ⚠️ Add `first` limits to unbounded relationships
8. ⚠️ Optimize `proposalsUsingGene` query (only IDs for list view)
9. ⚠️ Update frontend to handle optimized queries

---

## ⚠️ Critical Warnings

1. **DO NOT remove `proposalsUsingGene`** - Breaks gene sorting and detail pages
2. **DO NOT remove `tokenURI`** - Essential for displaying Aminals
3. **TEST before deploying** - Schema changes require full reindex
4. **Frontend coordination** - Query optimizations need frontend updates

---

## 📝 Verification Checklist

Before deploying schema changes:

- [ ] Test on development subgraph
- [ ] Verify gene gallery still sorts by "Most Used"
- [ ] Verify gene detail pages show Aminals
- [ ] Verify breeding auctions display correctly
- [ ] Verify user profiles load
- [ ] Benchmark indexing speed improvements

---

## 🔗 Full Report

See `GRAPH_INDEXING_REPORT.md` for:
- Detailed handler analysis
- Complete unused field list
- Query optimization examples
- Architecture recommendations
- Long-term scalability considerations
