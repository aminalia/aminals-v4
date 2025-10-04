/**
 * Trait Order Constants
 *
 * ⚠️ CRITICAL: These constants define the canonical trait order
 * This order MUST match the Solidity contract's trait slot enumeration
 * NEVER change these values!
 */

export const TRAIT_BACK = 0;
export const TRAIT_ARM = 1;
export const TRAIT_TAIL = 2;
export const TRAIT_EARS = 3;
export const TRAIT_BODY = 4;
export const TRAIT_FACE = 5;
export const TRAIT_MOUTH = 6;
export const TRAIT_MISC = 7;

// Array for validation and display
export const TRAIT_NAMES = [
  "BACK",
  "ARM",
  "TAIL",
  "EARS",
  "BODY",
  "FACE",
  "MOUTH",
  "MISC",
] as const;

// Type helper for trait indices
export type TraitType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Contract addresses (Sepolia)
export const CONTRACTS = {
  AminalFactory: "0xfd69b3285974f11ac0e8490d86a2dc4ee7d2ce9c",
  GeneAuction: "0x96bd719eb8d32a1210e4e2eb77b5ce6ff157325d",
  Genes: "0xb70c1d4ab9e90eb73b7f8972bd3eeb139201cd43",
  GeneRegistry: "0x2706cf8e08f6cbfd8a0fc32637d0289ab6ed2ca4",
} as const;

// Genes contract address for ID generation
export const GENES_CONTRACT_ADDRESS = CONTRACTS.Genes.toLowerCase();
