import { eq, inArray } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import * as schema from '../../ponder.schema';
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
  const genesResult = usePonderQuery({
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

  // Fetch all aminalGene records to count aminals per gene
  const aminalGenesResult = usePonderQuery({
    queryFn: (db) => {
      return db.select().from(schema.aminalGene);
    },
    enabled: !!genesResult.data,
  });

  // Process data after query execution
  const processedData =
    genesResult.data && aminalGenesResult.data
      ? processGenes(
          genesResult.data as GeneNFT[],
          aminalGenesResult.data as any[],
          filter,
          sort,
          userAddress
        )
      : genesResult.data
      ? processGenes(
          genesResult.data as GeneNFT[],
          [],
          filter,
          sort,
          userAddress
        )
      : undefined;

  return {
    ...genesResult,
    data: processedData,
  };
};

/**
 * Client-side processing of genes data
 */
function processGenes(
  genes: GeneNFT[],
  aminalGenes: any[],
  filter: GeneFilter,
  sort: GeneSort,
  userAddress?: string
): Array<GeneNFT & { aminalCount: number }> {
  // Count aminals per gene
  const aminalCountByGene = new Map<string, number>();
  for (const ag of aminalGenes) {
    const count = aminalCountByGene.get(ag.geneNFTId) || 0;
    aminalCountByGene.set(ag.geneNFTId, count + 1);
  }

  // Add aminal count to each gene
  let processed = genes.map((gene) => ({
    ...gene,
    aminalCount: aminalCountByGene.get(gene.id) || 0,
  }));

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
        // Sort by actual aminal count
        return b.aminalCount - a.aminalCount;
      case 'created-at':
        return Number(b.blockTimestamp - a.blockTimestamp);
      default:
        return 0;
    }
  });

  return processed;
}

/**
 * Fetch a single gene by ID with relations and aminals that have this gene
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

  // Fetch aminal-gene join table entries for this gene
  const aminalGenesResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.aminalGene)
        .where(eq(schema.aminalGene.geneNFTId, id as `0x${string}`));
    },
    enabled: !!id,
  });

  // Fetch aminals based on join table
  const aminalsResult = usePonderQuery({
    queryFn: (db) => {
      const aminalIds =
        (aminalGenesResult.data?.map((ag: any) => ag.aminalId) as
          | `0x${string}`[]
          | undefined) || [];

      if (aminalIds.length === 0) {
        // Return empty query
        return db
          .select()
          .from(schema.aminal)
          .where(eq(schema.aminal.id, '' as `0x${string}`));
      }

      return db
        .select()
        .from(schema.aminal)
        .where(inArray(schema.aminal.id, aminalIds));
    },
    enabled: !!aminalGenesResult.data && aminalGenesResult.data.length > 0,
  });

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

  // Combine data client-side
  const processedData = gene
    ? ({
        ...gene,
        aminals: aminalsResult.data || [],
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
 * Fetch multiple genes by their token IDs or composite IDs
 * Handles both formats:
 * - Token IDs: "123", "456"
 * - Composite IDs: "0x14336fd396682bc93d89bd5f7c7f0b52ce6c30c3-8"
 */
export const useGenesByIds = (ids: string[]) => {
  return usePonderQuery({
    queryFn: (db) => {
      if (ids.length === 0) {
        // Return empty query that returns no results
        return db
          .select()
          .from(schema.geneNFT)
          .where(eq(schema.geneNFT.tokenId, 0n));
      }

      // Check if IDs are composite (contain '-') or just token IDs
      const isCompositeId = ids[0]?.includes('-');

      if (isCompositeId) {
        // Query by composite ID
        return db
          .select()
          .from(schema.geneNFT)
          .where(inArray(schema.geneNFT.id, ids as `0x${string}`[]));
      } else {
        // Convert string IDs to bigints for comparison with tokenId
        const tokenIds = ids.map((id) => BigInt(id));

        return db
          .select()
          .from(schema.geneNFT)
          .where(inArray(schema.geneNFT.tokenId, tokenIds));
      }
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
