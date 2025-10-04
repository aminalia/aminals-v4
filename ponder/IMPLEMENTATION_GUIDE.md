# Ponder Implementation Guide

## Project Configuration

### Contract Addresses (Sepolia)

From `graph/subgraph.yaml`:

```typescript
// All contracts deployed on Sepolia testnet
const CONTRACTS = {
  AminalFactory: "0xfd69b3285974f11ac0e8490d86a2dc4ee7d2ce9c",
  GeneAuction: "0x96bd719eb8d32a1210e4e2eb77b5ce6ff157325d",
  Genes: "0xb70c1d4ab9e90eb73b7f8972bd3eeb139201cd43",
  GeneRegistry: "0x2706cf8e08f6cbfd8a0fc32637d0289ab6ed2ca4",
};

const START_BLOCK = 8828041; // All contracts start at same block
```

### Event Signatures

All event signatures extracted from subgraph.yaml:

#### AminalFactory
```typescript
"AminalSpawned(indexed address,indexed address,indexed address,uint256,uint256[8])"
```

#### Aminal (Dynamic Template)
```typescript
"FeedAminal(indexed address,uint256,uint256,uint256,uint256,uint256)"
"SkillUsed(indexed address,uint256,indexed address,indexed bytes4)"
"EnergyLost(indexed address,uint256,uint256)"
```

#### GeneAuction
```typescript
"VotingCreated(indexed uint256,indexed uint256,indexed uint256,uint256,uint64,uint64)"
"VotingSettled(indexed uint256,uint256[8],uint256)"
"GeneProposed(indexed uint256,indexed uint8,indexed uint256,address)"
"GeneVoteCast(indexed uint256,indexed uint8,indexed uint256,address,uint256)"
"GeneRemovalVote(indexed uint256,indexed uint8,indexed uint256,address,uint256)"
"GeneRemoved(indexed uint256,indexed uint8,indexed uint256)"
"BulkVoteCast(indexed uint256,indexed address,uint256[8],uint256)"
"GeneCreatorPayout(indexed uint256,indexed uint256,indexed address,uint256)"
```

#### Genes
```typescript
"Transfer(indexed address,indexed address,indexed uint256)"
```

#### GeneRegistry
```typescript
"GeneCreated(indexed uint256,indexed address,indexed uint8,string)"
```

## Implementation Order

### Phase 1: Project Setup ⚙️ ✅ (ALREADY DONE)

**Goal**: Get Ponder running locally with basic configuration

**Current State**:
✅ Ponder project initialized with `create ponder`
✅ `package.json` configured with npm scripts
✅ `ponder.config.ts` template created
✅ `ponder.schema.ts` template created
✅ `src/index.ts` handler registry created
✅ `src/api/index.ts` GraphQL/SQL API configured
✅ `.env.local` template created
✅ `.gitignore` configured
✅ TypeScript configuration ready
✅ Dependencies installed (node_modules present)

**What We Need to Do**:
1. Copy ABIs from `/workspace/out/` to `/workspace/ponder/abis/`
2. Update `ponder.config.ts` with Sepolia network and 5 contract configs
3. Update `.env.local` with Sepolia RPC URL
4. Delete example files (ExampleContractAbi.ts)
5. Test that Ponder starts: `npm run dev`

**Files to Update**:
- `ponder.config.ts` - Replace example with our 5 contracts
- `.env.local` - Add Sepolia RPC URL
- `abis/` - Copy 5 contract ABIs

**Files to Delete**:
- `ExampleContractAbi.ts` - Example ABI file

**Success Criteria**:
- `npm run dev` starts without errors
- Connects to Sepolia RPC
- No event handlers yet, just config

### Phase 2: Schema Definition 📋

**Goal**: Finalize database schema

**Current State**:
✅ `ponder.schema.ts` template exists (minimal example)
✅ `ponder.schema.ts.draft` complete and ready to use

