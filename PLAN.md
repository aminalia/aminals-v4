# Plan

- deploy-sepolia.sh -> deploy.sh

## UI

- Trait links don't work on aminal detail page
- Fix CI
- TOOL TIPS and more info EVERYWHERE
- Optimize all of the UI to be screenshotable for Twitter
- Show how much money genes have made on the card
- Show more information about bonding curve love pricing... allow feeding more than 0.01 ETH.

### Chat Feature Improvements

- Use Eigen AI for getting persionalities in a deterministic way
- Better prompts for more creative outputs
- Pass ETH amounts correctly (Aminals think they have more ETH than they actually have)
- API rate limiting

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

- [?] Total earnings for OG genes are not updating? (maybe fixed)
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

# Contracts

- Review vibe coded love bonding curve math
- Make sure geneNFTs show up well on OpenSea / wallets
- measure gas (see how this is done in aminalsV3)
- More genes test coverage (renderer, auction, registry, NFT contract, payouts to owners)
- Clean up and document scripts
- Some events might be redundent (squeak vs EnergyChange / LoveChange)
- Investigate whether there should be some limits on gene proposals during auctions
- When initializing aminal genes during deployment, gene #0 has issues

# New Features Ideas

- Aminal Race
- Bribe system
- Prediction Market
- Aminals DAO (a DAO of Aminals based on Loveocracy)
- Poo skill to create a new NFT

# Open Design Questions

- Do we need remove gene?
- What should proposing a gene cost in terms of love? Should it scale somehow in relation to the number of proposals?
- Should there be a way of creating an entirely new Aminal?

In general we need a review of what things cost (even if the cost is in terms of love or energy).

# Do last

- Rename "Visuals" to "GeneIds", maybe explore using an array that could be variable length? Do we need backId, armsId, etc. if we are just rendering a stack?
- More docs
- Landing page about the Aminals project
