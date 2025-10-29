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
  TraitArray,
  TraitType,
  User,
  UserSingle,
  UserWithRelations,
} from '../types/ponder';