**Steps**:
1. Replace `ponder.schema.ts` contents with `ponder.schema.ts.draft`
2. Review schema for any adjustments
3. Verify trait order documented in comments
4. Create `src/utils/` directory
5. Create `src/utils/constants.ts` with trait constants
6. Run `npm run dev` to verify schema compiles
7. Check generated types

**Files to Update**:
- `ponder.schema.ts` - Replace with drafted schema

**Files to Create**:
- `src/utils/constants.ts` - Trait constants and addresses
- `src/utils/helpers.ts` - Shared helper functions (prepare for Phase 3)
- `src/utils/validation.ts` - Validation functions (prepare for Phase 3)

**Success Criteria**:
- Schema compiles without errors
- Types are generated correctly
- All relationships defined

### Phase 3: Core Entities (Factory & Aminal) 🏭

**Goal**: Index factory and basic Aminal events

**Events to Handle**:
1. `AminalFactory:AminalSpawned` → Create Aminal entity
2. `Aminal:FeedAminal` → Update Aminal state, create FeedEvent
3. `Aminal:SkillUsed` → Create SkillUsedEvent
4. `Aminal:EnergyLost` → Update Aminal energy

**Implementation Order**:
1. Create helper functions (`src/utils/helpers.ts`)
2. Implement `AminalFactory:AminalSpawned` handler
3. Implement `Aminal:FeedAminal` handler
4. Implement `Aminal:SkillUsed` handler
5. Implement `Aminal:EnergyLost` handler

**Files to Create**:
- `src/index.ts` - Main indexing functions
- `src/utils/helpers.ts` - Shared utilities
- `src/utils/validation.ts` - Validation functions

**Testing**:
- Verify first few Aminals are indexed correctly
- Check traits array has correct values in correct order
- Verify parent relationships work
- Check feed events create correctly
- Verify energy updates

**Success Criteria**:
- Can query Aminals by ID
- Traits array populated correctly
- Parent relationships work
- Feed events recorded
- Skill events recorded

### Phase 4: Gene System (NFTs & Registry) 🧬

**Goal**: Index gene NFTs and track ownership

**Events to Handle**:
1. `GeneRegistry:GeneCreated` → Create GeneNFT entity
2. `Genes:Transfer` → Update GeneNFT owner

**Implementation Order**:
1. Implement `GeneRegistry:GeneCreated` handler
2. Implement `Genes:Transfer` handler (handle mints vs transfers)
3. Add User creation helper (reuse across handlers)

**Testing**:
- Verify genesis genes created
- Check gene metadata (svg, name, description)
- Verify transfers update owner
- Check creator stays constant
- Verify totalEarnings initializes to 0

**Success Criteria**:
- All genes indexed
- Ownership tracked correctly
- Metadata populated
- User entities created automatically

### Phase 5: Auction System (Complex) 🎪

**Goal**: Index breeding auctions and voting

**Events to Handle** (in order of complexity):
1. `GeneAuction:VotingCreated` → Create auction, cache parent traits
2. `GeneAuction:GeneProposed` → Create proposal
3. `GeneAuction:GeneVoteCast` → Record vote, update proposal
4. `GeneAuction:GeneRemovalVote` → Record removal vote
5. `GeneAuction:GeneRemoved` → Mark proposal as removed
6. `GeneAuction:BulkVoteCast` → Handle bulk voting (most complex!)
7. `GeneAuction:VotingSettled` → Settle auction
8. `GeneAuction:GeneCreatorPayout` → Record payout, update earnings

**Implementation Order**:

#### Step 5.1: Auction Creation
```typescript
// GeneAuction:VotingCreated
// - Create auction entity
// - Load parent Aminals
// - Cache parentGeneIds (16 bigints: 8 from each parent)
// - Store totalLove (voting power)
```

#### Step 5.2: Proposal System
```typescript
// GeneAuction:GeneProposed
// - Create proposal entity
// - Link to auction, gene, proposer
// - Initialize vote counts to 0
```

