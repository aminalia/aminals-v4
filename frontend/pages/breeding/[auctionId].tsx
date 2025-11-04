import BulkVoteButton from '@components/actions/BulkVoteButton';
import EndAuctionButton from '@components/actions/EndAuctionButton';
import { AminalVisualImage } from '@components/AminalCard';
import CountdownTimer from '@components/CountdownTimer';
import ProposeGeneModal from '@components/ProposeGeneModal';
import TraitSelector, {
  SelectedParts,
  TraitParts,
} from '@components/TraitSelector';
import VoteStats from '@components/VoteStats';
import {
  makeGeneNFTId,
  useAuction,
  useGeneProposalsByAuctionId,
  useGenesByIds,
} from '@hooks';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../_layout';

// VOTING_DURATION from the contract (1 hour = 3600 seconds)
const VOTING_DURATION = 3600;

const AuctionPage: NextPage = () => {
  const router = useRouter();
  const auctionId = router.query.auctionId as string;

  // Show loading state if router is not ready or ID is not available
  const isRouterReady =
    router.isReady &&
    auctionId &&
    typeof auctionId === 'string' &&
    auctionId !== 'undefined';

  const {
    data: auction,
    isLoading: isLoadingAuction,
    error,
  } = useAuction(isRouterReady ? auctionId : '');
  const {
    data: proposeGenes,
    isLoading: isLoadingProposeGenes,
    error: proposeGenesError,
  } = useGeneProposalsByAuctionId(isRouterReady ? auctionId : '');

  // Calculate auction end time
  const auctionEndTime = useMemo(() => {
    if (!auction?.blockTimestamp) return 0;
    // Convert BigInt to number and add voting duration
    return Number(auction.blockTimestamp) + VOTING_DURATION;
  }, [auction?.blockTimestamp]);

  // Check if auction has ended
  const isAuctionEnded = useMemo(() => {
    if (!auction) return false;
    const now = Math.floor(Date.now() / 1000);
    return auction.finished || now >= auctionEndTime;
  }, [auction, auctionEndTime]);

  // Get gene IDs from parent Aminals only (proposals already have gene data loaded)
  const geneIds = useMemo(() => {
    if (!auction?.aminalOne || !auction?.aminalTwo) return [];

    // Convert parent trait token IDs to geneNFT ID format
    const parentIds = [
      auction.aminalOne.backId,
      auction.aminalOne.armId,
      auction.aminalOne.tailId,
      auction.aminalOne.earsId,
      auction.aminalOne.bodyId,
      auction.aminalOne.faceId,
      auction.aminalOne.mouthId,
      auction.aminalOne.miscId,
      auction.aminalTwo.backId,
      auction.aminalTwo.armId,
      auction.aminalTwo.tailId,
      auction.aminalTwo.earsId,
      auction.aminalTwo.bodyId,
      auction.aminalTwo.faceId,
      auction.aminalTwo.mouthId,
      auction.aminalTwo.miscId,
    ]
      .filter((id) => {
        const idStr = id ? id.toString() : '';
        return idStr !== '' && idStr !== '0';
      })
      .map((id) => makeGeneNFTId(id!)); // Convert token ID to geneNFT ID format

    return Array.from(new Set(parentIds)); // Remove duplicates
  }, [auction]);

  // Fetch gene NFT data for the gene IDs
  const { data: geneData, isLoading: isLoadingGenes } = useGenesByIds(geneIds);

  // State for selected gene parts
  const [selectedParts, setSelectedParts] = useState<SelectedParts>({
    background: 0,
    tail: 0,
    arm: 0,
    ears: 0,
    body: 0,
    face: 0,
    mouth: 0,
    misc: 0,
  });

  // State for randomized preview
  const [hasRandomized, setHasRandomized] = useState(false);

  // State for propose gene modal
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  // Create a lookup map for gene data
  const geneMap = useMemo(() => {
    if (!geneData) return {};

    const map: { [key: string]: any } = {};
    geneData.forEach((gene) => {
      if (gene && gene.tokenId) {
        map[gene.tokenId.toString()] = gene;
      }
    });
    return map;
  }, [geneData]);

  // Define the gene parts from the auction data with community proposals
  const parts: TraitParts = useMemo(() => {
    if (!auction?.aminalOne || !auction?.aminalTwo) {
      return {
        background: [],
        body: [],
        face: [],
        mouth: [],
        ears: [],
        arm: [],
        tail: [],
        misc: [],
      };
    }

    const getGeneForId = (id: any) => {
      if (!id || id.toString() === '0') {
        return null;
      }
      const idStr = id.toString();
      const gene = geneMap[idStr];
      if (!gene) {
        console.warn(
          `Gene not found for ID: ${idStr}, available keys:`,
          Object.keys(geneMap).slice(0, 5)
        );
      }
      return gene ? { ...gene, visualId: gene.tokenId } : null;
    };

    // Mark parent genes with source metadata
    const markAsParentGene = (gene: any, parentIndex: number) => {
      return gene ? { ...gene, isParentGene: true, parentIndex } : null;
    };

    const parentGenes = {
      background: [
        markAsParentGene(getGeneForId(auction.aminalOne.backId), 1),
        markAsParentGene(getGeneForId(auction.aminalTwo.backId), 2),
      ].filter(Boolean),
      body: [
        markAsParentGene(getGeneForId(auction.aminalOne.bodyId), 1),
        markAsParentGene(getGeneForId(auction.aminalTwo.bodyId), 2),
      ].filter(Boolean),
      face: [
        markAsParentGene(getGeneForId(auction.aminalOne.faceId), 1),
        markAsParentGene(getGeneForId(auction.aminalTwo.faceId), 2),
      ].filter(Boolean),
      mouth: [
        markAsParentGene(getGeneForId(auction.aminalOne.mouthId), 1),
        markAsParentGene(getGeneForId(auction.aminalTwo.mouthId), 2),
      ].filter(Boolean),
      ears: [
        markAsParentGene(getGeneForId(auction.aminalOne.earsId), 1),
        markAsParentGene(getGeneForId(auction.aminalTwo.earsId), 2),
      ].filter(Boolean),
      arm: [
        markAsParentGene(getGeneForId(auction.aminalOne.armId), 1),
        markAsParentGene(getGeneForId(auction.aminalTwo.armId), 2),
      ].filter(Boolean),
      tail: [
        markAsParentGene(getGeneForId(auction.aminalOne.tailId), 1),
        markAsParentGene(getGeneForId(auction.aminalTwo.tailId), 2),
      ].filter(Boolean),
      misc: [
        markAsParentGene(getGeneForId(auction.aminalOne.miscId), 1),
        markAsParentGene(getGeneForId(auction.aminalTwo.miscId), 2),
      ].filter(Boolean),
    };

    // Add community proposals to each trait category
    const traitMapping = {
      0: 'background',
      1: 'arm',
      2: 'tail',
      3: 'ears',
      4: 'body',
      5: 'face',
      6: 'mouth',
      7: 'misc',
    };

    const communityGenes = {
      background: [],
      body: [],
      face: [],
      mouth: [],
      ears: [],
      arm: [],
      tail: [],
      misc: [],
    };

    // Group proposals by trait type and mark as community genes
    if (proposeGenes) {
      proposeGenes.forEach((proposal) => {
        const traitKey =
          traitMapping[proposal.traitType as keyof typeof traitMapping];
        // Use gene NFT data that's already loaded with the proposal
        const geneNFT = proposal.geneNFT;
        if (traitKey && geneNFT) {
          (communityGenes)[traitKey].push({
            ...geneNFT,
            visualId: geneNFT.tokenId,
            svg: geneNFT.svg,
            isCommunityGene: true,
          });
        }
      });
    }

    // Combine parent genes first, then community proposals (remove duplicates)
    const combineUnique = (parentArray: any[], communityArray: any[]) => {
      const combined = [...parentArray];
      const existingIds = new Set(
        parentArray.map((gene) => gene?.visualId || gene?.tokenId)
      );

      communityArray.forEach((gene) => {
        if (gene && !existingIds.has(gene.visualId || gene.tokenId)) {
          combined.push(gene);
          existingIds.add(gene.visualId || gene.tokenId);
        }
      });

      return combined;
    };

    const result = {
      background: combineUnique(
        parentGenes.background,
        communityGenes.background
      ),
      body: combineUnique(parentGenes.body, communityGenes.body),
      face: combineUnique(parentGenes.face, communityGenes.face),
      mouth: combineUnique(parentGenes.mouth, communityGenes.mouth),
      ears: combineUnique(parentGenes.ears, communityGenes.ears),
      arm: combineUnique(parentGenes.arm, communityGenes.arm),
      tail: combineUnique(parentGenes.tail, communityGenes.tail),
      misc: combineUnique(parentGenes.misc, communityGenes.misc),
    };

    return result;
  }, [auction, geneMap, proposeGenes]);

  // Parent genes only (for randomization)
  const parentParts: TraitParts = useMemo(() => {
    if (!auction?.aminalOne || !auction?.aminalTwo) {
      return {
        background: [],
        body: [],
        face: [],
        mouth: [],
        ears: [],
        arm: [],
        tail: [],
        misc: [],
      };
    }

    const getGeneForId = (id: any) => {
      if (!id || id.toString() === '0') {
        return null;
      }
      const gene = geneMap[id.toString()];
      return gene ? { ...gene, visualId: gene.tokenId } : null;
    };

    return {
      background: [
        getGeneForId(auction.aminalOne.backId),
        getGeneForId(auction.aminalTwo.backId),
      ].filter(Boolean),
      body: [
        getGeneForId(auction.aminalOne.bodyId),
        getGeneForId(auction.aminalTwo.bodyId),
      ].filter(Boolean),
      face: [
        getGeneForId(auction.aminalOne.faceId),
        getGeneForId(auction.aminalTwo.faceId),
      ].filter(Boolean),
      mouth: [
        getGeneForId(auction.aminalOne.mouthId),
        getGeneForId(auction.aminalTwo.mouthId),
      ].filter(Boolean),
      ears: [
        getGeneForId(auction.aminalOne.earsId),
        getGeneForId(auction.aminalTwo.earsId),
      ].filter(Boolean),
      arm: [
        getGeneForId(auction.aminalOne.armId),
        getGeneForId(auction.aminalTwo.armId),
      ].filter(Boolean),
      tail: [
        getGeneForId(auction.aminalOne.tailId),
        getGeneForId(auction.aminalTwo.tailId),
      ].filter(Boolean),
      misc: [
        getGeneForId(auction.aminalOne.miscId),
        getGeneForId(auction.aminalTwo.miscId),
      ].filter(Boolean),
    };
  }, [auction, geneMap]);

  // Randomize preview on page load using only parent genes
  useEffect(() => {
    if (!hasRandomized && parentParts && auction && geneData) {
      // Wait for all data to be loaded
      const hasData = Object.values(parentParts).some(
        (genes) => genes.length > 0
      );

      if (hasData) {
        const randomizedParts = Object.keys(parentParts).reduce((acc, key) => {
          const availableGenes = parentParts[key as keyof typeof parentParts];
          if (availableGenes.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * availableGenes.length
            );
            acc[key] = randomIndex;
          } else {
            acc[key] = -1; // Empty if no genes available
          }
          return acc;
        }, {} as SelectedParts);

        setSelectedParts(randomizedParts);
        setHasRandomized(true);
      }
    }
  }, [parentParts, hasRandomized, auction, geneData]);

  // Handler for gene selection
  const handlePartSelection = (part: string, index: number) => {
    setSelectedParts((prev) => ({
      ...prev,
      [part]: index,
    }));
  };

  // Function to get parent Aminal contract addresses
  const getParentAddresses = () => {
    if (!auction?.aminalOne || !auction?.aminalTwo)
      return { parentOne: '?', parentTwo: '?' };
    return {
      parentOne:
        auction.aminalOne.contractAddress || auction.aminalOne.aminalIndex,
      parentTwo:
        auction.aminalTwo.contractAddress || auction.aminalTwo.aminalIndex,
    };
  };

  const { parentOne, parentTwo } = getParentAddresses();

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

          {!isRouterReady || isLoadingAuction || isLoadingGenes ? (
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
              <div className="bg-card rounded-lg border border-border overflow-hidden -mt-8">
                {/* Parents Info with Countdown Timer */}
                <div className="bg-muted border border-border rounded-lg px-6 py-4">
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

                {/* Show new Aminal if auction is finished, show winning combination if ended but not born, otherwise show builder */}
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

                          <div className="bg-card rounded-lg p-4 border border-success/30 shadow-sm">
                            <div className="text-sm text-success font-medium">
                              Contract Address
                            </div>
                            <div className="text-sm font-mono text-success mt-1">
                              {auction.childAminal.contractAddress}
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
                  </div>
                ) : isAuctionEnded &&
                  (!auction?.finished || !auction?.childAminal) ? (
                  <div></div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 p-4">
                    {/* Left Column - Preview */}
                    <div className="xl:col-span-2">
                      <div className="bg-muted rounded-lg p-4 border border-border">
                        <h3 className="text-sm font-medium text-foreground mb-3">
                          Preview
                        </h3>
                        <div className="aspect-square rounded-lg overflow-hidden bg-card border border-border">
                          <svg
                            viewBox="0 0 1000 1000"
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{
                              __html: [
                                // Correct rendering order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
                                'background',
                                'arm',
                                'tail',
                                'ears',
                                'body',
                                'face',
                                'mouth',
                                'misc',
                              ]
                                .map((part) => {
                                  const index = selectedParts[part];
                                  // Handle empty gene selection (index -1)
                                  if (index === -1) return '';
                                  return parts[part][index]?.svg || '';
                                })
                                .join(''),
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Gene Selector */}
                    <div className="space-y-4 xl:col-span-2">
                      <TraitSelector
                        parts={parts}
                        selectedParts={selectedParts}
                        onPartSelection={handlePartSelection}
                        disabled={auction?.finished || isAuctionEnded}
                        onProposeGene={() => setIsProposalModalOpen(true)}
                        showProposeButton={
                          !auction?.finished && !isAuctionEnded
                        }
                      />

                      {/* Vote Button */}
                      {!auction?.finished && !isAuctionEnded && (
                        <div>
                          <BulkVoteButton
                            auctionId={auctionId}
                            backId={
                              selectedParts.background === -1
                                ? '0'
                                : parts.background[selectedParts.background]
                                    ?.visualId || '0'
                            }
                            armId={
                              selectedParts.arm === -1
                                ? '0'
                                : parts.arm[selectedParts.arm]?.visualId || '0'
                            }
                            tailId={
                              selectedParts.tail === -1
                                ? '0'
                                : parts.tail[selectedParts.tail]?.visualId ||
                                  '0'
                            }
                            earsId={
                              selectedParts.ears === -1
                                ? '0'
                                : parts.ears[selectedParts.ears]?.visualId ||
                                  '0'
                            }
                            bodyId={
                              selectedParts.body === -1
                                ? '0'
                                : parts.body[selectedParts.body]?.visualId ||
                                  '0'
                            }
                            faceId={
                              selectedParts.face === -1
                                ? '0'
                                : parts.face[selectedParts.face]?.visualId ||
                                  '0'
                            }
                            mouthId={
                              selectedParts.mouth === -1
                                ? '0'
                                : parts.mouth[selectedParts.mouth]?.visualId ||
                                  '0'
                            }
                            miscId={
                              selectedParts.misc === -1
                                ? '0'
                                : parts.misc[selectedParts.misc]?.visualId ||
                                  '0'
                            }
                          />
                        </div>
                      )}

                      {auction?.finished && (
                        <div className="text-center py-4 bg-success/10 rounded-lg border border-success/30">
                          <div className="text-success font-medium">
                            Auction Complete - New Aminal Created
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional breeding information section - only show if auction is finished */}
              {auction?.finished && auction?.childAminal && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Breeding Details
                    </h3>
                    <p className="text-muted-foreground">
                      This Aminal was created through community voting in
                      auction #{auctionId}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <span>👨‍👩‍👧‍👦</span>
                        Parent Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            Parent A
                          </span>
                          <Link
                            href={`/aminals/${auction.aminalOne?.contractAddress}`}
                            className="text-sm font-medium text-energy hover:text-energy/80"
                          >
                            Aminal #{auction.aminalOne?.aminalIndex}
                          </Link>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            Parent B
                          </span>
                          <Link
                            href={`/aminals/${auction.aminalTwo?.contractAddress}`}
                            className="text-sm font-medium text-energy hover:text-energy/80"
                          >
                            Aminal #{auction.aminalTwo?.aminalIndex}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <span>📊</span>
                        Auction Statistics
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            Total Voting Power
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {Number(auction.totalLove).toFixed(2)} ❤️
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            Status
                          </span>
                          <span className="text-sm font-medium text-success">
                            ✅ Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vote Statistics - Always show, but "Current Winning Combination" section is hidden if auction is finished */}
              <div className="bg-card rounded-lg border border-border p-4">
                <VoteStats
                  auctionId={auctionId}
                  forceShowWinningCombination={
                    isAuctionEnded &&
                    (!auction?.finished || !auction?.childAminal)
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Propose Gene Modal */}
      {!auction?.finished && !isAuctionEnded && (
        <ProposeGeneModal
          auctionId={auctionId}
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default AuctionPage;

// Remove static generation - use server-side rendering for dynamic routes
