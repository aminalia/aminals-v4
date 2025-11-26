import AuctionCard from '@components/AuctionCard';
import BreedingModal from '@components/BreedingModal';
import { Button } from '@components/ui/Button';
import { EmptyState, NoAuctionsFound } from '@components/ui/EmptyState';
import { PageLoadingSpinner } from '@components/ui/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { useAuctions } from '@hooks';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../_layout';

const BreedingPage: NextPage = () => {
  const { data: auctions, isLoading, refetch } = useAuctions();
  const [filter, setFilter] = useState<string>('all');
  const [isBreedingModalOpen, setIsBreedingModalOpen] = useState(false);

  const activeAuctions = auctions?.filter((a) => !a.finished) || [];
  const completedAuctions = auctions?.filter((a) => a.finished) || [];

  const filteredAuctions =
    filter === 'all'
      ? auctions
      : filter === 'active'
      ? activeAuctions
      : completedAuctions;

  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Breeding - Aminals</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <PageLoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Breeding - Aminals</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <div className="py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Breeding Auctions
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create new Aminals through community-driven breeding
                </p>
              </div>
              <Button
                onClick={() => setIsBreedingModalOpen(true)}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                💕 Start Breeding
              </Button>
            </div>
            <Link
              href="/"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              ← Back to Aminals
            </Link>
          </div>

          {/* Tabs */}
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">
                All ({auctions?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeAuctions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedAuctions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {renderAuctions(filteredAuctions, 'all')}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              {renderAuctions(filteredAuctions, 'active')}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {renderAuctions(filteredAuctions, 'completed')}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Breeding Modal - no aminal prop means dual selection mode */}
      <BreedingModal
        isOpen={isBreedingModalOpen}
        onClose={() => setIsBreedingModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </Layout>
  );

  function renderAuctions(
    auctionList: typeof auctions,
    type: 'all' | 'active' | 'completed'
  ) {
    if (!auctionList || auctionList.length === 0) {
      if (type === 'active') {
        return (
          <EmptyState
            icon="🔥"
            title="No active auctions"
            description="All breeding auctions have ended. Check back soon for new ones!"
          />
        );
      }
      if (type === 'completed') {
        return (
          <EmptyState
            icon="✅"
            title="No completed auctions"
            description="No auctions have been completed yet."
          />
        );
      }
      return <NoAuctionsFound />;
    }

    return (
      <div className="space-y-6">
        {auctionList.map((auction) => (
          <AuctionCard key={auction.auctionId} auction={auction} />
        ))}
      </div>
    );
  }
};

export default BreedingPage;
