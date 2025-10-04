import { eq } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import * as schema from '../../../ponder/ponder.schema';
import type { GeneNFT, User, UserWithRelations } from '../types/ponder';

// Re-export types
export type { GeneNFT, User, UserWithRelations };

/**
 * Fetch complete user profile with all relations
 *
 * Note: This is a simplified version. Full implementation would require
 * separate queries or joins for relationships.
 */
export const useUserProfile = (address: string) => {
  return usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, address as `0x${string}`))
        .limit(1);
    },
    enabled: !!address,
  });
};

/**
 * Fetch user's gene earnings with payout history
 *
 * This queries genes created by the user.
 */
export const useUserEarnings = (address: string) => {
  return usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneNFT)
        .where(eq(schema.geneNFT.creatorId, address as `0x${string}`));
    },
    enabled: !!address,
  });
};
