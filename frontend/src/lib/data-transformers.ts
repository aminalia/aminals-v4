import { Aminal } from '../../.graphclient';
import { traitsArrayToFields, type AminalWithTraitsArray } from './trait-helpers';

export type AminalFilter = 'all' | 'loved';
export type AminalSort =
  | 'most-loved'
  | 'least-loved'
  | 'oldest'
  | 'youngest'
  | 'richest'
  | 'poorest';

/**
 * Transform and filter aminals based on user preferences
 */
export const transformAminals = (
  aminals: Aminal[],
  filter: AminalFilter = 'all',
  sort: AminalSort = 'most-loved'
): Aminal[] => {
  let processedAminals = [...aminals];

  // Apply filter
  if (filter === 'loved') {
    processedAminals = processedAminals.filter((aminal: Aminal) => {
      const lovers = aminal.lovers?.items || [];
      return lovers.length > 0 && lovers[0]?.love && Number(lovers[0].love) > 0;
    });
  }

  // Apply sort
  processedAminals.sort((a: Aminal, b: Aminal) => {
    switch (sort) {
      case 'most-loved':
        return Number(b.totalLove) - Number(a.totalLove);
      case 'least-loved':
        return Number(a.totalLove) - Number(b.totalLove);
      case 'oldest':
        return Number(a.blockTimestamp) - Number(b.blockTimestamp);
      case 'youngest':
        return Number(b.blockTimestamp) - Number(a.blockTimestamp);
      case 'richest':
        return Number(b.ethBalance) - Number(a.ethBalance);
      case 'poorest':
        return Number(a.ethBalance) - Number(b.ethBalance);
      default:
        return 0;
    }
  });

  return processedAminals;
};

/**
 * Calculate derived stats for an aminal
 */
export const calculateAminalStats = (aminal: Aminal) => {
  const totalLove = Number(aminal.totalLove || 0);
  const energy = Number(aminal.energy || 0);
  const ethBalance = Number(aminal.ethBalance || 0);
  const lovers = aminal.lovers?.items || [];
  const userLove =
    lovers.length > 0 && lovers[0] ? Number(lovers[0].love || 0) : 0;

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
 */
export const formatAminalForDisplay = (aminal: Aminal) => {
  const stats = calculateAminalStats(aminal);

  // Convert traits array to individual fields for backward compatibility
  const aminalWithFields = traitsArrayToFields(aminal as unknown as AminalWithTraitsArray);

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
      blockTimestamp: Number(aminal.blockTimestamp || 0),
      createdAt: new Date(Number(aminal.blockTimestamp || 0) * 1000),
    },
  };
};

/**
 * Validate aminal data structure
 */
export const validateAminal = (aminal: any): aminal is Aminal => {
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
  aminals: Aminal[],
  searchTerm: string
): Aminal[] => {
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
export const groupAminalsByLoveRange = (aminals: Aminal[]) => {
  const groups = {
    high: [] as Aminal[], // > 10 love
    medium: [] as Aminal[], // 1-10 love
    low: [] as Aminal[], // 0-1 love
  };

  aminals.forEach((aminal) => {
    const totalLove = Number(aminal.totalLove || 0);

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
export const calculateCollectionStats = (aminals: Aminal[]) => {
  const totalAminals = aminals.length;
  const totalLove = aminals.reduce(
    (sum, aminal) => sum + Number(aminal.totalLove || 0),
    0
  );
  const totalEnergy = aminals.reduce(
    (sum, aminal) => sum + Number(aminal.energy || 0),
    0
  );
  const averageLove = totalAminals > 0 ? totalLove / totalAminals : 0;
  const averageEnergy = totalAminals > 0 ? totalEnergy / totalAminals : 0;

  const mostLoved = aminals.reduce(
    (max, aminal) =>
      Number(aminal.totalLove || 0) > Number(max.totalLove || 0) ? aminal : max,
    aminals[0]
  );

  const mostEnergetic = aminals.reduce(
    (max, aminal) =>
      Number(aminal.energy || 0) > Number(max.energy || 0) ? aminal : max,
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
