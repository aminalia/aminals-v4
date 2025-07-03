import { useQuery } from '@tanstack/react-query';
import {
  execute,
  VisualListDocument,
  VisualProposal,
  VisualProposalListByAuctionIdDocument,
} from '../../.graphclient';

const BASE_KEY = 'visuals';

export const useVisualsProposals = () => {
  return useQuery<VisualProposal[]>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(VisualListDocument, {
        first: 10,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      console.log('response.... visuals == ', response.data.visualProposals);
      return response.data.visualProposals;
    },
  });
};

export const useVisualProposalsByAuctionId = (auctionId: string) => {
  return useQuery<VisualProposal[]>({
    queryKey: [BASE_KEY, 'auction', auctionId],
    queryFn: async () => {
      const response = await execute(VisualProposalListByAuctionIdDocument, {
        auctionId,
        first: 100,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.visualProposals;
    },
  });
};
