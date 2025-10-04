# Ponder Implementation Checklist

Track progress through implementation phases.

## ⚙️ Phase 1: Setup (Est: 30 min)

- [ ] Initialize npm project
- [ ] Install dependencies (@ponder/core, viem)
- [ ] Create `.gitignore`
- [ ] Create `.env.local` with Sepolia RPC
- [ ] Copy ABIs from `../out/` to `abis/`
- [ ] Create `ponder.config.ts` with all 5 contracts
- [ ] Create `tsconfig.json`
- [ ] Run `npm dev` - verify it starts
- [ ] Verify connection to Sepolia RPC
- [ ] Verify GraphiQL accessible at http://localhost:42069

**Success Criteria**: Ponder starts without errors, connects to Sepolia

---

## 📋 Phase 2: Schema (Est: 15 min)

- [ ] Rename `ponder.schema.ts.draft` → `ponder.schema.ts`
- [ ] Review schema for any needed adjustments
- [ ] Verify trait order documented in comments
- [ ] Create `src/utils/constants.ts` with trait constants
- [ ] Run `npm dev` - verify schema compiles
- [ ] Check generated types in `.ponder/`
- [ ] Verify all relationships defined correctly

**Success Criteria**: Schema compiles, types generated, no errors

---

## 🏭 Phase 3: Core Entities (Est: 1 hour)

### Setup
- [ ] Create `src/index.ts`
- [ ] Create `src/utils/helpers.ts`
- [ ] Create `src/utils/validation.ts`
- [ ] Add JSDoc comments and trait order docs

### Event Handlers

#### AminalFactory:AminalSpawned
- [ ] Implement handler
- [ ] Create/update factory entity
- [ ] Create aminal entity with correct traits array order
- [ ] Set parent relationships (if not genesis)
- [ ] Link to auction (if spawned from breeding)
- [ ] Initialize energy, love, ethBalance
- [ ] Test: Verify first few aminals indexed correctly
- [ ] Test: Verify traits array has 8 elements in correct order

#### Aminal:FeedAminal
- [ ] Implement handler
- [ ] Create/load user entity
- [ ] Update aminal energy and totalLove
- [ ] Update aminal ethBalance
- [ ] Create/update relationship
- [ ] Create feed event entity
- [ ] Test: Verify feed events recorded
- [ ] Test: Verify relationship love updates

#### Aminal:SkillUsed
- [ ] Implement handler
- [ ] Create/load user entity
- [ ] Create skill used event entity
- [ ] Test: Verify skill events recorded

#### Aminal:EnergyLost
- [ ] Implement handler
- [ ] Update aminal energy
- [ ] Test: Verify energy updates correctly

### Validation
- [ ] Query first 5 aminals via GraphiQL
- [ ] Verify trait order matches expected values
- [ ] Verify parent relationships work
- [ ] Compare counts with Graph indexer

**Success Criteria**: Aminals indexed, relationships work, events recorded

---

## 🧬 Phase 4: Gene System (Est: 30 min)

### Event Handlers

#### GeneRegistry:GeneCreated
- [ ] Implement handler
- [ ] Create/load creator user
- [ ] Create gene NFT entity
- [ ] Set metadata (svg, name, description)
- [ ] Set creator and initial owner
- [ ] Initialize totalEarnings to 0
- [ ] Test: Verify genesis genes created
- [ ] Test: Verify metadata populated

#### Genes:Transfer
- [ ] Implement handler
- [ ] Handle mint (from zero address) vs transfer
- [ ] For mints: create gene NFT if not exists (fallback)
- [ ] For transfers: update owner
- [ ] Creator should never change
- [ ] Test: Verify transfers update owner
- [ ] Test: Verify creator stays constant

### Validation
- [ ] Query all genes via GraphiQL
- [ ] Check genes by traitType (0-7)
- [ ] Verify ownership tracking
- [ ] Compare gene count with Graph indexer

**Success Criteria**: All genes indexed, ownership tracked, metadata correct

---

## 🎪 Phase 5: Auction System (Est: 2 hours)

### Part 1: Auction Creation (20 min)

