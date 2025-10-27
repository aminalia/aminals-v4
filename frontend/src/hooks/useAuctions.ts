import { desc, eq, inArray } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import type { UseQueryResult } from '@tanstack/react-query';
import * as schema from '../../ponder.schema';
import type {
  Aminal,
  AminalWithRelations,
  GeneAuction,
  GeneAuctionWithRelations,
  GeneNFT,
  GeneProposal,
  GeneProposalWithRelations,
  GeneVote,
} from '../types/ponder';

// Re-export types
export type { GeneAuctionWithRelations, GeneProposalWithRelations };

/**
 * Fetch all gene auctions with live updates and related aminals
 */
export const useAuctions = () => {
  // Fetch auctions
  const auctionsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneAuction)
        .orderBy(desc(schema.geneAuction.blockTimestamp));
    },
  });

  const auctions = auctionsResult.data || [];

  // Get all unique aminal IDs from auctions
  const aminalIds = auctions.length
    ? Array.from(
        new Set([
          ...auctions.map((a) => a.aminalOneId),
          ...auctions.map((a) => a.aminalTwoId),
          ...auctions
            .filter((a) => a.childAminalId)
            .map((a) => a.childAminalId!),
        ])
      )
    : [];

  // Fetch all aminals
  const aminalsResult = usePonderQuery({
    queryFn: (db) => {
      if (aminalIds.length === 0) {
        return db
          .select()
          .from(schema.aminal)
          .where(eq(schema.aminal.id, '' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.aminal)
        .where(inArray(schema.aminal.id, aminalIds as `0x${string}`[]));
    },
    enabled: aminalIds.length > 0,
  });

  const aminals = aminalsResult.data || [];

  // Create a lookup map for aminals
  const aminalMap = new Map(aminals.map((a) => [a.id, addTraitHelpers(a)]));

  // Combine auctions with their related aminals
  const auctionsWithRelations = auctions.map((auction) => ({
    ...auction,
    aminalOne: aminalMap.get(auction.aminalOneId),
    aminalTwo: aminalMap.get(auction.aminalTwoId),
    childAminal: auction.childAminalId
      ? aminalMap.get(auction.childAminalId) || null
      : null,
  }));

  return {
    ...auctionsResult,
    data: auctionsWithRelations,
    isLoading: auctionsResult.isLoading || aminalsResult.isLoading,
  };
};

/**
 * Fetch a single auction with full details
 */
export const useAuction = (
  auctionId: string
): Omit<UseQueryResult<GeneAuction[], Error>, 'data'> & {
  data: GeneAuctionWithRelations | undefined;
} => {
  // Convert auction ID to Ponder format: 0xauction-{auctionId}
  const hexAuctionId = auctionId ? `0xauction-${auctionId}` : '';

  // Fetch the auction
  const auctionResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneAuction)
        .where(eq(schema.geneAuction.id, hexAuctionId as `0x${string}`))
        .limit(1);
    },
    enabled: !!auctionId,
  }) as UseQueryResult<GeneAuction[], Error>;

  const auction = auctionResult.data?.[0];

  // Get all aminal IDs we need to fetch
  const aminalIds = auction
    ? ([auction.aminalOneId, auction.aminalTwoId, auction.childAminalId].filter(
        Boolean
      ) as `0x${string}`[])
    : [];

  // Fetch all aminals in a single query
  const aminalsResult = usePonderQuery({
    queryFn: (db) => {
      if (aminalIds.length === 0) {
        return db
          .select()
          .from(schema.aminal)
          .where(eq(schema.aminal.id, '' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.aminal)
        .where(inArray(schema.aminal.id, aminalIds));
    },
    enabled: aminalIds.length > 0,
  }) as UseQueryResult<Aminal[], Error>;

  const aminals = aminalsResult.data || [];

  // Create a lookup map for aminals
  const aminalMap = new Map(aminals.map((a) => [a.id, addTraitHelpers(a)]));

  // Process data to add trait helpers
  const processedData = auction
    ? {
        ...auction,
        aminalOne: auction.aminalOneId
          ? aminalMap.get(auction.aminalOneId)
          : undefined,
        aminalTwo: auction.aminalTwoId
          ? aminalMap.get(auction.aminalTwoId)
          : undefined,
        childAminal: auction.childAminalId
          ? aminalMap.get(auction.childAminalId) || null
          : null,
      }
    : undefined;

  return {
    ...auctionResult,
    data: processedData,
    isLoading: auctionResult.isLoading || aminalsResult.isLoading,
  };
};

/**
 * Helper to add trait properties to an aminal
 */
function addTraitHelpers(
  aminal: Aminal | undefined
): AminalWithRelations | undefined {
  if (!aminal) return undefined;

  return {
    ...aminal,
    // Extract trait IDs from traits array for backward compatibility
    backId: aminal.traits[0],
    armId: aminal.traits[1],
    tailId: aminal.traits[2],
    earsId: aminal.traits[3],
    bodyId: aminal.traits[4],
    faceId: aminal.traits[5],
    mouthId: aminal.traits[6],
    miscId: aminal.traits[7],
  };
}

/**
 * Fetch gene proposals for a specific auction
 */
export const useAuctionProposeGenes = (auctionId: string) => {
  // Convert auction ID to Ponder format: 0xauction-{auctionId}
  const hexAuctionId = auctionId ? `0xauction-${auctionId}` : '';

  return usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneProposal)
        .where(
          eq(schema.geneProposal.auctionId, hexAuctionId as `0x${string}`)
        );
    },
    enabled: !!auctionId,
  });
};

