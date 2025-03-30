import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
  TraitByIdDocument,
  TraitByIdQuery,
  TraitsListDocument,
  TraitsListQuery,
  execute,
} from '../../.graphclient';

const BASE_KEY = 'traits';

export type TraitFilter = 'all' | 'yours';
export type TraitSort = 'aminals-count' | 'created-at';
export type CategoryFilter =
  | 'all'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7';

type Trait = TraitsListQuery['traits'][number];

export const useTraits = (
  filter: TraitFilter = 'all',
  sort: TraitSort = 'aminals-count',
  category: CategoryFilter = 'all'
) => {
  const { address } = useAccount();

  return useQuery<TraitsListQuery['traits']>({
    queryKey: [BASE_KEY, filter, sort, category, address],
    queryFn: async () => {
      const response = await execute(TraitsListDocument, {});
      if (response.errors) throw new Error(response.errors[0].message);

      let traits = response.data.traits;

      // Apply owner filter
      if (filter === 'yours' && address) {
        traits = traits.filter(
          (trait: Trait) =>
            trait.creator?.address?.toLowerCase() === address?.toLowerCase()
        );
      }

      // Apply category filter
      if (category !== 'all') {
        traits = traits.filter(
          (trait: Trait) => trait.catEnum === Number(category)
        );
      }

      // Apply sort
      if (sort === 'aminals-count') {
        traits.sort(
          (a: Trait, b: Trait) =>
            (b.aminals?.length || 0) - (a.aminals?.length || 0)
        );
      } else if (sort === 'created-at') {
        // Since we don't have a created timestamp in the current data,
        // we can sort by visualId as a proxy for creation time
        traits.sort(
          (a: Trait, b: Trait) => Number(b.visualId) - Number(a.visualId)
        );
      }

      return traits;
    },
  });
};

export const useTrait = (id: string) => {
  return useQuery<TraitByIdQuery['trait']>({
    queryKey: [BASE_KEY, id],
    queryFn: async () => {
      console.log('Fetching trait with ID:', id);

      const response = await execute(TraitByIdDocument, {
        id: id,
      });

      console.log('GraphQL Response:', response);

      if (response.errors) {
        console.error('GraphQL Errors:', response.errors);
        throw new Error(response.errors[0].message);
      }

      return response.data.trait;
    },
    enabled: !!id,
  });
};
