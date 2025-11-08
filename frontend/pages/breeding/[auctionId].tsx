/**
 * Breeding Auction Page - Refactored for Design-Based Voting
 *
 * Features:
 * - Tab navigation: Browse Designs | Create New Design
 * - DesignGallery for browsing and voting on proposals
 * - DesignBuilder for creating new designs
 * - Parent design templates
 * - Real-time voting stats
 */

import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import Layout from '../_layout';

// Components
import { AminalVisualImage } from '@components/AminalCard';
import CountdownTimer from '@components/CountdownTimer';
import EndAuctionButton from '@components/actions/EndAuctionButton';
import DesignBuilder from '@components/breeding/DesignBuilder';
import DesignGallery from '@components/breeding/DesignGallery';
import DesignVoteStats from '@components/breeding/DesignVoteStats';
import ProposeDesignButton from '@components/breeding/ProposeDesignButton';
import { Button } from '@components/ui/Button';

// Hooks & Types
import {
  contractFormatToPlacement,
  useAuction,
  useAuctionVoting,
  useDesignProposals,
  useGenesByIds,
  useIsVotingActive,
  useParentGenes,
  useUserVotedDesign,
  useUserVotingPower,
  type DesignProposal,
  type Gene,
  type GeneMetadata,
} from '@hooks';

// VOTING_DURATION from the contract (1 hour = 3600 seconds)
const VOTING_DURATION = 3600;

type TabType = 'browse' | 'create';

