# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aminals is a decentralized digital pet platform built on Ethereum. The system combines NFT ownership with a complex interaction model based on "love" and "energy" metrics, skills system, and community governance through proposals.

## Key Architecture

### Core Components
- **Aminals.sol**: Main contract orchestrating all functionality (ERC721S, AminalsDescriptor, governance)
- **Skills System**: Extensible plugin architecture for Aminal behaviors (Move2D, MoveTwice examples)
- **Proposals System**: Dual voting mechanism (democratic + love-based) for platform governance
- **VisualsAuction**: Community-driven breeding and trait creation system
- **GenesNFT**: Transferable rewards for visual trait creators

### Data Flow
1. Users build relationships with Aminals through `feed()` function (spending ETH for love)
2. Love provides governance power and reduced costs for actions
3. Skills consume energy through "squeak" mechanism
4. Community votes on new skills, visual traits, and platform changes
5. Breeding triggers visual trait auctions for offspring

## Development Commands

### Smart Contracts (Foundry)
```bash
# Run tests
forge test

# Build contracts
forge build

# Run specific test
forge test --match-test testFunctionName

# Run tests with gas reporting
forge test --gas-report

# Deploy scripts
forge script script/DeploySkill.s.sol --rpc-url $RPC_URL --broadcast
```

### Frontend (Next.js)
```bash
# Development
cd frontend
npm install
npm run graphclient:build
npm run dev

# Build and lint
npm run build
npm run lint
npm run typecheck
npm run prettier:fix

# Generate contracts
npm run wagmi:generate
```

### Graph Protocol Subgraph
```bash
cd graph
npm run codegen
npm run build
npm run test

# Deploy to The Graph
npm run deploy
```

## Key Development Patterns

### Contract Development
- Skills implement `ISkill` interface with `useSkill()` function
- All user interactions flow through main Aminals contract
- Love-based pricing: costs decrease based on user's relationship with specific Aminals
- Energy system prevents spam while maintaining engagement incentives

### Frontend Development
- Uses wagmi for contract interactions
- GraphQL queries for subgraph data
- RainbowKit for wallet connections
- Components follow established patterns in `src/components/`

### Testing
- Foundry tests in `test/` directory
- Use `BaseTest.sol` for common test utilities
- Tests cover both individual contracts and integration scenarios

## Important Notes

### Security Considerations
- Aminals are soulbound NFTs (non-transferable)
- Skills system requires governance approval for new additions
- Love-based economics creates sticky relationships and governance participation
- Energy system prevents unlimited skill usage

### Contract Interactions
- Skills can call other skills through `callSkillInternal()`
- Visual traits are community-created through proposals
- Breeding requires sufficient love and energy from both parent Aminals
- All governance uses dual voting: democratic (1 aminal = 1 vote) + love-based weighting