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
  // Fetch aminals
  const aminalsResult = usePonderQuery({
    queryFn: (db) => {
      return db.select().from(schema.aminal);
    },
  }) as UseQueryResult<Aminal[], Error>;

  // Fetch relationships
  const relationshipsResult = usePonderQuery({
    queryFn: (db) => {
      return db.select().from(schema.relationship);
    },
  }) as UseQueryResult<Relationship[], Error>;

  // Combine data
  const processedData =
    aminalsResult.data && relationshipsResult.data
      ? processAminals(
          aminalsResult.data,
          relationshipsResult.data,
          userAddress,
          filter,
          sort
        )
      : undefined;

  return {
    ...aminalsResult,
    data: processedData,
  };
};

/**
 * Client-side processing of aminals data
 */
function processAminals(
  aminals: Aminal[],
  relationships: Relationship[],
  userAddress: string,
  filter: AminalFilter,
  sort: AminalSort
): AminalWithRelations[] {
  // Create a map of aminal ID to lovers
  const loversMap = new Map<string, Relationship[]>();
  relationships.forEach((rel) => {
    const aminalId = rel.aminalId.toLowerCase();
    if (!loversMap.has(aminalId)) {
      loversMap.set(aminalId, []);
    }
    loversMap.get(aminalId)!.push(rel);
  });

  let processed: AminalWithRelations[] = aminals.map((aminal) => {
    const aminalId = aminal.id.toLowerCase();
    const aminalLovers = loversMap.get(aminalId) || [];

    // Find user's love relationship
    const userRelationship = userAddress
      ? aminalLovers.find(
          (rel) => rel.userId.toLowerCase() === userAddress.toLowerCase()
        )
      : undefined;

    return {
      ...aminal,
      lovers: { items: aminalLovers },
      userLove: userRelationship?.love || 0n,
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
  });

  // Apply filter
  if (filter === 'loved' && userAddress) {
    processed = processed.filter((aminal) => (aminal.userLove || 0n) > 0n);
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
): Omit<UseQueryResult<Aminal[], Error>, 'data'> & {
  data: AminalWithRelations | undefined;
} => {
  // Fetch the aminal
  const aminalResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.aminal)
        .where(eq(schema.aminal.id, contractAddress as `0x${string}`))
        .limit(1);
    },
    enabled: !!contractAddress && contractAddress !== 'undefined',
  }) as UseQueryResult<Aminal[], Error>;

  // Fetch relationships for this aminal
  const relationshipsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.relationship)
        .where(
          eq(schema.relationship.aminalId, contractAddress as `0x${string}`)
        );
    },
    enabled: !!contractAddress && contractAddress !== 'undefined',
  }) as UseQueryResult<Relationship[], Error>;

  // Fetch parent aminals if they exist
  const aminal = aminalResult.data?.[0];

  // Only fetch parents if they have valid IDs (not null/undefined)
  const hasParentOne = Boolean(aminal?.parentOneId && aminal.parentOneId !== null);
  const hasParentTwo = Boolean(aminal?.parentTwoId && aminal.parentTwoId !== null);

  const parentOneResult = usePonderQuery({
    queryFn: (db) => {
      if (!aminal?.parentOneId) {
        // Return empty query that won't execute
        return db.select().from(schema.aminal).where(eq(schema.aminal.id, '0x0' as `0x${string}`)).limit(0);
      }
      return db
        .select()
        .from(schema.aminal)
        .where(eq(schema.aminal.id, aminal.parentOneId as `0x${string}`))
        .limit(1);
    },
    enabled: hasParentOne,
  }) as UseQueryResult<Aminal[], Error>;

  const parentTwoResult = usePonderQuery({
    queryFn: (db) => {
      if (!aminal?.parentTwoId) {
        // Return empty query that won't execute
        return db.select().from(schema.aminal).where(eq(schema.aminal.id, '0x0' as `0x${string}`)).limit(0);
      }
      return db
        .select()
        .from(schema.aminal)
        .where(eq(schema.aminal.id, aminal.parentTwoId as `0x${string}`))
        .limit(1);
    },
    enabled: hasParentTwo,
  }) as UseQueryResult<Aminal[], Error>;

  // Combine data
  const processedData = aminal
    ? processAminalDetail(
        aminal,
        relationshipsResult.data || [],
        parentOneResult.data?.[0],
        parentTwoResult.data?.[0],
        userAddress
      )
    : undefined;

  return {
    ...aminalResult,
    data: processedData,
  };
};

/**
 * Process a single aminal with all its relationships
 */
function processAminalDetail(
  aminal: Aminal,
  relationships: Relationship[],
  parentOne: Aminal | undefined,
  parentTwo: Aminal | undefined,
  userAddress: string
): AminalWithRelations {
  // Find user's love relationship
  const userRelationship = userAddress
    ? relationships.find(
        (rel) => rel.userId.toLowerCase() === userAddress.toLowerCase()
      )
    : undefined;

  return {
    ...aminal,
    lovers: { items: relationships },
    userLove: userRelationship?.love || 0n,
    parentOne: parentOne || null,
    parentTwo: parentTwo || null,
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

// Re-export types for convenience
export type { Aminal, AminalWithRelations, Relationship };
