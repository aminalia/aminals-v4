import { useQuery } from '@tanstack/react-query';
import {
  GeneAuction,
  GeneAuctionDocument,
  GeneAuctionQuery,
  GeneAuctionsListDocument,
  GeneProposal,
  execute,
} from '../../.graphclient';

const BASE_KEY = 'auctions';

export const useAuctions = () => {
  return useQuery<GeneAuction[]>({
    queryKey: [BASE_KEY, 'list'],
    queryFn: async () => {
      const response = await execute(GeneAuctionsListDocument, {
        first: 10,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneAuctions;
    },
  });
};

export const useAuction = (auctionId: string) => {
  return useQuery<GeneAuction | null>({
    queryKey: [BASE_KEY, auctionId ?? ''],
    queryFn: async () => {
      const response = await execute(GeneAuctionDocument, {
        id: auctionId,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneAuction;
    },
  });
};

export const useAuctionProposeVisuals = (auctionId: string) => {
  return useQuery<GeneProposal[]>({
    queryKey: [BASE_KEY, auctionId ?? '', 'proposals'],
    queryFn: async () => {
      const response = await execute(GeneAuctionDocument, {
        id: auctionId,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneAuction?.proposals || [];
    },
  });
};

export const useProposeVisuals = () => {
  return useQuery<GeneProposal[]>({
    queryKey: [BASE_KEY, 'all', 'proposals'],
    queryFn: async () => {
      const response = await execute(GeneAuctionsListDocument, {
        first: 1000,
        skip: 0,
      });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.geneAuctions.flatMap((auction: any) => auction.proposals);
    },
  });
};
