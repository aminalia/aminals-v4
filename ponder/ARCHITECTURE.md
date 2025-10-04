# Ponder Architecture & Implementation Plan

## Executive Summary

This document outlines the architecture for migrating the Aminals indexer from The Graph Protocol to Ponder.sh. Ponder offers several advantages including TypeScript-native development, automatic GraphQL API generation, built-in Postgres support, and better local development experience.

## Why Ponder?

### Key Advantages Over The Graph

1. **TypeScript Native**: No AssemblyScript limitations, full Node.js ecosystem access
2. **Better DX**: Hot reloading, better error messages, easier debugging
3. **Postgres Backend**: Direct SQL access, better query performance, familiar database
4. **Auto-generated GraphQL**: No need to manually define queries, automatic filtering/pagination
5. **Simpler Deployment**: Self-hosted with standard Node.js tooling
6. **Better Relationships**: More intuitive one-to-many and many-to-many patterns

### Trade-offs

1. **Self-hosted**: No decentralized network (but we likely want this anyway)
2. **Less mature**: Smaller ecosystem than The Graph
3. **Migration cost**: Need to rewrite indexing logic and update frontend queries

## Current Graph Implementation Analysis

### Contracts Being Indexed

1. **AminalFactory** (`0xfd69b3285974f11ac0e8490d86a2dc4ee7d2ce9c`)
   - Events: `AminalSpawned`
   - Purpose: Track creation of new Aminal contracts

2. **Aminal** (Dynamic templates for each spawned Aminal)
   - Events: `FeedAminal`, `SkillUsed`, `EnergyLost`
   - Purpose: Track interactions with individual Aminals

3. **GeneAuction** (`0x96bd719eb8d32a1210e4e2eb77b5ce6ff157325d`)
   - Events: `VotingCreated`, `VotingSettled`, `GeneProposed`, `GeneVoteCast`, `GeneRemovalVote`, `GeneRemoved`, `BulkVoteCast`, `GeneCreatorPayout`
   - Purpose: Track breeding auctions and gene voting

4. **Genes** (NFT contract - `0xb70c1d4ab9e90eb73b7f8972bd3eeb139201cd43`)
   - Events: `Transfer`
   - Purpose: Track Gene NFT ownership

5. **GeneRegistry** (`0x2706cf8e08f6cbfd8a0fc32637d0289ab6ed2ca4`)
   - Events: `GeneCreated`
   - Purpose: Track creation of new gene traits

### Current Entity Model

```
AminalFactory
├── totalAminals: BigInt
└── aminals: [Aminal]

Aminal
├── contractAddress: Bytes (unique per Aminal)
├── aminalIndex: BigInt
├── parentOne/Two: Aminal (relationships)
├── auctionId: BigInt
├── traits: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId (8 trait slots)
├── energy, totalLove, ethBalance: BigInt
├── lovers: [Relationship]
├── skillUsed: [SkillUsed]
├── feeds: [FeedAminalEvent]
└── metadata

User
├── address: Bytes
├── lovers: [Relationship]
├── genesCreated/Owned: [GeneNFT]
└── geneVotes: [GeneVote]

GeneAuction
├── auctionId: BigInt
├── aminalOne/Two: Aminal (parents)
├── totalLove: BigInt (voting power)
├── parentGeneIds: [BigInt] (cached for performance)
├── finished: Boolean
├── childAminal: Aminal (result)
├── proposals: [GeneProposal]
├── votes: [GeneVote]
└── payouts: [GeneCreatorPayout]

GeneNFT
├── tokenId: BigInt
├── traitType: Int (0-7 categories)
├── owner/creator: User
├── svg, name, description: String
├── totalEarnings: BigInt
├── proposalsUsingGene: [GeneProposal]
└── payouts: [GeneCreatorPayout]

GeneProposal
├── auction: GeneAuction
├── geneNFT: GeneNFT
├── traitType: Int
├── proposer: User
├── loveVotes, removeVotes: BigInt
├── removed: Boolean
└── votes: [GeneVote]

GeneVote
├── auction: GeneAuction
├── proposal: GeneProposal
├── voter: User
├── isRemoveVote: Boolean
└── loveAmount: BigInt

Relationship
├── user: User
├── aminal: Aminal
└── love: BigInt

FeedAminalEvent
├── aminal: Aminal
├── sender: User
├── amount, love, totalLove, energy: BigInt
└── timestamp data

SkillUsed
├── aminal: Aminal
├── caller: User
├── skillAddress, selector: Bytes
├── newEnergy: BigInt
└── timestamp data

GeneCreatorPayout
├── auction: GeneAuction
├── geneNFT: GeneNFT
├── creator: User
├── amount: BigInt
└── timestamp data
```

