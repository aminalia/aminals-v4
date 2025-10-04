import { eq, desc } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import * as schema from '../../../ponder/ponder.schema';
import type {
  GeneAuction,
  GeneAuctionWithRelations,
  GeneProposal,
  GeneProposalWithRelations,
  GeneVote,
  GeneNFT,
} from '../types/ponder';

// Re-export types
export type { GeneAuctionWithRelations, GeneProposalWithRelations };

/**
 * Fetch all gene auctions with live updates
 */
export const useAuctions = () => {
  return usePonderQuery({
    queryFn: (db) => {
      // Return the query - Ponder will execute it
      // @ts-expect-error - Ponder's onchainTable type doesn't exactly match Drizzle's PgTable
      return db
        .select()
        .from(schema.geneAuction)
        .orderBy(desc(schema.geneAuction.blockTimestamp))
        .limit(10);
    },
  });
};

/**
 * Fetch a single auction with full details
 */
export const useAuction = (auctionId: string) => {
  // Convert auction ID to hex format if needed
  const hexAuctionId = auctionId?.startsWith('0x')
    ? auctionId
    : auctionId
    ? `0x${parseInt(auctionId).toString(16).padStart(64, '0')}`
    : '';

  return usePonderQuery({
    queryFn: (db) => {
      // @ts-expect-error - Ponder's onchainTable type doesn't exactly match Drizzle's PgTable
      return db
        .select()
        .from(schema.geneAuction)
        .where(eq(schema.geneAuction.id, hexAuctionId as `0x${string}`))
        .limit(1);
    },
    enabled: !!auctionId,
  });
};

/**
 * Fetch gene proposals for a specific auction
 */
export const useAuctionProposeGenes = (auctionId: string) => {
  // Convert auction ID to hex format if needed
  const hexAuctionId = auctionId?.startsWith('0x')
    ? auctionId
    : auctionId
    ? `0x${parseInt(auctionId).toString(16).padStart(64, '0')}`
    : '';

  return usePonderQuery({
    queryFn: (db) => {
      // @ts-expect-error - Ponder's onchainTable type doesn't exactly match Drizzle's PgTable
      return db
        .select()
        .from(schema.geneProposal)
        .where(eq(schema.geneProposal.auctionId, hexAuctionId as `0x${string}`));
    },
    enabled: !!auctionId,
  });
};

/**
 * Fetch votes for a specific auction
 */
export const useAuctionVotes = (auctionId: string) => {
  // Convert auction ID to hex format if needed
  const hexAuctionId = auctionId?.startsWith('0x')
    ? auctionId
    : auctionId
    ? `0x${parseInt(auctionId).toString(16).padStart(64, '0')}`
    : '';

  return usePonderQuery({
    queryFn: (db) => {
      // @ts-expect-error - Ponder's onchainTable type doesn't exactly match Drizzle's PgTable
      return db
        .select()
        .from(schema.geneVote)
        .where(eq(schema.geneVote.auctionId, hexAuctionId as `0x${string}`));
    },
    enabled: !!auctionId,
  });
};

// Re-export base types
export type { GeneAuction, GeneProposal, GeneVote, GeneNFT };
