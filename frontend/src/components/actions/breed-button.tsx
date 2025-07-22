import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { decodeEventLog, isAddress } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  aminalFactoryAbi,
  aminalFactoryAddress,
} from '../../contracts/generated';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function BreedButton({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) {
  const { isConnected, chain, address } = useAccount();
  const enabled = isConnected && chain;
  const [partnerAddress, setPartnerAddress] = useState<string>('');
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Log transaction initiation
  useEffect(() => {
    if (hash) {
      console.log('💕 Breed transaction initiated:', {
        hash,
        aminalAddress: contractAddress,
        partnerAddress,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: aminalFactoryAddress,
        timestamp: new Date().toISOString(),
      });
    }
  }, [hash, contractAddress, partnerAddress, address, chain?.id]);

  // Handle transaction success and extract auction ID for redirect
  useEffect(() => {
    if (isConfirmed && receipt) {
      console.log('✅ Breed transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed?.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        status: receipt.status,
        transactionIndex: receipt.transactionIndex,
        aminalAddress: contractAddress,
        partnerAddress,
        timestamp: new Date().toISOString(),
      });

      try {
        // Find the BreedAminal event in the transaction logs
        const breedAminalEvent = receipt.logs.find((log) => {
          try {
            const decoded = decodeEventLog({
              abi: aminalFactoryAbi,
              data: log.data,
              topics: log.topics,
            });
            return decoded.eventName === 'BreedAminal';
          } catch {
            return false;
          }
        });

        if (breedAminalEvent) {
          const decoded = decodeEventLog({
            abi: aminalFactoryAbi,
            data: breedAminalEvent.data,
            topics: breedAminalEvent.topics,
          });

          if (decoded.eventName === 'BreedAminal') {
            const auctionId = decoded.args.auctionId;

            toast.success(
              '🍼 Gene auction started! Redirecting to voting page...',
              {
                id: 'breed-tx',
                duration: 4000,
              }
            );

            queryClient.invalidateQueries({
              queryKey: ['aminal-by-address', contractAddress],
            });
            queryClient.invalidateQueries({ queryKey: ['aminals'] });

            // Redirect to the gene auction page
            setTimeout(() => {
              router.push(`/breeding/${auctionId}`);
            }, 1500); // Small delay to let toast show and ensure subgraph indexing

            return;
          }
        }

        // Fallback if event not found
        toast.success(
          '🍼 Gene auction started! Check the breeding page for your auction.',
          {
            id: 'breed-tx',
            duration: 6000,
          }
        );

        queryClient.invalidateQueries({
          queryKey: ['aminal-by-address', contractAddress],
        });
        queryClient.invalidateQueries({ queryKey: ['aminals'] });
      } catch (error) {
        console.error('Error parsing transaction receipt:', error);
        toast.success(
          '🍼 Gene auction started! Check the breeding page for your auction.',
          {
            id: 'breed-tx',
            duration: 6000,
          }
        );

        queryClient.invalidateQueries({
          queryKey: ['aminal-by-address', contractAddress],
        });
        queryClient.invalidateQueries({ queryKey: ['aminals'] });
      }
    }
  }, [
    isConfirmed,
    receipt,
    hash,
    contractAddress,
    partnerAddress,
    queryClient,
    router,
  ]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
        aminalAddress: contractAddress,
        partnerAddress,
        userAddress: address,
        chainId: chain?.id,
        contractAddress: aminalFactoryAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Breed transaction failed:', errorDetails);

      // More specific error messages based on error type
      let errorMessage = 'Transaction failed. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds. You need ETH for gas fees.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('breeding')) {
        errorMessage =
          'Breeding error. Check if both Aminals are eligible to breed.';
      }

      toast.error(errorMessage, { id: 'breed-tx' });
    }
  }, [error, contractAddress, partnerAddress, address, chain?.id]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      const receiptErrorDetails = {
        message: receiptError.message,
        name: receiptError.name,
        cause: receiptError.cause,
        hash,
        aminalAddress: contractAddress,
        partnerAddress,
        timestamp: new Date().toISOString(),
      };

      console.error('❌ Breed transaction receipt error:', receiptErrorDetails);
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [receiptError, hash, contractAddress, partnerAddress]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      console.log('⏳ Breed transaction pending...', {
        aminalAddress: contractAddress,
        partnerAddress,
        userAddress: address,
        timestamp: new Date().toISOString(),
      });
      toast.loading('Preparing transaction...', { id: 'breed-tx' });
    }
  }, [isPending, contractAddress, partnerAddress, address]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      console.log('🔄 Breed transaction confirming...', {
        hash,
        aminalAddress: contractAddress,
        partnerAddress,
        timestamp: new Date().toISOString(),
      });

      toast.loading('Starting gene auction...', { id: 'breed-tx' });
    }
  }, [isConfirming, hash, contractAddress, partnerAddress]);

  function startBreeding() {
    if (!enabled || !isAddress(partnerAddress)) {
      toast.error('Please enter a valid partner contract address');
      return;
    }

    // Log the contract call parameters
    console.log('🚀 Initiating breed transaction:', {
      contractAddress: aminalFactoryAddress,
      functionName: 'breedAminals',
      aminalAddress: contractAddress,
      partnerAddress,
      userAddress: address,
      chainId: chain?.id,
      timestamp: new Date().toISOString(),
    });

    writeContract({
      abi: aminalFactoryAbi,
      address: aminalFactoryAddress,
      functionName: 'breedAminals',
      args: [contractAddress, partnerAddress as `0x${string}`],
    });
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Enter partner contract address (0x...)"
        value={partnerAddress}
        onChange={(e) => setPartnerAddress(e.target.value)}
        disabled={isPending || isConfirming}
        className="w-full"
      />

      <Button
        onClick={startBreeding}
        disabled={
          !enabled || !isAddress(partnerAddress) || isPending || isConfirming
        }
        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
      >
        {isPending || isConfirming
          ? '⏳ Starting Auction...'
          : '🍼 Start Gene Auction'}
      </Button>
    </div>
  );
}
