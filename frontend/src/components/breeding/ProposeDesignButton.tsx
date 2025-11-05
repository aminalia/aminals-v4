/**
 * ProposeDesignButton Component
 * Submit a complete Aminal design as a proposal for community voting
 */

import { Button } from '@components/ui/Button';
import { countGenes, placementToContractFormat, validateDesign } from '@hooks';
import type { GeneMetadata } from '../../types/breeding';
import { useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { geneAuctionAbi, geneAuctionAddress } from '../../contracts/generated';

export interface ProposeDesignButtonProps {
  auctionId: string;
  geneIds: bigint[]; // Array of 10, with 0n for empty slots
  placements: GeneMetadata[]; // Array of 10 placement metadata
  disabled?: boolean;
  onSuccess?: (designId?: bigint) => void;
  className?: string;
}

export default function ProposeDesignButton({
  auctionId,
  geneIds,
  placements,
  disabled = false,
  onSuccess,
  className,
}: ProposeDesignButtonProps) {
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

  // Validate design
  const validation = useMemo(() => validateDesign(geneIds), [geneIds]);
  const geneCount = useMemo(() => countGenes(geneIds), [geneIds]);

  // Log transaction initiation
  useEffect(() => {
    if (hash) {
      console.log('🧬 Propose design transaction initiated:', {
        hash,
        auctionId,
        geneCount,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, auctionId, geneCount, address, chain?.id]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && receipt && toastStateRef.current !== 'success') {
      toastStateRef.current = 'success';
      console.log('✅ Propose design transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        auctionId,
        geneCount,
        timestamp: new Date().toISOString(),
      });

      toast.success(
        '🧬 Design proposed successfully! Community can now vote on it.',
        {
          id: 'propose-design-tx',
          duration: 5000,
        }
      );

      if (onSuccess) onSuccess();

      // Reset toast state for next transaction
      toastStateRef.current = null;
    }
  }, [isConfirmed, receipt, hash, auctionId, geneCount, onSuccess]);

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
        geneCount,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: geneAuctionAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Propose design transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Failed to propose design. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('VotingNotActive')) {
        errorMessage = 'Voting is no longer active for this auction.';
      } else if (error.message.includes('InvalidGeneCount')) {
        errorMessage = 'Design must have 1-10 genes.';
      } else if (error.message.includes('InvalidGene')) {
        errorMessage = 'One or more genes are invalid.';
      } else if (error.message.includes('InsufficientLove')) {
        errorMessage =
          'Insufficient love/energy. Need 10 ❤️ + 10 ⚡ from each parent.';
      }

      toast.error(errorMessage, {
        id: 'propose-design-tx',
      });
    }
  }, [error, auctionId, geneCount, address, chain?.id]);

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
        geneCount,
        timestamp: new Date().toISOString(),
      };

      console.error(
        '❌ Propose design transaction receipt error:',
        receiptErrorDetails
      );
      toast.error('Design proposal failed. Please try again.', {
        id: 'propose-design-tx',
      });
    }
  }, [receiptError, hash, auctionId, geneCount]);

  // Handle pending state
  useEffect(() => {
    if (isPending && toastStateRef.current !== 'pending') {
      toastStateRef.current = 'pending';
      console.log('⏳ Propose design transaction pending...', {
        auctionId,
        geneCount,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Proposing design...', { id: 'propose-design-tx' });
    }
  }, [isPending, auctionId, geneCount, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming && toastStateRef.current !== 'confirming') {
      toastStateRef.current = 'confirming';
      console.log('🔄 Propose design transaction confirming...', {
        hash,
        auctionId,
        geneCount,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Confirming proposal...', { id: 'propose-design-tx' });
    }
  }, [isConfirming, hash, auctionId, geneCount]);

  const handlePropose = () => {
    if (!enabled) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid design');
      return;
    }

    // Pad geneIds and placements to arrays of 10
    // Pad to 9 elements (contract expects 9, not 10)
    const paddedGeneIds = [...geneIds.slice(0, 9)];
    while (paddedGeneIds.length < 9) {
      paddedGeneIds.push(0n);
    }

    const paddedPlacements = [...placements.slice(0, 9)];
    while (paddedPlacements.length < 9) {
      paddedPlacements.push({
        offsetX: 0,
        offsetY: 0,
        scale: 100,
        rotation: 0,
      });
    }

    // Convert to contract format
    const contractPlacements = paddedPlacements.map(placementToContractFormat);

    // Log the contract call parameters
    console.log('🚀 Initiating propose design transaction:', {
      contractAddress: geneAuctionAddress,
      functionName: 'proposeDesign',
      auctionId: BigInt(auctionId).toString(),
      geneCount,
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: geneAuctionAbi,
      address: geneAuctionAddress,
      functionName: 'proposeDesign',
      args: [
        BigInt(auctionId),
        paddedGeneIds as [
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint
        ],
        contractPlacements as [
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          },
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          },
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          },
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          },
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          },
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          },
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          },
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          },
          {
            offsetX: number;
            offsetY: number;
            scale: number;
            rotation: number;
          }
        ],
      ],
    });
  };

  return (
    <div className="space-y-2">
      {/* Cost info */}
      <div className="text-sm text-muted-foreground text-center">
        Cost: <span className="font-medium">10 ❤️ + 10 ⚡</span> (from each
        parent)
      </div>

      <Button
        type="button"
        onClick={handlePropose}
        disabled={
          !enabled ||
          !validation.isValid ||
          disabled ||
          isPending ||
          isConfirming
        }
        variant="success"
        size="lg"
        className={`w-full ${className}`}
      >
        <span className="flex items-center justify-center gap-2">
          {isPending || isConfirming ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              {isPending ? 'Proposing...' : 'Confirming...'}
            </>
          ) : !enabled ? (
            <>Connect Wallet</>
          ) : !validation.isValid ? (
            <>{validation.error}</>
          ) : (
            <>🧬 Propose Design ({geneCount} genes)</>
          )}
        </span>
      </Button>
    </div>
  );
}
