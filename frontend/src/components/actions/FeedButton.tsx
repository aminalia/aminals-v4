import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { parseEther } from 'viem';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { aminalAbi } from '../../contracts/generated';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

export default function FeedButton({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) {
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedAmount, setFeedAmount] = useState('0.1');

  // Get the love amount for the current feed amount
  const { data: loveForAmount } = useReadContract({
    address: contractAddress,
    abi: aminalAbi,
    functionName: 'getLoveForAmount',
    args: feedAmount ? [parseEther(feedAmount)] : undefined,
    query: {
      enabled: !!feedAmount && parseFloat(feedAmount) >= 0.001,
    },
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Track which toast has been shown to prevent duplicates
  const toastStateRef = useRef<string | null>(null);

  // Log transaction initiation
  useEffect(() => {
    if (hash) {
      console.log('🍖 Feed aminal transaction initiated:', {
        hash,
        aminalAddress: contractAddress,
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, contractAddress, address, chain?.id]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt && toastStateRef.current !== 'success') {
      toastStateRef.current = 'success';
      console.log('✅ Feed aminal transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        aminalAddress: contractAddress,
        timestamp: new Date().toISOString(),
      });

      toast.success('🍖 Aminal fed successfully! Energy increased!', {
        id: 'feed-tx',
        duration: 5000,
      });

      // Refresh the data - invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ['aminal-by-address', contractAddress],
      });
      queryClient.invalidateQueries({ queryKey: ['aminals'] });

      // Reset toast state for next transaction
      toastStateRef.current = null;
    }
  }, [isConfirmed, receipt, hash, contractAddress, queryClient]);

  // Handle transaction errors
  useEffect(() => {
    if (error && toastStateRef.current !== 'error') {
      toastStateRef.current = 'error';
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        aminalAddress: contractAddress,
        userAddress: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Feed aminal transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to feed Aminal. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage =
          'Insufficient funds. You need at least 0.001 ETH plus gas fees.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      toast.error(errorMessage, { id: 'feed-tx' });
    }
  }, [error, contractAddress, address, chain?.id]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError && toastStateRef.current !== 'receiptError') {
      toastStateRef.current = 'receiptError';
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        aminalAddress: contractAddress,
        timestamp: new Date().toISOString(),
      };

      console.error(
        '❌ Feed aminal transaction receipt error:',
        receiptErrorDetails
      );
      toast.error('Transaction failed. Please try again.', { id: 'feed-tx' });
    }
  }, [receiptError, hash, contractAddress]);

  // Handle pending state
  useEffect(() => {
    if (isPending && toastStateRef.current !== 'pending') {
      toastStateRef.current = 'pending';
      console.log('⏳ Feed aminal transaction pending...', {
        aminalAddress: contractAddress,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Preparing transaction...', { id: 'feed-tx' });
    }
  }, [isPending, contractAddress, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming && toastStateRef.current !== 'confirming') {
      toastStateRef.current = 'confirming';
      console.log('🔄 Feed aminal transaction confirming...', {
        hash,
        aminalAddress: contractAddress,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Transaction submitted, waiting for confirmation...', {
        id: 'feed-tx',
      });
    }
  }, [isConfirming, hash, contractAddress]);

  function openModal() {
    if (!enabled || !contractAddress) {
      console.warn(
        '⚠️ Feed aminal attempted but wallet not connected or no contract address:',
        {
          isConnected,
          contractAddress,
          chainId: chain?.id,
          timestamp: new Date().toISOString(),
        }
      );
      return;
    }
    setIsModalOpen(true);
  }

  function action() {
    // Log the contract call parameters
    console.log('🚀 Initiating feed aminal transaction:', {
      contractAddress,
      functionName: 'feed',
      value: parseEther(feedAmount).toString(),
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: aminalAbi,
      address: contractAddress,
      functionName: 'feed',
      args: [],
      value: parseEther(feedAmount),
    });

    setIsModalOpen(false);
  }

  return (
    <>
      <Button
        onClick={openModal}
        disabled={!enabled || isPending || isConfirming}
        variant="feed"
        className="w-full"
      >
        {isPending
          ? '⏳ Feeding...'
          : isConfirming
          ? '⏳ Confirming...'
          : '🍖 Feed Aminal'}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Feed Aminal"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="feed-amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount (ETH)
            </label>
            <Input
              id="feed-amount"
              type="number"
              step="0.001"
              min="0.001"
              value={feedAmount}
              onChange={(e) => setFeedAmount(e.target.value)}
              placeholder="0.1"
            />
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-500">
                Minimum: 0.001 ETH
              </p>
              {loveForAmount !== undefined && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                  <p className="text-base font-semibold text-pink-700">
                    💖 Love gained: {loveForAmount.toString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="default"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={action}
              variant="feed"
              className="flex-1"
              disabled={!feedAmount || parseFloat(feedAmount) < 0.001}
            >
              Feed 🍖
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
