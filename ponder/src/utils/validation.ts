/**
 * Validation Utilities
 *
 * Type guards and validation functions for event data
 */

/**
 * Type for slot index (0-9 for 10 gene slots)
 */
export type SlotIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Validate slot index is within valid range (0-9)
 */
export function isValidSlotIndex(slotIndex: number): slotIndex is SlotIndex {
  return slotIndex >= 0 && slotIndex <= 9;
}

/**
 * Validate gene array has 1-10 elements
 */
export function isValidGeneArray(genes: readonly bigint[]): boolean {
  return genes.length >= 1 && genes.length <= 10;
}

/**
 * Validate gene array is exactly 10 elements (contract format)
 */
export function isValidGeneArrayFixed(genes: readonly bigint[]): boolean {
  return genes.length === 10;
}

/**
 * Validate parent gene IDs cache has exactly 20 elements
 * (up to 10 genes from parent1 + up to 10 genes from parent2)
 */
export function isValidParentGeneIds(parentGeneIds: bigint[]): boolean {
  return parentGeneIds.length === 20;
}

/**
 * Count actual genes in a gene array (non-zero values)
 */
export function countGenes(genes: readonly bigint[]): number {
  return genes.filter(g => g !== 0n).length;
}

/**
 * Assert gene array is valid fixed format, throw if not
 */
export function assertValidGeneArray(
  genes: readonly bigint[],
  context: string
): void {
  if (!isValidGeneArrayFixed(genes)) {
    throw new Error(
      `${context}: Invalid gene array length. Expected 10, got ${genes.length}`
    );
  }

  const geneCount = countGenes(genes);
  if (geneCount < 1 || geneCount > 10) {
    throw new Error(
      `${context}: Invalid gene count. Must have 1-10 non-zero genes, got ${geneCount}`
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
      `${context}: Invalid parentGeneIds length. Expected 20, got ${parentGeneIds.length}`
    );
  }
}

// Legacy functions for backwards compatibility (deprecated)
export type TraitType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export function isValidTraitType(traitType: number): traitType is TraitType {
  return traitType >= 0 && traitType <= 7;
}
export function isValidTraitArray(traits: readonly bigint[]): boolean {
  return traits.length === 8;
}
export function assertValidTraitArray(
  traits: readonly bigint[],
  context: string
): void {
  if (!isValidTraitArray(traits)) {
    throw new Error(
      `${context}: Invalid trait array length. Expected 8, got ${traits.length}`
    );
  }
}
