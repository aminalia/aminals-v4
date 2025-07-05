# Plan

### TODO:

UI / Graph:
- Feeding an Aminal is successful but doesn't update the graph or UI
- Only show end auction button if auction is endable
- Add custom genes to a breeding aminal
- Update values after a successful tx and make sure toasts are working
- Show zero traits on breeding?
- Trait filtering (most reproduced)

Contracts:
- GeneNFTFactory -> GeneRegistry
- Move smart contract interfaces to a dedicated folder
- setFactory in genesNft is not good... maybe use an initializer? Owner can set factory whenever
- User JSON files for storing variables in script
- Sync env variables between graph, frontend, and contracts
