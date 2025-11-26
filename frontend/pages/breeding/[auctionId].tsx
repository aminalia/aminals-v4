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
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';

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

  // Auto-switch to Create tab for new auctions (no community designs yet)
  useEffect(() => {
    if (!isLoadingDesigns && designs.length > 0 && !auction?.finished) {
      const hasCommunityDesigns = designs.some(
        (d) => !d.isParentDesign && !d.removed
      );
      if (!hasCommunityDesigns) {
        setActiveTab('create');
      }
    }
  }, [isLoadingDesigns, designs, auction?.finished]);

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
                  className="hover:text-energy/80 text-sm font-medium"
                >
                  ← Back to Breeding
                </Link>
                <span className="px-2 py-1 text-sm bg-secondary text-foreground rounded font-medium">
                  Auction #{auctionId}
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
                <div className="bg-muted border-b border-border px-4 md:px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Parent Links with Images */}
                    <div className="flex items-center gap-2 md:gap-4">
                      {/* Parent 1 */}
                      <Link
                        href={`/aminals/${
                          auction?.aminalOne?.contractAddress ||
                          auction?.aminalOne?.aminalIndex
                        }`}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-secondary border-2 border-border flex-shrink-0">
                          {auction?.aminalOne && (
                            <AminalVisualImage aminal={auction.aminalOne} />
                          )}
                        </div>
                        <span className="text-base md:text-lg font-semibold text-primary">
                          #
                          {auction?.aminalOne?.aminalIndex !== undefined
                            ? Number(auction.aminalOne.aminalIndex)
                            : '?'}
                        </span>
                      </Link>

                      {/* Heart connector */}
                      <div className="text-love text-lg">💕</div>

                      {/* Parent 2 */}
                      <Link
                        href={`/aminals/${
                          auction?.aminalTwo?.contractAddress ||
                          auction?.aminalTwo?.aminalIndex
                        }`}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-secondary border-2 border-border flex-shrink-0">
                          {auction?.aminalTwo && (
                            <AminalVisualImage aminal={auction.aminalTwo} />
                          )}
                        </div>
                        <span className="text-base md:text-lg font-semibold text-primary">
                          #
                          {auction?.aminalTwo?.aminalIndex !== undefined
                            ? Number(auction.aminalTwo.aminalIndex)
                            : '?'}
                        </span>
                      </Link>
                    </div>

                    {/* Status / Timer */}
                    <div className="flex-shrink-0">
                      {auction?.finished ? (
                        <Badge variant="success">Completed</Badge>
                      ) : isAuctionEnded ? (
                        <Badge variant="warning">Ready to Birth</Badge>
                      ) : (
                        <CountdownTimer endTime={auctionEndTime} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Show new Aminal if auction is finished */}
                {auction?.finished && auction?.childAminal ? (
                  <div className="p-4 md:p-6 space-y-6">
                    {/* New Aminal Card */}
                    <div className="bg-muted border border-border rounded-lg p-6">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Aminal Image */}
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden bg-secondary border border-border flex-shrink-0">
                          <AminalVisualImage aminal={auction.childAminal} />
                        </div>

                        {/* Aminal Details */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                          <div>
                            <Badge variant="success" className="mb-2">
                              Born!
                            </Badge>
                            <h2 className="text-2xl font-bold">
                              Aminal #{auction.childAminal.aminalIndex}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              Child of #{auction.aminalOne?.aminalIndex} × #
                              {auction.aminalTwo?.aminalIndex}
                            </p>
                          </div>

                          <div className="bg-card rounded-lg p-3 border border-border inline-block">
                            <div className="text-xs text-muted-foreground">
                              Total Love
                            </div>
                            <div className="text-lg font-bold text-love">
                              {Number(auction.childAminal.totalLove).toFixed(2)}
                            </div>
                          </div>

                          <div>
                            <Link
                              href={`/aminals/${auction.childAminal.contractAddress}`}
                            >
                              <Button variant="default">
                                Visit Aminal Page
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vote Stats */}
                    <div className="bg-card rounded-lg border border-border p-4">
                      <DesignVoteStats
                        auctionId={auctionId}
                        totalLove={auction?.totalLove || 0n}
                      />
                    </div>
                  </div>
                ) : isAuctionEnded && !auction?.finished ? (
                  /* Ready to Birth State - Auction ended but not yet settled */
                  <ReadyToBirthSection
                    auctionId={auctionId}
                    designs={designs}
                    winningDesignId={auctionVoting?.winningDesignId}
                    totalLove={auction?.totalLove || 0n}
                  />
                ) : (
                  <>
                    {/* Tab Navigation */}
                    <Tabs
                      value={activeTab}
                      onValueChange={(v) => setActiveTab(v as TabType)}
                      className="w-full"
                    >
                      <div className="px-4 md:px-6 pt-4">
                        <TabsList>
                          <TabsTrigger value="browse" disabled={isAuctionEnded}>
                            Browse Designs
                          </TabsTrigger>
                          <TabsTrigger value="create" disabled={isAuctionEnded}>
                            Create New Design
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      {/* Tab Content */}
                      <div className="p-6">
                        <TabsContent value="browse" className="mt-0">
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
                        </TabsContent>

                        <TabsContent value="create" className="mt-0">
                          <div className="space-y-6">
                            {/* Quick Start Templates */}
                            <div className="bg-muted rounded-lg border border-border p-4">
                              <h3 className="text-sm font-semibold mb-3">
                                Quick Start Templates
                              </h3>
                              <div className="grid grid-cols-2 md:flex gap-2 md:gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleLoadParent1}
                                  disabled={isAuctionEnded}
                                >
                                  Parent 1
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleLoadParent2}
                                  disabled={isAuctionEnded}
                                >
                                  Parent 2
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleRandomize}
                                  disabled={isAuctionEnded}
                                >
                                  Randomize
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
                                Load a parent design or randomize to get started
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
                        </TabsContent>
                      </div>
                    </Tabs>
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