## Proposed Ponder Architecture

### Schema Design Improvements

Based on Ponder's capabilities and our current schema analysis, here are proposed improvements:

#### 1. **Normalized Primary Keys**
- Use natural IDs where possible (addresses, tokenIds)
- Composite keys for many-to-many relationships
- Better indexing for common query patterns

#### 2. **Optimized Relationships**
- Use Ponder's `one()` and `many()` for cleaner relationships
- Denormalize frequently accessed data (already doing this with `parentGeneIds`)
- Add indexes for common filter/sort patterns

#### 3. **Query Optimization**
- Split immutable events from mutable state
- Add computed fields for common aggregations
- Consider materialized views for complex queries

#### 4. **Breaking Changes from Current Schema**

To improve efficiency, we should consider:

1. **Flatten trait storage**: Instead of 8 separate `backId`, `armId`, etc. fields, use a `traits` array field
2. **Separate event tables**: Keep immutable events separate from mutable state (already mostly done)
3. **Indexed fields**: Add explicit indexes for common queries (aminal by index, genes by traitType, etc.)
4. **Timestamp handling**: Use Ponder's native `timestamp` type instead of BigInt
5. **JSON fields**: Use JSON type for complex nested data if needed

### Project Structure

```
ponder/
├── ponder.config.ts          # Contract configurations, networks, ABIs
├── ponder.schema.ts           # Database schema definitions
├── src/
│   ├── index.ts              # Main indexing functions (event handlers)
│   ├── AminalFactory.ts      # Factory event handlers
│   ├── Aminal.ts             # Aminal event handlers
│   ├── GeneAuction.ts        # Auction event handlers
│   ├── Genes.ts              # Gene NFT event handlers
│   ├── GeneRegistry.ts       # Gene creation handlers
│   └── utils/
│       ├── helpers.ts        # Shared utility functions
│       └── constants.ts      # Contract addresses, etc.
├── abis/                     # Contract ABIs (copy from ../out/)
│   ├── AminalFactory.json
│   ├── Aminal.json
│   ├── GeneAuction.json
│   ├── Genes.json
│   └── GeneRegistry.json
├── package.json
├── tsconfig.json
└── .env.local                # Local development config
```

## Implementation Phases

### Phase 0: Setup & Scaffolding
- [ ] Initialize Ponder project
- [ ] Copy ABIs from contract build output
- [ ] Set up ponder.config.ts with contract addresses
- [ ] Configure development database (PGlite for local, Postgres for production)

### Phase 1: Core Entities (Factory & Aminal)
- [ ] Define base schema (AminalFactory, Aminal, User)
- [ ] Implement AminalFactory event handlers
- [ ] Implement Aminal event handlers (Feed, Skill, Energy)
- [ ] Test core functionality locally

### Phase 2: Gene System (NFTs & Registry)
- [ ] Add Gene NFT schema
- [ ] Implement Gene creation and transfer handlers
- [ ] Add User-Gene relationships
- [ ] Test gene tracking

### Phase 3: Auction System
- [ ] Add GeneAuction schema with all relationships
- [ ] Implement auction lifecycle handlers (Create, Settle)
- [ ] Implement voting handlers (Propose, Vote, Remove, BulkVote)
- [ ] Implement payout tracking
- [ ] Add parentGeneIds caching optimization
- [ ] Test auction flows

### Phase 4: Testing & Optimization
- [ ] Test all queries against local database
- [ ] Add database indexes for common queries
- [ ] Performance testing with bulk operations
- [ ] Compare query patterns with current Graph implementation

### Phase 5: Frontend Migration
- [ ] Document GraphQL API changes
- [ ] Update frontend GraphQL queries
- [ ] Update GraphQL code generation
- [ ] Test frontend integration
- [ ] Update environment variables

### Phase 6: Deployment
- [ ] Set up production Postgres database
- [ ] Configure deployment environment
- [ ] Deploy indexer
- [ ] Monitor sync progress
- [ ] Switch frontend to Ponder endpoint

## Key Considerations

### Dynamic Contract Templates

**Challenge**: The Graph uses dynamic templates to index individual Aminal contracts as they're spawned. Ponder's approach to this may differ.

**Solution**: Ponder supports dynamic contract tracking. We'll need to:
1. Register the Aminal contract in config with `factory` option
2. Track factory events to discover new Aminal addresses
3. Index events from all dynamically created Aminals

### Event Handler Patterns

