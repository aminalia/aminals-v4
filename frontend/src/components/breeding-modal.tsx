import { cn } from '@/lib/utils';
import { useAminals } from '@/resources/aminals';
import { X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { decodeEventLog, isAddress } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { aminalFactoryAbi, aminalFactoryAddress } from '../contracts/generated';
import { AminalVisualImage } from './aminal-card';
import { Button } from './ui/button';

interface BreedingModalProps {
  aminal: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BreedingModal({
  aminal,
  isOpen,
  onClose,
  onSuccess,
}: BreedingModalProps) {
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isConnected, chain, address } = useAccount();
  const router = useRouter();
  const enabled = isConnected && chain;

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch available Aminals for selection
  const { data: aminals, isLoading: isLoadingAminals } = useAminals(
    address || '',
    'loved',
    'most-loved'
  );

  // Filter out current aminal
  const availableAminals = useMemo(() => {
    if (!aminals) return [];

    return aminals
      .filter((a: any) => a.contractAddress !== aminal.contractAddress)
      .sort((a: any, b: any) => {
        // Sort by total love in descending order
        return Number(b.totalLove) - Number(a.totalLove);
      });
  }, [aminals, aminal]);

  // Handle transaction success and extract auction ID for redirect
  useEffect(() => {
    if (isConfirmed && receipt) {
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

            onSuccess?.();
            onClose();
            // Reset form
            setSelectedPartner(null);

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
        onSuccess?.();
        onClose();
        setSelectedPartner(null);
      } catch (error) {
        console.error('Error parsing transaction receipt:', error);
        toast.success(
          '🍼 Gene auction started! Check the breeding page for your auction.',
          {
            id: 'breed-tx',
            duration: 6000,
          }
        );
        onSuccess?.();
        onClose();
        setSelectedPartner(null);
      }
    }
  }, [isConfirmed, receipt, onSuccess, onClose, router]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error('Breeding transaction failed:', error);
      let errorMessage = 'Transaction failed. Please try again.';
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds. You need ETH for gas fees.';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      }
      toast.error(errorMessage, { id: 'breed-tx' });
    }
  }, [error]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('Breeding transaction receipt error:', receiptError);
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [receiptError]);

  // Handle pending state
  useEffect(() => {
    if (isPending) {
      toast.loading('Preparing transaction...', { id: 'breed-tx' });
    }
  }, [isPending]);

  // Handle confirmation state
  useEffect(() => {
    if (isConfirming) {
      toast.loading('Starting gene auction...', { id: 'breed-tx' });
    }
  }, [isConfirming]);

  const handleBreeding = () => {
    if (!enabled) return;

    const partnerAddress = selectedPartner?.contractAddress;
    if (!partnerAddress || !isAddress(partnerAddress)) {
      toast.error('Please select a valid partner');
      return;
    }

    writeContract({
      abi: aminalFactoryAbi,
      address: aminalFactoryAddress,
      functionName: 'breedAminals',
      args: [aminal.contractAddress, partnerAddress as `0x${string}`],
    });
  };

  const getActionText = () => {
    if (!enabled) return 'Connect Wallet';
    if (isPending || isConfirming) {
      return 'Starting Auction...';
    }
    return '🍼 Start Gene Auction';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">
              Find Breeding Partner
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
              Select one of your loved Aminals to breed with.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0 ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {/* Selection Method */}
          <div className="mb-6">
            <div>
              {/* Aminals Grid */}
              {isLoadingAminals ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : !availableAminals || availableAminals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No available Aminals found
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {availableAminals.map((aminalOption: any) => (
                    <div
                      key={aminalOption.id}
                      className={cn(
                        'border-2 rounded-lg p-2 sm:p-3 cursor-pointer transition-all active:scale-95',
                        selectedPartner?.id === aminalOption.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                      onClick={() => setSelectedPartner(aminalOption)}
                    >
                      <div className="aspect-square mb-2 bg-gray-50 rounded-lg overflow-hidden">
                        <AminalVisualImage aminal={aminalOption} />
                      </div>
                      <div className="text-center space-y-1">
                        <div className="text-xs sm:text-sm font-medium truncate">
                          Aminal #{aminalOption.aminalIndex}
                        </div>
                        <div className="text-xs text-gray-600">
                          {Number(aminalOption.totalLove).toFixed(0)} ❤️
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Partner Info */}
          {selectedPartner && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Selected Partner
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-blue-200">
                  <AminalVisualImage aminal={selectedPartner} />
                </div>
                <div>
                  <div className="font-medium">
                    Aminal #{selectedPartner.aminalIndex}
                  </div>
                  <div className="text-sm text-blue-700">
                    {selectedPartner.contractAddress}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between shrink-0">
          <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
            Start the gene auction to create offspring with your selected
            partner
          </div>
          <div className="flex gap-3 order-1 sm:order-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBreeding}
              disabled={
                !enabled || !selectedPartner || isPending || isConfirming
              }
              className={cn(
                'bg-green-600 hover:bg-green-700 text-white',
                'disabled:opacity-50 flex-1 sm:flex-initial'
              )}
            >
              {getActionText()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
