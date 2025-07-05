import { useQuery } from '@tanstack/react-query';
import {
  execute,
  VisualGeneProposalsListDocument,
  GeneProposal,
  GeneProposalsByAuctionDocument,
} from '../../.graphclient';

const BASE_KEY = 'visuals';

export const useVisualsProposals = () => {
  return useQuery<GeneProposal[]>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(VisualGeneProposalsListDocument, {});
      if (response.errors) throw new Error(response.errors[0].message);
      console.log('response.... gene proposals == ', response.data.geneProposals);
      return response.data.geneProposals;
    },
  });
};

export const useVisualProposalsByAuctionId = (auctionId: string) => {
  return useQuery<GeneProposal[]>({
    queryKey: [BASE_KEY, 'auction', auctionId],
    queryFn: async () => {
      const response = await execute(GeneProposalsByAuctionDocument, {
        auctionId,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneProposals;
    },
  });
};
