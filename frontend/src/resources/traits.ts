import { useQuery } from '@tanstack/react-query';
import { TraitsListDocument, TraitsListQuery, execute } from '../../.graphclient';

const BASE_KEY = 'traits';

export const useTraits = () => {
  return useQuery<TraitsListQuery['traits']>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(TraitsListDocument, {});
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.traits;
    },
  });
};
