import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
  GeneNFTByIdDocument,
  GeneNFTByIdQuery,
  GeneNFTsListDocument,
  GeneNFTsListQuery,
  GenesByTraitTypeDocument,
  GenesByTraitTypeQuery,
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

type GeneNFT = GeneNFTsListQuery['geneNFTs'][number];

export const useTraits = (
  filter: TraitFilter = 'all',
  sort: TraitSort = 'aminals-count',
  category: CategoryFilter = 'all'
) => {
  const { address } = useAccount();

  return useQuery<GeneNFTsListQuery['geneNFTs']>({
    queryKey: [BASE_KEY, filter, sort, category, address],
    queryFn: async () => {
      const response = await execute(GeneNFTsListDocument, {});
      if (response.errors) throw new Error(response.errors[0].message);

      let geneNFTs = response.data.geneNFTs;

      // Apply owner filter
      if (filter === 'yours' && address) {
        geneNFTs = geneNFTs.filter(
          (gene: GeneNFT) =>
            gene.creator?.address?.toLowerCase() === address?.toLowerCase()
        );
      }

      // Apply category filter
      if (category !== 'all') {
        geneNFTs = geneNFTs.filter(
          (gene: GeneNFT) => gene.traitType === Number(category)
        );
      }

      // Apply sort
      if (sort === 'aminals-count') {
        geneNFTs.sort(
          (a: GeneNFT, b: GeneNFT) =>
            (b.aminalsUsingGene?.length || 0) - (a.aminalsUsingGene?.length || 0)
        );
      } else if (sort === 'created-at') {
        // Sort by tokenId as a proxy for creation time
        geneNFTs.sort(
          (a: GeneNFT, b: GeneNFT) => Number(b.tokenId) - Number(a.tokenId)
        );
      }

      return geneNFTs;
    },
  });
};

export const useTrait = (id: string) => {
  return useQuery<GeneNFTByIdQuery['geneNFT']>({
    queryKey: [BASE_KEY, id],
    queryFn: async () => {
      console.log('Fetching gene NFT with ID:', id);

      const response = await execute(GeneNFTByIdDocument, {
        id: id,
      });

      console.log('GraphQL Response:', response);

      if (response.errors) {
        console.error('GraphQL Errors:', response.errors);
        throw new Error(response.errors[0].message);
      }

      return response.data.geneNFT;
    },
    enabled: !!id,
  });
};
