import { useQuery } from '@tanstack/react-query';
import {
  Aminal,
  AminalByIdDocument,
  AminalByIdQuery,
  AminalByContractAddressDocument,
  AminalByContractAddressQuery,
  AminalForChatDocument,
  AminalForChatQuery,
  AminalsListDocument,
  execute,
} from '../../.graphclient';
import {
  AminalFilter,
  AminalSort,
  transformAminals,
} from '../lib/data-transformers';
import { handleGraphQLError, queryKeys } from '../lib/query-client';

export type { AminalFilter, AminalSort };

export const useAminals = (
  userAddress: string,
  filter: AminalFilter = 'all',
  sort: AminalSort = 'most-loved'
) => {
  return useQuery<Aminal[]>({
    queryKey: queryKeys.aminals.list(filter, sort, userAddress),
    queryFn: async () => {
      try {
        const response = await execute(AminalsListDocument, {
          first: 100,
          skip: 0,
          address: userAddress,
        });

        if (response.errors) {
          console.error('GraphQL errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        const aminals = response.data?.aminals?.items || [];

        // Use data transformer to apply filter and sort
        return transformAminals(aminals, filter, sort);
      } catch (error) {
        console.error('Failed to fetch aminals:', error);
        throw error;
      }
    },
  });
};

export const useAminal = (aminalId: string) => {
  return useQuery<AminalByIdQuery['aminal'] | undefined>({
    queryKey: queryKeys.aminals.detail(aminalId),
    queryFn: async () => {
      try {
        console.log('Fetching aminal with ID:', aminalId);

        const response = await execute(AminalByIdDocument, {
          contractAddress: aminalId, // Use contractAddress as the query parameter
        });

        console.log('GraphQL Response:', response);

        if (response.errors) {
          console.error('GraphQL Errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        console.log('Aminal:', response.data.aminal);

        return response.data.aminal;
      } catch (error) {
        console.error('Failed to fetch aminal:', error);
        throw error;
      }
    },
    enabled: !!aminalId,
  });
};

export const useAminalForChat = (contractAddress: string, userAddress: string) => {
  return useQuery<AminalForChatQuery['aminal'] | undefined>({
    queryKey: queryKeys.aminals.chat(contractAddress, userAddress),
    queryFn: async () => {
      try {
        const response = await execute(AminalForChatDocument, {
          contractAddress,
          address: userAddress,
        });

        if (response.errors) {
          console.error('GraphQL errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        return response.data?.aminal;
      } catch (error) {
        console.error('Failed to fetch aminal for chat:', error);
        throw error;
      }
    },
    enabled: !!contractAddress && contractAddress !== 'undefined' && !!userAddress,
  });
};

export const useAminalByContractAddress = (contractAddress: string, userAddress: string) => {
  return useQuery<AminalByContractAddressQuery['aminal'] | undefined>({
    queryKey: queryKeys.aminals.detail(contractAddress),
    queryFn: async () => {
      try {
        const response = await execute(AminalByContractAddressDocument, {
          contractAddress,
          address: userAddress,
        });

        if (response.errors) {
          console.error('GraphQL errors:', response.errors);
          throw handleGraphQLError(response.errors);
        }

        return response.data?.aminal;
      } catch (error) {
        console.error('Failed to fetch aminal by contract address:', error);
        throw error;
      }
    },
    enabled: !!contractAddress && contractAddress !== 'undefined',
  });
};
