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
