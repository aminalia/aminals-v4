import { useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
const geneAuctionAbi = require('../../../deployments/GeneAuction.json').abi;

const GENE_AUCTION_ADDRESS = '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605' as const;

export default function BulkVoteButton({
  auctionId,
  backId,
  armId,
  tailId,
  earsId,
  bodyId,
  faceId,
  mouthId,
  miscId,
}: {
  auctionId: any;
  backId: any;
  armId: any;
  tailId: any;
  earsId: any;
  bodyId: any;
  faceId: any;
  mouthId: any;
  miscId: any;
}) {
  const traitIds = [backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId];

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
      toast.success('🗳️ All votes cast successfully!', {
        id: 'bulk-vote-tx',
        duration: 4000,
      });
    }
  }, [isConfirmed]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error('Bulk vote transaction failed:', error);
      toast.error('Failed to cast votes. Please try again.', { 
        id: 'bulk-vote-tx' 
      });
    }
  }, [error]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('Bulk vote transaction receipt error:', receiptError);
      toast.error('Votes failed. Please try again.', { 
        id: 'bulk-vote-tx' 
      });
    }
  }, [receiptError]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      toast.loading('Casting votes...', { id: 'bulk-vote-tx' });
    }
  }, [isPending]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      toast.loading('Confirming votes...', { id: 'bulk-vote-tx' });
    }
  }, [isConfirming]);

  const action = () => {
    if (enabled) {
      // Convert trait IDs to BigInt array (8 elements for all categories)
      const geneIds = traitIds.map(id => BigInt(id));
      
      writeContract({
        abi: geneAuctionAbi,
        address: GENE_AUCTION_ADDRESS,
        functionName: 'bulkVoteOnGenes',
        args: [
          BigInt(auctionId),
          geneIds, // Just the gene IDs array
        ],
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={action}
      disabled={!enabled || isPending || isConfirming}
      className={enabled ? 'w-full' : 'w-full text-neutral-400'}
    >
      {isPending || isConfirming 
        ? 'Voting...' 
        : 'Vote on Selected Traits'
      }
    </Button>
  );
}
