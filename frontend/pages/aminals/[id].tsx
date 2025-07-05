import BreedButton from '@/components/actions/breed-button';
import FeedButton from '@/components/actions/feed-button';
import CallSkillButton from '@/components/actions/call-skill-button';
import { AminalVisualImage } from '@/components/aminal-card';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../_layout';

import { useQuery } from '@tanstack/react-query';

// Direct fetch for individual Aminal by contract address
const useAminalByAddress = (contractAddress: string) => {
  return useQuery({
    queryKey: ['aminal-by-address', contractAddress],
    queryFn: async () => {
      if (!contractAddress || contractAddress === 'undefined') {
        return null;
      }

      const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest';
      
      const query = `
        query AminalByAddress($contractAddress: Bytes) {
          aminals(where: { contractAddress: $contractAddress }) {
            id
            contractAddress
            aminalIndex
            momAddress
            dadAddress
            energy
            totalLove
            breeding
            blockTimestamp
            tokenURI
            backId
            armId
            tailId
            earsId
            bodyId
            faceId
            mouthId
            miscId
            feeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
              id
              sender {
                address
              }
              amount
              love
              blockTimestamp
            }
            squeaks(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
              id
              sender {
                address
              }
              amount
              love
              blockTimestamp
            }
            skillCalls(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
              id
              caller {
                address
              }
              skillAddress
              squeakCost
              blockTimestamp
            }
          }
        }
      `;

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { contractAddress }
        })
      });

      const data = await response.json();

      if (data.errors) {
        console.error('Aminal fetch errors:', data.errors);
        throw new Error(data.errors[0].message);
      }

      const aminals = data.data?.aminals || [];
      return aminals.length > 0 ? aminals[0] : null;
    },
    enabled: !!contractAddress && contractAddress !== 'undefined'
  });
};

const AminalPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query; // This is now a contract address
  const contractAddress = id as string;
  const { data: aminal, isLoading } = useAminalByAddress(contractAddress);

  if (isLoading) {
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
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">
                  Aminal #{aminal.aminalIndex}
                </h1>
              </div>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Back to all Aminals
              </Link>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-indigo-50 flex items-center justify-center border border-gray-200">
                <AminalVisualImage aminal={aminal} />
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Stats Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                  <h2 className="text-xl font-semibold">Stats</h2>

                  {/* Energy and Total Love */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm text-gray-500">Energy</div>
                      <div className="text-xl font-semibold text-purple-600">
                        {(Number(aminal.energy) / 1e18).toFixed(2)} ⚡
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm text-gray-500">Total Love</div>
                      <div className="text-xl font-semibold text-pink-600">
                        {(Number(aminal.totalLove) / 1e18).toFixed(2)} ❤️
                      </div>
                    </div>
                  </div>

                  {/* Contract Address */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-sm text-gray-500">Contract Address</div>
                    <div className="text-sm font-mono text-blue-600">
                      {aminal.contractAddress}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <FeedButton contractAddress={aminal.contractAddress as `0x${string}`} />
                  <BreedButton contractAddress={aminal.contractAddress as `0x${string}`} />
                  <CallSkillButton aminalContractAddress={aminal.contractAddress as `0x${string}`} />
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
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2 px-3">
                      <span className="text-blue-600 text-lg">👪</span>
                      Lineage
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500">Mom</div>
                        <div className="font-medium text-xs">
                          {!aminal.momAddress || aminal.momAddress === '0x0000000000000000000000000000000000000000' 
                            ? 'Genesis' 
                            : `${aminal.momAddress.slice(0, 8)}...`}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500">Dad</div>
                        <div className="font-medium text-xs">
                          {!aminal.dadAddress || aminal.dadAddress === '0x0000000000000000000000000000000000000000' 
                            ? 'Genesis' 
                            : `${aminal.dadAddress.slice(0, 8)}...`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breeding */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2 px-3">
                      <span className="text-blue-600 text-lg">🧬</span>
                      Breeding
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 px-3">
                        Breeding Status: {aminal.breeding ? 'Available' : 'Not Available'}
                      </p>
                      <p className="text-xs text-gray-500 px-3">
                        In the new system, breeding requires consent from both parties and community voting via Gene Auctions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Gene IDs */}
                <div>
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2 px-3">
                      <span className="text-blue-600 text-lg">🧬</span>
                      Gene IDs
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'Back', emoji: '🎒', id: aminal.backId },
                        { name: 'Arms', emoji: '💪', id: aminal.armId },
                        { name: 'Tail', emoji: '🐾', id: aminal.tailId },
                        { name: 'Ears', emoji: '👂', id: aminal.earsId },
                        { name: 'Body', emoji: '👤', id: aminal.bodyId },
                        { name: 'Face', emoji: '😊', id: aminal.faceId },
                        { name: 'Mouth', emoji: '👄', id: aminal.mouthId },
                        { name: 'Misc', emoji: '✨', id: aminal.miscId },
                      ].map((gene, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border bg-blue-50 border-blue-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{gene.emoji}</span>
                            <div>
                              <div className="text-sm font-medium">{gene.name}</div>
                              <div className="text-xs text-blue-700 font-medium">
                                Gene #{gene.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Skills Section */}
            <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-2xl font-bold">Global Skills</h2>
                <div className="text-sm text-gray-500">
                  Any Aminal can call any registered skill
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">
                    🔮 Call a Global Skill
                  </h3>
                  <p className="text-sm text-blue-600 mb-4">
                    In the new architecture, skills are globally available to any Aminal. No need to learn them individually!
                  </p>
                  <CallSkillButton aminalContractAddress={aminal.contractAddress as `0x${string}`} />
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium mb-2">Available Global Skills:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">🏃</span>
                      <span className="font-medium">Move2D</span>
                      <span className="text-gray-500">- Move your Aminal in 2D space</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">🏃‍♀️</span>
                      <span className="font-medium">MoveTwice</span>
                      <span className="text-gray-500">- Move your Aminal twice in one action</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </Layout>
  );
};

export default AminalPage;