/**
 * Ready to Birth Section - Shown when auction has ended but not yet settled
 */
function ReadyToBirthSection({
  auctionId,
  designs,
  winningDesignId,
  totalLove,
}: {
  auctionId: string;
  designs: DesignProposal[];
  winningDesignId?: bigint;
  totalLove: bigint;
}) {
  // Find the winning design
  const winningDesign = useMemo(() => {
    if (winningDesignId === undefined) return null;
    return designs.find(
      (d) => d.designIndex === Number(winningDesignId)
    );
  }, [designs, winningDesignId]);

  // Render winning design SVG
  const winningDesignSvg = useMemo(() => {
    if (!winningDesign?.genes || winningDesign.genes.length === 0) return '';

    return winningDesign.geneIds
      .map((geneId, index) => {
        if (geneId === 0n) return '';

        const gene = winningDesign.genes?.find(
          (g) => BigInt(g.tokenId) === geneId
        );
        if (!gene?.svg) return '';

        const placement = winningDesign.placements[index];
        if (!placement) return gene.svg;

        const { offsetX, offsetY, scale, rotation } = placement;

        return `
          <g transform="translate(${offsetX}, ${offsetY}) rotate(${rotation}, 500, 500) scale(${
          scale / 100
        })">
            ${gene.svg}
          </g>
        `;
      })
      .join('');
  }, [winningDesign]);

  // Calculate vote percentage for winning design
  const winningVotePercentage = useMemo(() => {
    if (!winningDesign || totalLove === 0n) return 0;
    return Number((winningDesign.votes * 100n) / totalLove);
  }, [winningDesign, totalLove]);

  // Count genes in winning design
  const geneCount = winningDesign?.geneIds.filter((id) => id !== 0n).length || 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Winning Design Preview */}
        <div className="flex-1">
          <div className="bg-muted border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Winning Design</h3>
                {winningDesign && (
                  <Badge variant="success" className="text-xs">
                    🏆 #{winningDesign.designIndex}
                  </Badge>
                )}
              </div>
            </div>

            {winningDesign ? (
              <div className="p-4">
                <div className="aspect-square bg-card rounded-lg overflow-hidden border border-border mb-4 max-w-sm mx-auto">
                  <svg
                    viewBox="0 0 1000 1000"
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: winningDesignSvg }}
                  />
                </div>

                {/* Design Stats */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <div className="bg-card rounded-lg p-3 border border-border text-center">
                    <div className="text-xs text-muted-foreground">Votes</div>
                    <div className="text-lg font-semibold text-love">
                      {winningDesign.votes.toString()} ❤️
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {winningVotePercentage.toFixed(1)}% of total
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border text-center">
                    <div className="text-xs text-muted-foreground">Genes</div>
                    <div className="text-lg font-semibold">{geneCount}</div>
                    <div className="text-xs text-muted-foreground">
                      {winningDesign.isParentDesign
                        ? 'Parent Design'
                        : `By ${winningDesign.proposer.address.slice(0, 6)}...`}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <div className="text-2xl mb-2">🤔</div>
                <p className="text-sm">No winning design found</p>
              </div>
            )}
          </div>
        </div>

        {/* Birth Action Panel */}
        <div className="flex-1">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 h-full flex flex-col justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">👶</div>
              <h3 className="text-xl font-bold mb-2">Birth the Aminal</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Voting has ended! Click below to finalize the breeding and
                create the new Aminal with the winning design.
              </p>
            </div>

            <div className="max-w-xs mx-auto w-full">
              <EndAuctionButton auctionId={auctionId} className="w-full" />
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Anyone can settle the auction. The caller pays gas but helps the
              community!
            </p>
          </div>
        </div>
      </div>

      {/* Vote Stats Summary */}
      <div className="bg-card rounded-lg border border-border p-4">
        <DesignVoteStats auctionId={auctionId} totalLove={totalLove} />
      </div>
    </div>
  );
}

export default AuctionPage;
