import { eq, inArray } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as schema from '../../ponder.schema';
import type {
  DesignProposal,
  DesignProposalWithRelations,
  DesignVote,
  User,
} from '../types/ponder';

// Re-export types
export type { DesignProposal, DesignProposalWithRelations, DesignVote };

/**
 * Fetch design proposals filtered by auction ID with related data
 */
export const useDesignProposalsByAuctionId = (
  auctionId: string
): Omit<UseQueryResult<DesignProposal[], Error>, 'data'> & {
  data: DesignProposalWithRelations[] | undefined;
} => {
  // Convert auction ID to Ponder format: 0xauction-{auctionId}
  const hexAuctionId = auctionId ? `0xauction-${auctionId}` : '';

  // Fetch proposals
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
  }) as UseQueryResult<DesignProposal[], Error>;

  const proposals = proposalsResult.data;

  // Collect all unique proposer IDs
  const proposerIds = useMemo(() => {
    if (!proposals) return [];
    return Array.from(
      new Set(proposals.map((p) => p.proposerId).filter((id) => id))
    );
  }, [proposals]);

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
    if (!proposals || !proposersResult.data) {
      return undefined;
    }

    const proposerMap = new Map<string, User>();
    proposersResult.data.forEach((user) => {
      proposerMap.set(user.id, user);
    });

    // Map proposals to include relations
    return proposals.map((proposal) => ({
      ...proposal,
      proposer: proposerMap.get(proposal.proposerId),
      // We already have auctionId, no need to fetch full auction here
    })) as DesignProposalWithRelations[];
  }, [proposals, proposersResult.data]);

  return {
    ...proposalsResult,
    data: processedData,
  };
};

// Legacy alias (deprecated)
export const useGeneProposalsByAuctionId = useDesignProposalsByAuctionId;
