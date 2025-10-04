/**
 * Validation Utilities
 *
 * Type guards and validation functions for event data
 */

import { TRAIT_NAMES } from "./constants";
import type { TraitType } from "./constants";

/**
 * Validate trait type is within valid range (0-7)
 */
export function isValidTraitType(traitType: number): traitType is TraitType {
  return traitType >= 0 && traitType <= 7;
}

/**
 * Validate trait array has exactly 8 elements
 */
export function isValidTraitArray(traits: readonly bigint[]): boolean {
  return traits.length === 8;
}

/**
 * Validate parent gene IDs cache has exactly 16 elements
 * (8 traits from parent1 + 8 traits from parent2)
 */
export function isValidParentGeneIds(parentGeneIds: bigint[]): boolean {
  return parentGeneIds.length === 16;
}

/**
 * Get trait name from trait type index
 */
export function getTraitName(traitType: number): string {
  if (!isValidTraitType(traitType)) {
    throw new Error(`Invalid trait type: ${traitType}`);
  }
  return TRAIT_NAMES[traitType];
}

/**
 * Assert trait array is valid, throw if not
 */
export function assertValidTraitArray(
  traits: readonly bigint[],
  context: string
): asserts traits is readonly [
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint
] {
  if (!isValidTraitArray(traits)) {
    throw new Error(
      `${context}: Invalid trait array length. Expected 8, got ${traits.length}`
    );
  }
}

/**
 * Assert parent gene IDs array is valid, throw if not
 */
export function assertValidParentGeneIds(
  parentGeneIds: bigint[],
  context: string
): void {
  if (!isValidParentGeneIds(parentGeneIds)) {
    throw new Error(
      `${context}: Invalid parentGeneIds length. Expected 16, got ${parentGeneIds.length}`
    );
  }
}
