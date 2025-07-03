# Aminals Project: Remaining Implementation Tasks

## Overview

The team has made three major architectural decisions to enhance the functionality and autonomy of Aminals (blockchain-based NFT entities). These changes will simplify the codebase while enabling more powerful features.

## Core Implementation Tasks

### 1. Migration: aminals.sol → aminalsfactory.sol

Problem: Currently, all Aminals exist as instances within a single NFT contract, preventing them from:

- Having their own contract addresses
- Holding funds independently
- Calling other contracts
- Interacting autonomously with the broader ecosystem

Solution: Deploy each Aminal as a one-of-one NFT from a factory contract

- Each Aminal gets its own independent contract address
- Enables self-sovereign interactions with other smart contracts
- Trade-off: May not aggregate properly in marketplace collection views (OpenSea, etc.)
  - Acceptable since Aminals aren't tradeable
  - Can still aggregate on the Aminals website

Note: Team considered token-bound account standard but rejected due to limited adoption

### 2. Skills System Refactor: Global Call-Based Architecture

Current State: Skills must be taught to specific Aminals before use

New Architecture:

- Skills become globally accessible - any Aminal can call any skill
- Skills are small contracts registered in a skill registry
- Security model:
  - Skills can only be called by Aminal factory descendants
  - Skills declare a cost (in squeaks/energy)
  - Skills can only affect:
    - The squeak count (via return value)
    - Added properties stored in a separate mapping
  - Flow: Aminal → Skill → Returns cost → Aminal deducts cost
- Prevents malicious squeak deduction since Aminals initiate and control the transaction

### 3. Trait Registry → Gene NFTs

Change: Replace the trait registry with permissionless Gene NFTs

Implementation:

- Anyone can create Gene NFTs from a factory
- Gene NFTs represent traits for Aminals
- Revenue model:
  - Auction settlement funds go directly to Gene NFT owner
  - Uses similar mechanics to Nouns auction (bidder refunds previous bidder)
  - Settlement transfers funds to current Gene NFT owner
- Simple registry mapping to verify Gene NFTs came from factory
- No placement restrictions - community can vote against poorly designed traits

## Technical Implications

- Substantial codebase changes required (all NFT ID references → contract addresses)
- Simplification opportunity: Remove many verification checks
- Not a complete rewrite (v3) - more of a refactor that deletes unnecessary code
- Rendering engine remains untouched (most solid component)
- Auction logic needs review due to architectural changes

## Summary

These changes transform Aminals from passive NFTs into autonomous blockchain entities with their own addresses, capable of holding assets and interacting with the broader ecosystem through a permissionless skill system, while maintaining community-driven trait creation through Gene NFTs.
