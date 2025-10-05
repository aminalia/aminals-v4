import AuctionCard from '@/components/AuctionCard';
import { Button } from '@/components/ui/Button';
import { useAuctions } from '@/hooks';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../_layout';

const AuctionsPage: NextPage = () => {
  const { data: auctions, isLoading: isLoadingAuctions, error } = useAuctions();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Test direct connection to Ponder
  useEffect(() => {
    const testPonderConnection = async () => {
      try {
        const response = await fetch('http://localhost:42069/sql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: 'SELECT * FROM geneAuction LIMIT 5',
          }),
        });
        const data = await response.json();
        console.log('Direct Ponder test - response:', data);
      } catch (err) {
        console.error('Direct Ponder test - error:', err);
      }
    };
    testPonderConnection();
  }, []);

  const filteredAuctions =
    auctions?.filter((auction) => {
      if (filter === 'all') return true;
      if (filter === 'active') return !auction.finished;
      return auction.finished;
    }) || [];

  const activeCount = auctions?.filter((a) => !a.finished).length || 0;
  const completedCount = auctions?.filter((a) => a.finished).length || 0;

  return (
    <Layout>
      <div className="py-8">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3">
              <div className="text-6xl">💕</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-love">
                  Aminal Breeding
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Create new Aminals through community-driven breeding
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="bg-success/10 border border-success/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {activeCount}
              </div>
              <div className="text-sm text-success font-medium">
                Active Auctions
              </div>
            </div>
            <div className="bg-energy/10 border border-energy/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-energy">
                {auctions?.length || 0}
              </div>
              <div className="text-sm text-energy font-medium">
                Total Auctions
              </div>
            </div>
            <div className="bg-love/10 border border-love/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-love">
                {completedCount}
              </div>
              <div className="text-sm text-love font-medium">Completed</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center">
            <div className="flex gap-2 bg-card border border-border rounded-full p-2 shadow-sm">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                onClick={() => setFilter('all')}
                className="rounded-full px-6 font-medium"
              >
                All ({auctions?.length || 0})
              </Button>
              <Button
                variant={filter === 'active' ? 'success' : 'ghost'}
                onClick={() => setFilter('active')}
                className="rounded-full px-6 font-medium"
              >
                🔥 Active ({activeCount})
              </Button>
              <Button
                variant={filter === 'inactive' ? 'love' : 'ghost'}
                onClick={() => setFilter('inactive')}
                className="rounded-full px-6 font-medium"
              >
                ✅ Completed ({completedCount})
              </Button>
            </div>
          </div>

          {/* Auctions List */}
          {isLoadingAuctions ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-love"></div>
                <div className="text-muted-foreground">
                  Loading breeding auctions...
                </div>
              </div>
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-muted rounded-2xl p-8 border border-border">
                <div className="text-6xl mb-4">
                  {filter === 'active'
                    ? '🔥'
                    : filter === 'inactive'
                    ? '✅'
                    : '🧬'}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {filter === 'active'
                    ? 'No Active Auctions'
                    : filter === 'inactive'
                    ? 'No Completed Auctions'
                    : 'No Auctions Found'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {filter === 'active'
                    ? 'All current breeding auctions have ended. Check back soon for new ones!'
                    : filter === 'inactive'
                    ? 'No auctions have been completed yet.'
                    : 'No breeding auctions match your current filter.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAuctions.map((auction) => (
                <AuctionCard key={auction.auctionId} auction={auction} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionsPage;
