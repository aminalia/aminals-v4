import { useAminals } from '@hooks';
import { cn } from '@lib/utils';
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
import { AminalVisualImage } from './AminalCard';
import { Button } from './ui/Button';

interface BreedingModalProps {
  aminal?: any; // Optional - if not provided, user selects both aminals
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
  const [selectedFirst, setSelectedFirst] = useState<any>(null);
  const [selectedSecond, setSelectedSecond] = useState<any>(null);
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isConnected, chain, address } = useAccount();
  const router = useRouter();
  const enabled = isConnected && chain;

  // Determine mode: single selection (partner only) or dual selection
  const isDualSelectionMode = !aminal;

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

  // Filter out current aminal (only in single selection mode)
  const availableAminals = useMemo(() => {
    if (!aminals) return [];

    let filtered = aminals;

    // In single selection mode, filter out the pre-selected aminal
    if (!isDualSelectionMode && aminal) {
      filtered = aminals.filter(
        (a: any) => a.contractAddress !== aminal.contractAddress
      );
    }

    return filtered.sort((a: any, b: any) => {
      return Number(b.totalLove) - Number(a.totalLove);
    });
  }, [aminals, aminal, isDualSelectionMode]);

  // Reset selections when modal opens/closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFirst(null);
      setSelectedSecond(null);
    }
  }, [isOpen]);

  // Handle transaction success and extract auction ID for redirect
  useEffect(() => {
    if (isConfirmed && receipt) {
      try {
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
              'Gene auction started! Redirecting to voting page...',
              {
                id: 'breed-tx',
                duration: 4000,
              }
            );

            onSuccess?.();
            onClose();
            setSelectedFirst(null);
            setSelectedSecond(null);

            setTimeout(() => {
              router.push(`/breeding/${auctionId}`);
            }, 1500);

            return;
          }
        }

        toast.success(
          'Gene auction started! Check the breeding page for your auction.',
          {
            id: 'breed-tx',
            duration: 6000,
          }
        );
        onSuccess?.();
        onClose();
        setSelectedFirst(null);
        setSelectedSecond(null);
      } catch (error) {
        console.error('Error parsing transaction receipt:', error);
        toast.success(
          'Gene auction started! Check the breeding page for your auction.',
          {
            id: 'breed-tx',
            duration: 6000,
          }
        );
        onSuccess?.();
        onClose();
        setSelectedFirst(null);
        setSelectedSecond(null);
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

  useEffect(() => {
    if (receiptError) {
      console.error('Breeding transaction receipt error:', receiptError);
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [receiptError]);

  useEffect(() => {
    if (isPending) {
      toast.loading('Preparing transaction...', { id: 'breed-tx' });
    }
  }, [isPending]);

  useEffect(() => {
    if (isConfirming) {
      toast.loading('Starting gene auction...', { id: 'breed-tx' });
    }
  }, [isConfirming]);

  const handleAminalClick = (clickedAminal: any) => {
    if (isDualSelectionMode) {
      // Dual selection mode: toggle selection
      if (selectedFirst?.id === clickedAminal.id) {
        setSelectedFirst(null);
      } else if (selectedSecond?.id === clickedAminal.id) {
        setSelectedSecond(null);
      } else if (!selectedFirst) {
        setSelectedFirst(clickedAminal);
      } else if (!selectedSecond) {
        setSelectedSecond(clickedAminal);
      } else {
        // Both selected, replace second
        setSelectedSecond(clickedAminal);
      }
    } else {
      // Single selection mode (partner only)
      setSelectedSecond(clickedAminal);
    }
  };

  const getSelectionState = (aminalOption: any) => {
    if (isDualSelectionMode) {
      if (selectedFirst?.id === aminalOption.id) return 'first';
      if (selectedSecond?.id === aminalOption.id) return 'second';
    } else {
      if (selectedSecond?.id === aminalOption.id) return 'selected';
    }
    return null;
  };

  const handleBreeding = () => {
    if (!enabled) return;

    const firstAminal = isDualSelectionMode ? selectedFirst : aminal;
    const secondAminal = selectedSecond;

    const firstAddress = firstAminal?.contractAddress;
    const secondAddress = secondAminal?.contractAddress;

    if (!firstAddress || !isAddress(firstAddress)) {
      toast.error('Please select the first aminal');
      return;
    }
    if (!secondAddress || !isAddress(secondAddress)) {
      toast.error('Please select the second aminal');
      return;
    }

    writeContract({
      abi: aminalFactoryAbi,
      address: aminalFactoryAddress,
      functionName: 'breedAminals',
      args: [firstAddress as `0x${string}`, secondAddress as `0x${string}`, 0n],
    });
  };

  const getActionText = () => {
    if (!enabled) return 'Connect Wallet';
    if (isPending || isConfirming) return 'Starting Auction...';
    return 'Start Gene Auction';
  };

  const canBreed = isDualSelectionMode
    ? selectedFirst && selectedSecond
    : selectedSecond;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">
              {isDualSelectionMode
                ? 'Start Breeding Auction'
                : 'Find Breeding Partner'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
              {isDualSelectionMode
                ? 'Select two of your loved Aminals to breed together.'
                : 'Select one of your loved Aminals to breed with.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors shrink-0 ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {/* Selected Aminals Preview (dual mode) */}
          {isDualSelectionMode && (selectedFirst || selectedSecond) && (
            <div className="mb-6 p-4 bg-muted border border-border rounded-lg">
              <div className="text-sm font-medium mb-3">Selected Aminals</div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  {selectedFirst ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedFirst(null)}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-primary bg-secondary">
                        <AminalVisualImage aminal={selectedFirst} />
                      </div>
                      <div className="text-xs mt-1 font-medium">
                        #{selectedFirst.aminalIndex?.toString()}
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        First
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-2xl text-muted-foreground">×</div>
                <div className="text-center">
                  {selectedSecond ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedSecond(null)}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-love bg-secondary">
                        <AminalVisualImage aminal={selectedSecond} />
                      </div>
                      <div className="text-xs mt-1 font-medium">
                        #{selectedSecond.aminalIndex?.toString()}
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        Second
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pre-selected Aminal (single mode) */}
          {!isDualSelectionMode && aminal && (
            <div className="mb-6 p-4 bg-muted border border-border rounded-lg">
              <div className="text-sm font-medium mb-3">Breeding From</div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-secondary">
                  <AminalVisualImage aminal={aminal} />
                </div>
                <div>
                  <div className="font-medium">
                    Aminal #{aminal.aminalIndex?.toString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Number(aminal.totalLove || 0).toFixed(0)} total love
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aminals Grid */}
          <div>
            <div className="text-sm font-medium mb-3">
              {isDualSelectionMode ? 'Your Loved Aminals' : 'Select Partner'}
            </div>
            {isLoadingAminals ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !availableAminals || availableAminals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isDualSelectionMode
                  ? 'No Aminals found. You need to love at least 2 Aminals to breed.'
                  : 'No available Aminals found.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {availableAminals.map((aminalOption: any) => {
                  const selectionState = getSelectionState(aminalOption);
                  return (
                    <div
                      key={aminalOption.id}
                      className={cn(
                        'border-2 rounded-lg p-2 sm:p-3 cursor-pointer transition-all active:scale-95',
                        selectionState === 'first'
                          ? 'border-primary bg-primary/10'
                          : selectionState === 'second'
                          ? 'border-love bg-love/10'
                          : selectionState === 'selected'
                          ? 'border-love bg-love/10'
                          : 'border-border hover:border-muted-foreground'
                      )}
                      onClick={() => handleAminalClick(aminalOption)}
                    >
                      <div className="aspect-square mb-2 bg-secondary rounded-lg overflow-hidden">
                        <AminalVisualImage aminal={aminalOption} />
                      </div>
                      <div className="text-center space-y-1">
                        <div className="text-xs sm:text-sm font-medium truncate">
                          Aminal #{aminalOption.aminalIndex?.toString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Number(aminalOption.totalLove).toFixed(0)} love
                        </div>
                      </div>
                      {selectionState && (
                        <div
                          className={cn(
                            'text-xs text-center mt-2 font-medium',
                            selectionState === 'first'
                              ? 'text-primary'
                              : 'text-love'
                          )}
                        >
                          {selectionState === 'first'
                            ? '1st'
                            : selectionState === 'second'
                            ? '2nd'
                            : 'Selected'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between shrink-0">
          <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
            {isDualSelectionMode
              ? 'Select two Aminals to start a gene auction'
              : 'Select a partner to start a gene auction'}
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
              disabled={!enabled || !canBreed || isPending || isConfirming}
              variant="breed"
              className="flex-1 sm:flex-initial"
            >
              {getActionText()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
