/**
 * Hooks Barrel Export
 *
 * Central export point for all Ponder-based data hooks and types.
 * Import from this file for convenience: `import { useAminals, type Aminal } from '@hooks'`
 */

// Aminal hooks
export {
  useAminalByContractAddress,
  useAminals,
  type AminalFilter,
  type AminalSort,
} from './useAminals';

// Auction hooks
export {
  useAuction,
  useAuctionProposeGenes,
  useAuctionVotes,
  useAuctions,
} from './useAuctions';

// Gene hooks
export {
  useGene,
  useGenes,
  useGenesByIds,
  type CategoryFilter,
  type GeneFilter,
  type GeneSort,
} from './useGenes';

// User profile hooks
export { useUserEarnings, useUserProfile } from './useUser';

// Gene proposal hooks
export { useGeneProposalsByAuctionId } from './useGeneProposals';

// Breeding/Design hooks
export {
  useAuctionVoting,
  useDesign,
  // useDesignPlacements, // Removed - no longer available in contract
  useDesignProposals,
  useDesignRemovalVotes,
  useGenesByIds as useGenesByIdsBreeding,
  useIsVotingActive,
  useParentGenes,
  useUserVotedDesign,
  useUserVotingPower,
} from './useBreeding';

// Trait utilities
export {
  TraitIndex,
  getArmId,
  getBackId,
  getBodyId,
  getEarsId,
  getFaceId,
  getMiscId,
  getMouthId,
  getTailId,
  getTrait,
} from './traitUtils';

// Gene utilities
export { makeGeneNFTId } from '../lib/geneTransformers';

// Re-export all Ponder types for convenience
export type {
  // Base types
  Aminal,
  // List types
  AminalList,
  // Single item types
  AminalSingle,
  // Extended types with relations
  AminalWithRelations,
  Factory,
  FeedEvent,
  GeneAuction,
  GeneAuctionList,
  GeneAuctionSingle,
  GeneAuctionWithRelations,
  GeneCreatorPayout,
  GeneNFT,
  GeneNFTList,
  GeneNFTSingle,
  GeneNFTWithRelations,
  GeneProposal,
  GeneProposalList,
  GeneProposalWithRelations,
  GeneVote,
  Relationship,
  SkillUsedEvent,
  // Helper types
  // Note: TraitArray and TraitType removed - genes are now flexible (no categories)
  User,
  UserSingle,
  UserWithRelations,
} from '../types/ponder';

// Re-export breeding types
export type {
  AminalDesign,
  AuctionVoteInfo,
  DesignBuilderState,
  DesignProposal,
  DesignVote,
  Gene,
  GeneMetadata,
  HistoryState,
} from '../types/breeding';

export {
  DEFAULT_PLACEMENT,
  contractFormatToPlacement,
  countGenes,
  createDesignFromGenes,
  createEmptyDesign,
  placementToContractFormat,
  validateDesign,
} from '../types/breeding';
