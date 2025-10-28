# Gene NFT System

The Gene NFT system allows permissionless creation of visual traits for Aminals. Anyone can create Gene NFTs which represent individual trait components (background, arms, tail, ears, body, face, mouth, misc).

## Overview

- **Genes.sol**: ERC721 contract for Gene NFTs
- **GeneRegistry.sol**: Factory contract for creating and registering Gene NFTs
- **GeneAuction.sol**: Auction system for determining which genes are used in new Aminals

## Creating Genes

### Basic Gene Creation

The simplest way to create a gene is using `createGene()`:

```solidity
function createGene(string calldata svg, VisualsCat category) external returns (uint256 geneId)
```

**Example:**
```solidity
uint256 geneId = geneRegistry.createGene(
    '<rect width="1000" height="1000" fill="#87CEEB"/>',
    IAminalStructs.VisualsCat.BACK
);
```

This mints the Gene NFT to `msg.sender` and marks them as the creator.

### Creating Genes for Another Account

You can also create genes on behalf of another account using `createGeneFor()`:

```solidity
function createGeneFor(address recipient, string calldata svg, VisualsCat category) 
    public 
    returns (uint256 geneId)
```

**Example:**
```solidity
address treasury = 0x1234...;
uint256 geneId = geneRegistry.createGeneFor(
    treasury,
    '<circle cx="500" cy="400" r="100" fill="#FFB6C1"/>',
    IAminalStructs.VisualsCat.FACE
);
```

This mints the Gene NFT to the `recipient` address and marks them as the creator. The `recipient` will:
- Own the Gene NFT
- Be recorded as the creator in the registry
- Receive any revenue from genes used in Aminal breeding auctions

### Use Cases for `createGeneFor()`

1. **Minting Scripts**: Batch minting initial genes to a specific account
2. **Treasury Management**: Creating genes for a multisig or DAO treasury
3. **Airdrops**: Distributing genes to community members
4. **Delegation**: Allowing one account to mint on behalf of another

## Gene Categories

There are 8 visual categories for traits:

- `BACK`: Background layer
- `ARM`: Arms/limbs
- `TAIL`: Tail component
- `EARS`: Ears component
- `BODY`: Body/torso
- `FACE`: Face features
- `MOUTH`: Mouth/expression
- `MISC`: Miscellaneous accessories

## SVG Requirements

- Must be non-empty
- Maximum length: 50,000 bytes (50KB)
- Must contain at least one opening tag (e.g., `<svg`, `<g`, `<path`)
- Should be valid SVG syntax

## Example Minting Script

See `script/genes/ExampleGenesMinterWithRecipient.sol` for a complete example of using `createGeneFor()` in a deployment script.

```solidity
// Mint 3 genes to a treasury address
function mintGenesToTreasury(GeneRegistry registry, address treasury) external {
    registry.createGeneFor(
        treasury,
        '<rect width="1000" height="1000" fill="#F0F8FF"/>',
        VisualsCat.BACK
    );
    
    registry.createGeneFor(
        treasury,
        '<circle cx="500" cy="450" r="80" fill="#FFDAB9"/>',
        VisualsCat.FACE
    );
    
    registry.createGeneFor(
        treasury,
        '<path d="M480,500 Q500,520 520,500" stroke="#000" fill="none"/>',
        VisualsCat.MOUTH
    );
}
```

## Gene Ownership and Revenue

When a gene is created:
1. The Gene NFT is minted to the specified recipient
2. The recipient is recorded as the "creator" in the registry
3. When the gene wins an auction and is used in a new Aminal, the NFT owner at settlement time receives a share of the breeding revenue

This creates an economic incentive for gene creators and allows for speculation on gene popularity through the secondary NFT market.

## Registry Functions

### Query Gene Information

```solidity
// Get all info about a gene
(address creator, VisualsCat category, string memory svg) = geneRegistry.getGeneInfo(geneId);

// Check if gene is from this factory
bool isValid = geneRegistry.isValidGene(geneId);

// Get genes by creator
uint256[] memory geneIds = geneRegistry.getGenesByCreator(creatorAddress);

// Get genes by category
uint256[] memory geneIds = geneRegistry.getGenesByCategory(VisualsCat.FACE);
```

## Security Considerations

- Only genes created through GeneRegistry are considered valid
- SVG content is stored on-chain and must pass basic validation
- Gene ownership is transferable through standard ERC721 mechanics
- Revenue sharing occurs at auction settlement time based on current NFT ownership