import CallSkillButton from '@components/actions/CallSkillButton';
import FeedButton from '@components/actions/FeedButton';
import { AminalVisualImage } from '@components/AminalCard';
import BreedingModal from '@components/BreedingModal';
import { Button } from '@components/ui/Button';
import { useAminalByContractAddress, useGenesByIds } from '@hooks';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../_layout';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatEther } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

const AminalPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query; // This is now a contract address
  const contractAddress = id as string;
  const { address } = useAccount();
  const [isBreedingModalOpen, setIsBreedingModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Show loading state if router is not ready or ID is not available
  const isRouterReady =
    router.isReady && id && typeof id === 'string' && id !== 'undefined';

  const {
    data: aminal,
    isLoading,
    refetch,
  } = useAminalByContractAddress(
    isRouterReady ? contractAddress : '',
    address || ''
  );

  // Breeding transaction hooks
  const {
    writeContract: startBreeding,
    isPending: isBreedingPending,
    data: breedingHash,
    error: breedingError,
  } = useWriteContract();

  const {
    isLoading: isBreedingConfirming,
    isSuccess: isBreedingConfirmed,
    error: breedingReceiptError,
  } = useWaitForTransactionReceipt({
    hash: breedingHash,
  });

  // Get all gene IDs for this Aminal to fetch gene data
  const geneIds = useMemo(() => {
    if (!aminal) return [];

    return aminal.traits
      .filter((id) => id && id.toString() !== '0')
      .map((id) => id.toString());
  }, [aminal]);

  // Fetch gene data for trait images
  const { data: geneData } = useGenesByIds(geneIds);

  // Children tracking removed from schema

  // Handle breeding transaction success
  useEffect(() => {
    if (isBreedingConfirmed) {
      toast.success(
        '🍼 Breeding auction started! Community can now vote on offspring traits.',
        {
          id: 'breed-tx',
          duration: 6000,
        }
      );
      queryClient.invalidateQueries({
        queryKey: ['aminals', 'detail', contractAddress],
      });
      refetch();
    }
  }, [isBreedingConfirmed, queryClient, contractAddress, refetch]);

  // Handle breeding transaction errors
  useEffect(() => {
    if (breedingError) {
      console.error('Breeding transaction failed:', breedingError);
      let errorMessage = 'Transaction failed. Please try again.';
      if (breedingError.message.includes('insufficient funds')) {
        errorMessage =
          'Insufficient funds. You need at least 0.001 ETH plus gas fees.';
      } else if (breedingError.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      }
      toast.error(errorMessage, { id: 'breed-tx' });
    }
  }, [breedingError]);

  // Handle breeding receipt errors
  useEffect(() => {
    if (breedingReceiptError) {
      console.error(
        'Breeding transaction receipt error:',
        breedingReceiptError
      );
      toast.error('Transaction failed. Please try again.', { id: 'breed-tx' });
    }
  }, [breedingReceiptError]);

  // Handle breeding pending state
  useEffect(() => {
    if (isBreedingPending) {
      toast.loading('Starting gene auction...', { id: 'breed-tx' });
    }
  }, [isBreedingPending]);

  // Handle breeding confirmation state
  useEffect(() => {
    if (isBreedingConfirming) {
      toast.loading('Confirming transaction...', { id: 'breed-tx' });
    }
  }, [isBreedingConfirming]);

  // Breeding function removed - now handled through BreedingModal

  // Handle fallback state for static export
  if (router.isFallback) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state if router is not ready or data is loading
  if (!isRouterReady || isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!aminal) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh] text-gray-500">
            Aminal not found
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">
              Aminal #
              {aminal.aminalIndex !== undefined
                ? Number(aminal.aminalIndex)
                : 'Unknown'}
            </h1>
            <Link
              href="/"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              ← Back to all Aminals
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary flex items-center justify-center border border-border">
              <AminalVisualImage aminal={aminal} />
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Stats Section */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h2 className="text-xl font-semibold">Stats</h2>

                {/* Energy, Total Love, and ETH Balance */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground">Energy</div>
                    <div className="text-xl font-semibold text-energy">
                      {Number(aminal.energy).toFixed(2)} ⚡
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground">
                      Total Love
                    </div>
                    <div className="text-xl font-semibold text-love">
                      {Number(aminal.totalLove).toFixed(2)} ❤️
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground">
                      ETH Balance
                    </div>
                    <div className="text-xl font-semibold text-primary">
                      {Number(
                        formatEther(BigInt(aminal.ethBalance || 0))
                      ).toFixed(4)}{' '}
                      Ξ
                    </div>
                  </div>
                </div>

                {/* Love 4 U section */}
                {aminal.lovers &&
                  aminal.lovers.items &&
                  aminal.lovers.items.length > 0 && (
                    <div className="p-4 bg-energy/10 rounded-lg border border-energy/30">
                      <div className="text-sm text-muted-foreground">
                        Love 4 U
                      </div>
                      <div className="text-xl font-semibold text-energy">
                        💜 {Number(aminal.lovers.items[0].love).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Your love relationship with this Aminal
                      </div>
                    </div>
                  )}

                {/* Contract Address */}
                <div className="hidden md:block p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <div className="text-sm text-muted-foreground">
                    Contract Address
                  </div>
                  <div className="text-sm font-mono text-primary">
                    {aminal.contractAddress}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <FeedButton
                  contractAddress={aminal.contractAddress as `0x${string}`}
                />

                <Button
                  variant="default"
                  className="w-full"
                  disabled={
                    !aminal?.lovers ||
                    aminal.lovers.items.length === 0 ||
                    Number(aminal.lovers.items[0]?.love || 0) <= 0
                  }
                  asChild={
                    aminal?.lovers &&
                    aminal.lovers.items.length > 0 &&
                    Number(aminal.lovers.items[0]?.love || 0) > 0
                  }
                >
                  {aminal?.lovers &&
                  aminal.lovers.items.length > 0 &&
                  Number(aminal.lovers.items[0]?.love || 0) > 0 ? (
                    <Link href={`/aminals/${aminal.contractAddress}/chat`}>
                      💬 Chat with Aminal
                    </Link>
                  ) : (
                    <span>💬 Chat with Aminal</span>
                  )}
                </Button>

                {/* Auction functionality removed from schema */}
              </div>
            </div>
          </div>

          {/* Info Section - Full width, with two columns, no border */}
          <div className="p-2 space-y-4">
            <h2 className="text-xl font-semibold px-3">Info</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Lineage and Breeding */}
              <div className="space-y-6">
                {/* Lineage */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2 px-3">
                    <span className="text-primary text-lg">👪</span>
                    Lineage
                  </h3>

                  {/* Parents */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 px-3">
                      Parents
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted rounded-lg border border-border">
                        <div className="text-sm text-muted-foreground">
                          Parent A
                        </div>
                        <div className="font-medium text-xs">
                          {!aminal.parentOne ? (
                            <span className="text-muted-foreground">
                              Genesis
                            </span>
                          ) : (
                            <Link
                              href={`/aminals/${aminal.parentOne.contractAddress}`}
                              className="text-primary hover:text-primary/80 transition-colors underline"
                            >
                              Aminal #
                              {aminal.parentOne.aminalIndex !== undefined
                                ? Number(aminal.parentOne.aminalIndex)
                                : 'Unknown'}
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg border border-border">
                        <div className="text-sm text-muted-foreground">
                          Parent B
                        </div>
                        <div className="font-medium text-xs">
                          {!aminal.parentTwo ? (
                            <span className="text-muted-foreground">
                              Genesis
                            </span>
                          ) : (
                            <Link
                              href={`/aminals/${aminal.parentTwo.contractAddress}`}
                              className="text-primary hover:text-primary/80 transition-colors underline"
                            >
                              Aminal #
                              {aminal.parentTwo.aminalIndex !== undefined
                                ? Number(aminal.parentTwo.aminalIndex)
                                : 'Unknown'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Children tracking removed from schema */}
                </div>

                {/* Breeding */}
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 px-3">
                    <span className="text-primary text-lg">🧬</span>
                    Breeding
                  </h3>

                  <div className="px-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      Start a breeding auction to create offspring with another
                      Aminal.
                    </p>
                    <Button
                      onClick={() => setIsBreedingModalOpen(true)}
                      variant="breed"
                      className="w-full"
                      disabled={
                        !aminal?.lovers ||
                        aminal.lovers.items.length === 0 ||
                        Number(aminal.lovers.items[0]?.love || 0) <= 0
                      }
                    >
                      🔍 Find Breeding Partner
                    </Button>
                    {(!aminal?.lovers ||
                      aminal.lovers.items.length === 0 ||
                      Number(aminal.lovers.items[0]?.love || 0) <= 0) && (
                      <p className="text-xs text-warning mt-1">
                        You must feed this Aminal first to unlock breeding.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Gene IDs */}
              <div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2 px-3">
                    <span className="text-primary text-lg">🧬</span>
                    Traits
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {((
                      traits: Array<{
                        name: string;
                        id: any;
                        traitType: number;
                      }>
                    ) =>
                      traits.map((gene, i) => {
                        // Find gene data for this trait
                        const traitId = (gene as any).id;
                        const geneInfo = geneData?.find(
                          (g: any) => g?.tokenId === traitId?.toString()
                        );
                        const geneId = geneInfo?.id || traitId || '';

                        return (
                          <Link
                            key={i}
                            href={`/genes/${geneId}`}
                            className="p-3 rounded-lg border bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-card rounded border border-border overflow-hidden flex-shrink-0">
                                {geneInfo?.svg ? (
                                  <svg
                                    viewBox="0 0 1000 1000"
                                    className="w-full h-full"
                                    dangerouslySetInnerHTML={{
                                      __html: geneInfo.svg,
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                    ?
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium truncate">
                                  {gene.name}
                                </div>
                                <div className="text-xs text-primary font-medium hover:text-primary/80 truncate">
                                  Gene #{gene.id}
                                </div>
                                {geneInfo?.name && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {geneInfo.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      }))([
                      {
                        name: 'Background',
                        id: aminal.backId,
                        traitType: 0,
                      },
                      {
                        name: 'Arms',
                        id: aminal.armId,
                        traitType: 1,
                      },
                      {
                        name: 'Tail',
                        id: aminal.tailId,
                        traitType: 2,
                      },
                      {
                        name: 'Ears',
                        id: aminal.earsId,
                        traitType: 3,
                      },
                      {
                        name: 'Body',
                        id: aminal.bodyId,
                        traitType: 4,
                      },
                      {
                        name: 'Face',
                        id: aminal.faceId,
                        traitType: 5,
                      },
                      {
                        name: 'Mouth',
                        id: aminal.mouthId,
                        traitType: 6,
                      },
                      {
                        name: 'Misc',
                        id: aminal.miscId,
                        traitType: 7,
                      },
                    ])}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Skills Section */}
          <div className="mt-4 p-6 bg-muted rounded-xl border border-border">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold">Skills</h2>
              <div className="text-sm text-muted-foreground">
                Aminals can <em>do</em> things.
              </div>
            </div>

            <div className="space-y-4">
              <CallSkillButton
                aminalContractAddress={aminal.contractAddress as `0x${string}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breeding Modal */}
      <BreedingModal
        aminal={aminal}
        isOpen={isBreedingModalOpen}
        onClose={() => setIsBreedingModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsBreedingModalOpen(false);
        }}
      />
    </Layout>
  );
};

export default AminalPage;

// Remove static generation - use server-side rendering for dynamic routes
