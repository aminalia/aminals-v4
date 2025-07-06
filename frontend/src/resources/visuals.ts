import { useQuery } from '@tanstack/react-query';
import {
  execute,
  VisualGeneProposalsListDocument,
  GeneProposal,
  GeneProposalsByAuctionDocument,
} from '../../.graphclient';

const BASE_KEY = 'visuals';

// Helper function to convert auction ID to hex format expected by GraphQL
const toHexAuctionId = (auctionId: string): string => {
  if (!/^0x/.test(auctionId)) {
    // Convert auction ID to proper hex format: "1" -> "0x01000000"
    // The auction ID goes in the first byte, followed by zeros
    const auctionNum = parseInt(auctionId);
    const hexId = (auctionNum * 0x1000000).toString(16).padStart(8, '0');
    return `0x${hexId}`;
  }
  return auctionId;
};

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
        auctionId: toHexAuctionId(auctionId),
        first: 100,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneProposals || [];
    },
    enabled: !!auctionId,
  });
};
