# Trait Array Order Specification

## ⚠️ CRITICAL: Trait Order Convention

The order of traits in the `traits` array is **CRITICAL** and must be maintained consistently across the entire codebase. This order matches the Solidity contract's trait slot enumeration.

## Canonical Trait Order

```typescript
// Index | Trait Name | Description
// ------|------------|-------------
//   0   | BACK       | Background/back layer trait
//   1   | ARM        | Arms trait
//   2   | TAIL       | Tail trait
//   3   | EARS       | Ears trait
//   4   | BODY       | Body trait
//   5   | FACE       | Face trait
//   6   | MOUTH      | Mouth trait
//   7   | MISC       | Miscellaneous/accessory trait
```

## Constants Definition

**REQUIRED**: Define these constants in all files that access trait arrays:

```typescript
// src/utils/constants.ts
export const TRAIT_BACK = 0;
export const TRAIT_ARM = 1;
export const TRAIT_TAIL = 2;
export const TRAIT_EARS = 3;
export const TRAIT_BODY = 4;
export const TRAIT_FACE = 5;
export const TRAIT_MOUTH = 6;
export const TRAIT_MISC = 7;

// Array for validation
export const TRAIT_NAMES = [
  "BACK",
  "ARM",
  "TAIL",
  "EARS",
  "BODY",
  "FACE",
  "MOUTH",
  "MISC"
] as const;

// Type helper
export type TraitType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
```

## Usage Examples

### ✅ CORRECT Usage

```typescript
import { TRAIT_BACK, TRAIT_ARM, TRAIT_TAIL, TRAIT_EARS, TRAIT_BODY, TRAIT_FACE, TRAIT_MOUTH, TRAIT_MISC } from "./utils/constants";

// Creating traits array from Solidity event
const traits = [
  event.params.geneIds[0], // BACK
  event.params.geneIds[1], // ARM
  event.params.geneIds[2], // TAIL
  event.params.geneIds[3], // EARS
  event.params.geneIds[4], // BODY
  event.params.geneIds[5], // FACE
  event.params.geneIds[6], // MOUTH
  event.params.geneIds[7], // MISC
];

// Accessing traits
const backGeneId = aminal.traits[TRAIT_BACK];
const faceGeneId = aminal.traits[TRAIT_FACE];

// Iterating with context
for (let i = 0; i < 8; i++) {
  console.log(`Trait ${TRAIT_NAMES[i]}: ${aminal.traits[i]}`);
}
```

### ❌ INCORRECT Usage

```typescript
// DON'T use magic numbers
const backGeneId = aminal.traits[0]; // What is 0? Unclear!

// DON'T use wrong order
const traits = [
  event.params.geneIds[1], // WRONG! Should be [0]
  event.params.geneIds[0], // WRONG!
];

// DON'T hardcode without constants
if (traitType === 5) { // What is 5?
  // ...
}
```

## Solidity Contract Reference

The order matches the Solidity enum in the contracts:

```solidity
// From contracts/src/nft/IGenes.sol or similar
enum TraitCategory {
    BACK,    // 0
    ARM,     // 1
    TAIL,    // 2
    EARS,    // 3
    BODY,    // 4
    FACE,    // 5
    MOUTH,   // 6
    MISC     // 7
}
```

## Event Data Structure

### AminalSpawned Event

```solidity
event AminalSpawned(
    address indexed child,
    address indexed parentOne,
    address indexed parentTwo,
    uint256 auctionId,
    uint256[8] geneIds  // [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
);
```

### VotingCreated Event

When caching `parentGeneIds` in GeneAuction:

```typescript
// Parent 1 traits (indices 0-7)
auction.parentGeneIds = [
  aminalOne.traits[0], // Parent 1 BACK
  aminalOne.traits[1], // Parent 1 ARM
  aminalOne.traits[2], // Parent 1 TAIL
  aminalOne.traits[3], // Parent 1 EARS
  aminalOne.traits[4], // Parent 1 BODY
  aminalOne.traits[5], // Parent 1 FACE
  aminalOne.traits[6], // Parent 1 MOUTH
  aminalOne.traits[7], // Parent 1 MISC
  // Parent 2 traits (indices 8-15)
  aminalTwo.traits[0], // Parent 2 BACK
  aminalTwo.traits[1], // Parent 2 ARM
  aminalTwo.traits[2], // Parent 2 TAIL
  aminalTwo.traits[3], // Parent 2 EARS
  aminalTwo.traits[4], // Parent 2 BODY
  aminalTwo.traits[5], // Parent 2 FACE
  aminalTwo.traits[6], // Parent 2 MOUTH
  aminalTwo.traits[7], // Parent 2 MISC
];
```