const AuctionPage: NextPage = () => {
  const router = useRouter();
  const auctionId = router.query.auctionId as string;
  const { address } = useAccount();

  // Show loading state if router is not ready or ID is not available
  const isRouterReady =
    router.isReady &&
    auctionId &&
    typeof auctionId === 'string' &&
    auctionId !== 'undefined';

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('browse');

  // Design builder state
  const [currentGeneIds, setCurrentGeneIds] = useState<bigint[]>([]);
  const [currentPlacements, setCurrentPlacements] = useState<GeneMetadata[]>(
    []
  );
  const [builderKey, setBuilderKey] = useState(0); // Force remount when loading templates

  // Fetch auction data
  const {
    data: auction,
    isLoading: isLoadingAuction,
    error,
  } = useAuction(isRouterReady ? auctionId : '');

  // Fetch design proposals
  const {
    data: designs = [],
    isLoading: isLoadingDesigns,
    refetch: refetchDesigns,
  } = useDesignProposals(isRouterReady ? auctionId : '');

  // Fetch user voting power
  const { data: userVotingPower = 0n } = useUserVotingPower(
    isRouterReady ? auctionId : '',
    address
  );

  // Fetch user's current vote
  const { data: userVotedDesignId = 0n } = useUserVotedDesign(
    isRouterReady ? auctionId : '',
    address
  );

  // Fetch auction voting info
  const { data: auctionVoting } = useAuctionVoting(
    isRouterReady ? auctionId : ''
  );

  // Fetch parent genes
  const { data: parentGenesData } = useParentGenes(
    isRouterReady ? auctionId : ''
  );

  // Check if voting is active
  const { data: isVotingActive = false } = useIsVotingActive(
    isRouterReady ? auctionId : ''
  );

  // Calculate auction end time
  const auctionEndTime = useMemo(() => {
    if (!auction?.blockTimestamp) return 0;
    return Number(auction.blockTimestamp) + VOTING_DURATION;
  }, [auction?.blockTimestamp]);

  // Check if auction has ended
  const isAuctionEnded = useMemo(() => {
    if (!auction) return false;
    const now = Math.floor(Date.now() / 1000);
    return auction.finished || now >= auctionEndTime;
  }, [auction, auctionEndTime]);

  // Get all unique gene IDs from parents
  const parentGeneIds = useMemo(() => {
    if (!auction?.aminalOne || !auction?.aminalTwo) return [];

    const allGeneIds = [
      ...(auction.aminalOne.genes || []),
      ...(auction.aminalTwo.genes || []),
    ].filter((id) => id && id !== 0n);

    return Array.from(new Set(allGeneIds));
  }, [auction]);

  // Fetch parent gene data with SVGs
  const { data: parentGenesWithSvg } = useGenesByIds(
    parentGeneIds.map((id) => id.toString())
  );

  // Convert parent genes to Gene[] format for DesignBuilder
  const availableGenes = useMemo((): Gene[] => {
    const allGenes: Gene[] = [];
    const seenGeneIds = new Set<string>();

    // First, add parent genes
    if (parentGenesWithSvg) {
      parentGenesWithSvg.forEach((gene) => {
        if (gene && !seenGeneIds.has(gene.id)) {
          seenGeneIds.add(gene.id);
          // Map GraphQL gene structure to Gene type
          allGenes.push({
            id: gene.id,
            tokenId: gene.tokenId.toString(),
            owner: {
              id: gene.ownerId,
              address: gene.ownerId,
            },
            creator: {
              id: gene.creatorId,
              address: gene.creatorId,
            },
            svg: gene.svg || '',
            name: gene.name || undefined,
            description: gene.description || undefined,
            totalEarnings: gene.totalEarnings,
          });
        }
      });
    }

    // Then add any additional genes from designs
    if (designs && designs.length > 0) {
      designs.forEach((design) => {
        design.genes?.forEach((gene) => {
          if (!seenGeneIds.has(gene.id)) {
            seenGeneIds.add(gene.id);
            allGenes.push(gene);
          }
        });
      });
    }

    return allGenes;
  }, [parentGenesWithSvg, designs]);

  // Load parent 1 template
  const handleLoadParent1 = useCallback(() => {
    if (!auction?.aminalOne?.genes) return;

    const genes = auction.aminalOne.genes.filter((g) => g !== 0n);

    // Use actual placements from indexed data
    let placements: GeneMetadata[] = [];

    if (auction.aminalOne.genePlacements) {
      try {
        const allPlacements = JSON.parse(auction.aminalOne.genePlacements);
        // Filter to match filtered genes (skip empty slots)
        // Convert from contract format (0-359) to UI format (-180 to 180)
        placements = auction.aminalOne.genes
          .map((geneId, idx) =>
            geneId !== 0n ? contractFormatToPlacement(allPlacements[idx]) : null
          )
          .filter((p): p is GeneMetadata => p !== null);
      } catch (e) {
        console.error('Failed to parse parent 1 placements:', e);
        // Fallback to default
        placements = genes.map(() => ({
          offsetX: 0,
          offsetY: 0,
          scale: 100,
          rotation: 0,
        }));
      }
    } else {
      // Legacy Aminal without indexed placements
      placements = genes.map(() => ({
        offsetX: 0,
        offsetY: 0,
        scale: 100,
        rotation: 0,
      }));
    }

    setCurrentGeneIds(genes);
    setCurrentPlacements(placements);
    setBuilderKey((k) => k + 1); // Force remount
  }, [auction]);

  // Load parent 2 template
  const handleLoadParent2 = useCallback(() => {
    if (!auction?.aminalTwo?.genes) return;

    const genes = auction.aminalTwo.genes.filter((g) => g !== 0n);

    // Use actual placements from indexed data
    let placements: GeneMetadata[] = [];

    if (auction.aminalTwo.genePlacements) {
      try {
        const allPlacements = JSON.parse(auction.aminalTwo.genePlacements);
        // Filter to match filtered genes (skip empty slots)
        // Convert from contract format (0-359) to UI format (-180 to 180)
        placements = auction.aminalTwo.genes
          .map((geneId, idx) =>
            geneId !== 0n ? contractFormatToPlacement(allPlacements[idx]) : null
          )
          .filter((p): p is GeneMetadata => p !== null);
      } catch (e) {
        console.error('Failed to parse parent 2 placements:', e);
        // Fallback to default
        placements = genes.map(() => ({
          offsetX: 0,
          offsetY: 0,
          scale: 100,
          rotation: 0,
        }));
      }
    } else {
      // Legacy Aminal without indexed placements
      placements = genes.map(() => ({
        offsetX: 0,
        offsetY: 0,
        scale: 100,
        rotation: 0,
      }));
    }

    setCurrentGeneIds(genes);
    setCurrentPlacements(placements);
    setBuilderKey((k) => k + 1); // Force remount
  }, [auction]);

  // Randomize between parent genes - for each slot, randomly pick gene from either parent
  const handleRandomize = useCallback(() => {
    if (!auction?.aminalOne?.genes || !auction?.aminalTwo?.genes) return;

    const parent1Genes = auction.aminalOne.genes;
    const parent2Genes = auction.aminalTwo.genes;

    // Parse parent placements
    let parent1Placements: GeneMetadata[] = [];
    let parent2Placements: GeneMetadata[] = [];

    try {
      const rawPlacements = auction.aminalOne?.genePlacements
        ? JSON.parse(auction.aminalOne.genePlacements)
        : parent1Genes.map(() => ({
            offsetX: 0,
            offsetY: 0,
            scale: 100,
            rotation: 0,
          }));
      // Convert from contract format (0-359) to UI format (-180 to 180)
      parent1Placements = rawPlacements.map((p: any) =>
        contractFormatToPlacement(p)
      );
    } catch (e) {
      parent1Placements = parent1Genes.map(() => ({
        offsetX: 0,
        offsetY: 0,
        scale: 100,
        rotation: 0,
      }));
    }

    try {
      const rawPlacements = auction.aminalTwo?.genePlacements
        ? JSON.parse(auction.aminalTwo.genePlacements)
        : parent2Genes.map(() => ({
            offsetX: 0,
            offsetY: 0,
            scale: 100,
            rotation: 0,
          }));
      // Convert from contract format (0-359) to UI format (-180 to 180)
      parent2Placements = rawPlacements.map((p: any) =>
        contractFormatToPlacement(p)
      );
    } catch (e) {
      parent2Placements = parent2Genes.map(() => ({
        offsetX: 0,
        offsetY: 0,
        scale: 100,
        rotation: 0,
      }));
    }

    // Determine max slots (up to 9)
    const maxSlots = Math.max(parent1Genes.length, parent2Genes.length);
    const selectedGenes: bigint[] = [];
    const selectedPlacements: GeneMetadata[] = [];

    // For each slot position, randomly pick from either parent
    for (let i = 0; i < maxSlots && i < 9; i++) {
      const useParent1 = Math.random() < 0.5;

      if (useParent1 && i < parent1Genes.length && parent1Genes[i] !== 0n) {
        selectedGenes.push(parent1Genes[i]);
        selectedPlacements.push(parent1Placements[i]);
      } else if (i < parent2Genes.length && parent2Genes[i] !== 0n) {
        selectedGenes.push(parent2Genes[i]);
        selectedPlacements.push(parent2Placements[i]);
      } else if (i < parent1Genes.length && parent1Genes[i] !== 0n) {
        // Fallback to parent 1 if parent 2 slot is empty
        selectedGenes.push(parent1Genes[i]);
        selectedPlacements.push(parent1Placements[i]);
      }
    }

    setCurrentGeneIds(selectedGenes);
    setCurrentPlacements(selectedPlacements);
    setBuilderKey((k) => k + 1);
  }, [auction]);

  // Handle design change from DesignBuilder
  const handleDesignChange = useCallback(
    (geneIds: bigint[], placements: GeneMetadata[]) => {
      setCurrentGeneIds(geneIds);
      setCurrentPlacements(placements);
    },
    []
  );

  // Handle vote success
  const handleVoteSuccess = useCallback(() => {
    refetchDesigns();
  }, [refetchDesigns]);

  // Handle propose success
  const handleProposeSuccess = useCallback(() => {
    refetchDesigns();
    setActiveTab('browse');
    setCurrentGeneIds([]);
    setCurrentPlacements([]);
  }, [refetchDesigns]);

  // Handle view design
  const handleViewDesign = useCallback((design: DesignProposal) => {
    // Load design into builder (read-only initially, but can be remixed)
    setCurrentGeneIds(design.geneIds.filter((id) => id !== 0n));
    setCurrentPlacements(
      design.placements.filter((_, i) => design.geneIds[i] !== 0n)
    );
    setActiveTab('create');
  }, []);

  // Handle fallback state for static export (production only)
  if (router.isFallback) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-love"></div>
              <div className="text-muted-foreground">Loading auction...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href="/breeding"
                  className="text-energy hover:text-energy/80 text-sm font-medium"
                >
                  ← Back to Breeding
                </Link>
                <span className="px-2 py-1 text-sm bg-secondary text-foreground rounded font-medium">
                  #{auctionId}
                </span>
              </div>
            </div>
          </div>

          {!isRouterReady || isLoadingAuction ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-love"></div>
                <div className="text-muted-foreground">
                  Loading breeding data...
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Main Content */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {/* Parents Info with Countdown Timer */}
                <div className="bg-muted border-b border-border px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Link
                        href={`/aminals/${
                          auction?.aminalOne?.contractAddress ||
                          auction?.aminalOne?.aminalIndex
                        }`}
                        className="text-lg font-semibold text-energy hover:text-energy/80 transition-colors"
                      >
                        Aminal #
                        {auction?.aminalOne?.aminalIndex !== undefined
                          ? Number(auction.aminalOne.aminalIndex)
                          : '?'}
                      </Link>
                      <div className="text-muted-foreground">×</div>
                      <Link
                        href={`/aminals/${
                          auction?.aminalTwo?.contractAddress ||
                          auction?.aminalTwo?.aminalIndex
                        }`}
                        className="text-lg font-semibold text-energy hover:text-energy/80 transition-colors"
                      >
                        Aminal #
                        {auction?.aminalTwo?.aminalIndex !== undefined
                          ? Number(auction.aminalTwo.aminalIndex)
                          : '?'}
                      </Link>
                    </div>

                    <div>
                      {/* Countdown Timer or End Auction Button */}
                      {auction?.finished ? (
                        <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded text-sm">
                          <div>✓</div>
                          <div className="font-medium">Completed</div>
                        </div>
                      ) : isAuctionEnded ? (
                        <EndAuctionButton auctionId={auctionId} />
                      ) : (
                        <CountdownTimer endTime={auctionEndTime} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Show new Aminal if auction is finished */}
                {auction?.finished && auction?.childAminal ? (
                  <div className="p-4">
                    <div className="bg-success/10 border border-success/30 rounded-xl p-6">
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-2">🎉</div>
                        <h2 className="text-2xl font-bold text-success mb-2">
                          New Aminal Has Been Born!
                        </h2>
                        <p className="text-success">
                          The community has voted and created a new Aminal from
                          this breeding auction.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left Column - New Aminal Display */}
                        <div className="flex justify-center">
                          <div className="relative">
                            <div className="w-80 h-80 rounded-2xl overflow-hidden bg-success/20 border-4 border-success shadow-2xl">
                              <AminalVisualImage aminal={auction.childAminal} />
                            </div>
                            <div className="absolute -top-4 -right-4 bg-success text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shadow-lg animate-bounce">
                              👶
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Aminal Details */}
                        <div className="space-y-6">
                          <div className="text-center lg:text-left">
                            <Link
                              href={`/aminals/${auction.childAminal.contractAddress}`}
                              className="text-4xl font-bold text-success hover:text-success/80 transition-colors underline decoration-2 underline-offset-4"
                            >
                              Aminal #{auction.childAminal.aminalIndex}
                            </Link>
                            <p className="text-xl text-success mt-2 font-medium">
                              Has been born!
                            </p>
                            <p className="text-success mt-1">
                              Child of #{auction.aminalOne?.aminalIndex} × #
                              {auction.aminalTwo?.aminalIndex}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card rounded-lg p-4 border border-success/30 shadow-sm">
                              <div className="text-sm text-success font-medium">
                                Energy
                              </div>
                              <div className="text-2xl font-bold text-success">
                                {Number(auction.childAminal.energy).toFixed(2)}{' '}
                                ⚡
                              </div>
                            </div>
                            <div className="bg-card rounded-lg p-4 border border-success/30 shadow-sm">
                              <div className="text-sm text-success font-medium">
                                Total Love
                              </div>
                              <div className="text-2xl font-bold text-success">
                                {Number(auction.childAminal.totalLove).toFixed(
                                  2
                                )}{' '}
                                ❤️
                              </div>
                            </div>
                          </div>

                          <div className="text-center lg:text-left">
                            <Link
                              href={`/aminals/${auction.childAminal.contractAddress}`}
                              className="inline-flex items-center gap-3 bg-success hover:bg-success/80 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              <span>👀</span>
                              Visit Aminal Page
                              <span>→</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-card rounded-lg border border-border p-4">
                      <DesignVoteStats
                        auctionId={auctionId}
                        totalLove={auction?.totalLove || 0n}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Tab Navigation */}
                    <div className="border-b border-border">
                      <div className="flex gap-4 px-6">
                        <button
                          onClick={() => setActiveTab('browse')}
                          className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'browse'
                              ? 'border-energy text-energy'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                          disabled={isAuctionEnded}
                        >
                          📊 Browse Designs
                        </button>
                        <button
                          onClick={() => setActiveTab('create')}
                          className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'create'
                              ? 'border-energy text-energy'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                          disabled={isAuctionEnded}
                        >
                          ✨ Create New Design
                        </button>
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {activeTab === 'browse' ? (
                        <DesignGallery
                          auctionId={auctionId}
                          designs={designs}
                          userVotedDesignId={userVotedDesignId}
                          userVotingPower={userVotingPower}
                          totalLove={auction?.totalLove || 0n}
                          winningDesignId={auctionVoting?.winningDesignId}
                          onVoteSuccess={handleVoteSuccess}
                          onViewDesign={handleViewDesign}
                          disabled={isAuctionEnded}
                          isLoading={isLoadingDesigns}
                        />
                      ) : (
                        <div className="space-y-6">
                          {/* Quick Start Templates */}
                          <div className="bg-muted rounded-lg border border-border p-4">
                            <h3 className="text-sm font-semibold mb-3">
                              💡 Quick Start Templates
                            </h3>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLoadParent1}
                                disabled={isAuctionEnded}
                              >
                                Start with Parent 1
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLoadParent2}
                                disabled={isAuctionEnded}
                              >
                                Start with Parent 2
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRandomize}
                                disabled={isAuctionEnded}
                                className="text-energy border-energy/30 hover:bg-energy/10"
                              >
                                🎲 Randomize
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCurrentGeneIds([]);
                                  setCurrentPlacements([]);
                                  setBuilderKey((k) => k + 1); // Force remount
                                }}
                                disabled={isAuctionEnded}
                              >
                                Start Fresh
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Try randomize for creative gene combinations with
                              placement variations!
                            </p>
                          </div>

                          {/* Design Builder */}
                          <DesignBuilder
                            key={builderKey}
                            initialGeneIds={currentGeneIds}
                            initialPlacements={currentPlacements}
                            availableGenes={availableGenes}
                            onDesignChange={handleDesignChange}
                            disabled={isAuctionEnded}
                            maxGenes={9}
                          />

                          {/* Propose Button */}
                          {!isAuctionEnded && (
                            <ProposeDesignButton
                              auctionId={auctionId}
                              geneIds={currentGeneIds}
                              placements={currentPlacements}
                              onSuccess={handleProposeSuccess}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionPage;
