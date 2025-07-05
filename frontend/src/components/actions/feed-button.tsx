import { useEffect } from 'react';
import { parseEther } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
const aminalAbi = require('../../../deployments/Aminal.json').abi;

export default function FeedButton({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const queryClient = useQueryClient();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed) {
      toast.success('🍖 Aminal fed successfully! Energy increased!', { 
        id: 'feed-tx',
        duration: 5000,
      });
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['aminal-by-address', contractAddress] });
      queryClient.invalidateQueries({ queryKey: ['aminals-direct'] });
    }
  }, [isConfirmed, queryClient, contractAddress]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error('Feed transaction failed:', error);
      toast.error('Failed to feed Aminal. Please try again.', { id: 'feed-tx' });
    }
  }, [error]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('Transaction receipt error:', receiptError);
      toast.error('Transaction failed. Please try again.', { id: 'feed-tx' });
    }
  }, [receiptError]);

  // Handle pending transaction
  useEffect(() => {
    if (isPending) {
      toast.loading('Preparing transaction...', { id: 'feed-tx' });
    } else if (isConfirming && hash) {
      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'feed-tx' });
    }
  }, [isPending, isConfirming, hash]);

  function action() {
    if (!enabled || !contractAddress) return;

    writeContract({
      abi: aminalAbi,
      address: contractAddress,
      functionName: 'feed',
      args: [],
      value: parseEther('0.01'),
    });
  }

  return (
    <Button
      onClick={action}
      disabled={!enabled || isPending || isConfirming}
      className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
    >
      {isPending ? '⏳ Feeding...' : 
       isConfirming ? '⏳ Confirming...' : 
       '🍖 Feed (0.01 ETH)'}
    </Button>
  );
}