#### GeneAuction:VotingCreated
- [ ] Implement handler
- [ ] Create auction entity
- [ ] Load parent aminals
- [ ] Cache parentGeneIds (16 elements: 8 from each parent)
- [ ] Validate parentGeneIds length = 16
- [ ] Set totalLove (voting power)
- [ ] Set finished = false
- [ ] Test: Verify auction created
- [ ] Test: Verify parentGeneIds cached correctly (critical!)

### Part 2: Proposals (15 min)

#### GeneAuction:GeneProposed
- [ ] Implement handler
- [ ] Create proposal entity
- [ ] Generate composite ID (auction-traitType-geneId)
- [ ] Link to auction, gene, proposer
- [ ] Initialize loveVotes = 0, removeVotes = 0
- [ ] Set removed = false
- [ ] Test: Verify proposals created
- [ ] Test: Verify composite ID format

### Part 3: Simple Voting (20 min)

#### GeneAuction:GeneVoteCast
- [ ] Implement handler
- [ ] Load proposal (or create if voting for parent trait)
- [ ] Create vote entity
- [ ] Update proposal loveVotes
- [ ] Test: Verify votes recorded
- [ ] Test: Verify proposal vote counts update

### Part 4: Removal System (15 min)

#### GeneAuction:GeneRemovalVote
- [ ] Implement handler
- [ ] Load proposal
- [ ] Create vote entity with isRemoveVote=true
- [ ] Update proposal removeVotes
- [ ] Test: Verify removal votes recorded

#### GeneAuction:GeneRemoved
- [ ] Implement handler
- [ ] Load proposal
- [ ] Set removed = true
- [ ] Test: Verify proposals marked as removed

### Part 5: Bulk Voting (30 min - CRITICAL!)

#### GeneAuction:BulkVoteCast
- [ ] Implement handler
- [ ] Load auction
- [ ] Iterate through 8 trait slots (i = 0 to 7)
- [ ] For each slot:
  - [ ] Get geneId from event.args.geneIds[i]
  - [ ] Generate proposal ID
  - [ ] Load or create proposal
  - [ ] Check if gene is parent trait using cached parentGeneIds
  - [ ] parent1Trait = parentGeneIds[i]
  - [ ] parent2Trait = parentGeneIds[i + 8]
  - [ ] Create vote entity
  - [ ] Update proposal loveVotes
- [ ] Test with auction that has bulk votes
- [ ] Test: Verify all 8 votes recorded
- [ ] Test: Verify vote counts correct
- [ ] Test: Verify parent trait detection works (optimization!)
- [ ] Performance test: Should be fast with cached parentGeneIds

### Part 6: Settlement (15 min)

#### GeneAuction:VotingSettled
- [ ] Implement handler
- [ ] Load auction
- [ ] Set finished = true
- [ ] Note: childAminal linked via AminalSpawned handler
- [ ] Test: Verify auction marked finished
- [ ] Test: Verify child linked (check AminalSpawned logic)

### Part 7: Payouts (15 min)

#### GeneAuction:GeneCreatorPayout
- [ ] Implement handler
- [ ] Create payout entity
- [ ] Load gene NFT
- [ ] Update gene.totalEarnings
- [ ] Test: Verify payouts recorded
- [ ] Test: Verify totalEarnings accumulates correctly

### Full Auction Testing
- [ ] Find complete auction in blockchain data
- [ ] Verify all phases work together
- [ ] Check proposals → votes → settlement → payouts
- [ ] Compare with Graph indexer data

**Success Criteria**: Complete auction lifecycle works, bulk voting fast

---

## ✅ Phase 6: Testing & Validation (Est: 1 hour)

### Entity Count Comparison
- [ ] Compare factories count (Graph vs Ponder)
- [ ] Compare aminals count
- [ ] Compare users count
- [ ] Compare geneNfts count
- [ ] Compare geneAuctions count
- [ ] Compare geneProposals count
- [ ] Compare geneVotes count
- [ ] Compare feedEvents count
- [ ] Compare skillUsedEvents count
- [ ] Compare payouts count

### Spot Check Data Quality
- [ ] Check first aminal (genesis)
- [ ] Check aminal with parents
- [ ] Check auction with proposals
- [ ] Check gene with earnings
- [ ] Check user with relationships

### Query Testing
Test all these queries work:

