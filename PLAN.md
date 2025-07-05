# Aminals Graph Migration Plan

## Overview
This document outlines the strategy for upgrading the Aminals subgraph to support the new factory-based architecture where each Aminal is its own contract rather than a token in a collection.

## Key Architecture Changes

### Old Architecture (Collection-Based)
- Single `Aminals` contract with multiple token IDs
- Skills were individual NFTs taught to specific Aminals
- Centralized trait registry
- Aminals were ERC721 tokens with sequential IDs

### New Architecture (Factory-Based)
- `AminalFactory` contract that creates individual Aminal contracts
- Each Aminal is its own contract with unique address
- Skills are globally accessible and callable by any Aminal
- Gene NFT system for decentralized trait management
- Aminals are soulbound (non-transferable) NFTs

## Required Changes

### 1. Schema Updates (`schema.graphql`)

#### New Entities Needed:
- **AminalFactory**: Track factory contract state
- **GeneNFT**: Track gene NFT creation and ownership
- **GeneAuction**: Track breeding auctions
- **SkillCall**: Track skill usage events
- **AminalContract**: Individual Aminal contract entities

#### Updated Entities:
- **Aminal**: 
  - Change ID from `BigInt` to `Bytes` (contract address)
  - Add `contractAddress` field
  - Remove `aminalId` field (no longer sequential)
  - Add `aminalIndex` field (factory index)
  - Add `momAddress` and `dadAddress` fields
  - Update visual fields to use Gene NFT IDs
  - Add `loveVRGDA` reference

- **Skill**: 
  - Remove individual skill ownership
  - Track skill calls instead of skill additions
  - Add global skill registry

- **Breeding**:
  - Update to use Gene Auction system
  - Track auction creation and settlement
  - Link to Gene NFT winners

### 2. Event Handler Updates

#### New Events to Handle:
- `AminalFactory.AminalSpawned`
- `AminalFactory.BreedAminal`
- `Aminal.FeedAminal` (now per-contract)
- `Aminal.Squeak` (now per-contract)
- `Aminal.SkillCall` (now per-contract)
- `GeneAuction.AuctionCreated`
- `GeneAuction.AuctionSettled`
- `GenesNFT.Transfer`

#### Updated Events:
- Remove old collection-based events
- Update breeding events to use addresses instead of IDs
- Update feeding/squeak events to use contract addresses

### 3. Mapping Function Updates

#### Factory Mappings:
- `handleAminalSpawned`: Create new Aminal entity with contract address
- `handleBreedAminal`: Track breeding consent and auction creation

#### Individual Aminal Mappings:
- `handleFeedAminal`: Update per-contract feeding events
- `handleSqueak`: Update per-contract squeak events
- `handleSkillCall`: Track skill usage across all Aminals

#### Gene System Mappings:
- `handleGeneNFTCreated`: Track new gene NFT creation
- `handleAuctionCreated`: Track breeding auctions
- `handleAuctionSettled`: Update Aminal with winning genes

### 4. Subgraph Manifest Updates

#### Data Sources:
- **AminalFactory**: Main factory contract
- **Template for Aminals**: Dynamic contract creation
- **GeneAuction**: Breeding auction system
- **GenesNFT**: Gene NFT registry
- **Skills**: Global skill contracts

#### Templates:
- Use contract templates to dynamically index new Aminal contracts
- Each spawned Aminal creates a new data source instance

### 5. ABI Updates
- Update ABIs to match new contract interfaces
- Add factory ABI
- Add individual Aminal ABI
- Add Gene system ABIs

## Implementation Steps

### Phase 1: Schema Migration
1. ✅ Update schema.graphql with new entity definitions
2. ✅ Ensure backward compatibility where possible
3. ✅ Add new fields for factory-based architecture

### Phase 2: Factory Integration
1. ✅ Add AminalFactory data source to subgraph.yaml
2. ✅ Implement factory event handlers
3. ✅ Set up Aminal contract templates

### Phase 3: Individual Aminal Tracking
1. ✅ Update Aminal entity creation logic
2. ✅ Implement per-contract event handlers
3. ✅ Update relationship tracking

### Phase 4: Gene System Integration
1. ✅ Add Gene NFT tracking
2. ✅ Implement auction system indexing
3. ✅ Update breeding mechanics

### Phase 5: Skills System Update
1. ✅ Remove individual skill ownership
2. ✅ Implement global skill call tracking
3. ✅ Update skill-related queries

### Phase 6: Testing & Deployment
1. ✅ Test with local development environment
2. ✅ Validate data consistency
3. ✅ Deploy to testnet
4. ✅ Monitor performance and accuracy

## Data Migration Strategy

### Backwards Compatibility
- Maintain existing entity IDs where possible
- Use migration mappings for ID changes
- Preserve historical data with legacy flags

### Performance Considerations
- Use efficient indexing for contract addresses
- Optimize queries for the new structure
- Consider pagination for large datasets

## Testing Strategy

### Unit Tests
- Test each event handler in isolation
- Verify entity creation and updates
- Test relationship mappings

### Integration Tests
- Test full breeding flow
- Test skill calling across contracts
- Test gene auction settlement

### Performance Tests
- Test with large numbers of Aminals
- Verify query performance
- Test template instantiation

## Deployment Considerations

### Contract Addresses
- Update all hardcoded addresses
- Use network-specific configurations
- Implement proper startBlock settings

### Monitoring
- Set up alerts for failed indexing
- Monitor sync performance
- Track entity count growth

## Risk Mitigation

### Data Loss Prevention
- Backup existing subgraph data
- Implement rollback procedures
- Use staging environment for testing

### Performance Risks
- Monitor indexing speed
- Set appropriate rate limits
- Optimize query patterns

This plan ensures a smooth transition to the new architecture while maintaining data integrity and query performance.