### BulkVoteCast Event

```solidity
event BulkVoteCast(
    uint256 indexed auctionId,
    address indexed voter,
    uint256[8] geneIds,  // [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
    uint256 loveAmount
);
```

When processing bulk votes, iterate in order:

```typescript
for (let i = 0; i < 8; i++) {
  const geneId = event.params.geneIds[i];
  const traitType = i; // 0=BACK, 1=ARM, ..., 7=MISC

  // Check if this is a parent trait (optimization)
  const parent1TraitId = auction.parentGeneIds[i];     // Parent 1's trait at slot i
  const parent2TraitId = auction.parentGeneIds[i + 8]; // Parent 2's trait at slot i

  // ...
}
```

## Frontend Migration

### Old Code (Graph - 8 separate fields)

```typescript
// OLD
interface Aminal {
  backId: string;
  armId: string;
  tailId: string;
  earsId: string;
  bodyId: string;
  faceId: string;
  mouthId: string;
  miscId: string;
}

// Usage
const back = aminal.backId;
const face = aminal.faceId;
```

### New Code (Ponder - traits array)

```typescript
// NEW
interface Aminal {
  traits: string[]; // Array of 8 trait IDs
}

// Constants (import from shared location)
const TRAIT_BACK = 0;
const TRAIT_ARM = 1;
const TRAIT_TAIL = 2;
const TRAIT_EARS = 3;
const TRAIT_BODY = 4;
const TRAIT_FACE = 5;
const TRAIT_MOUTH = 6;
const TRAIT_MISC = 7;

// Usage
const back = aminal.traits[TRAIT_BACK];
const face = aminal.traits[TRAIT_FACE];

// OR use destructuring if you need all traits
const [back, arm, tail, ears, body, face, mouth, misc] = aminal.traits;
```

## Validation Helper

Create a validation function to ensure trait arrays are correct:

```typescript
// src/utils/validation.ts
export function validateTraits(traits: bigint[]): void {
  if (traits.length !== 8) {
    throw new Error(`Invalid traits array length: ${traits.length}, expected 8`);
  }

  // Additional validation: ensure all are non-negative bigints
  for (let i = 0; i < 8; i++) {
    if (traits[i] < 0n) {
      throw new Error(`Invalid trait at index ${i} (${TRAIT_NAMES[i]}): ${traits[i]}`);
    }
  }
}

// Usage in event handlers
const traits = [
  event.params.geneIds[0],
  event.params.geneIds[1],
  event.params.geneIds[2],
  event.params.geneIds[3],
  event.params.geneIds[4],
  event.params.geneIds[5],
  event.params.geneIds[6],
  event.params.geneIds[7],
];

validateTraits(traits); // Throws if invalid
```

## Testing Checklist

When testing trait functionality:

- [ ] Verify traits are stored in correct order during Aminal spawning
- [ ] Verify each trait index corresponds to correct visual (BACK=0, ARM=1, etc.)
- [ ] Verify parentGeneIds cache has correct order (parent1[0-7], parent2[8-15])
- [ ] Verify bulk vote processing checks correct trait slots
- [ ] Verify frontend renders traits in correct order
- [ ] Verify GraphQL queries return traits in correct order

## Documentation Requirements

Every file that works with traits MUST include a comment specifying the order:

```typescript
/**
 * Trait Array Order: [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
 * See TRAIT_ORDER.md for specification
 */
```

## Emergency Reference

If you ever forget the order, remember the mnemonic:

**"BATE BFMM"** - **B**ack, **A**rm, **T**ail, **E**ars, **B**ody, **F**ace, **M**outh, **M**isc

Or just remember: **Front-to-back rendering order** (back layers first, misc/accessories last)

## Schema Documentation

The order MUST be documented in the schema file:

```typescript
// ponder.schema.ts
export const aminals = onchainTable("aminals", (t) => ({
  // ...

  // Visual traits - array of 8 gene NFT IDs
  // ⚠️ CRITICAL: Order must match contract enum
  // Index: 0=BACK, 1=ARM, 2=TAIL, 3=EARS, 4=BODY, 5=FACE, 6=MOUTH, 7=MISC
  traits: t.bigint().array().notNull(),

  // ...
}));
```

## Summary

1. ✅ Always use constants (`TRAIT_BACK`, `TRAIT_ARM`, etc.) - never magic numbers
2. ✅ Always preserve order: [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
3. ✅ Document the order in every file that uses traits
4. ✅ Validate trait arrays have length 8
5. ✅ Test trait ordering at every integration point

**The trait order is part of the contract specification and cannot be changed without a contract upgrade.**
