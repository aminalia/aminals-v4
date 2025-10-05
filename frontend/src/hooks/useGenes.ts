import { eq, inArray } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import * as schema from '../../../ponder/ponder.schema';
import type {
  CategoryFilter,
  GeneFilter,
  GeneSort,
} from '../lib/geneTransformers';
import type {
  GeneCreatorPayout,
  GeneNFT,
  GeneNFTWithRelations,
  GeneProposal,
  User,
} from '../types/ponder';

export type { CategoryFilter, GeneFilter, GeneSort };

/**
 * Fetch all genes with filtering, sorting, and categorization
 */
export const useGenes = (
  filter: GeneFilter = 'all',
  sort: GeneSort = 'aminals-count',
  category: CategoryFilter = 'all',
  userAddress?: string
) => {
  const result = usePonderQuery({
    queryFn: (db) => {
      // Apply category filter at SQL level for efficiency
      if (category !== 'all') {
        return db
          .select()
          .from(schema.geneNFT)
          .where(eq(schema.geneNFT.traitType, Number(category)));
      }

      return db.select().from(schema.geneNFT);
    },
  });

  // Process data after query execution
  const processedData = result.data
    ? processGenes(result.data as GeneNFT[], filter, sort, userAddress)
    : undefined;

  return {
    ...result,
    data: processedData,
  };
};

/**
 * Client-side processing of genes data
 */
function processGenes(
  genes: GeneNFT[],
  filter: GeneFilter,
  sort: GeneSort,
  userAddress?: string
): GeneNFT[] {
  let processed = [...genes];

  // Apply owner filter
  if (filter === 'yours' && userAddress) {
    processed = processed.filter(
      (gene) => gene.creatorId.toLowerCase() === userAddress.toLowerCase()
    );
  }

  // Apply sorting
  processed.sort((a, b) => {
    switch (sort) {
      case 'aminals-count':
        // Sort by total earnings as a proxy for usage
        return Number(b.totalEarnings - a.totalEarnings);
      case 'created-at':
        return Number(b.blockTimestamp - a.blockTimestamp);
      default:
        return 0;
    }
  });

  return processed;
}

/**
 * Fetch a single gene by ID with relations
 */
export const useGene = (id: string) => {
  // Fetch the gene
  const geneResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneNFT)
        .where(eq(schema.geneNFT.id, id as `0x${string}`))
        .limit(1);
    },
    enabled: !!id,
  });

  const gene = (geneResult.data as GeneNFT[] | undefined)?.[0];

  // Fetch proposals for this gene
  const proposalsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneProposal)
        .where(eq(schema.geneProposal.geneNFTId, id as `0x${string}`));
    },
    enabled: !!id,
  });

  // Fetch payouts for this gene
  const payoutsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneCreatorPayout)
        .where(eq(schema.geneCreatorPayout.geneNFTId, id as `0x${string}`));
    },
    enabled: !!id,
  });

  // Fetch owner
  const ownerResult = usePonderQuery({
    queryFn: (db) => {
      if (!gene?.ownerId) {
        return db
          .select()
          .from(schema.user)
          .where(eq(schema.user.id, '0x0' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, gene.ownerId))
        .limit(1);
    },
    enabled: !!gene?.ownerId,
  });

  // Fetch creator
  const creatorResult = usePonderQuery({
    queryFn: (db) => {
      if (!gene?.creatorId) {
        return db
          .select()
          .from(schema.user)
          .where(eq(schema.user.id, '0x0' as `0x${string}`))
          .limit(0);
      }
      return db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, gene.creatorId))
        .limit(1);
    },
    enabled: !!gene?.creatorId,
  });

  // Combine data
  const processedData = gene
    ? ({
        ...gene,
        proposals: { items: proposalsResult.data || [] },
        payouts: payoutsResult.data || [],
        owner: (ownerResult.data as User[] | undefined)?.[0],
        creator: (creatorResult.data as User[] | undefined)?.[0],
      } as GeneNFTWithRelations)
    : undefined;

  return {
    ...geneResult,
    data: processedData,
  };
};

/**
 * Fetch multiple genes by their IDs
 */
export const useGenesByIds = (ids: string[]) => {
  return usePonderQuery({
    queryFn: (db) => {
      if (ids.length === 0) {
        // Return empty query that returns no results
        return db
          .select()
          .from(schema.geneNFT)
          .where(eq(schema.geneNFT.id, '' as `0x${string}`));
      }

      return db
        .select()
        .from(schema.geneNFT)
        .where(inArray(schema.geneNFT.id, ids as `0x${string}`[]));
    },
    enabled: ids.length > 0,
  });
};

// Re-export types
export type {
  GeneCreatorPayout,
  GeneNFT,
  GeneNFTWithRelations,
  GeneProposal,
  User,
};
