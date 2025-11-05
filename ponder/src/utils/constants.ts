/**
 * Gene Slot Constants
 *
 * Aminals now use a flexible 1-10 gene system without fixed categories.
 * Genes can be placed in any slot (0-9) with per-Aminal placement metadata.
 */

export const MAX_GENES = 10;
export const MIN_GENES = 1;

// Slot indices for validation
export const SLOT_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

// Type helper for slot indices
export type SlotIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Legacy constants kept for backwards compatibility (deprecated)
/** @deprecated Categories no longer exist in the new system */
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