#### Step 5.3: Simple Voting
```typescript
// GeneAuction:GeneVoteCast
// - Load proposal (or create if voting for parent trait)
// - Create vote entity
// - Update proposal.loveVotes
```

#### Step 5.4: Removal Votes
```typescript
// GeneAuction:GeneRemovalVote
// - Load proposal
// - Create vote entity with isRemoveVote=true
// - Update proposal.removeVotes

// GeneAuction:GeneRemoved
// - Load proposal
// - Set proposal.removed = true
```

#### Step 5.5: Bulk Voting (Complex!)
```typescript
// GeneAuction:BulkVoteCast
// - Iterate through 8 trait slots
// - For each slot:
//   - Load or create proposal
//   - Check if gene is parent trait (use cached parentGeneIds)
//   - Create vote entity
//   - Update proposal vote count
// - This is the main performance bottleneck!
```

#### Step 5.6: Settlement
```typescript
// GeneAuction:VotingSettled
// - Load auction
// - Set finished = true
// - Child Aminal will be linked via AminalSpawned handler
```

#### Step 5.7: Payouts
```typescript
// GeneAuction:GeneCreatorPayout
// - Create payout entity
// - Update gene.totalEarnings
```

**Testing**:
- Create test auction with 2 parents
- Verify parentGeneIds caching
- Propose new gene
- Cast individual vote
- Cast bulk vote (test with all 8 traits)
- Verify vote counts update
- Test removal votes
- Settle auction
- Verify child linked to auction

**Success Criteria**:
- Auctions created with cached parent traits
- Proposals track votes correctly
- Bulk voting works (this is critical!)
- Settlements work
- Payouts recorded and totaled

### Phase 6: Testing & Validation ✅

**Goal**: Ensure all data matches Graph indexer

**Tasks**:
1. Compare entity counts between Graph and Ponder
2. Spot-check specific entities for data accuracy
3. Test all common GraphQL queries
4. Performance testing (bulk vote processing)
5. Edge case testing

**Validation Queries**:
```graphql
# Count all entities
{ factories { totalCount } }
{ aminals { totalCount } }
{ users { totalCount } }
{ geneNfts { totalCount } }
{ geneAuctions { totalCount } }
{ geneProposals { totalCount } }
{ geneVotes { totalCount } }
{ feedEvents { totalCount } }

# Spot check first Aminal
{ aminal(id: "0x...") {
  aminalIndex
  traits # Should be [back, arm, tail, ears, body, face, mouth, misc]
  energy
  totalLove
  parentOne { aminalIndex }
  parentTwo { aminalIndex }
}}

# Check auction with votes
{ geneAuction(id: "...") {
  auctionId
  aminalOne { aminalIndex }
  aminalTwo { aminalIndex }
  parentGeneIds # Should have 16 elements
  proposals {
    geneNFT { tokenId }
    loveVotes
    removed
  }
}}
```

**Performance Testing**:
```typescript
// Test bulk vote processing speed
// Should handle 100+ votes efficiently using cached parentGeneIds
```

**Success Criteria**:
- Entity counts match between Graph and Ponder (±1 for timing)
- Spot-checked entities have identical data
- All queries return expected results
- Bulk vote processing is fast

### Phase 7: Frontend Migration 🖥️

**Goal**: Update frontend to use Ponder GraphQL API

**Steps**:
1. Update GraphQL endpoint in frontend `.env`
2. Update GraphQL queries for schema changes
3. Update trait access pattern (8 fields → array)
4. Regenerate GraphQL types
5. Test all pages
6. Fix any query issues

**Key Changes**:

#### Environment Variable
```bash
# frontend/.env.local
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:42069/graphql
```

