import { desc, eq } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import type { UseQueryResult } from '@tanstack/react-query';
import * as schema from '../../../ponder/ponder.schema';
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
 * Fetch all gene auctions with live updates
 */
export const useAuctions = () => {
  return usePonderQuery({
    queryFn: (db) => {
      // Return the query - Ponder will execute it
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
export const useAuction = (
  auctionId: string
): Omit<UseQueryResult<GeneAuction[], Error>, 'data'> & {
  data: GeneAuctionWithRelations | undefined;
} => {
  // Convert auction ID to hex format if needed
  const hexAuctionId = auctionId?.startsWith('0x')
    ? auctionId
    : auctionId
    ? `0x${parseInt(auctionId).toString(16).padStart(64, '0')}`
    : '';

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

  // Fetch aminalOne
  const aminalOneResult = usePonderQuery({
    queryFn: (db) => {
      if (!auction?.aminalOneId) {
        return db
          .select()
          .from(schema.aminal)
          .where(eq(schema.aminal.id, '0x0' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.aminal)
        .where(eq(schema.aminal.id, auction.aminalOneId as `0x${string}`))
        .limit(1);
    },
    enabled: Boolean(auction?.aminalOneId),
  }) as UseQueryResult<Aminal[], Error>;

  // Fetch aminalTwo
  const aminalTwoResult = usePonderQuery({
    queryFn: (db) => {
      if (!auction?.aminalTwoId) {
        return db
          .select()
          .from(schema.aminal)
          .where(eq(schema.aminal.id, '0x0' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.aminal)
        .where(eq(schema.aminal.id, auction.aminalTwoId as `0x${string}`))
        .limit(1);
    },
    enabled: Boolean(auction?.aminalTwoId),
  }) as UseQueryResult<Aminal[], Error>;

  // Fetch childAminal if it exists
  const childAminalResult = usePonderQuery({
    queryFn: (db) => {
      if (!auction?.childAminalId) {
        return db
          .select()
          .from(schema.aminal)
          .where(eq(schema.aminal.id, '0x0' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.aminal)
        .where(eq(schema.aminal.id, auction.childAminalId as `0x${string}`))
        .limit(1);
    },
    enabled: Boolean(auction?.childAminalId),
  }) as UseQueryResult<Aminal[], Error>;

  // Process data to add trait helpers
  const processedData = auction
    ? processAuctionWithRelations(
        auction,
        aminalOneResult.data?.[0],
        aminalTwoResult.data?.[0],
        childAminalResult.data?.[0]
      )
    : undefined;

  return {
    ...auctionResult,
    data: processedData,
  };
};

/**
 * Helper to add trait properties to an aminal
 */
function addTraitHelpers(aminal: Aminal | undefined): AminalWithRelations | undefined {
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
 * Process auction with related aminals
 */
function processAuctionWithRelations(
  auction: GeneAuction,
  aminalOne: Aminal | undefined,
  aminalTwo: Aminal | undefined,
  childAminal: Aminal | undefined
): GeneAuctionWithRelations {
  return {
    ...auction,
    aminalOne: addTraitHelpers(aminalOne),
    aminalTwo: addTraitHelpers(aminalTwo),
    childAminal: childAminal ? addTraitHelpers(childAminal) : null,
  };
}

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
      return db
        .select()
        .from(schema.geneVote)
        .where(eq(schema.geneVote.auctionId, hexAuctionId as `0x${string}`));
    },
    enabled: !!auctionId,
  });
};

// Re-export base types
export type { GeneAuction, GeneNFT, GeneProposal, GeneVote };
