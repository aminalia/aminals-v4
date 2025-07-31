# Plan

## New Features Ideas

- Amainal Chat (feed in love, system prompt, extract SVG and convert to embeddings and grab words)
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

#### Contracts

- setFactory in Genes is not good... maybe use an initializer? Owner can set factory whenever. Need to initialize initial genes, but maybe there is a different pattern we can use?
- start optimizing for gas (payouts need most work)
- measure gas (see how this is done in aminalsV3)
- More genes test coverage (renderer, auction, registry, NFT contract, payouts to owners)
- Clean up and document scripts
- Some events might be redundent (squeak vs EnergyChange / LoveChange)
- Investigate whether there should be some limits on gene proposals during auctions
- When initializing aminal genes during deployment, gene #0 has issues

#### Indexer

- Switch to ponder?
- Have to reload often, can we make the indexer faster?

#### Do last

- Rename "Visuals" to "GeneIds", maybe explore using an array that could be variable length? Do we need backId, armsId, etc. if we are just rendering a stack?
- More docs
- Landing page about the Aminals project

### User Testing feedback

General:

- [ ] Tooltips and more info
- [ ] Love should be a percentage?
- [ ] Make clear costs in love and energy everywhere

Aminal detail page:

- [x] Breeding modal should only show loved Aminals
- [x] Navigate to new auction after finding partner

Profile:

- [x] Classic profile stuff (ENS, picture, copy address)
- [ ] Show favorite Aminal on profile?

Genes:

- [ ] Zoom on traits (for tiny things like mouth)
- [ ] Traits / genes should have UI to transfer?

Breeding:

- [x] SVG creator should just be text / preview
- [ ] make nice SVG coder with linting
- [ ] "Vote on Genes" -> Submit
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

Indexer Bugs:

- [x] Many bugs on multiple votes with indexer
- [x] Index indexes multiple votes for changing votes. If someone already voted, don't increment votes.
- [ ] Verify bugs are fixed
- [ ] Total earnings for OG genes are not updating it seems
- [ ] Regression, Aminals with gene seems broken

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


### Chat Feature

I want to add the ability to chat with the Aminals. On @frontend/pages/aminals/[id].tsx, add a chat button that launches a modal (or takes the user to a new chat page (which might be better as that link could reference that particular chat)).

We'll use Claude Opus as the chatbot, write a simple system promt (we will refine this later). The system promt template should feed in how much love the Aminal has for a user. It should also take the image of the aminal and use that to construct personality traits for the aminal.

Make sure the UX is elegant.


It would be nice if the chats could be persistent. Does the claude API support chat sessions? If so, maybe consider making /chat a sub folder of frontend/pages/aminals/? So we might have a url like https:/aminals.life/aminals/0xf9555236DEA7940a21c0f271FA2b004af06B0Fcb/chat/{chatId}? Is that possible?

---

Let's make a few more improvements:
- Button styling on @frontend/pages/aminals/[id].tsx could be improved, it's too close to the feed button and doesn't have rounded corners. Make the UX better and consistent here.
- Generate personality when starting a new chat. Store the personality so it doesn't need to be generated again.
- On @frontend/pages/aminals/[id]/chat/[chatId].tsx show the generated personality
