/**
 * Gene Transformers
 *
 * Updated for Ponder schema with hex-based IDs and new structure.
 */

import * as schema from '../../ponder.schema';
import { genesAddress } from '../contracts/generated';

// Type inference from Ponder schema
type GeneNFT = typeof schema.geneNFT.$inferSelect;
type DesignProposal = typeof schema.designProposal.$inferSelect;
type GeneCreatorPayout = typeof schema.geneCreatorPayout.$inferSelect;
type User = typeof schema.user.$inferSelect;

export type GeneFilter = 'all' | 'yours';
export type GeneSort = 'aminals-count' | 'created-at';
// Note: Category filter removed - genes are now flexible (no fixed categories)
export type CategoryFilter = 'all';

// Extended type with relationships (matches hook return type)
export interface GeneNFTWithRelations extends GeneNFT {
  owner?: User;
  creator?: User;
  // Note: Design proposals are complete designs, not per-gene
  proposals?: DesignProposal[];
  payouts?: GeneCreatorPayout[];
}

/**
 * Transform and filter genes based on user preferences
 *
 * Note: With Ponder, most filtering/sorting is done in the hooks.
 * This function is kept for backward compatibility and additional client-side processing.
 */
export const transformGenes = (
  genes: GeneNFTWithRelations[],
  filter: GeneFilter = 'all',
  sort: GeneSort = 'aminals-count',
  category: CategoryFilter = 'all',
  userAddress?: string
): GeneNFTWithRelations[] => {
  let processedGenes = [...genes];

  // Apply owner filter
  if (filter === 'yours' && userAddress) {
    processedGenes = processedGenes.filter(
      (gene) => gene.creatorId?.toLowerCase() === userAddress.toLowerCase()
    );
  }

  // Note: Category filter removed - genes are now flexible (no fixed categories)
  // The category parameter is kept for API compatibility but ignored

  // Apply sort
  processedGenes.sort((a, b) => {
    switch (sort) {
      case 'aminals-count':
        // Count based on proposals
        const aCount = a.proposals?.length || 0;
        const bCount = b.proposals?.length || 0;
        return bCount - aCount;
      case 'created-at':
        return Number(b.blockTimestamp - a.blockTimestamp);
      default:
        return 0;
    }
  });

  return processedGenes;
};

/**
 * Calculate gene statistics
 */
export const calculateGeneStats = (gene: GeneNFTWithRelations) => {
  const totalEarnings = Number(gene.totalEarnings || 0n);
  const proposals = gene.proposals || [];
  const proposalCount = proposals.length;
  const payoutCount = gene.payouts?.length || 0;

  // Calculate unique Aminals count from proposals
  // Note: This would require auction data which we don't have in this context
  // We'll use proposal count as a proxy
  const uniqueAminalsCount = proposalCount;

  return {
    totalEarnings,
    proposalCount,
    payoutCount,
    uniqueAminalsCount,
    averageEarningsPerProposal:
      proposalCount > 0 ? totalEarnings / proposalCount : 0,
  };
};

/**
 * Format gene display data
 * Note: Genes no longer have fixed trait types/categories
 */
export const formatGeneForDisplay = (gene: GeneNFTWithRelations) => {
  const stats = calculateGeneStats(gene);

  return {
    id: gene.id,
    tokenId: gene.tokenId.toString(),
    displayName: gene.name || `Gene #${gene.tokenId}`,
    description: gene.description || '',
    // Note: traitType removed - genes are now flexible (no fixed categories)
    svg: gene.svg,
    owner: gene.owner,
    creator: gene.creator,
    stats,
    metadata: {
      blockTimestamp: Number(gene.blockTimestamp || 0n),
      createdAt: new Date(Number(gene.blockTimestamp || 0n) * 1000),
    },
  };
};

/**
 * Get slot name from index (0-9)
 * Note: Replaces old getTraitTypeName - genes are now ordered by rendering layer
 */
export const getSlotName = (slotIndex: number): string => {
  return `Slot ${slotIndex}`; // Simple naming - slots are just rendering order now
};

/**
 * Filter genes by search term
 */
export const filterGenesBySearch = (
  genes: GeneNFTWithRelations[],
  searchTerm: string
): GeneNFTWithRelations[] => {
  if (!searchTerm.trim()) {
    return genes;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return genes.filter((gene) => {
    const name = gene.name?.toLowerCase() || '';
    const description = gene.description?.toLowerCase() || '';
    const tokenId = gene.tokenId?.toString() || '';
    const traitTypeName = getTraitTypeName(gene.traitType).toLowerCase();

    return (
      name.includes(lowerSearchTerm) ||
      description.includes(lowerSearchTerm) ||
      tokenId.includes(lowerSearchTerm) ||
      traitTypeName.includes(lowerSearchTerm)
    );
  });
};

/**
 * Group genes by trait type
 */
export const groupGenesByTraitType = (genes: GeneNFTWithRelations[]) => {
  const groups = {
    0: [] as GeneNFTWithRelations[], // Background
    1: [] as GeneNFTWithRelations[], // Arm
    2: [] as GeneNFTWithRelations[], // Tail
    3: [] as GeneNFTWithRelations[], // Ears
    4: [] as GeneNFTWithRelations[], // Body
    5: [] as GeneNFTWithRelations[], // Face
    6: [] as GeneNFTWithRelations[], // Mouth
    7: [] as GeneNFTWithRelations[], // Misc
  };

  genes.forEach((gene) => {
    const traitType = gene.traitType;
    if (traitType >= 0 && traitType <= 7) {
      groups[traitType as keyof typeof groups].push(gene);
    }
  });

  return groups;
};

/**
 * Validate gene data structure
 */
export const validateGene = (gene: any): gene is GeneNFTWithRelations => {
  return (
    gene &&
    typeof gene === 'object' &&
    'id' in gene &&
    'tokenId' in gene &&
    'traitType' in gene
  );
};

/**
 * Convert a gene token ID (bigint) to geneNFT ID format
 * Format: 0x{genesAddress}-{tokenId}
 *
 * This matches the ID format used in the Ponder indexer.
 */
export const makeGeneNFTId = (tokenId: bigint | string): string => {
  const tokenIdStr = typeof tokenId === 'bigint' ? tokenId.toString() : tokenId;
  return `0x${genesAddress.toLowerCase().replace('0x', '')}-${tokenIdStr}`;
};
