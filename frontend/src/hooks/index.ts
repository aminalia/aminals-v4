/**
 * Hooks Barrel Export
 *
 * Central export point for all Ponder-based data hooks and types.
 * Import from this file for convenience: `import { useAminals, type Aminal } from '@/hooks'`
 */

// Aminal hooks
export {
  useAminals,
  useAminalByContractAddress,
  useAminalForChat,
  type AminalFilter,
  type AminalSort,
} from './useAminals';

// Auction hooks
export {
  useAuctions,
  useAuction,
  useAuctionProposeGenes,
  useAuctionVotes,
} from './useAuctions';

// Gene hooks
export {
  useGenes,
  useGene,
  useGenesByIds,
  type GeneFilter,
  type GeneSort,
  type CategoryFilter,
} from './useGenes';

// User profile hooks
export {
  useUserProfile,
  useUserEarnings,
} from './useUser';

// Gene proposal hooks
export {
  useGeneProposalsByAuctionId,
} from './useGeneProposals';

// Trait utilities
export {
  TraitIndex,
  getTrait,
  getBackId,
  getArmId,
  getTailId,
  getEarsId,
  getBodyId,
  getFaceId,
  getMouthId,
  getMiscId,
} from './traitUtils';

// Re-export all Ponder types for convenience
export type {
  // Base types
  Aminal,
  User,
  Relationship,
  GeneNFT,
  GeneAuction,
  GeneProposal,
  GeneVote,
  GeneCreatorPayout,
  FeedEvent,
  SkillUsedEvent,
  Factory,

  // Extended types with relations
  AminalWithRelations,
  GeneNFTWithRelations,
  GeneAuctionWithRelations,
  GeneProposalWithRelations,
  UserWithRelations,

  // List types
  AminalList,
  GeneNFTList,
  GeneAuctionList,
  GeneProposalList,

  // Single item types
  AminalSingle,
  GeneNFTSingle,
  GeneAuctionSingle,
  UserSingle,

  // Helper types
  TraitArray,
  TraitType,
} from '../types/ponder';
