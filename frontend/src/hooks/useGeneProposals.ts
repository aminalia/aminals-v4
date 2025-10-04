import { eq } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import * as schema from '../../../ponder/ponder.schema';
import type {
  GeneNFT,
  GeneProposal,
  GeneProposalWithRelations,
  GeneVote,
} from '../types/ponder';

// Re-export types
export type { GeneNFT, GeneProposal, GeneProposalWithRelations, GeneVote };

/**
 * Fetch gene proposals filtered by auction ID
 */
export const useGeneProposalsByAuctionId = (auctionId: string) => {
  // Convert auction ID to hex format if needed
  const hexAuctionId = auctionId?.startsWith('0x')
    ? auctionId
    : auctionId
    ? `0x${parseInt(auctionId).toString(16).padStart(64, '0')}`
    : '';

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
