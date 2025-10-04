import { eq } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import type { UseQueryResult } from '@tanstack/react-query';
import * as schema from '../../../ponder/ponder.schema';
import type { AminalFilter, AminalSort } from '../lib/dataTransformers';
import type {
  Aminal,
  AminalWithRelations,
  Relationship,
} from '../types/ponder';

export type { AminalFilter, AminalSort };

/**
 * Fetch all Aminals with optional filtering and sorting
 *
 * Note: Ponder queryFn must return SQL, not execute it.
 * Client-side filtering and sorting applied after query results.
 */
export const useAminals = (
  userAddress: string,
  filter: AminalFilter = 'all',
  sort: AminalSort = 'most-loved'
): Omit<UseQueryResult<Aminal[], Error>, 'data'> & {
  data: AminalWithRelations[] | undefined;
} => {
  const result = usePonderQuery({
    queryFn: (db) => {
      // Return the query - Ponder will execute it
      return db.select().from(schema.aminal);
    },
  }) as UseQueryResult<Aminal[], Error>;

  // Process data after query execution
  const processedData = result.data
    ? processAminals(result.data, userAddress, filter, sort)
    : undefined;

  return {
    ...result,
    data: processedData,
  };
};

/**
 * Client-side processing of aminals data
 */
function processAminals(
  aminals: Aminal[],
  userAddress: string,
  filter: AminalFilter,
  sort: AminalSort
): AminalWithRelations[] {
  let processed: AminalWithRelations[] = aminals.map((aminal) => ({
    ...aminal,
    lovers: [],
    userLove: 0n,
  }));

  // Apply filter
  if (filter === 'loved' && userAddress) {
    // Note: Without relationship data, we can't filter by love yet
    // This would require a separate query or join
    processed = processed.filter((aminal) => aminal.totalLove > 0n);
  }

  // Apply sorting
  processed.sort((a, b) => {
    switch (sort) {
      case 'most-loved':
        return Number(b.totalLove - a.totalLove);
      case 'least-loved':
        return Number(a.totalLove - b.totalLove);
      case 'oldest':
        return Number(a.blockTimestamp - b.blockTimestamp);
      case 'youngest':
        return Number(b.blockTimestamp - a.blockTimestamp);
      case 'richest':
        return Number(b.ethBalance - a.ethBalance);
      case 'poorest':
        return Number(a.ethBalance - b.ethBalance);
      default:
        return 0;
    }
  });

  return processed;
}

/**
 * Fetch a single Aminal by contract address (for detail view)
 */
export const useAminalByContractAddress = (
  contractAddress: string,
  userAddress: string
): UseQueryResult<Aminal | undefined, Error> => {
  const result = usePonderQuery({
    queryFn: (db) => {
      // Return the query - Ponder will execute it
      return db
        .select()
        .from(schema.aminal)
        .where(eq(schema.aminal.id, contractAddress as `0x${string}`))
        .limit(1);
    },
    enabled: !!contractAddress && contractAddress !== 'undefined',
  }) as UseQueryResult<Aminal[], Error>;

  return {
    ...result,
    data: result.data?.[0],
  };
};

// Re-export types for convenience
export type { Aminal, AminalWithRelations, Relationship };
