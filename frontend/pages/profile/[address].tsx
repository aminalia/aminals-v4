import AminalGrid from '@/components/aminal-grid';
import TraitCard from '@/components/trait-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { useHasMounted } from '@/hooks/useHasMounted';
import { cn } from '@/lib/utils';
import { useUserEarnings, useUserProfile } from '@/resources/user-profile';
import { Check, Copy } from 'lucide-react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState as useReactState, useState } from 'react';
import { formatEther } from 'viem';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
import Layout from '../_layout';

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const { address } = router.query;
  const hasMounted = useHasMounted();
  const [activeTab, setActiveTab] = useState<
    'loved' | 'genes' | 'earnings' | 'activity'
  >('loved');
  const [copied, setCopied] = useReactState(false);

  // Show loading state if router is not ready or address is not available
  const isRouterReady =
    router.isReady &&
    address &&
    typeof address === 'string' &&
    address !== 'undefined';

  const profileAddress = address as string;
  const isOwnProfile =
    hasMounted &&
    connectedAddress &&
    profileAddress?.toLowerCase() === connectedAddress.toLowerCase();

  // ENS resolution
  const { data: ensName } = useEnsName({
    address: isRouterReady ? (profileAddress as `0x${string}`) : undefined,
    chainId: 1, // Mainnet for ENS
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: 1, // Mainnet for ENS
  });

  const { data: userProfile, isLoading: profileLoading } = useUserProfile(
    isRouterReady ? profileAddress : ''
  );
  const { data: userEarnings, isLoading: earningsLoading } = useUserEarnings(
    isRouterReady ? profileAddress : ''
  );

  // Handle fallback state for static export
  if (router.isFallback) {
    return (
      <>
        <Head>
          <title>Profile - Aminals</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <Layout>
          <div className="container max-w-5xl mx-auto px-4 py-8">
            <div className="text-center py-20">
              <div className="text-4xl mb-4">⏳</div>
              <div className="text-gray-500">Loading profile...</div>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  if (!isRouterReady || !hasMounted || profileLoading || earningsLoading) {
    return (
      <>
        <Head>
          <title>Profile - Aminals</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <Layout>
          <div className="container max-w-5xl mx-auto px-4 py-8">
            <div className="text-center py-20">
              <div className="text-4xl mb-4">⏳</div>
              <div className="text-gray-500">Loading...</div>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  if (!userProfile) {
    return (
      <>
        <Head>
          <title>Profile Not Found - Aminals</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <Layout>
          <div className="container max-w-5xl mx-auto px-4 py-8">
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-gray-500">
                No profile found for this address
              </div>
              <div className="text-sm text-gray-400 mt-2 font-mono">
                {profileAddress}
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  const totalEarnings =
    userEarnings?.genesCreated?.reduce(
      (sum, gene) => sum + BigInt(gene.totalEarnings || '0'),
      BigInt(0)
    ) || BigInt(0);

  const totalLoveGiven =
    userProfile.lovers?.reduce(
      (sum, lover) => sum + BigInt(lover.love || '0'),
      BigInt(0)
    ) || BigInt(0);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(profileAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const getDisplayName = () => {
    if (ensName) return ensName;
    return formatAddress(profileAddress);
  };

  const getAvatarSrc = () => {
    if (ensAvatar) return ensAvatar;
    // Fallback to a generated avatar based on address
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${profileAddress}&backgroundColor=e1f5fe,e8f5e8,f3e5f5,fff3e0,fce4ec`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <>
      <Head>
        <title>
          {isOwnProfile ? 'Your Profile' : 'User Profile'} - Aminals
        </title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Image
                    src={getAvatarSrc()}
                    alt={`Avatar for ${getDisplayName()}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 text-3xl items-center justify-center hidden">
                    👤
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {isOwnProfile ? 'Your Profile' : getDisplayName()}
                  </h1>

                  {/* Address with copy functionality */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <p className="text-base md:text-lg text-gray-600 font-mono">
                      {/* Show full address only when ENS is available (so it's below the ENS name), otherwise truncate */}
                      {ensName ? (
                        <>
                          <span className="hidden md:inline">
                            {profileAddress}
                          </span>
                          <span className="md:hidden">
                            {formatAddress(profileAddress)}
                          </span>
                        </>
                      ) : (
                        formatAddress(profileAddress)
                      )}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyAddress}
                      className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* ENS name if available */}
                  {ensName && (
                    <div className="flex items-center justify-center md:justify-start gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">
                        {ensName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-2">
              <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-pink-600">
                  {userProfile.lovers?.length || 0}
                </div>
                <div className="text-xs md:text-sm text-pink-700 font-medium">
                  Aminals Loved
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-purple-600">
                  {userProfile.genesCreated?.length || 0}
                </div>
                <div className="text-xs md:text-sm text-purple-700 font-medium">
                  Genes Created
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                <div className="text-lg md:text-2xl font-bold text-green-600">
                  {Number(formatEther(totalEarnings)).toFixed(4)} ETH
                </div>
                <div className="text-xs md:text-sm text-green-700 font-medium">
                  Total Earnings
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center px-2">
              <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-white border border-gray-200 rounded-xl md:rounded-full p-2 shadow-sm max-w-full">
                <Button
                  variant={activeTab === 'loved' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('loved')}
                  className={cn(
                    'rounded-lg md:rounded-full px-3 md:px-6 py-2 text-xs md:text-sm font-medium transition-all flex-1 md:flex-none',
                    activeTab === 'loved'
                      ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  <span className="md:hidden">
                    ❤️ {userProfile.lovers?.length || 0}
                  </span>
                  <span className="hidden md:inline">
                    ❤️ Loved ({userProfile.lovers?.length || 0})
                  </span>
                </Button>
                <Button
                  variant={activeTab === 'genes' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('genes')}
                  className={cn(
                    'rounded-lg md:rounded-full px-3 md:px-6 py-2 text-xs md:text-sm font-medium transition-all flex-1 md:flex-none',
                    activeTab === 'genes'
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  <span className="md:hidden">
                    🧬 {userProfile.genesCreated?.length || 0}
                  </span>
                  <span className="hidden md:inline">
                    🧬 Genes ({userProfile.genesCreated?.length || 0})
                  </span>
                </Button>
                <Button
                  variant={activeTab === 'earnings' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('earnings')}
                  className={cn(
                    'rounded-lg md:rounded-full px-3 md:px-6 py-2 text-xs md:text-sm font-medium transition-all flex-1 md:flex-none',
                    activeTab === 'earnings'
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  <span className="md:hidden">💰</span>
                  <span className="hidden md:inline">💰 Earnings</span>
                </Button>
                <Button
                  variant={activeTab === 'activity' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('activity')}
                  className={cn(
                    'rounded-lg md:rounded-full px-3 md:px-6 py-2 text-xs md:text-sm font-medium transition-all flex-1 md:flex-none',
                    activeTab === 'activity'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  <span className="md:hidden">📊</span>
                  <span className="hidden md:inline">📊 Activity</span>
                </Button>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'loved' && (
              <div className="space-y-6">
                {userProfile.lovers && userProfile.lovers.length > 0 ? (
                  <AminalGrid
                    aminals={userProfile.lovers.map((lover) => ({
                      ...lover.aminal,
                      lovers: [{ love: lover.love }],
                    }))}
                  />
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 border border-pink-200">
                      <div className="text-6xl mb-4">💔</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No loved Aminals yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Start showing some love to Aminals to see them here!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'genes' && (
              <div className="space-y-6">
                {userProfile.genesCreated &&
                userProfile.genesCreated.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProfile.genesCreated.map((gene) => (
                      <TraitCard
                        key={gene.id}
                        trait={{
                          id: gene.id,
                          tokenId: gene.tokenId,
                          traitType: gene.traitType,
                          svg: gene.svg,
                          name: gene.name,
                          creator: {
                            address: profileAddress,
                          },
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
                      <div className="text-6xl mb-4">🧬</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No genes created yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Create your first gene to contribute to the Aminals
                        ecosystem!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                {userEarnings?.genesCreated &&
                userEarnings.genesCreated.filter(
                  (gene) => gene.payouts && gene.payouts.length > 0
                ).length > 0 ? (
                  <div className="space-y-4">
                    {userEarnings.genesCreated
                      .filter((gene) => gene.payouts && gene.payouts.length > 0)
                      .map((gene) => (
                        <div
                          key={gene.id}
                          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {gene.name || `Gene #${gene.tokenId}`}
                              </h3>
                              <Badge variant="secondary" className="mt-1">
                                {TRAIT_CATEGORIES[
                                  gene.traitType as keyof typeof TRAIT_CATEGORIES
                                ]?.name || `Type ${gene.traitType}`}
                              </Badge>
                            </div>
                            <div className="text-right mt-2 sm:mt-0">
                              <div className="text-2xl font-bold text-green-600">
                                {Number(
                                  formatEther(BigInt(gene.totalEarnings || '0'))
                                ).toFixed(4)}{' '}
                                ETH
                              </div>
                              <div className="text-sm text-gray-500">
                                {gene.payouts?.length || 0} payouts
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {gene.payouts?.map((payout) => (
                              <div
                                key={payout.id}
                                className="flex items-center justify-between text-sm bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 rounded-lg"
                              >
                                <div>
                                  <span className="font-medium">
                                    Auction #{payout.auctionId}
                                  </span>
                                  <span className="text-gray-500 ml-2">
                                    {formatTimeAgo(payout.blockTimestamp)}
                                  </span>
                                </div>
                                <div className="font-mono text-green-600 font-medium">
                                  +
                                  {Number(
                                    formatEther(BigInt(payout.amount))
                                  ).toFixed(4)}{' '}
                                  ETH
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                      <div className="text-6xl mb-4">💰</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No earnings yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Create genes and participate in auctions to start
                        earning!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">
                      {Number(formatEther(totalLoveGiven)).toFixed(2)}
                    </div>
                    <div className="text-sm text-pink-700 font-medium">
                      Total Love Given
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userProfile.geneVotes?.length || 0}
                    </div>
                    <div className="text-sm text-purple-700 font-medium">
                      Gene Votes Cast
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userProfile.genesOwned?.length || 0}
                    </div>
                    <div className="text-sm text-blue-700 font-medium">
                      Genes Owned
                    </div>
                  </div>
                </div>

                {/* Recent Votes */}
                {userProfile.geneVotes && userProfile.geneVotes.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Recent Gene Votes
                    </h3>
                    {userProfile.geneVotes.slice(0, 5).map((vote) => (
                      <div
                        key={vote.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">
                              {vote.isRemoveVote
                                ? 'Voted to remove'
                                : 'Voted for'}{' '}
                              {vote.proposal.geneNFT.name ||
                                `Gene #${vote.proposal.geneNFT.tokenId}`}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Auction #{vote.auction.auctionId} •{' '}
                              {formatTimeAgo(vote.blockTimestamp)}
                            </div>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <div className="text-sm font-medium text-purple-600">
                              {Number(
                                formatEther(BigInt(vote.loveAmount))
                              ).toFixed(2)}{' '}
                              Love
                            </div>
                            <Badge
                              variant={
                                vote.isRemoveVote ? 'destructive' : 'default'
                              }
                              className="mt-1"
                            >
                              {vote.isRemoveVote ? 'Remove' : 'Support'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No activity yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Start participating in gene votes and loving Aminals to
                        see your activity here!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProfilePage;

// Remove static generation - use server-side rendering for dynamic routes
