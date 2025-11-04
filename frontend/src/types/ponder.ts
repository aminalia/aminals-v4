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
export type DesignProposal = typeof schema.designProposal.$inferSelect;
export type DesignVote = typeof schema.designVote.$inferSelect;
export type GeneCreatorPayout = typeof schema.geneCreatorPayout.$inferSelect;
export type FeedEvent = typeof schema.feedEvent.$inferSelect;
export type SkillUsedEvent = typeof schema.skillUsedEvent.$inferSelect;

// Legacy aliases for backwards compatibility (deprecated)
export type GeneProposal = DesignProposal;
export type GeneVote = DesignVote;

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
  // Note: genes array now supports 1-10 flexible genes (no categories)
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
  proposals?: DesignProposal[];
  aminalOne?: AminalWithRelations;
  aminalTwo?: AminalWithRelations;
  childAminal?: AminalWithRelations | null;
  votes?: DesignVote[];
  payouts?: GeneCreatorPayout[];
}

export interface DesignProposalWithRelations
  extends Omit<DesignProposal, 'votes'> {
  auction?: GeneAuction;
  proposer?: User;
  voteRecords?: DesignVote[]; // Renamed from votes to avoid conflict
  votes: bigint; // Vote count from base DesignProposal
}

// Legacy alias (deprecated)
export type GeneProposalWithRelations = DesignProposalWithRelations;

export interface RelationshipWithAminal extends Relationship {
  aminal: Aminal;
}

export interface DesignVoteWithRelations extends DesignVote {
  proposal?: DesignProposal;
  voter?: User;
  auction?: GeneAuction;
}

// Legacy alias (deprecated)
export type GeneVoteWithRelations = DesignVoteWithRelations;

export interface UserWithRelations extends User {
  lovers?: RelationshipWithAminal[];
  genesCreated?: GeneNFT[];
  genesOwned?: GeneNFT[];
  designVotes?: DesignVoteWithRelations[];
  proposedDesigns?: DesignProposal[];
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

// Gene array type (1-10 flexible genes, no categories)
export type GeneArray = readonly bigint[];

// Slot index type (0-9 for 10 possible gene slots)
export type SlotIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Helper to extract array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : T;
