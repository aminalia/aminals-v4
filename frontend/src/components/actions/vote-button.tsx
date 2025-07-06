import { useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
const geneAuctionAbi = require('../../../deployments/GeneAuction.json').abi;

const GENE_AUCTION_ADDRESS = '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605' as const;

export default function VoteButton({
  auctionId,
  catId,
  vizId,
}: {
  auctionId: any;
  catId: any;
  vizId: any;
}) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContract, isPending, data: hash, error } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed) {
      toast.success('🗳️ Vote cast successfully!', {
        id: `vote-${catId}-${vizId}`,
        duration: 3000,
      });
    }
  }, [isConfirmed, catId, vizId]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error('Vote transaction failed:', error);
      toast.error('Failed to cast vote. Please try again.', { 
        id: `vote-${catId}-${vizId}` 
      });
    }
  }, [error, catId, vizId]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('Vote transaction receipt error:', receiptError);
      toast.error('Vote failed. Please try again.', { 
        id: `vote-${catId}-${vizId}` 
      });
    }
  }, [receiptError, catId, vizId]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      toast.loading('Casting vote...', { id: `vote-${catId}-${vizId}` });
    }
  }, [isPending, catId, vizId]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      toast.loading('Confirming vote...', { id: `vote-${catId}-${vizId}` });
    }
  }, [isConfirming, catId, vizId]);

  const action = () => {
    if (enabled) {
      writeContract({
        abi: geneAuctionAbi,
        address: GENE_AUCTION_ADDRESS,
        functionName: 'voteOnGene',
        args: [BigInt(auctionId), catId, BigInt(vizId)], // No vote weight needed
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={action}
      disabled={!enabled || isPending || isConfirming}
      className={cn(
        enabled ? '' : 'text-neutral-400',
        (isPending || isConfirming) && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isPending || isConfirming 
        ? 'Voting...' 
        : `Vote on Gene ${vizId}`
      }
    </Button>
  );
}
