import { useQuery } from '@tanstack/react-query';
import {
  Aminal,
  AminalByIdDocument,
  AminalByIdQuery,
  AminalsListDocument,
  execute,
} from '../../.graphclient';

const BASE_KEY = 'aminals';

export type AminalFilter = 'all' | 'loved';
export type AminalSort = 'most-loved' | 'least-loved' | 'oldest' | 'youngest';

export const useAminals = (
  userAddress: string,
  filter: AminalFilter = 'all',
  sort: AminalSort = 'most-loved'
) => {
  return useQuery<Aminal[]>({
    queryKey: [BASE_KEY, filter, sort],
    queryFn: async () => {
      const response = await execute(AminalsListDocument, {
        first: 100, // Increase to get more aminals
        skip: 0,
        address: userAddress,
      });
      if (response.errors) throw new Error(response.errors[0].message);

      let aminals = response.data.aminals;

      // Apply filter
      if (filter === 'loved') {
        aminals = aminals.filter(
          (aminal: Aminal) =>
            aminal.lovers &&
            aminal.lovers.length > 0 &&
            aminal.lovers[0]?.love &&
            Number(aminal.lovers[0].love) > 0
        );
      }

      // Apply sort
      if (sort === 'most-loved') {
        aminals.sort(
          (a: Aminal, b: Aminal) => Number(b.totalLove) - Number(a.totalLove)
        );
      } else if (sort === 'least-loved') {
        aminals.sort(
          (a: Aminal, b: Aminal) => Number(a.totalLove) - Number(b.totalLove)
        );
      } else if (sort === 'oldest') {
        aminals.sort(
          (a: Aminal, b: Aminal) =>
            Number(a.blockTimestamp) - Number(b.blockTimestamp)
        );
      } else if (sort === 'youngest') {
        aminals.sort(
          (a: Aminal, b: Aminal) =>
            Number(b.blockTimestamp) - Number(a.blockTimestamp)
        );
      }

      return aminals;
    },
  });
};

export const useAminal = (aminalId: string) => {
  return useQuery<AminalByIdQuery['aminals'][0] | undefined>({
    queryKey: [BASE_KEY, aminalId],
    queryFn: async () => {
      console.log('Fetching aminal with ID:', aminalId);

      const response = await execute(AminalByIdDocument, {
        aminalId: aminalId, // Pass the string directly, no BigInt conversion
      });

      console.log('GraphQL Response:', response);

      if (response.errors) {
        console.error('GraphQL Errors:', response.errors);
        throw new Error(response.errors[0].message);
      }

      console.log('Aminals array:', response.data.aminals);
      console.log('First aminal:', response.data.aminals[0]);

      return response.data.aminals[0];
    },
    enabled: !!aminalId,
  });
};
