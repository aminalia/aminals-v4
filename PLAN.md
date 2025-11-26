# Plan

# Bugs
- Fix mobile responsive issues

- Fix flow... new auction, create first proposal
- Activity page on profile should show more info


Let's work on some indexer improvements:
- Make sure for genes we are indexing gene name, description, and categories
- Make sure we're also indexing how much a particular gene has earned
- Index these things on create gene

# Aminal designer

- Draft system (Poli easily deleted his hard work)

## UI

- Show on Aminal detail page that "Aminals cannot be owned"
- Show how much money genes have made on the card

### Chat Feature Improvements

- Better prompts for more creative outputs
- Switch to qwen
- API rate limiting
- Chat skill?

### User Testing feedback

General:

- [ ] Love should be a percentage?

Profile:

- [x] Classic profile stuff (ENS, picture, copy address)
- [ ] Show favorite Aminal on profile?

Genes:

- [ ] Zoom on traits (for tiny things like mouth)
- [ ] Traits / genes should have UI to transfer?
- [ ] View on Rarible

Breeding:

- [ ] "Time Left" -> "Incubation Period"
- [ ] Button to breed aminals on Breeding page?
- [ ] Communicate the amount of energy / love to breed (MIN_LOVE_REQUIRED / MIN_ENERGY_REQUIRED)

Desgin challenges:

- [ ] Make it clearer that you can't own an Aminal
- [x] Be clearer that you can own genes (they have "owners" now)

Contract Changes:

- [ ] Randomize on StartAuction so that the preview shows what the Aminal will be if no one votes?
- [x] Propose gene is expensive (investigate)
- [x] More GeneAuction gas optimizations.
- [ ] Remember aminal state in aminal builder

# Contracts

- Do we want "This NFT represents a digital pet. This NFT cannot be transfered." as the Aminal description?
- Name / description is not actually being used when creating a new gene, not being stored in contracts

# New Features Ideas

- Aminal Race
- Bribe system
- Prediction Market
- Aminals DAO (a DAO of Aminals based on Loveocracy)
- Poo skill to create a new NFT

# Open Design Questions

- What should proposing a gene cost in terms of love? Should it scale somehow in relation to the number of proposals?
- If your Aminal design proposal is chosen, do you get incentives?
