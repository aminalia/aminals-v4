/**
 * Data Transformers for Aminals
 *
 * Updated for Ponder schema with traits array instead of individual fields.
 */

import * as schema from '../../ponder.schema';
import {
  traitsArrayToFields,
  type AminalWithTraitsArray,
} from './traitHelpers';

// Type inference from Ponder schema
type Aminal = typeof schema.aminal.$inferSelect;
type Relationship = typeof schema.relationship.$inferSelect;

export type AminalFilter = 'all' | 'loved';
export type AminalSort =
  | 'most-loved'
  | 'least-loved'
  | 'oldest'
  | 'youngest'
  | 'richest'
  | 'poorest';

// Extended type with relationships (matches hook return type)
export interface AminalWithRelations extends Aminal {
  lovers?: Relationship[];
  userLove?: bigint;
  parentOne?: Aminal | null;
  parentTwo?: Aminal | null;
}

/**
 * Transform and filter aminals based on user preferences
 *
 * Note: With Ponder, most filtering/sorting is done in the hooks.
 * This function is kept for backward compatibility and additional client-side processing.
 */
export const transformAminals = (
  aminals: AminalWithRelations[],
  filter: AminalFilter = 'all',
  sort: AminalSort = 'most-loved'
): AminalWithRelations[] => {
  let processedAminals = [...aminals];

  // Apply filter
  if (filter === 'loved') {
    processedAminals = processedAminals.filter((aminal) => {
      return aminal.userLove && aminal.userLove > 0n;
    });
  }

  // Apply sort
  processedAminals.sort((a, b) => {
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

  return processedAminals;
};

/**
 * Calculate derived stats for an aminal
 */
export const calculateAminalStats = (aminal: AminalWithRelations) => {
  const totalLove = Number(aminal.totalLove || 0n);
  const energy = Number(aminal.energy || 0n);
  const ethBalance = Number(aminal.ethBalance || 0n);
  const userLove = Number(aminal.userLove || 0n);

  return {
    totalLove,
    energy,
    ethBalance,
    userLove,
    hasUserLove: userLove > 0,
    energyPercentage: Math.min(energy / 100, 1) * 100, // Assuming max energy is 100
    loveRank: 'Unknown', // Would need all aminals to calculate
  };
};

/**
 * Format aminal display data
 *
 * Converts traits array to individual fields for backward compatibility
 */
export const formatAminalForDisplay = (aminal: AminalWithRelations) => {
  const stats = calculateAminalStats(aminal);

  // Convert traits array to individual fields for backward compatibility
  const aminalWithFields = traitsArrayToFields(
    aminal as unknown as AminalWithTraitsArray
  );

  return {
    id: aminal.id,
    contractAddress: aminal.contractAddress,
    aminalIndex: aminal.aminalIndex?.toString() || 'Unknown',
    displayName: `Aminal #${aminal.aminalIndex || 'Unknown'}`,
    energy: stats.energy.toFixed(2),
    totalLove: stats.totalLove.toFixed(2),
    ethBalance: stats.ethBalance.toFixed(4),
    userLove: stats.userLove.toFixed(2),
    hasUserLove: stats.hasUserLove,
    tokenURI: aminal.tokenURI,
    traits: {
      backId: aminalWithFields.backId,
      armId: aminalWithFields.armId,
      tailId: aminalWithFields.tailId,
      earsId: aminalWithFields.earsId,
      bodyId: aminalWithFields.bodyId,
      faceId: aminalWithFields.faceId,
      mouthId: aminalWithFields.mouthId,
      miscId: aminalWithFields.miscId,
    },
    breeding: {
      parentOneAddress: aminal.parentOne?.contractAddress || null,
      parentTwoAddress: aminal.parentTwo?.contractAddress || null,
    },
    metadata: {
      blockTimestamp: Number(aminal.blockTimestamp || 0n),
      createdAt: new Date(Number(aminal.blockTimestamp || 0n) * 1000),
    },
  };
};

/**
 * Validate aminal data structure
 */
export const validateAminal = (aminal: any): aminal is AminalWithRelations => {
  return (
    aminal &&
    typeof aminal === 'object' &&
    'id' in aminal &&
    'contractAddress' in aminal &&
    'aminalIndex' in aminal
  );
};

/**
 * Filter aminals by search term
 */
export const filterAminalsBySearch = (
  aminals: AminalWithRelations[],
  searchTerm: string
): AminalWithRelations[] => {
  if (!searchTerm.trim()) {
    return aminals;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return aminals.filter((aminal) => {
    const aminalIndex = aminal.aminalIndex?.toString().toLowerCase() || '';
    const contractAddress = aminal.contractAddress?.toLowerCase() || '';

    return (
      aminalIndex.includes(lowerSearchTerm) ||
      contractAddress.includes(lowerSearchTerm)
    );
  });
};

/**
 * Group aminals by a specific criteria
 */
export const groupAminalsByLoveRange = (aminals: AminalWithRelations[]) => {
  const groups = {
    high: [] as AminalWithRelations[], // > 10 love
    medium: [] as AminalWithRelations[], // 1-10 love
    low: [] as AminalWithRelations[], // 0-1 love
  };

  aminals.forEach((aminal) => {
    const totalLove = Number(aminal.totalLove || 0n);

    if (totalLove > 10) {
      groups.high.push(aminal);
    } else if (totalLove >= 1) {
      groups.medium.push(aminal);
    } else {
      groups.low.push(aminal);
    }
  });

  return groups;
};

/**
 * Calculate collection statistics
 */
export const calculateCollectionStats = (aminals: AminalWithRelations[]) => {
  const totalAminals = aminals.length;
  const totalLove = aminals.reduce(
    (sum, aminal) => sum + Number(aminal.totalLove || 0n),
    0
  );
  const totalEnergy = aminals.reduce(
    (sum, aminal) => sum + Number(aminal.energy || 0n),
    0
  );
  const averageLove = totalAminals > 0 ? totalLove / totalAminals : 0;
  const averageEnergy = totalAminals > 0 ? totalEnergy / totalAminals : 0;

  const mostLoved = aminals.reduce(
    (max, aminal) =>
      Number(aminal.totalLove || 0n) > Number(max.totalLove || 0n)
        ? aminal
        : max,
    aminals[0]
  );

  const mostEnergetic = aminals.reduce(
    (max, aminal) =>
      Number(aminal.energy || 0n) > Number(max.energy || 0n) ? aminal : max,
    aminals[0]
  );

  return {
    totalAminals,
    totalLove,
    totalEnergy,
    averageLove,
    averageEnergy,
    mostLoved,
    mostEnergetic,
  };
};
