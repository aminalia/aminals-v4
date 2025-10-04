/**
 * Trait Utilities
 *
 * Helper utilities for working with Aminal traits as arrays.
 * This provides type-safe access to the traits array.
 */

/**
 * Trait index enum for type-safe array access
 * Matches the order in the Ponder schema traits array
 */
export enum TraitIndex {
  BACK = 0,
  ARM = 1,
  TAIL = 2,
  EARS = 3,
  BODY = 4,
  FACE = 5,
  MOUTH = 6,
  MISC = 7,
}

/**
 * Get a specific trait by type from an Aminal
 */
export const getTrait = (
  traits: readonly bigint[] | bigint[] | undefined,
  traitType: TraitIndex
): bigint => {
  if (!traits || traits.length === 0) {
    return 0n;
  }
  return traits[traitType] || 0n;
};

/**
 * Backward compatibility helpers
 * These match the old GraphQL field names for easier migration
 */
export const getBackId = (traits: readonly bigint[] | bigint[] | undefined): bigint =>
  getTrait(traits, TraitIndex.BACK);

export const getArmId = (traits: readonly bigint[] | bigint[] | undefined): bigint =>
  getTrait(traits, TraitIndex.ARM);

export const getTailId = (traits: readonly bigint[] | bigint[] | undefined): bigint =>
  getTrait(traits, TraitIndex.TAIL);

export const getEarsId = (traits: readonly bigint[] | bigint[] | undefined): bigint =>
  getTrait(traits, TraitIndex.EARS);

export const getBodyId = (traits: readonly bigint[] | bigint[] | undefined): bigint =>
  getTrait(traits, TraitIndex.BODY);

export const getFaceId = (traits: readonly bigint[] | bigint[] | undefined): bigint =>
  getTrait(traits, TraitIndex.FACE);

export const getMouthId = (traits: readonly bigint[] | bigint[] | undefined): bigint =>
  getTrait(traits, TraitIndex.MOUTH);

export const getMiscId = (traits: readonly bigint[] | bigint[] | undefined): bigint =>
  getTrait(traits, TraitIndex.MISC);
