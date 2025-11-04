import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@components/ui/Card';
import type { GeneAuction } from '@hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProposeButton from './actions/ProposeButton';

import '../../styles/index.module.css';

// VOTING_DURATION from the contract (1 hour = 3600 seconds)
const VOTING_DURATION = 3600;

export default function AuctionCard({
  auction,
}: {
  auction: GeneAuctionWithRelations;
}) {
  const aminalOne = auction.aminalOne;
  const aminalTwo = auction.aminalTwo;
  const [timeLeft, setTimeLeft] = useState<number>(0);

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

  // Update countdown timer
  useEffect(() => {
    if (auction.finished || isAuctionEnded) return;

    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const difference = auctionEndTime - now;
      setTimeLeft(Math.max(0, difference));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [auctionEndTime, auction.finished, isAuctionEnded]);

  // Format time for display
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Ended';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const childAminal = auction.childAminal;
  console.log(childAminal);

  return (
    <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Main container - stack on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Images Section - Always side by side */}
        <div className="flex w-full md:w-1/2 relative min-h-[200px] md:min-h-[300px]">
          {/* Heart connector between images */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-card rounded-full p-2 shadow-lg border-2 border-love/30 group-hover:border-love transition-all">
            <div className="text-lg text-love group-hover:scale-110 transition-transform">
              💕
            </div>
          </div>

          <div className="w-1/2 relative group/image">
            <div className="h-full min-h-[200px] md:min-h-[300px]">
              {aminalOne ? (
                <TokenUriImage tokenUri={aminalOne.tokenURI} />
              ) : (
                <div className="h-full bg-muted flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              )}
            </div>
          </div>
          <div className="w-1/2 relative group/image">
            <div className="h-full min-h-[200px] md:min-h-[300px]">
              {aminalTwo ? (
                <TokenUriImage tokenUri={aminalTwo.tokenURI} />
              ) : (
                <div className="h-full bg-muted flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section - Full width on mobile, 50% on desktop */}
        <div className="w-full md:w-1/2 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
            <div className="flex-1">
              <Link href={`/breeding/${auction.auctionId}`}>
                <h2 className="text-xl sm:text-2xl font-bold hover:text-love transition-colors group/title text-love">
                  #{aminalOne?.aminalIndex?.toString() || '?'} × #
                  {aminalTwo?.aminalIndex?.toString() || '?'}
                </h2>
              </Link>
              <div className="text-sm text-muted-foreground mt-1">
                Breeding Auction #{auction.auctionId}
              </div>
            </div>
            <Badge
              variant={
                auction.finished
                  ? 'secondary'
                  : isAuctionEnded
                  ? 'warning'
                  : 'success'
              }
              className="transition-all duration-300 px-3 py-2 font-medium text-sm self-start"
            >
              {auction.finished
                ? '🎉 Completed'
                : isAuctionEnded
                ? '⏰ Ended'
                : '🔥 Active'}
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Countdown Timer Row */}
            {!auction.finished && (
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground flex items-center gap-2.5 font-medium">
                    <span className="text-xl">⏰</span>
                    Time Left
                  </span>
                  <span className="font-bold text-xl text-warning">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-energy/10 border border-energy/30 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl mb-1">👶</div>
                <div className="text-sm text-muted-foreground mb-1">Child</div>
                {childAminal ? (
                  <Link
                    href={`/aminals/${childAminal.contractAddress}`}
                    className="font-bold text-energy hover:text-energy/80 underline transition-colors"
                  >
                    #{childAminal.aminalIndex?.toString()}
                  </Link>
                ) : (
                  <div className="font-bold text-muted-foreground">
                    {isAuctionEnded ? 'Settling...' : 'TBD'}
                  </div>
                )}
              </div>

              <div className="bg-love/10 border border-love/30 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl mb-1">❤️</div>
                <div className="text-sm text-muted-foreground mb-1">
                  Total Love
                </div>
                <div className="font-bold text-love">
                  {auction.totalLove ? auction.totalLove.toString() : '0'}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <Link href={`/breeding/${auction.auctionId}`}>
              <Button variant="breed" className="w-full mt-4">
                {auction.finished ? 'View Results' : 'Join Breeding'} →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AuctionCardActive({ auction }: { auction: GeneAuction }) {
  const aminalOne = (auction).aminalOne;
  const aminalTwo = (auction).aminalTwo;
  const childAminal = (auction).childAminal;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne?.tokenURI} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo?.tokenURI} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId.toString()}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne?.aminalIndex?.toString() || '?'} and{' '}
              {aminalTwo?.aminalIndex?.toString() || '?'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>
                  Child ID: #{childAminal?.aminalIndex?.toString() || 'TBD'}
                </tr>
              </td>
            </table>
            <table>
              <ProposeButton auctionId={auction.auctionId.toString()} />
            </table>
          </CardContent>
          {/* <CardFooter></CardFooter> */}
        </CardSection>
      </Card>
    </>
  );
}

export function AuctionCardInActive({ auction }: { auction: GeneAuction }) {
  const aminalOne = (auction).aminalOne;
  const aminalTwo = (auction).aminalTwo;
  const childAminal = (auction).childAminal;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne?.tokenURI} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo?.tokenURI} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId.toString()}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne?.aminalIndex?.toString() || '?'} and{' '}
              {aminalTwo?.aminalIndex?.toString() || '?'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>
                  Child ID: #{childAminal?.aminalIndex?.toString() || 'TBD'}
                </tr>
              </td>
            </table>
            <table>
              <ProposeButton auctionId={auction.auctionId.toString()} />
            </table>
          </CardContent>
          <CardFooter></CardFooter>
        </CardSection>
      </Card>
    </>
  );
}

function TokenUriImage({ tokenUri }: { tokenUri?: string | null }) {
  let image,
    error = null;

  if (!tokenUri) {
    error = new Error('No token URI provided');
  } else {
    try {
      const base64Payload = tokenUri.split(',')[1];
      const decodedJsonString = atob(base64Payload);
      const json = JSON.parse(decodedJsonString);
      image = json.image;
    } catch (e) {
      error = e;
    }
  }

  if (error || !image) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-sm">
        <div className="text-center">
          <div className="text-2xl mb-2">🐈</div>
          <div>Unable to load image</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-secondary">
      <Image
        src={image}
        alt="Aminal"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, 250px"
      />
    </div>
  );
}
