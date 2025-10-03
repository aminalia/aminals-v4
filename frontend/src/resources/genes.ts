import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
  GeneNftByIdDocument,
  GeneNftByIdQuery,
  GeneNftsListDocument,
  GeneNftsListQuery,
  GenesByIdsDocument,
  GenesByIdsQuery,
  execute,
} from '../../.graphclient';
import {
  CategoryFilter,
  GeneFilter,
  GeneSort,
  transformGenes,
} from '../lib/gene-transformers';
import { handleGraphQLError, queryKeys } from '../lib/query-client';

export type { CategoryFilter, GeneFilter, GeneSort };
export { GenesByIdsDocument, GenesByIdsQuery };

type GeneNFT = GeneNftsListQuery['geneNFTs'][number];

export const useGenes = (
  filter: GeneFilter = 'all',
  sort: GeneSort = 'aminals-count',
  category: CategoryFilter = 'all'
) => {
  const { address } = useAccount();

  return useQuery<GeneNftsListQuery['geneNFTs']>({
    queryKey: queryKeys.genes.list({ filter, sort, category, address }),
    queryFn: async () => {
      try {
        const response = await execute(GeneNftsListDocument, {});

        if (response.errors) {
          console.error('GraphQL errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        if (!response.data) {
          console.error('No data in response:', response);
          throw new Error('No data returned from GraphQL query');
        }

        const geneNFTs = response.data?.geneNFTs || [];

        // Use data transformer to apply filter, sort, and category
        return transformGenes(geneNFTs, filter, sort, category, address);
      } catch (error) {
        console.error('Error in genes query:', error);
        throw error;
      }
    },
  });
};

export const useGene = (id: string) => {
  return useQuery<GeneNftByIdQuery['geneNFT']>({
    queryKey: queryKeys.genes.detail(id),
    queryFn: async () => {
      try {
        const response = await execute(GeneNftByIdDocument, {
          id: id,
        });

        if (response.errors) {
          console.error('GraphQL Errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        return response.data?.geneNFT;
      } catch (error) {
        console.error('Error fetching gene:', error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useGenesByIds = (ids: string[]) => {
  return useQuery<GenesByIdsQuery['geneNFTs']>({
    queryKey: queryKeys.genes.list({ ids: ids.sort() }),
    queryFn: async () => {
      if (ids.length === 0) return [];

      try {
        // Convert string IDs to BigInt for GraphQL
        const bigIntIds = ids.map(id => id);
        
        const response = await execute(GenesByIdsDocument, {
          ids: bigIntIds,
        });

        if (response.errors) {
          console.error('GraphQL Errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        return response.data?.geneNFTs || [];
      } catch (error) {
        console.error('Error fetching genes by IDs:', error);
        throw error;
      }
    },
    enabled: ids.length > 0,
  });
};
