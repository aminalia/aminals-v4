/**
 * VoteOnDesignButton Component
 * Vote on a complete Aminal design in a breeding auction
 */

import { Button } from '@components/ui/Button';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { geneAuctionAbi, geneAuctionAddress } from '../../contracts/generated';

export interface VoteOnDesignButtonProps {
  auctionId: string;
  designId: bigint;
  userVotingPower: bigint;
  isCurrentVote: boolean;
  disabled?: boolean;
  onSuccess?: () => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs' | 'xl';
}

export default function VoteOnDesignButton({
  auctionId,
  designId,
  userVotingPower,
  isCurrentVote,
  disabled = false,
  onSuccess,
  className,
  size = 'default',
}: VoteOnDesignButtonProps) {
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;
  const { writeContract, isPending, data: hash, error } = useWriteContract();

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
      console.log('🗳️ Vote transaction initiated:', {
        hash,
        auctionId,
        designId: designId.toString(),
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, auctionId, designId, address, chain?.id]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt && toastStateRef.current !== 'success') {
      toastStateRef.current = 'success';
      console.log('✅ Vote transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        auctionId,
        designId: designId.toString(),
        timestamp: new Date().toISOString(),
      });

      toast.success('🗳️ Vote cast successfully!', {
        id: 'vote-design-tx',
        duration: 4000,
      });

      if (onSuccess) onSuccess();

      // Reset toast state for next transaction
      toastStateRef.current = null;
    }
  }, [isConfirmed, receipt, hash, auctionId, designId, onSuccess]);

  // Handle transaction errors
  useEffect(() => {
    if (error && toastStateRef.current !== 'error') {
      toastStateRef.current = 'error';
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        auctionId,
        designId: designId.toString(),
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Vote transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to cast vote. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('VotingNotActive')) {
        errorMessage = 'Voting is no longer active for this auction.';
      } else if (error.message.includes('NoVotingPower')) {
        errorMessage = 'You have no voting power in this auction.';
      } else if (error.message.includes('DesignAlreadyRemoved')) {
        errorMessage = 'This design has been removed from the auction.';
      }

      toast.error(errorMessage, {
        id: 'vote-design-tx',
      });
    }
  }, [error, auctionId, designId, address, chain?.id]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError && toastStateRef.current !== 'receiptError') {
      toastStateRef.current = 'receiptError';
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        auctionId,
        designId: designId.toString(),
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Vote transaction receipt error:', receiptErrorDetails);
      toast.error('Vote failed. Please try again.', {
        id: 'vote-design-tx',
      });
    }
  }, [receiptError, hash, auctionId, designId]);

  // Handle pending state
  useEffect(() => {
    if (isPending && toastStateRef.current !== 'pending') {
      toastStateRef.current = 'pending';
      console.log('⏳ Vote transaction pending...', {
        auctionId,
        designId: designId.toString(),
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Casting vote...', { id: 'vote-design-tx' });
    }
  }, [isPending, auctionId, designId, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming && toastStateRef.current !== 'confirming') {
      toastStateRef.current = 'confirming';
      console.log('🔄 Vote transaction confirming...', {
        hash,
        auctionId,
        designId: designId.toString(),
        timestamp: new Date().toISOString(),
      });
      toast.loading('Confirming vote...', { id: 'vote-design-tx' });
    }
  }, [isConfirming, hash, auctionId, designId]);

  const handleVote = () => {
    if (!enabled) {
      toast.error('Please connect your wallet');
      return;
    }

    if (userVotingPower === 0n) {
      toast.error('You have no voting power in this auction');
      return;
    }

    // Log the contract call parameters
    console.log('🚀 Initiating vote transaction:', {
      contractAddress: geneAuctionAddress,
      functionName: 'voteOnDesign',
      auctionId: BigInt(auctionId).toString(),
      designId: designId.toString(),
      userAddress: address,
      votingPower: userVotingPower.toString(),
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: geneAuctionAbi,
      address: geneAuctionAddress,
      functionName: 'voteOnDesign',
      args: [BigInt(auctionId), designId],
    });
  };

  return (
    <Button
      type="button"
      onClick={handleVote}
      disabled={!enabled || disabled || isPending || isConfirming}
      variant={isCurrentVote ? 'outline' : 'energy'}
      size={size}
      className={className}
    >
      <span className="flex items-center justify-center gap-2">
        {isPending || isConfirming ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            {isPending ? 'Casting Vote...' : 'Confirming...'}
          </>
        ) : !enabled ? (
          <>Connect Wallet</>
        ) : isCurrentVote ? (
          <>✓ Change Vote</>
        ) : (
          <>🗳️ Vote ({userVotingPower.toString()} ❤️)</>
        )}
      </span>
    </Button>
  );
}
