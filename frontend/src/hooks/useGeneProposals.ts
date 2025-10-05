import { eq, inArray } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as schema from '../../../ponder/ponder.schema';
import type {
  GeneNFT,
  GeneProposal,
  GeneProposalWithRelations,
  GeneVote,
  User,
} from '../types/ponder';

// Re-export types
export type { GeneNFT, GeneProposal, GeneProposalWithRelations, GeneVote };

/**
 * Fetch gene proposals filtered by auction ID with related data
 */
export const useGeneProposalsByAuctionId = (
  auctionId: string
): Omit<UseQueryResult<GeneProposal[], Error>, 'data'> & {
  data: GeneProposalWithRelations[] | undefined;
} => {
  // Convert auction ID to Ponder format: 0xauction-{auctionId}
  const hexAuctionId = auctionId ? `0xauction-${auctionId}` : '';

  // Fetch proposals
  const proposalsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneProposal)
        .where(
          eq(schema.geneProposal.auctionId, hexAuctionId as `0x${string}`)
        );
    },
    enabled: !!auctionId,
  }) as UseQueryResult<GeneProposal[], Error>;

  const proposals = proposalsResult.data;

  // Collect all unique gene NFT IDs
  const geneNFTIds = useMemo(() => {
    if (!proposals) return [];
    return Array.from(
      new Set(proposals.map((p) => p.geneNFTId).filter((id) => id))
    );
  }, [proposals]);

  // Collect all unique proposer IDs
  const proposerIds = useMemo(() => {
    if (!proposals) return [];
    return Array.from(
      new Set(proposals.map((p) => p.proposerId).filter((id) => id))
    );
  }, [proposals]);

  // Fetch all gene NFTs
  const geneNFTsResult = usePonderQuery({
    queryFn: (db) => {
      if (geneNFTIds.length === 0) {
        return db
          .select()
          .from(schema.geneNFT)
          .where(eq(schema.geneNFT.id, '' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.geneNFT)
        .where(inArray(schema.geneNFT.id, geneNFTIds as `0x${string}`[]));
    },
    enabled: geneNFTIds.length > 0,
  }) as UseQueryResult<GeneNFT[], Error>;

  // Fetch all proposers
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
  }) as UseQueryResult<User[], Error>;

  // Process data to add relations
  const processedData = useMemo(() => {
    if (!proposals || !geneNFTsResult.data || !proposersResult.data) {
      return undefined;
    }

    // Create lookup maps
    const geneNFTMap = new Map<string, GeneNFT>();
    geneNFTsResult.data.forEach((gene) => {
      geneNFTMap.set(gene.id, gene);
    });

    const proposerMap = new Map<string, User>();
    proposersResult.data.forEach((user) => {
      proposerMap.set(user.id, user);
    });

    // Map proposals to include relations
    return proposals.map((proposal) => ({
      ...proposal,
      geneNFT: geneNFTMap.get(proposal.geneNFTId),
      proposer: proposerMap.get(proposal.proposerId),
      // We already have auctionId, no need to fetch full auction here
    })) as GeneProposalWithRelations[];
  }, [proposals, geneNFTsResult.data, proposersResult.data]);

  return {
    ...proposalsResult,
    data: processedData,
  };
};