/**
 * Fetch votes for a specific auction with related proposal and gene data
 */
export const useAuctionVotes = (auctionId: string) => {
  // Convert auction ID to Ponder format: 0xauction-{auctionId}
  const hexAuctionId = auctionId ? `0xauction-${auctionId}` : '';

  // Fetch votes
  const votesResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneVote)
        .where(eq(schema.geneVote.auctionId, hexAuctionId as `0x${string}`));
    },
    enabled: !!auctionId,
  });

  const votes = votesResult.data;

  // Get unique proposal IDs from votes
  const proposalIds = votes
    ? Array.from(new Set(votes.map((v) => v.proposalId)))
    : [];

  // Fetch proposals
  const proposalsResult = usePonderQuery({
    queryFn: (db) => {
      if (proposalIds.length === 0) {
        return db
          .select()
          .from(schema.geneProposal)
          .where(eq(schema.geneProposal.id, '' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.geneProposal)
        .where(inArray(schema.geneProposal.id, proposalIds as `0x${string}`[]));
    },
    enabled: proposalIds.length > 0,
  });

  const proposals = proposalsResult.data || [];

  // Get unique gene IDs from proposals
  const geneIds = proposals.length
    ? Array.from(new Set(proposals.map((p) => p.geneNFTId)))
    : [];

  // Fetch genes
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

  // Get unique voter IDs from votes
  const voterIds = votes
    ? Array.from(new Set(votes.map((v) => v.voterId)))
    : [];

  // Fetch voters
  const votersResult = usePonderQuery({
    queryFn: (db) => {
      if (voterIds.length === 0) {
        return db
          .select()
          .from(schema.user)
          .where(eq(schema.user.id, '' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.user)
        .where(inArray(schema.user.id, voterIds as `0x${string}`[]));
    },
    enabled: voterIds.length > 0,
  });

  const voters = votersResult.data || [];

  // Create lookup maps
  const geneMap = new Map(genes.map((g) => [g.id, g]));
  const proposalMap = new Map(
    proposals.map((p) => [p.id, { ...p, geneNFT: geneMap.get(p.geneNFTId) }])
  );
  const voterMap = new Map(voters.map((v) => [v.id, v]));

  // Combine votes with proposals, genes, and voters
  const votesWithRelations = votes
    ? votes.map((vote) => ({
        ...vote,
        proposal: proposalMap.get(vote.proposalId),
        voter: voterMap.get(vote.voterId),
      }))
    : undefined;

  return {
    ...votesResult,
    data: votesWithRelations,
    isLoading:
      votesResult.isLoading ||
      proposalsResult.isLoading ||
      genesResult.isLoading ||
      votersResult.isLoading,
  };
};

// Re-export base types
export type { GeneAuction, GeneNFT, GeneProposal, GeneVote };
