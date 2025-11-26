import AminalGrid from '@components/AminalGrid';
import GeneCard from '@components/GeneCard';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { EmptyState } from '@components/ui/EmptyState';
import { PageLoadingSpinner } from '@components/ui/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { useUserEarnings, useUserProfile } from '@hooks';
import { useHasMounted } from '@hooks/useHasMounted';
import { Check, Copy } from 'lucide-react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { formatEther } from 'viem';
import { useAccount, useEnsName } from 'wagmi';
import Layout from '../_layout';

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const { address } = router.query;
  const hasMounted = useHasMounted();
  const [activeTab, setActiveTab] = useState<string>('loved');
  const [copied, setCopied] = useState(false);

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

  const { data: ensName } = useEnsName({
    address: isRouterReady ? (profileAddress as `0x${string}`) : undefined,
    chainId: 1,
  });

  const { data: userProfile, isLoading: profileLoading } = useUserProfile(
    isRouterReady ? profileAddress : ''
  );
  const { data: userEarnings, isLoading: earningsLoading } = useUserEarnings(
    isRouterReady ? profileAddress : ''
  );

  if (
    router.isFallback ||
    !isRouterReady ||
    !hasMounted ||
    profileLoading ||
    earningsLoading
  ) {
    return (
      <Layout>
        <Head>
          <title>Profile - Aminals</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <PageLoadingSpinner />
      </Layout>
    );
  }

  if (!userProfile) {
    return (
      <Layout>
        <Head>
          <title>Profile Not Found - Aminals</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <div className="py-8">
          <EmptyState
            icon="🔍"
            title="No profile found"
            description={`No activity found for ${formatAddress(
              profileAddress
            )}`}
          />
        </div>
      </Layout>
    );
  }

  const totalEarnings =
    userEarnings?.genesCreated?.reduce(
      (sum, gene) => sum + BigInt(gene.totalEarnings || '0'),
      BigInt(0)
    ) || BigInt(0);

  const totalSpent =
    userProfile.feedEvents?.reduce(
      (sum, event) => sum + (event.amount || 0n),
      0n
    ) || 0n;

  function formatAddress(addr: string) {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(profileAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const formatTimeAgo = (timestamp: bigint | string) => {
    const timestampNum =
      typeof timestamp === 'bigint' ? Number(timestamp) : parseInt(timestamp);
    const date = new Date(timestampNum * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <Layout>
      <Head>
        <title>{ensName || formatAddress(profileAddress)} - Aminals</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <div className="py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">
                {ensName || (
                  <>
                    <span className="md:hidden">
                      {formatAddress(profileAddress)}
                    </span>
                    <span className="hidden md:inline font-mono">
                      {profileAddress}
                    </span>
                  </>
                )}
              </h1>
              {isOwnProfile && <Badge variant="secondary">You</Badge>}
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {ensName && (
              <div className="text-sm text-muted-foreground font-mono">
                <span className="md:hidden">
                  {formatAddress(profileAddress)}
                </span>
                <span className="hidden md:inline">{profileAddress}</span>
              </div>
            )}
            <Link
              href="/"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              ← Back to Aminals
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {userProfile.lovers?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Aminals Loved
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {userProfile.genesCreated?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Genes Created
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {Number(formatEther(totalEarnings)).toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">ETH Earned</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {Number(formatEther(totalSpent)).toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">ETH Spent</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="loved">
                Loved ({userProfile.lovers?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="genes">
                Genes ({userProfile.genesCreated?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="loved" className="mt-6">
              {userProfile.lovers && userProfile.lovers.length > 0 ? (
                <AminalGrid
                  aminals={userProfile.lovers.map((lover) => ({
                    ...lover.aminal,
                    lovers: { items: [{ ...lover, love: lover.love }] },
                  }))}
                />
              ) : (
                <EmptyState
                  icon="💔"
                  title="No loved Aminals yet"
                  description="Start showing some love to Aminals to see them here!"
                />
              )}
            </TabsContent>

            <TabsContent value="genes" className="mt-6">
              {userProfile.genesCreated &&
              userProfile.genesCreated.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProfile.genesCreated.map((gene) => (
                    <GeneCard
                      key={gene.id}
                      trait={{
                        id: gene.id,
                        tokenId: gene.tokenId.toString(),
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
                <EmptyState
                  icon="🧬"
                  title="No genes created yet"
                  description="Create your first gene to contribute to the Aminals ecosystem!"
                />
              )}
            </TabsContent>

            <TabsContent value="earnings" className="mt-6">
              {userEarnings?.genesCreated &&
              userEarnings.genesCreated.filter(
                (gene) => gene.payouts && gene.payouts.length > 0
              ).length > 0 ? (
                <div className="space-y-4">
                  {userEarnings.genesCreated
                    .filter((gene) => gene.payouts && gene.payouts.length > 0)
                    .map((gene) => (
                      <Card key={gene.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {gene.name || `Gene #${gene.tokenId}`}
                              </CardTitle>
                              <div className="text-sm text-muted-foreground">
                                {gene.payouts?.length || 0} payouts
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-success">
                                {Number(
                                  formatEther(BigInt(gene.totalEarnings || '0'))
                                ).toFixed(4)}{' '}
                                ETH
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {gene.payouts?.map((payout) => (
                              <div
                                key={payout.id}
                                className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                              >
                                <div>
                                  <span className="font-medium">
                                    Auction #{payout.auctionId}
                                  </span>
                                  <span className="text-muted-foreground ml-2">
                                    {formatTimeAgo(payout.blockTimestamp)}
                                  </span>
                                </div>
                                <div className="font-mono text-success">
                                  +
                                  {Number(
                                    formatEther(BigInt(payout.amount))
                                  ).toFixed(4)}{' '}
                                  ETH
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <EmptyState
                  icon="💰"
                  title="No earnings yet"
                  description="Create genes and participate in auctions to start earning!"
                />
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="space-y-6">
                {/* Activity Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        {Number(formatEther(totalSpent)).toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ETH Spent
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        {userProfile.designVotes?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Design Votes Cast
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        {userProfile.genesOwned?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Genes Owned
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Votes */}
                {userProfile.designVotes &&
                userProfile.designVotes.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Recent Design Votes
                    </h3>
                    {userProfile.designVotes.slice(0, 5).map((vote: any) => {
                      if (!vote.proposal) return null;
                      return (
                        <Card key={vote.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">
                                  {vote.isRemoveVote
                                    ? 'Voted to remove'
                                    : 'Voted for'}{' '}
                                  {vote.proposal.geneNFT.name ||
                                    `Gene #${vote.proposal.geneNFT.tokenId}`}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Auction #
                                  {vote.auction?.auctionId ?? 'Unknown'} •{' '}
                                  {formatTimeAgo(vote.blockTimestamp)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {Number(
                                    formatEther(BigInt(vote.loveAmount))
                                  ).toFixed(2)}{' '}
                                  Love
                                </div>
                                <Badge
                                  variant={
                                    vote.isRemoveVote
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                >
                                  {vote.isRemoveVote ? 'Remove' : 'Support'}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon="📊"
                    title="No activity yet"
                    description="Start participating in gene votes and loving Aminals to see your activity here!"
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
