import BulkVoteButton from '@/components/actions/bulk-vote-button';
import ProposeButton from '@/components/actions/propose-button';
import TraitSelector, {
  SelectedParts,
  TraitParts,
} from '@/components/trait-selector';
import { Button } from '@/components/ui/button';
import VisualsList from '@/components/visuals-list';
import { useAuction, useAuctionProposeVisuals } from '@/resources/auctions';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../_layout';

const AuctionPage: NextPage = () => {
  const router = useRouter();
  const auctionId = router.query.auctionId as string;

  const { data: auctions, isLoading: isLoadingAuction } = useAuction(auctionId);
  const { data: proposeVisuals, isLoading: isLoadingProposeVisuals } =
    useAuctionProposeVisuals(auctionId);

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

  // Define the trait parts from the auction data
  const parts: TraitParts =
    auctions && auctions[0]
      ? {
          background: [
            auctions[0].aminalOne.traits[0],
            auctions[0].aminalTwo.traits[0],
          ],
          body: [
            auctions[0].aminalOne.traits[4],
            auctions[0].aminalTwo.traits[4],
          ],
          face: [
            auctions[0].aminalOne.traits[5],
            auctions[0].aminalTwo.traits[5],
          ],
          mouth: [
            auctions[0].aminalOne.traits[6],
            auctions[0].aminalTwo.traits[6],
          ],
          ears: [
            auctions[0].aminalOne.traits[3],
            auctions[0].aminalTwo.traits[3],
          ],
          arm: [
            auctions[0].aminalOne.traits[1],
            auctions[0].aminalTwo.traits[1],
          ],
          tail: [
            auctions[0].aminalOne.traits[2],
            auctions[0].aminalTwo.traits[2],
          ],
          misc: [
            auctions[0].aminalOne.traits[7],
            auctions[0].aminalTwo.traits[7],
          ],
        }
      : {
          background: [],
          body: [],
          face: [],
          mouth: [],
          ears: [],
          arm: [],
          tail: [],
          misc: [],
        };

  // Handler for trait selection
  const handlePartSelection = (part: string, index: number) => {
    setSelectedParts((prev) => ({
      ...prev,
      [part]: index,
    }));
  };

  // Function to get parent Aminals IDs
  const getParentIds = () => {
    if (!auctions || !auctions[0]) return { mom: '?', dad: '?' };
    return {
      mom: auctions[0].aminalOne.aminalId,
      dad: auctions[0].aminalTwo.aminalId,
    };
  };

  const { mom, dad } = getParentIds();

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

          {isLoadingAuction ? (
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
                      Aminal #{mom} + Aminal #{dad}
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
                      <BulkVoteButton
                        auctionId={auctionId}
                        backId={
                          parts.background[selectedParts.background]?.visualId
                        }
                        armId={parts.arm[selectedParts.arm]?.visualId}
                        tailId={parts.tail[selectedParts.tail]?.visualId}
                        earsId={parts.ears[selectedParts.ears]?.visualId}
                        bodyId={parts.body[selectedParts.body]?.visualId}
                        faceId={parts.face[selectedParts.face]?.visualId}
                        mouthId={parts.mouth[selectedParts.mouth]?.visualId}
                        miscId={parts.misc[selectedParts.misc]?.visualId}
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionPage;
