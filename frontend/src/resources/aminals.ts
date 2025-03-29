import { useQuery } from '@tanstack/react-query';
import { Aminal, AminalsListDocument, AminalByIdDocument, AminalByIdQuery, execute } from '../../.graphclient';

const BASE_KEY = 'aminals';

export const useAminals = (userAddress: string) => {
  return useQuery<Aminal[]>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(AminalsListDocument, {
        first: 10,
        skip: 0,
        address: userAddress,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.aminals;
    },
  });
};

export const useAminal = (aminalId: string) => {
  return useQuery<AminalByIdQuery['aminals'][0] | undefined>({
    queryKey: [BASE_KEY, aminalId],
    queryFn: async () => {
      console.log('Fetching aminal with ID:', aminalId);
      
      const response = await execute(AminalByIdDocument, { 
        aminalId: aminalId // Pass the string directly, no BigInt conversion
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
