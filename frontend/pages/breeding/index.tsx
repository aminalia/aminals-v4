import AuctionCard from '@/components/auction-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuctions } from '@/resources/auctions';
import type { NextPage } from 'next';
import { useState } from 'react';
import Layout from '../_layout';

const AuctionsPage: NextPage = () => {
  const { data: auctions, isLoading: isLoadingAuctions, error } = useAuctions();
  
  // Debug logging
  console.log('Auctions data:', auctions);
  console.log('Auctions loading:', isLoadingAuctions);
  console.log('Auctions error:', error);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAuctions =
    auctions?.filter((auction) => {
      if (filter === 'all') return true;
      if (filter === 'active') return !auction.finished;
      return auction.finished;
    }) || [];

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Breeding</h1>
            <p className="text-gray-600">
              Browse and participate in Aminal reproduction.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-full',
                filter === 'all'
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'hover:bg-gray-100'
              )}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
              className={cn(
                'rounded-full',
                filter === 'active'
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'hover:bg-gray-100'
              )}
            >
              Active
            </Button>
            <Button
              variant={filter === 'inactive' ? 'default' : 'outline'}
              onClick={() => setFilter('inactive')}
              className={cn(
                'rounded-full',
                filter === 'inactive'
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'hover:bg-gray-100'
              )}
            >
              Completed
            </Button>
          </div>

          {/* Auctions List */}
          {isLoadingAuctions ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No auctions found matching your filter.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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
