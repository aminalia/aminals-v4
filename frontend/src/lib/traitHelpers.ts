/**
 * Trait Helpers for Ponder Schema Migration
 *
 * The Ponder schema uses a traits array instead of individual trait fields.
 * Order: [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
 * Indices: [0, 1, 2, 3, 4, 5, 6, 7]
 */

export const TRAIT_INDICES = {
  BACK: 0,
  ARM: 1,
  TAIL: 2,
  EARS: 3,
  BODY: 4,
  FACE: 5,
  MOUTH: 6,
  MISC: 7,
} as const;

export const TRAIT_NAMES = [
  'BACK',
  'ARM',
  'TAIL',
  'EARS',
  'BODY',
  'FACE',
  'MOUTH',
  'MISC',
] as const;

export type TraitName = (typeof TRAIT_NAMES)[number];

/**
 * Interface for Aminal with traits array (from Ponder)
 */
export interface AminalWithTraitsArray {
  traits: readonly bigint[];
  [key: string]: any;
}

/**
 * Interface for Aminal with individual trait fields (legacy format)
 */
export interface AminalWithTraitFields {
  backId: string;
  armId: string;
  tailId: string;
  earsId: string;
  bodyId: string;
  faceId: string;
  mouthId: string;
  miscId: string;
  [key: string]: any;
}

/**
 * Convert traits array to individual trait fields for backward compatibility
 */
export function traitsArrayToFields(
  aminal: AminalWithTraitsArray
): AminalWithTraitFields {
  const traits = aminal.traits || [];

  return {
    ...aminal,
    backId: traits[TRAIT_INDICES.BACK]?.toString() || '0',
    armId: traits[TRAIT_INDICES.ARM]?.toString() || '0',
    tailId: traits[TRAIT_INDICES.TAIL]?.toString() || '0',
    earsId: traits[TRAIT_INDICES.EARS]?.toString() || '0',
    bodyId: traits[TRAIT_INDICES.BODY]?.toString() || '0',
    faceId: traits[TRAIT_INDICES.FACE]?.toString() || '0',
    mouthId: traits[TRAIT_INDICES.MOUTH]?.toString() || '0',
    miscId: traits[TRAIT_INDICES.MISC]?.toString() || '0',
  };
}

/**
 * Convert array of Aminals with traits arrays to individual trait fields
 */
export function convertAminalsTraits<T extends AminalWithTraitsArray>(
  aminals: T[]
): (T & AminalWithTraitFields)[] {
  return aminals.map(traitsArrayToFields) as (T & AminalWithTraitFields)[];
}

/**
 * Get a specific trait from an Aminal by name
 */
export function getTrait(
  aminal: AminalWithTraitsArray,
  traitName: TraitName
): string {
  const index = TRAIT_INDICES[traitName];
  return aminal.traits[index]?.toString() || '0';
}

/**
 * Get all traits as an object with named properties
 */
export function getTraitsObject(
  aminal: AminalWithTraitsArray
): Record<TraitName, string> {
  return {
    BACK: getTrait(aminal, 'BACK'),
    ARM: getTrait(aminal, 'ARM'),
    TAIL: getTrait(aminal, 'TAIL'),
    EARS: getTrait(aminal, 'EARS'),
    BODY: getTrait(aminal, 'BODY'),
    FACE: getTrait(aminal, 'FACE'),
    MOUTH: getTrait(aminal, 'MOUTH'),
    MISC: getTrait(aminal, 'MISC'),
  };
}

/**
 * Convert trait name to array index
 */
export function traitNameToIndex(traitName: TraitName): number {
  return TRAIT_INDICES[traitName];
}

/**
 * Convert trait index to name
 */
export function traitIndexToName(index: number): TraitName {
  return TRAIT_NAMES[index];
}
