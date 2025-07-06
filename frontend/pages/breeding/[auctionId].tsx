import BulkVoteButton from '@/components/actions/bulk-vote-button';
import ProposeButton from '@/components/actions/propose-button';
import TraitSelector, {
  SelectedParts,
  TraitParts,
} from '@/components/trait-selector';
import { Button } from '@/components/ui/button';
import VisualsList from '@/components/visuals-list';
import VoteStats from '@/components/vote-stats';
import { useAuction, useAuctionProposeVisuals } from '@/resources/auctions';
import { useTraitsByIds } from '@/resources/traits';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Layout from '../_layout';

const AuctionPage: NextPage = () => {
  const router = useRouter();
  const auctionId = router.query.auctionId as string;

  const {
    data: auction,
    isLoading: isLoadingAuction,
    error,
  } = useAuction(auctionId);
  const { data: proposeVisuals, isLoading: isLoadingProposeVisuals } =
    useAuctionProposeVisuals(auctionId);

  console.log('auction data:', auction, error);

  // Get all trait IDs from parent Aminals
  const traitIds = useMemo(() => {
    if (!auction) return [];

    const ids = [
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
      .map((id) => id.toString());
    return Array.from(new Set(ids)); // Remove duplicates
  }, [auction]);

  // Fetch gene NFT data for the trait IDs
  const { data: traitData, isLoading: isLoadingTraits } =
    useTraitsByIds(traitIds);

  // State for selected trait parts
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

  // Create a lookup map for trait data
  const traitMap = useMemo(() => {
    if (!traitData) return {};

    const map: { [key: string]: any } = {};
    traitData.forEach((trait) => {
      if (trait && trait.tokenId) {
        map[trait.tokenId] = trait;
      }
    });
    return map;
  }, [traitData]);

  // Define the trait parts from the auction data
  const parts: TraitParts = useMemo(() => {
    if (!auction) {
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

    const getTraitForId = (id: any) => {
      if (!id || id.toString() === '0') {
        return null;
      }
      const trait = traitMap[id.toString()];
      return trait ? { ...trait, visualId: trait.tokenId } : null;
    };

    const result = {
      background: [
        getTraitForId(auction.aminalOne.backId),
        getTraitForId(auction.aminalTwo.backId),
      ].filter(Boolean),
      body: [
        getTraitForId(auction.aminalOne.bodyId),
        getTraitForId(auction.aminalTwo.bodyId),
      ].filter(Boolean),
      face: [
        getTraitForId(auction.aminalOne.faceId),
        getTraitForId(auction.aminalTwo.faceId),
      ].filter(Boolean),
      mouth: [
        getTraitForId(auction.aminalOne.mouthId),
        getTraitForId(auction.aminalTwo.mouthId),
      ].filter(Boolean),
      ears: [
        getTraitForId(auction.aminalOne.earsId),
        getTraitForId(auction.aminalTwo.earsId),
      ].filter(Boolean),
      arm: [
        getTraitForId(auction.aminalOne.armId),
        getTraitForId(auction.aminalTwo.armId),
      ].filter(Boolean),
      tail: [
        getTraitForId(auction.aminalOne.tailId),
        getTraitForId(auction.aminalTwo.tailId),
      ].filter(Boolean),
      misc: [
        getTraitForId(auction.aminalOne.miscId),
        getTraitForId(auction.aminalTwo.miscId),
      ].filter(Boolean),
    };

    return result;
  }, [auction, traitMap]);

  // Handler for trait selection
  const handlePartSelection = (part: string, index: number) => {
    setSelectedParts((prev) => ({
      ...prev,
      [part]: index,
    }));
  };

  // Function to get parent Aminal contract addresses
  const getParentAddresses = () => {
    if (!auction) return { mom: '?', dad: '?' };
    return {
      mom: auction.aminalOne.contractAddress || auction.aminalOne.aminalIndex,
      dad: auction.aminalTwo.contractAddress || auction.aminalTwo.aminalIndex,
    };
  };

  const { mom, dad } = getParentAddresses();

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Breeding</h1>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                #{auctionId}
              </span>
            </div>
            <Link
              href="/auctions"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to all Auctions
            </Link>
          </div>

          {isLoadingAuction || isLoadingTraits ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Parents Info */}
              <div className="bg-gray-50 rounded-xl px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-5">
                <div className="flex items-center gap-4">
                  <div className="text-xl">👪</div>
                  <div>
                    <div className="text-sm text-gray-500">Parents</div>
                    <div className="font-medium">
                      Aminal #{auction?.aminalOne?.aminalIndex || '?'} + Aminal
                      #{auction?.aminalTwo?.aminalIndex || '?'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/aminals/${mom}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      View Mom
                    </Button>
                  </Link>
                  <Link href={`/aminals/${dad}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      View Dad
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold">Design Your Offspring</h2>
                  <p className="text-gray-600 mt-1">
                    Choose which traits to inherit from each parent, or insert a
                    new gene.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Left Column - Preview */}
                  <div className="lg:col-span-2">
                    <div className="aspect-square rounded-xl overflow-hidden bg-indigo-50 border border-gray-200 p-4">
                      <svg
                        viewBox="0 0 1000 1000"
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{
                          __html: Object.entries(selectedParts)
                            .map(([part, index]) => parts[part][index]?.svg)
                            .join(''),
                        }}
                      />
                    </div>
                    <div className="mt-6 space-y-4">
                      {/* Debug info */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                          <div>
                            Selected Parts: {JSON.stringify(selectedParts)}
                          </div>
                          <div>Trait Data Count: {traitData?.length || 0}</div>
                          <div>
                            Available traits: {Object.keys(traitMap).join(', ')}
                          </div>
                          <div>Background parts: {parts.background.length}</div>
                          <div>Arm parts: {parts.arm.length}</div>
                        </div>
                      )}

                      <BulkVoteButton
                        auctionId={auctionId}
                        backId={
                          parts.background[selectedParts.background]
                            ?.visualId || '0'
                        }
                        armId={parts.arm[selectedParts.arm]?.visualId || '0'}
                        tailId={parts.tail[selectedParts.tail]?.visualId || '0'}
                        earsId={parts.ears[selectedParts.ears]?.visualId || '0'}
                        bodyId={parts.body[selectedParts.body]?.visualId || '0'}
                        faceId={parts.face[selectedParts.face]?.visualId || '0'}
                        mouthId={
                          parts.mouth[selectedParts.mouth]?.visualId || '0'
                        }
                        miscId={parts.misc[selectedParts.misc]?.visualId || '0'}
                      />
                      <ProposeButton auctionId={auctionId} />
                    </div>
                  </div>

                  {/* Right Column - Trait Selector */}
                  <div>
                    <TraitSelector
                      parts={parts}
                      selectedParts={selectedParts}
                      onPartSelection={handlePartSelection}
                    />
                  </div>
                </div>
              </div>

              {/* Visuals List Section */}
              <div className="mt-4 space-y-6">
                <h2 className="text-2xl font-bold">Community Proposals</h2>
                <VisualsList auctionId={auctionId} />
              </div>

              {/* Vote Statistics Section */}
              <div className="mt-4 space-y-6">
                <VoteStats auctionId={auctionId} />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionPage;