#### Trait Access Pattern
```typescript
// OLD (Graph)
const traits = {
  back: aminal.backId,
  arm: aminal.armId,
  tail: aminal.tailId,
  ears: aminal.earsId,
  body: aminal.bodyId,
  face: aminal.faceId,
  mouth: aminal.mouthId,
  misc: aminal.miscId,
};

// NEW (Ponder)
const TRAIT_BACK = 0, TRAIT_ARM = 1, TRAIT_TAIL = 2, TRAIT_EARS = 3;
const TRAIT_BODY = 4, TRAIT_FACE = 5, TRAIT_MOUTH = 6, TRAIT_MISC = 7;

const traits = {
  back: aminal.traits[TRAIT_BACK],
  arm: aminal.traits[TRAIT_ARM],
  tail: aminal.traits[TRAIT_TAIL],
  ears: aminal.traits[TRAIT_EARS],
  body: aminal.traits[TRAIT_BODY],
  face: aminal.traits[TRAIT_FACE],
  mouth: aminal.traits[TRAIT_MOUTH],
  misc: aminal.traits[TRAIT_MISC],
};

// OR if rendering in order, destructure:
const [back, arm, tail, ears, body, face, mouth, misc] = aminal.traits;
```

#### GraphQL Query Updates
```graphql
# OLD
query GetAminal($id: ID!) {
  aminal(id: $id) {
    backId
    armId
    tailId
    earsId
    bodyId
    faceId
    mouthId
    miscId
  }
}

# NEW
query GetAminal($id: ID!) {
  aminal(id: $id) {
    traits # Returns array of 8 bigints
  }
}
```

**Testing Checklist**:
- [ ] Home page loads
- [ ] Aminal list displays correctly
- [ ] Aminal detail page shows correct traits
- [ ] Aminal renders correctly (visual check)
- [ ] Breeding page loads
- [ ] Auction info displays
- [ ] Gene proposals show
- [ ] Voting works
- [ ] User profile loads
- [ ] Gene NFT pages work

**Success Criteria**:
- All pages load without errors
- Visual rendering matches previous version
- All queries return expected data
- No TypeScript errors

## Development Workflow

### Starting Development

```bash
cd /workspace/ponder

# Install dependencies
npm install

# Start development server (hot reload enabled)
npm dev

# In another terminal, open GraphiQL
open http://localhost:42069
```

### Iterating on Schema

```bash
# 1. Edit ponder.schema.ts
# 2. Ponder will automatically:
#    - Regenerate types
#    - Recreate database tables
#    - Re-index from startBlock

# No manual codegen needed!
```

### Iterating on Handlers

```bash
# 1. Edit src/index.ts or other handler files
# 2. Save file
# 3. Ponder automatically hot-reloads
# 4. Re-indexes affected events

# Check terminal for logs
```

### Testing Queries

```bash
# Open GraphiQL in browser
open http://localhost:42069

# Or use curl
curl -X POST http://localhost:42069/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ aminals { id aminalIndex } }"}'
```

### Debugging

```typescript
// Add logging in handlers
ponder.on("AminalFactory:AminalSpawned", async ({ event, context }) => {
  console.log("Spawned Aminal:", event.args.child);
  console.log("Gene IDs:", event.args.geneIds);

  // Rest of handler...
});

// Logs appear in terminal running `npm dev`
```

### Resetting Database

```bash
# If you need to start fresh
rm -rf .ponder/

# Restart dev server
npm dev
```

## Code Quality Standards

### TypeScript

- ✅ Use strict types (no `any`)
- ✅ Use constants for magic numbers
- ✅ Use enums/constants for trait indices
- ✅ Document complex logic with comments
- ✅ Use async/await (no callbacks)

### Error Handling

```typescript
// Always check if entity exists before accessing
const aminal = await context.db.aminals.findUnique({
  id: event.args.parentOne,
});

if (!aminal) {
  console.error(`Aminal not found: ${event.args.parentOne}`);
  return; // Skip this event
}

// Use it safely
const traits = aminal.traits;
```

### Performance

