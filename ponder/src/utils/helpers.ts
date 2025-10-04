/**
 * Helper Functions for Ponder Indexer
 *
 * Utility functions for ID generation, formatting, and common operations
 */

import type { Address, Hex } from "viem";
import { genesAddress } from "../../../frontend/src/contracts/generated";

/**
 * Generate a composite ID for entities
 * Ensures consistent ID format across the indexer
 */
export function makeId(...parts: (string | bigint | number)[]): Hex {
  return `0x${parts.map((p) => p.toString().toLowerCase()).join("-")}` as Hex;
}

/**
 * Generate gene NFT ID from token ID
 * Format: genesContractAddress-tokenId
 *
 * Note: Genes contract address is imported from generated contracts
 */
export function makeGeneNFTId(tokenId: bigint): Hex {
  return `0x${genesAddress
    .toLowerCase()
    .replace("0x", "")}-${tokenId.toString()}` as Hex;
}

/**
 * Generate auction ID from auction number
 * Format: auction-{auctionId}
 */
export function makeAuctionId(auctionId: bigint): Hex {
  return `0x${"auction"}-${auctionId.toString()}` as Hex;
}

/**
 * Generate proposal ID
 * Format: auction-{auctionId}-{traitType}-{geneId}
 */
export function makeProposalId(
  auctionId: bigint,
  traitType: number,
  geneId: bigint
): Hex {
  return makeId("auction", auctionId, traitType, geneId);
}

/**
 * Generate relationship ID (user-aminal love relationship)
 * Format: userId-aminalId
 */
export function makeRelationshipId(userId: Address, aminalId: Address): Hex {
  return `0x${userId.toLowerCase().replace("0x", "")}-${aminalId
    .toLowerCase()
    .replace("0x", "")}` as Hex;
}

/**
 * Generate event ID from transaction hash and log index
 * Format: txHash-logIndex
 */
export function makeEventId(txHash: Hex, logIndex: number | bigint): Hex {
  return `0x${txHash.replace("0x", "")}-${logIndex.toString()}` as Hex;
}

/**
 * Ensure address is lowercase and typed as Hex
 */
export function normalizeAddress(address: Address): Hex {
  return address.toLowerCase() as Hex;
}

/**
 * Convert array of bigints to proper format for storage
 */
export function normalizeTraitArray(traits: readonly bigint[]): bigint[] {
  return Array.from(traits);
}
