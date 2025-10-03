# Plan

- [ ] Make issues / resolve issues from security audit
- [ ] Switch to ponder (will hopefully solve many bugs)

# Indexer Cleanup

✅ **COMPLETED** - Graph indexing optimizations implemented (2025-10-03)

## Implemented Optimizations

### Phase 1: High-Impact Performance Improvements (30-40% faster bulk votes)
- ✅ Added `parentGeneIds` cache to GeneAuction schema
- ✅ Updated `handleVotingCreated` to store parent trait IDs on auction creation
- ✅ Updated `handleBulkVoteCast` to use cached traits (eliminates 2 entity loads per vote)

### Phase 2: Schema Cleanup (5-10% reduction in write operations)
- ✅ Removed `BreedAminalEvent` entity entirely (not queried by frontend)
- ✅ Removed unused AminalFactory fields: `geneAuction`, `genes`, `loveVRGDA`, `initialAminalSpawned`, `blockNumber`, `blockTimestamp`, `transactionHash`
- ✅ Removed unused Aminal derived relationships: `breedingEventsAsParentOne`, `breedingEventsAsParentTwo`, `auctions`
- ✅ Removed unused GeneAuction metadata: `winningGeneIds`, `endBlockNumber`, `endBlockTimestamp`, `endTransactionHash`
- ✅ Removed `User.geneProposals` field (not queried)

### Expected Performance Impact
- **Bulk vote processing**: 30-40% faster (primary bottleneck)
- **Overall indexing**: 10-20% improvement
- **Write operations**: 5-10% reduction

### Documentation
- See `GRAPH_INDEXING_REPORT.md` for full analysis
- See `GRAPH_OPTIMIZATION_SUMMARY.md` for quick reference
- See `FRONTEND_VERIFICATION_REPORT.md` for frontend impact analysis

### Future Optimizations (Phase 3 - Not Yet Implemented)
- ⚠️ Add `first` limits to unbounded relationships (requires frontend testing)
- ⚠️ Optimize `proposalsUsingGene` queries to fetch only IDs for list views (requires frontend refactor)

# Try ponder

I want to experiment with using ponder.sh instead of the graph for indexing the solidity contracts. Create a new `ponder` directory, and let's create an indexer similar to the functionality we've already created with the graph in @graph/

## New Features Ideas

- Maybe make this a chat skill (with an AVS that extracts personality traits)
- Aminal Race
- Prediction Market
- Bribing
- Give love to Aminals (check voting power) on breeding page (if you don't love them yet, it's not too late)
- Aminals DAO (a DAO of Aminals based on Loveocracy)
- Poo skill to create a new NFT

## Open Design Questions

- Do we need remove gene?
- What should proposing a gene cost in terms of love? Should it scale somehow in relation to the number of proposals?
- Should there be a way of creating an entirely new Aminal?

In general we need a review of what things cost (even if the cost is in terms of love or energy).

## TODO

#### UI

- Trait links don't work on aminal detail page
- Fix CI
- Optimize all of the UI to be screenshotable for Twitter
- Show how much money genes have made on the card

#### Contracts

- setFactory in Genes is not good... maybe use an initializer? Owner can set factory whenever. Need to initialize initial genes, but maybe there is a different pattern we can use?
- start optimizing for gas (payouts need most work)
- measure gas (see how this is done in aminalsV3)
- More genes test coverage (renderer, auction, registry, NFT contract, payouts to owners)
- Clean up and document scripts
- Some events might be redundent (squeak vs EnergyChange / LoveChange)
- Investigate whether there should be some limits on gene proposals during auctions
- When initializing aminal genes during deployment, gene #0 has issues

#### Do last

- Rename "Visuals" to "GeneIds", maybe explore using an array that could be variable length? Do we need backId, armsId, etc. if we are just rendering a stack?
- More docs
- Landing page about the Aminals project

### User Testing feedback

General:

- [ ] Tooltips and more info
- [ ] Love should be a percentage?
- [ ] Make clear costs in love and energy everywhere

Profile:

- [x] Classic profile stuff (ENS, picture, copy address)
- [ ] Show favorite Aminal on profile?

Genes:

- [ ] Zoom on traits (for tiny things like mouth)
- [ ] Traits / genes should have UI to transfer?

Breeding:

- [x] SVG creator should just be text / preview
- [ ] make nice SVG coder with linting
- [ ] "Gene Selection" -> "Gene Pool"
- [ ] "p1" - "Parent 1", etc
- [ ] "Time Left" -> "Incubation Period"
- [x] Propose gene button placement is bad, should be next to gene pool header
- [ ] Button to breed aminals on Breeding page
- [x] Voting none seems to not work? (investigated: fixed in indexer)
- [ ] Toast for propose is wrong
- [ ] Be clearer what propose genes costs PROPOSE_GENE_COST
- [ ] Communicate the amount of energy / love to breed (MIN_LOVE_REQUIRED / MIN_ENERGY_REQUIRED)

Desgin challenges:

- [ ] Make it clearer that you can't own an Aminal
- [x] Be clearer that you can own genes (they have "owners" now)

Indexer:

- [ ] Total earnings for OG genes are not updating?
- [ ] Index amount of Eth a user has spent feeding / interacting with Aminals

Contract Changes:

- [ ] Default Aminal Designer to winning combo
- [ ] Randomize on StartAuction so that the preview shows what the Aminal will be if no one votes
- [ ] bulkVoteOnGenes could be optimized to only vote on traits different than random
- [x] Propose gene is expensive (investigate)
- [x] More GeneAuction gas optimizations.
- [ ] Clean up remove proposals logic?
- [ ] Remember aminal state in aminal builder

##### General Questions from User Interview

- "Why aren't all genes listed?"
