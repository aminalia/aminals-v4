/**
 * React Query hooks for breeding/design system
 * Provides data fetching for design-based voting
 */

import { eq, inArray } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import { useAccount, useReadContract } from 'wagmi';
import * as schema from '../../ponder.schema';
import { geneAuctionAbi, geneAuctionAddress } from '../contracts/generated';
import { makeGeneNFTId } from '../lib/geneTransformers';
import type {
  AuctionVoteInfo,
  DesignProposal,
  Gene,
  GeneMetadata,
} from '../types/breeding';

/**
 * Get all design proposals for an auction from Ponder
 */
export const useDesignProposals = (auctionId: string) => {
  const hexAuctionId = auctionId ? `0xauction-${auctionId}` : '';

  // Fetch design proposals from Ponder
  const proposalsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.designProposal)
        .where(
          eq(schema.designProposal.auctionId, hexAuctionId as `0x${string}`)
        );
    },
    enabled: !!auctionId,
  });

  const proposals = proposalsResult.data || [];

  // Get all gene IDs from proposals
  const geneIds = proposals.length
    ? Array.from(
        new Set(proposals.flatMap((p) => (p.geneIds || []).map(makeGeneNFTId)))
      ).filter((id) => id !== makeGeneNFTId(0n)) // Filter out empty slots
    : [];

  // Fetch gene data for all genes used in proposals
  const genesResult = usePonderQuery({
    queryFn: (db) => {
      if (geneIds.length === 0) {
        return db
          .select()
          .from(schema.geneNFT)
          .where(eq(schema.geneNFT.id, '' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.geneNFT)
        .where(inArray(schema.geneNFT.id, geneIds as `0x${string}`[]));
    },
    enabled: geneIds.length > 0,
  });

  const genes = genesResult.data || [];

  // Create gene lookup map
  const geneMap = new Map(genes.map((g) => [g.tokenId.toString(), g]));

  // Fetch proposer data
  const proposerIds = proposals.length
    ? Array.from(new Set(proposals.map((p) => p.proposerId)))
    : [];

  const proposersResult = usePonderQuery({
    queryFn: (db) => {
      if (proposerIds.length === 0) {
        return db
          .select()
          .from(schema.user)
          .where(eq(schema.user.id, '' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.user)
        .where(inArray(schema.user.id, proposerIds as `0x${string}`[]));
    },
    enabled: proposerIds.length > 0,
  });

  const proposers = proposersResult.data || [];
  const proposerMap = new Map(proposers.map((p) => [p.id, p]));

  // Combine proposals with gene data and proposer data
  const proposalsWithData: DesignProposal[] = proposals.map((proposal) => {
    // Parse placements from JSON
    let placements: GeneMetadata[] = [];
    try {
      placements = JSON.parse(proposal.placements);
    } catch (e) {
      console.error('Failed to parse placements:', e);
      placements = Array(10).fill({
        offsetX: 0,
        offsetY: 0,
        scale: 100,
        rotation: 0,
      });
    }

    // Map gene IDs to gene data
    const genes: Gene[] = (proposal.geneIds || [])
      .map((geneId) => {
        if (geneId === 0n) return null;
        const gene = geneMap.get(geneId.toString());
        if (!gene) return null;
        return {
          id: gene.id,
          tokenId: gene.tokenId.toString(),
          owner: {
            id: gene.ownerId,
            address: gene.ownerId,
          },
          creator: {
            id: gene.creatorId,
            address: gene.creatorId,
          },
          svg: gene.svg || '',
          name: gene.name || undefined,
          description: gene.description || undefined,
          totalEarnings: gene.totalEarnings,
        };
      })
      .filter(Boolean) as Gene[];

    const proposer = proposerMap.get(proposal.proposerId);

    return {
      id: proposal.id,
      auctionId: hexAuctionId,
      designIndex: proposal.designIndex,
      proposer: {
        id: proposal.proposerId,
        address: proposer?.address || proposal.proposerId,
      },
      geneIds: proposal.geneIds || [],
      placements,
      votes: proposal.votes,
      removeVotes: proposal.removeVotes,
      removed: proposal.removed,
      blockNumber: proposal.blockNumber,
      blockTimestamp: proposal.blockTimestamp,
      transactionHash: proposal.transactionHash,
      genes,
      isParentDesign:
        proposal.proposerId === '0x0000000000000000000000000000000000000000',
    };
  });

  return {
    ...proposalsResult,
    data: proposalsWithData,
    isLoading:
      proposalsResult.isLoading ||
      genesResult.isLoading ||
      proposersResult.isLoading,
  };
};

/**
 * Get a specific design from contract
 */
export const useDesign = (auctionId: string, designId: bigint) => {
  return useReadContract({
    address: geneAuctionAddress,
    abi: geneAuctionAbi,
    functionName: 'getDesign',
    args: [BigInt(auctionId), designId],
    query: {
      enabled: !!auctionId && designId > 0n,
    },
  });
};

/**
 * Get user's voting power for an auction
 */
export const useUserVotingPower = (auctionId: string, userAddress?: string) => {
  const { address } = useAccount();
  const effectiveAddress = userAddress || address;

  return useReadContract({
    address: geneAuctionAddress,
    abi: geneAuctionAbi,
    functionName: 'getUserVotingPower',
    args: [BigInt(auctionId), effectiveAddress as `0x${string}`],
    query: {
      enabled: !!auctionId && !!effectiveAddress,
    },
  });
};

/**
 * Get which design user voted for
 */
export const useUserVotedDesign = (auctionId: string, userAddress?: string) => {
  const { address } = useAccount();
  const effectiveAddress = userAddress || address;

  return useReadContract({
    address: geneAuctionAddress,
    abi: geneAuctionAbi,
    functionName: 'getUserVotedDesign',
    args: [BigInt(auctionId), effectiveAddress as `0x${string}`],
    query: {
      enabled: !!auctionId && !!effectiveAddress,
    },
  });
};

/**
 * Get auction voting information (winning design, tied designs, etc.)
 */
export const useAuctionVoting = (auctionId: string) => {
  const result = useReadContract({
    address: geneAuctionAddress,
    abi: geneAuctionAbi,
    functionName: 'getAuctionVoting',
    args: [BigInt(auctionId)],
    query: {
      enabled: !!auctionId,
    },
  });

  // result.data is already an AuctionVoteInfo object
  const data = result.data as AuctionVoteInfo | undefined;

  return {
    ...result,
    data,
  };
};

/**
 * Get parent genes for an auction
 */
export const useParentGenes = (auctionId: string) => {
  const result = useReadContract({
    address: geneAuctionAddress,
    abi: geneAuctionAbi,
    functionName: 'getParentGenes',
    args: [BigInt(auctionId)],
    query: {
      enabled: !!auctionId,
    },
  });

  // Transform result to separate parent genes
  const data = result.data
    ? {
        parentOneGenes: result.data[0], // First 10 elements
        parentTwoGenes: result.data[1], // Second 10 elements
      }
    : undefined;

  return {
    ...result,
    data,
  };
};

/**
 * Check if voting is active for an auction
 */
export const useIsVotingActive = (auctionId: string) => {
  return useReadContract({
    address: geneAuctionAddress,
    abi: geneAuctionAbi,
    functionName: 'isVotingActive',
    args: [BigInt(auctionId)],
    query: {
      enabled: !!auctionId,
    },
  });
};

/**
 * Get genes by their IDs (for rendering designs)
 */
export const useGenesByIds = (geneIds: bigint[]) => {
  // Convert to hex format
  const hexIds = geneIds
    .filter((id) => id !== 0n)
    .map((id) => makeGeneNFTId(id));

  return usePonderQuery({
    queryFn: (db) => {
      if (hexIds.length === 0) {
        return db
          .select()
          .from(schema.geneNFT)
          .where(eq(schema.geneNFT.id, '' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.geneNFT)
        .where(inArray(schema.geneNFT.id, hexIds as `0x${string}`[]));
    },
    enabled: hexIds.length > 0,
  });
};

/**
 * Get design removal votes for a design
 */
export const useDesignRemovalVotes = (auctionId: string, designId: bigint) => {
  return useReadContract({
    address: geneAuctionAddress,
    abi: geneAuctionAbi,
    functionName: 'getDesignRemovalVotes',
    args: [BigInt(auctionId), designId],
    query: {
      enabled: !!auctionId && designId > 0n,
    },
  });
};

/**
 * Get design placements from contract
 */
export const useDesignPlacements = (auctionId: string, designId: bigint) => {
  return useReadContract({
    address: geneAuctionAddress,
    abi: geneAuctionAbi,
    functionName: 'getDesignPlacements',
    args: [BigInt(auctionId), designId],
    query: {
      enabled: !!auctionId && designId > 0n,
    },
  });
};
