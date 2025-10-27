/**
 * Ponder Schema Types
 *
 * Type-safe exports from the Ponder schema.
 * Use these instead of 'any' for full type safety.
 */

import * as schema from '../../ponder.schema';

// ============================================================================
// Base Table Types (using Ponder's $inferSelect)
// ============================================================================

export type Factory = typeof schema.factory.$inferSelect;
export type Aminal = typeof schema.aminal.$inferSelect;
export type User = typeof schema.user.$inferSelect;
export type Relationship = typeof schema.relationship.$inferSelect;
export type GeneNFT = typeof schema.geneNFT.$inferSelect;
export type GeneAuction = typeof schema.geneAuction.$inferSelect;
export type GeneProposal = typeof schema.geneProposal.$inferSelect;
export type GeneVote = typeof schema.geneVote.$inferSelect;
export type GeneCreatorPayout = typeof schema.geneCreatorPayout.$inferSelect;
export type FeedEvent = typeof schema.feedEvent.$inferSelect;
export type SkillUsedEvent = typeof schema.skillUsedEvent.$inferSelect;

// ============================================================================
// Extended Types with Relations
// ============================================================================

export interface AminalWithRelations extends Aminal {
  lovers?: { items: Relationship[] };
  userLove?: bigint;
  parentOne?: Aminal | null;
  parentTwo?: Aminal | null;
  feeds?: FeedEvent[];
  skillsUsed?: SkillUsedEvent[];
  // Trait helper properties (extracted from traits array for backward compatibility)
  backId?: bigint;
  armId?: bigint;
  tailId?: bigint;
  earsId?: bigint;
  bodyId?: bigint;
  faceId?: bigint;
  mouthId?: bigint;
  miscId?: bigint;
}

export interface GeneNFTWithRelations extends GeneNFT {
  owner?: User;
  creator?: User;
  proposals?: { items: GeneProposal[] };
  payouts?: GeneCreatorPayout[];
  aminals?: Aminal[];
  aminalCount?: number;
}

export interface GeneAuctionWithRelations extends GeneAuction {
  proposals?: GeneProposal[];
  aminalOne?: AminalWithRelations;
  aminalTwo?: AminalWithRelations;
  childAminal?: AminalWithRelations | null;
  votes?: GeneVote[];
  payouts?: GeneCreatorPayout[];
}

export interface GeneProposalWithRelations extends GeneProposal {
  geneNFT?: GeneNFT;
  auction?: GeneAuction;
  proposer?: User;
  votes?: GeneVote[];
}

export interface RelationshipWithAminal extends Relationship {
  aminal: Aminal;
}

export interface GeneVoteWithRelations extends GeneVote {
  proposal?: {
    geneNFT?: GeneNFT;
  } & GeneProposal;
  voter?: User;
  auction?: GeneAuction;
}

export interface UserWithRelations extends User {
  lovers?: RelationshipWithAminal[];
  genesCreated?: GeneNFT[];
  genesOwned?: GeneNFT[];
  geneVotes?: GeneVoteWithRelations[];
  proposedGenes?: GeneProposal[];
  receivedPayouts?: GeneCreatorPayout[];
  feedEvents?: FeedEvent[];
  skillEvents?: SkillUsedEvent[];
}

// ============================================================================
// Query Result Types (for arrays)
// ============================================================================

export type AminalList = Aminal[];
export type GeneNFTList = GeneNFT[];
export type GeneAuctionList = GeneAuction[];
export type GeneProposalList = GeneProposal[];

// ============================================================================
// Single Item Types (for queries that return one item)
// ============================================================================

export type AminalSingle = Aminal | null | undefined;
export type GeneNFTSingle = GeneNFT | null | undefined;
export type GeneAuctionSingle = GeneAuction | null | undefined;
export type UserSingle = User | null | undefined;

// ============================================================================
// Helper Types
// ============================================================================

// Trait array type (8 bigints)
export type TraitArray = readonly [
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint
];

// Trait type enum (matches schema)
export enum TraitType {
  BACK = 0,
  ARM = 1,
  TAIL = 2,
  EARS = 3,
  BODY = 4,
  FACE = 5,
  MOUTH = 6,
  MISC = 7,
}

// Helper to extract array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : T;
