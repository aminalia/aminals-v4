/**
 * Gene Transformers
 *
 * Updated for Ponder schema with hex-based IDs and new structure.
 */

import * as schema from '../../../ponder/ponder.schema';
import { genesAddress } from '../contracts/generated';

// Type inference from Ponder schema
type GeneNFT = typeof schema.geneNFT.$inferSelect;
type GeneProposal = typeof schema.geneProposal.$inferSelect;
type GeneCreatorPayout = typeof schema.geneCreatorPayout.$inferSelect;
type User = typeof schema.user.$inferSelect;

export type GeneFilter = 'all' | 'yours';
export type GeneSort = 'aminals-count' | 'created-at';
export type CategoryFilter =
  | 'all'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7';

// Extended type with relationships (matches hook return type)
export interface GeneNFTWithRelations extends GeneNFT {
  owner?: User;
  creator?: User;
  proposals?: GeneProposal[];
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
      (gene) =>
        gene.creatorId?.toLowerCase() === userAddress.toLowerCase()
    );
  }

  // Apply category filter
  if (category !== 'all') {
    processedGenes = processedGenes.filter(
      (gene) => gene.traitType === Number(category)
    );
  }

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
 */
export const formatGeneForDisplay = (gene: GeneNFTWithRelations) => {
  const stats = calculateGeneStats(gene);

  return {
    id: gene.id,
    tokenId: gene.tokenId.toString(),
    displayName: gene.name || `Gene #${gene.tokenId}`,
    description: gene.description || '',
    traitType: gene.traitType,
    traitTypeName: getTraitTypeName(gene.traitType),
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
 * Get trait type name from number
 */
export const getTraitTypeName = (traitType: number): string => {
  const traitNames = {
    0: 'Background',
    1: 'Arm',
    2: 'Tail',
    3: 'Ears',
    4: 'Body',
    5: 'Face',
    6: 'Mouth',
    7: 'Misc',
  };
  return traitNames[traitType as keyof typeof traitNames] || 'Unknown';
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