- [ ] Get aminal by ID
- [ ] List aminals (with pagination)
- [ ] Get aminals by aminalIndex (sorted)
- [ ] Get user's loved aminals
- [ ] Get user's created genes
- [ ] Get user's owned genes
- [ ] Get genes by traitType
- [ ] Get active auctions (finished=false)
- [ ] Get auction proposals
- [ ] Get proposal votes
- [ ] Get gene earnings (totalEarnings + payouts)
- [ ] Get feed events for aminal
- [ ] Get skill events for aminal

### Performance Testing
- [ ] Test bulk vote query performance
- [ ] Verify no N+1 queries in relationships
- [ ] Check database size vs Graph
- [ ] Measure sync speed

### Edge Cases
- [ ] Genesis aminals (no parents)
- [ ] Voting on parent traits (no proposal needed)
- [ ] Removed proposals
- [ ] Genes with no proposals
- [ ] Users with no activity

**Success Criteria**: All data matches, all queries work, performance good

---

## 🖥️ Phase 7: Frontend Migration (Est: 1 hour)

### Environment Setup
- [ ] Update frontend `.env.local` with Ponder endpoint
- [ ] Stop Graph indexer (not needed anymore)
- [ ] Keep Ponder running

### Code Changes

#### Trait Constants
- [ ] Create `frontend/src/utils/traitConstants.ts`
- [ ] Define TRAIT_BACK, TRAIT_ARM, etc.
- [ ] Export trait names array

#### GraphQL Queries
- [ ] Find all queries with aminal traits
- [ ] Update backId → traits[TRAIT_BACK]
- [ ] Update all 8 trait fields
- [ ] Update any entity name changes (GeneNFT → geneNft)
- [ ] Regenerate GraphQL types

#### Components
- [ ] Update trait rendering components
- [ ] Update trait access patterns
- [ ] Test each component individually

### Testing Checklist
- [ ] Home page loads
- [ ] Aminal list page
- [ ] Aminal detail page
- [ ] Aminal renders correctly (visual!)
- [ ] Breeding page
- [ ] Auction detail
- [ ] Gene proposals display
- [ ] Voting interface works
- [ ] User profile page
- [ ] User's genes page
- [ ] Gene NFT detail page
- [ ] Relationships display correctly

### Validation
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All images/SVGs render
- [ ] All data displays correctly
- [ ] Navigation works
- [ ] Interactive features work

**Success Criteria**: Frontend fully functional with Ponder backend

---

## 🎉 Completion Checklist

### Code Quality
- [ ] All handlers have JSDoc comments
- [ ] Trait order documented in all relevant files
- [ ] Constants used (no magic numbers)
- [ ] Error handling in place
- [ ] Validation functions used
- [ ] TypeScript strict mode passing
- [ ] No console.logs left in code

### Documentation
- [ ] README.md complete
- [ ] All planning docs reviewed
- [ ] Code comments added
- [ ] Breaking changes documented
- [ ] Migration guide complete

### Testing
- [ ] All entity counts match
- [ ] All queries tested
- [ ] Performance acceptable
- [ ] Frontend fully functional
- [ ] No errors in logs

### Deployment Ready
- [ ] .gitignore correct
- [ ] .env.local not committed
- [ ] All files committed
- [ ] Git history clean
- [ ] Ready for production deployment (later)

---

## 📊 Progress Tracking

**Start Time**: _________
**Current Phase**: Phase 0 (Planning Complete)
**Estimated Completion**: _________ (Start + 6.5 hours)

### Time Log
- Phase 1 (Setup): _____ min
- Phase 2 (Schema): _____ min
- Phase 3 (Core): _____ min
- Phase 4 (Genes): _____ min
- Phase 5 (Auctions): _____ min
- Phase 6 (Testing): _____ min
- Phase 7 (Frontend): _____ min

**Total**: _____ hours

---

## 🚨 Critical Items

1. ⚠️ **Trait Order**: Must be preserved exactly as documented
2. ⚠️ **parentGeneIds**: Must cache 16 elements (8 from each parent)
3. ⚠️ **Bulk Voting**: Must use cached traits for performance
4. ⚠️ **Validation**: Always validate array lengths
5. ⚠️ **Testing**: Compare every entity with Graph indexer

---

## ✅ Sign-off

- [ ] All phases complete
- [ ] All tests passing
- [ ] Frontend working
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Ready for production

**Completed by**: _________
**Date**: _________
**Notes**: _________
