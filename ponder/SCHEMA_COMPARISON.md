# Schema Comparison: The Graph vs Ponder

This document details the differences between the current Graph schema and the proposed Ponder schema.

## Summary of Changes

### Breaking Changes

1. **Aminal traits**: Changed from 8 separate fields to a single array
2. **Table naming**: Snake_case for database tables (but GraphQL uses camelCase)
3. **Relationship fields**: More consistent `*Id` suffix pattern
4. **Type names**: Changed to match Ponder conventions

### Non-Breaking Improvements

1. **Better indexes**: Explicit index planning for common queries
2. **Cleaner relationships**: Using Ponder's relations API
3. **Type safety**: Full TypeScript instead of AssemblyScript
4. **Consistent patterns**: More uniform approach to IDs and references

## Entity-by-Entity Comparison

### AminalFactory → factories

**Graph (schema.graphql)**:
```graphql
type AminalFactory @entity(immutable: false) {
  id: Bytes! # Factory contract address
  totalAminals: BigInt!
  aminals: [Aminal!]! @derivedFrom(field: "factory")
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const factories = onchainTable("factories", (t) => ({
  id: t.hex().primaryKey(),
  totalAminals: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- ✅ Added timestamp/block metadata (useful for debugging)
- ✅ Relationship handled via `relations()` instead of `@derivedFrom`
- ⚠️ Table name: `AminalFactory` → `factories`

### Aminal → aminals

**Graph (schema.graphql)**:
```graphql
type Aminal @entity(immutable: false) {
  id: Bytes!
  contractAddress: Bytes!
  aminalIndex: BigInt!
  factory: AminalFactory!
  parentOne: Aminal
  parentTwo: Aminal
  auctionId: BigInt
  childrenAsParentOne: [Aminal!]! @derivedFrom(field: "parentOne")
  childrenAsParentTwo: [Aminal!]! @derivedFrom(field: "parentTwo")

  # Visual traits (8 separate fields)
  backId: BigInt!
  armId: BigInt!
  tailId: BigInt!
  earsId: BigInt!
  bodyId: BigInt!
  faceId: BigInt!
  mouthId: BigInt!
  miscId: BigInt!

  tokenURI: String
  energy: BigInt!
  totalLove: BigInt!
  ethBalance: BigInt!
  lovers: [Relationship]! @derivedFrom(field: "aminal")
  skillUsed: [SkillUsed!]! @derivedFrom(field: "aminal")
  feeds: [FeedAminalEvent!]! @derivedFrom(field: "aminal")
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const aminals = onchainTable("aminals", (t) => ({
  id: t.hex().primaryKey(),
  contractAddress: t.hex().notNull(),
  aminalIndex: t.bigint().notNull(),
  factoryId: t.hex().notNull().references("factories.id"),
  parentOneId: t.hex().references("aminals.id"),
  parentTwoId: t.hex().references("aminals.id"),
  auctionId: t.bigint(),

  // Visual traits - BREAKING CHANGE: array instead of 8 fields
  traits: t.bigint().array().notNull(),

  energy: t.bigint().notNull(),
  totalLove: t.bigint().notNull(),
  ethBalance: t.bigint().notNull(),
  tokenURI: t.text(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- 🔥 **BREAKING**: Traits now array `traits[0..7]` instead of `backId`, `armId`, etc.
- ✅ Foreign keys explicit: `factory` → `factoryId`
- ✅ Parent relationships explicit: `parentOne` → `parentOneId`
- ✅ Derived relationships handled via `relations()`
- ⚠️ Table name: `Aminal` → `aminals`

**Migration for Frontend**:
```typescript
// OLD
const backGeneId = aminal.backId;
const armGeneId = aminal.armId;
// ... 8 separate fields

// NEW
const backGeneId = aminal.traits[0]; // BACK
const armGeneId = aminal.traits[1];  // ARM
// ... array access

// Or use constants for clarity
const TRAIT_BACK = 0, TRAIT_ARM = 1, TRAIT_TAIL = 2, TRAIT_EARS = 3;
const TRAIT_BODY = 4, TRAIT_FACE = 5, TRAIT_MOUTH = 6, TRAIT_MISC = 7;
const backGeneId = aminal.traits[TRAIT_BACK];
```

### User → users

**Graph (schema.graphql)**:
```graphql
type User @entity(immutable: false) {
  id: Bytes!
  address: Bytes!
  lovers: [Relationship]! @derivedFrom(field: "user")
  genesCreated: [GeneNFT]! @derivedFrom(field: "creator")
  genesOwned: [GeneNFT]! @derivedFrom(field: "owner")
  geneVotes: [GeneVote]! @derivedFrom(field: "voter")
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const users = onchainTable("users", (t) => ({
  id: t.hex().primaryKey(),
  address: t.hex().notNull(),
}));

// Relations defined separately
export const usersRelations = relations(users, ({ many }) => ({
  lovers: many(relationships),
  genesCreated: many(geneNFTs, { relationName: "createdGenes" }),
  genesOwned: many(geneNFTs, { relationName: "ownedGenes" }),
  geneVotes: many(geneVotes),
  proposedGenes: many(geneProposals),
  receivedPayouts: many(geneCreatorPayouts),
  feedEvents: many(feedEvents),
  skillEvents: many(skillUsedEvents),
}));
```

**Changes**:
- ✅ Same core fields
- ✅ Relationships more explicit and type-safe
- ✅ Added more relationship types for complete querying
- ⚠️ Table name: `User` → `users`

### GeneNFT → gene_nfts

**Graph (schema.graphql)**:
```graphql
type GeneNFT @entity(immutable: false) {
  id: Bytes!
  tokenId: BigInt!
  traitType: Int!
  owner: User!
  creator: User!
  svg: String
  name: String
  description: String
  proposalsUsingGene: [GeneProposal!]! @derivedFrom(field: "geneNFT")
  totalEarnings: BigInt!
  payouts: [GeneCreatorPayout!]! @derivedFrom(field: "geneNFT")
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const geneNFTs = onchainTable("gene_nfts", (t) => ({
  id: t.hex().primaryKey(),
  tokenId: t.bigint().notNull(),
  traitType: t.integer().notNull(),
  ownerId: t.hex().notNull().references("users.id"),
  creatorId: t.hex().notNull().references("users.id"),
  svg: t.text(),
  name: t.text(),
  description: t.text(),
  totalEarnings: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- ✅ Foreign keys explicit: `owner` → `ownerId`, `creator` → `creatorId`
- ✅ Relationships handled via `relations()`
- ⚠️ Table name: `GeneNFT` → `gene_nfts`
- ⚠️ Type: `Int` → `integer()` (same thing, different syntax)

### GeneAuction → gene_auctions

**Graph (schema.graphql)**:
```graphql
type GeneAuction @entity(immutable: false) {
  id: Bytes!
  auctionId: BigInt!
  aminalOne: Aminal!
  aminalTwo: Aminal!
  totalLove: BigInt!
  finished: Boolean!
  parentGeneIds: [BigInt!]!
  childAminal: Aminal
  proposals: [GeneProposal!]! @derivedFrom(field: "auction")
  votes: [GeneVote!]! @derivedFrom(field: "auction")
  payouts: [GeneCreatorPayout!]! @derivedFrom(field: "auction")
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const geneAuctions = onchainTable("gene_auctions", (t) => ({
  id: t.hex().primaryKey(),
  auctionId: t.bigint().notNull(),
  aminalOneId: t.hex().notNull().references("aminals.id"),
  aminalTwoId: t.hex().notNull().references("aminals.id"),
  totalLove: t.bigint().notNull(),
  parentGeneIds: t.bigint().array().notNull(),
  finished: t.boolean().notNull(),
  childAminalId: t.hex().references("aminals.id"),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- ✅ Foreign keys explicit: `aminalOne` → `aminalOneId`, etc.
- ✅ Kept `parentGeneIds` optimization from recent Graph work
- ✅ Relationships handled via `relations()`
- ⚠️ Table name: `GeneAuction` → `gene_auctions`

### GeneProposal → gene_proposals

**Graph (schema.graphql)**:
```graphql
type GeneProposal @entity(immutable: false) {
  id: Bytes!
  auction: GeneAuction!
  geneNFT: GeneNFT!
  traitType: Int!
  proposer: User!
  loveVotes: BigInt!
  removeVotes: BigInt!
  removed: Boolean!
  votes: [GeneVote!]! @derivedFrom(field: "proposal")
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const geneProposals = onchainTable("gene_proposals", (t) => ({
  id: t.hex().primaryKey(),
  auctionId: t.hex().notNull().references("gene_auctions.id"),
  geneNFTId: t.hex().notNull().references("gene_nfts.id"),
  traitType: t.integer().notNull(),
  proposerId: t.hex().notNull().references("users.id"),
  loveVotes: t.bigint().notNull(),
  removeVotes: t.bigint().notNull(),
  removed: t.boolean().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- ✅ Foreign keys explicit with consistent `*Id` suffix
- ✅ Relationships handled via `relations()`
- ⚠️ Table name: `GeneProposal` → `gene_proposals`

### GeneVote → gene_votes

**Graph (schema.graphql)**:
```graphql
type GeneVote @entity(immutable: false) {
  id: Bytes!
  auction: GeneAuction!
  proposal: GeneProposal!
  voter: User!
  isRemoveVote: Boolean!
  loveAmount: BigInt!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const geneVotes = onchainTable("gene_votes", (t) => ({
  id: t.hex().primaryKey(),
  auctionId: t.hex().notNull().references("gene_auctions.id"),
  proposalId: t.hex().notNull().references("gene_proposals.id"),
  voterId: t.hex().notNull().references("users.id"),
  isRemoveVote: t.boolean().notNull(),
  loveAmount: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- ✅ Foreign keys explicit
- ✅ Relationships handled via `relations()`
- ⚠️ Table name: `GeneVote` → `gene_votes`

### Relationship → relationships

**Graph (schema.graphql)**:
```graphql
type Relationship @entity(immutable: false) {
  id: Bytes!
  user: User!
  aminal: Aminal!
  love: BigInt!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const relationships = onchainTable("relationships", (t) => ({
  id: t.hex().primaryKey(),
  userId: t.hex().notNull().references("users.id"),
  aminalId: t.hex().notNull().references("aminals.id"),
  love: t.bigint().notNull(),
}));
```

**Changes**:
- ✅ Foreign keys explicit
- ✅ Relationships handled via `relations()`
- ⚠️ Table name: `Relationship` → `relationships`

### FeedAminalEvent → feed_events

**Graph (schema.graphql)**:
```graphql
type FeedAminalEvent @entity(immutable: true) {
  id: Bytes!
  aminal: Aminal!
  sender: User!
  amount: BigInt!
  love: BigInt!
  totalLove: BigInt!
  energy: BigInt!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const feedEvents = onchainTable("feed_events", (t) => ({
  id: t.hex().primaryKey(),
  aminalId: t.hex().notNull().references("aminals.id"),
  senderId: t.hex().notNull().references("users.id"),
  amount: t.bigint().notNull(),
  love: t.bigint().notNull(),
  totalLove: t.bigint().notNull(),
  energy: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- ✅ Foreign keys explicit
- ✅ Relationships handled via `relations()`
- ⚠️ Table name: `FeedAminalEvent` → `feed_events`

### SkillUsed → skill_used_events

**Graph (schema.graphql)**:
```graphql
type SkillUsed @entity(immutable: true) {
  id: Bytes!
  aminal: Aminal!
  caller: User!
  skillAddress: Bytes!
  selector: Bytes!
  newEnergy: BigInt!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const skillUsedEvents = onchainTable("skill_used_events", (t) => ({
  id: t.hex().primaryKey(),
  aminalId: t.hex().notNull().references("aminals.id"),
  callerId: t.hex().notNull().references("users.id"),
  skillAddress: t.hex().notNull(),
  selector: t.hex().notNull(),
  newEnergy: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- ✅ Foreign keys explicit
- ✅ Relationships handled via `relations()`
- ⚠️ Table name: `SkillUsed` → `skill_used_events`

### GeneCreatorPayout → gene_creator_payouts

**Graph (schema.graphql)**:
```graphql
type GeneCreatorPayout @entity(immutable: true) {
  id: Bytes!
  auction: GeneAuction!
  geneNFT: GeneNFT!
  creator: User!
  amount: BigInt!
  auctionId: BigInt!
  geneId: BigInt!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Ponder (ponder.schema.ts)**:
```typescript
export const geneCreatorPayouts = onchainTable("gene_creator_payouts", (t) => ({
  id: t.hex().primaryKey(),
  auctionId: t.hex().notNull().references("gene_auctions.id"),
  geneNFTId: t.hex().notNull().references("gene_nfts.id"),
  creatorId: t.hex().notNull().references("users.id"),
  amount: t.bigint().notNull(),
  auctionIdRaw: t.bigint().notNull(),
  geneIdRaw: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));
```

**Changes**:
- ✅ Foreign keys explicit
- ✅ Renamed raw IDs for clarity: `auctionId`/`geneId` → `auctionIdRaw`/`geneIdRaw`
- ✅ Relationships handled via `relations()`
- ⚠️ Table name: `GeneCreatorPayout` → `gene_creator_payouts`

## GraphQL Query Migration Guide

### Table Names

Ponder will auto-generate GraphQL types with camelCase names:

```graphql
# Database: factories
# GraphQL: factories (same, already plural)

# Database: aminals
# GraphQL: aminals (same)

# Database: gene_nfts
# GraphQL: geneNfts (auto-camelCase)

# Database: gene_auctions
# GraphQL: geneAuctions (auto-camelCase)

# Database: gene_proposals
# GraphQL: geneProposals (auto-camelCase)

# Database: gene_votes
# GraphQL: geneVotes (auto-camelCase)

# Database: feed_events
# GraphQL: feedEvents (auto-camelCase)

# Database: skill_used_events
# GraphQL: skillUsedEvents (auto-camelCase)

# Database: gene_creator_payouts
# GraphQL: geneCreatorPayouts (auto-camelCase)
```

### Query Examples

**Get Aminal by address** (no change):
```graphql
query GetAminal($id: String!) {
  aminal(id: $id) {
    id
    aminalIndex
    # BREAKING: traits changed from separate fields to array
    traits # Returns [backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId]
    energy
    totalLove
  }
}
```

**Get user's loved Aminals** (minimal change):
```graphql
query GetUserLoves($userId: String!) {
  user(id: $userId) {
    id
    lovers {
      love
      aminal {
        id
        aminalIndex
        traits
      }
    }
  }
}
```

**Get active auctions** (table name changed):
```graphql
query GetActiveAuctions {
  # OLD: geneAuctions (Graph)
  # NEW: geneAuctions (Ponder - same! but different entity name in code)
  geneAuctions(where: { finished: false }) {
    id
    auctionId
    aminalOne {
      id
      aminalIndex
    }
    aminalTwo {
      id
      aminalIndex
    }
    proposals {
      geneNFT {
        tokenId
        svg
      }
      loveVotes
    }
  }
}
```

**Get gene NFTs by trait type** (table name changed):
```graphql
query GetGenesByTrait($traitType: Int!) {
  # OLD: geneNFTs (Graph)
  # NEW: geneNfts (Ponder - note lowercase 'n')
  geneNfts(where: { traitType: $traitType }) {
    id
    tokenId
    svg
    creator {
      address
    }
    owner {
      address
    }
    totalEarnings
  }
}
```

## Frontend Migration Checklist

### Code Changes Required

- [ ] Update trait access pattern (8 fields → array)
- [ ] Update GraphQL queries for table name changes
- [ ] Update GraphQL endpoint URL
- [ ] Regenerate GraphQL types with new schema
- [ ] Update any hardcoded entity/field names

### Testing Required

- [ ] Verify all Aminal queries work
- [ ] Verify trait rendering works with array access
- [ ] Verify auction queries work
- [ ] Verify gene NFT queries work
- [ ] Verify user profile queries work
- [ ] Verify relationship queries work
- [ ] Verify pagination works
- [ ] Verify filtering works
- [ ] Verify sorting works

### Deployment

- [ ] Set up Ponder indexer in production
- [ ] Wait for full sync
- [ ] Update frontend environment variables
- [ ] Deploy frontend changes
- [ ] Monitor for errors
- [ ] Keep Graph indexer running temporarily as backup

## Benefits Summary

### For Development

1. ✅ **Better type safety**: Full TypeScript instead of AssemblyScript
2. ✅ **Better tooling**: Standard Node.js ecosystem
3. ✅ **Easier debugging**: Better error messages, source maps
4. ✅ **Faster iteration**: Hot reloading during development
5. ✅ **Local testing**: PGlite for instant local database

### For Production

1. ✅ **Better performance**: Postgres is fast and well-optimized
2. ✅ **Easier deployment**: Standard Node.js deployment
3. ✅ **Direct SQL access**: Can run custom queries when needed
4. ✅ **Better monitoring**: Standard database monitoring tools
5. ✅ **Horizontal scaling**: Can run multiple `ponder serve` instances

### For Schema

1. ✅ **Cleaner relationships**: More explicit foreign keys
2. ✅ **Better indexes**: Can optimize for specific query patterns
3. ✅ **More flexible**: Can add computed fields, views, etc.
4. ✅ **Standard SQL**: Familiar to most developers
5. ✅ **Migration path**: Can evolve schema over time

## Risk Assessment

### High Risk (Breaking Changes)

- 🔥 **Aminal traits array**: Frontend must update trait access pattern
  - **Mitigation**: Can be done in one PR with search/replace
  - **Testing**: Visual rendering tests will catch issues

### Medium Risk (Name Changes)

- ⚠️ **Table/entity names**: Frontend queries need updates
  - **Mitigation**: GraphQL codegen will catch most issues at compile time
  - **Testing**: Type errors will surface before runtime

### Low Risk (Internal)

- ✅ **Relationship patterns**: Internal to indexer
- ✅ **Foreign key names**: Internal to indexer
- ✅ **Database optimizations**: Transparent to frontend

## Conclusion

The migration from The Graph to Ponder requires one significant breaking change (traits array) and several naming changes (table names, field names). However, the benefits in terms of development experience, deployment simplicity, and query flexibility make this a worthwhile migration.

The breaking changes are well-contained and can be addressed systematically during migration. The improved type safety and tooling will catch most issues at compile time rather than runtime.