- ✅ Use cached data (parentGeneIds) to avoid extra queries
- ✅ Batch operations when possible
- ✅ Use indexes for common queries
- ✅ Avoid N+1 queries in relationships

### Documentation

- ✅ Add JSDoc comments to all functions
- ✅ Document complex business logic
- ✅ Reference event signatures in handlers
- ✅ Document trait order wherever traits are used

### Validation

```typescript
// Validate critical data
if (traits.length !== 8) {
  throw new Error(`Invalid traits length: ${traits.length}`);
}

if (auction.parentGeneIds.length !== 16) {
  throw new Error(`Invalid parentGeneIds length: ${auction.parentGeneIds.length}`);
}
```

## Common Patterns

### Creating or Loading User

```typescript
async function getOrCreateUser(
  context: Context,
  address: `0x${string}`
) {
  let user = await context.db.users.findUnique({ id: address });

  if (!user) {
    user = await context.db.users.create({
      id: address,
      data: {
        address,
      },
    });
  }

  return user;
}
```

### Creating Composite IDs

```typescript
// For proposals: auction ID + trait type + gene ID
const proposalId = `${auctionId}-${traitType}-${geneId}` as `0x${string}`;

// For votes: tx hash + log index
const voteId = `${event.transaction.hash}-${event.log.index}` as `0x${string}`;

// For relationships: user address + aminal address
const relationshipId = `${userAddress}-${aminalAddress}` as `0x${string}`;
```

### Handling Arrays from Events

```typescript
// Solidity: uint256[8] geneIds
// Ponder: bigint[] (array of 8 elements)

const traits = [
  event.args.geneIds[0], // BACK
  event.args.geneIds[1], // ARM
  event.args.geneIds[2], // TAIL
  event.args.geneIds[3], // EARS
  event.args.geneIds[4], // BODY
  event.args.geneIds[5], // FACE
  event.args.geneIds[6], // MOUTH
  event.args.geneIds[7], // MISC
];

// Validate
if (event.args.geneIds.length !== 8) {
  throw new Error("Invalid geneIds array length");
}
```

## Troubleshooting

### Ponder Won't Start

```bash
# Check Node version (need 18+)
node --version

# Check npm version
npm --version

# Clear cache and reinstall
rm -rf node_modules npm-lock.yaml .ponder
npm install
```

### RPC Connection Issues

```env
# Try different RPC providers
PONDER_RPC_URL_11155111=https://ethereum-sepolia-rpc.publicnode.com
# OR
PONDER_RPC_URL_11155111=https://rpc.sepolia.org
# OR use Alchemy/Infura
```

### Slow Syncing

```typescript
// In ponder.config.ts, increase polling interval
chains: {
  sepolia: {
    id: 11155111,
    rpc: process.env.PONDER_RPC_URL_11155111!,
    pollingInterval: 10_000, // 10 seconds instead of default
  },
}
```

### Wrong Data Indexed

```bash
# Clear database and re-index
rm -rf .ponder/
npm dev
```

### TypeScript Errors

```bash
# Regenerate types
npm ponder codegen

# Check tsconfig.json is correct
```

## Next Steps After Implementation

1. **Performance monitoring**: Track sync speed, query performance
2. **Error monitoring**: Set up alerts for handler errors
3. **Database backups**: Regular Postgres backups
4. **Deployment**: Deploy to production when ready
5. **Documentation**: Update frontend README with new patterns

## Summary

**Total Events to Handle**: 14 events across 5 contracts

**Estimated Implementation Time**:
- Phase 1 (Setup): 30 minutes
- Phase 2 (Schema): 15 minutes
- Phase 3 (Core): 1 hour
- Phase 4 (Genes): 30 minutes
- Phase 5 (Auctions): 2 hours
- Phase 6 (Testing): 1 hour
- Phase 7 (Frontend): 1 hour

**Total**: ~6.5 hours for clean, well-tested implementation

**Priority**: HIGH - Complete today with clean, maintainable code

Let's build this! 🚀