The Graph uses global functions per event. Ponder uses a registry pattern:

```typescript
// Graph (AssemblyScript)
export function handleAminalSpawned(event: AminalSpawnedEvent): void { ... }

// Ponder (TypeScript)
ponder.on("AminalFactory:AminalSpawned", async ({ event, context }) => { ... });
```

### Database Queries

The Graph loads entities synchronously. Ponder uses async/await:

```typescript
// Graph
let aminal = Aminal.load(address);

// Ponder
const aminal = await context.db.Aminal.findUnique({ id: address });
```

### Relationships

The Graph uses derived relationships via @derivedFrom. Ponder uses explicit relations:

```typescript
// ponder.schema.ts
export const aminals = onchainTable("aminals", (t) => ({
  id: t.hex().primaryKey(),
  factoryId: t.hex().references("factories.id"),
  // ... other fields
}));

export const factories = onchainTable("factories", (t) => ({
  id: t.hex().primaryKey(),
  totalAminals: t.bigint().notNull(),
}));

export const aminalRelations = relations(aminals, ({ one, many }) => ({
  factory: one(factories, {
    fields: [aminals.factoryId],
    references: [factories.id],
  }),
  feeds: many(feedEvents),
}));
```

## Migration Strategy for Frontend

### Query Changes

Current frontend uses `@graphprotocol/client-cli` to generate typed queries. With Ponder, we'll:

1. **Keep GraphQL**: Ponder auto-generates a GraphQL API
2. **Update endpoint**: Change from Graph hosted service to self-hosted Ponder
3. **Update queries**: Some query syntax may need adjustment for Ponder's filtering
4. **Regenerate types**: Use GraphQL codegen against new Ponder endpoint

### Key Query Patterns to Preserve

From frontend analysis, ensure these queries work:

1. **Aminal by address**: `aminal(id: "0x...")`
2. **Aminals by index**: `aminals(orderBy: aminalIndex, orderDirection: asc)`
3. **User relationships**: `user(id: "0x...") { lovers { aminal { ... } } }`
4. **Gene auctions**: `geneAuctions(where: { finished: false })`
5. **Gene proposals**: Filter by auction, trait type, removed status
6. **User genes**: `user(id: "0x...") { genesCreated { ... } genesOwned { ... } }`
7. **Gene earnings**: `geneNFT(id: "...") { totalEarnings, payouts { ... } }`

### Environment Variables

Update frontend `.env`:

```bash
# Old
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/...

# New
NEXT_PUBLIC_PONDER_URL=http://localhost:42069 # Dev
NEXT_PUBLIC_PONDER_URL=https://ponder.aminals.xyz # Prod
```

## Performance Optimizations to Implement

Based on the recent Graph optimizations:

1. **Cached Parent Traits**: Keep `parentGeneIds` array on GeneAuction
2. **Minimal Event Entities**: Only store events that frontend queries
3. **Indexed Fields**: Add database indexes for:
   - Aminal by aminalIndex
   - Genes by traitType
   - Auctions by finished status
   - Proposals by auction + traitType
   - User relationships by user or aminal
4. **Denormalized Counts**: Store frequently accessed counts directly
5. **Batch Operations**: Use Ponder's batch insert/update capabilities

## Testing Strategy

1. **Local Development**:
   - Use PGlite for fast local testing
   - Test with Sepolia testnet data
   - Verify all event handlers work correctly

2. **Integration Testing**:
   - Compare outputs between Graph and Ponder for same block range
   - Verify entity counts match
   - Test all frontend queries

3. **Performance Testing**:
   - Measure sync speed
   - Test query performance
   - Benchmark bulk operations (BulkVoteCast with 100+ votes)

## Success Criteria

- [ ] All events indexed correctly
- [ ] All current frontend queries work with minimal changes
- [ ] Sync performance equal to or better than The Graph
- [ ] Query performance equal to or better than The Graph
- [ ] Local development experience improved
- [ ] Deployment simpler than The Graph

## Next Steps

1. Review and approve this architecture plan
2. Create detailed schema definitions in `ponder.schema.ts`
3. Set up initial project structure
4. Begin Phase 1 implementation

## Questions for Discussion

1. **Deployment infrastructure**: Where should we host the Ponder indexer? (Railway, Fly.io, VPS, etc.)
2. **Database**: Use managed Postgres (e.g., Supabase, Neon) or self-hosted?
3. **Breaking changes**: Are we comfortable with schema changes that improve efficiency but require frontend updates?
4. **Backwards compatibility**: Should we run both indexers in parallel during migration?
5. **Timeline**: What's the priority for this migration vs other tasks?
