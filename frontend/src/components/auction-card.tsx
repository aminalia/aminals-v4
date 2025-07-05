import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardMedia,
  CardSection,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { GeneAuction } from '../../.graphclient';
import EndAuctionButton from './actions/endauction-button';
import ProposeButton from './actions/propose-button';

import '../../styles/index.module.css';

export default function AuctionCard({ auction }: { auction: GeneAuction }) {
  const { aminalOne, aminalTwo } = auction;

  return (
    <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 group">
      {/* Main container - stack on mobile, row on desktop */}
      <div className="flex w-full">
        {/* Images Section - Always side by side */}
        <div className="flex w-full md:w-1/2">
          <div className="w-1/2 relative group/image aspect-square">
            <div className="h-full">
              <TokenUriImage tokenUri={aminalOne.tokenURI} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm bg-white/95 backdrop-blur-sm shadow-lg px-4 py-1.5 rounded-full font-medium">
              <span className="hidden md:inline">✨ </span>#{aminalOne.aminalIndex}
            </div>
          </div>
          <div className="w-1/2 relative group/image aspect-square">
            <div className="h-full">
              <TokenUriImage tokenUri={aminalTwo.tokenURI} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm bg-white/95 backdrop-blur-sm shadow-lg px-4 py-1.5 rounded-full font-medium">
              <span className="hidden md:inline">✨ </span>#{aminalTwo.aminalIndex}
            </div>
          </div>
        </div>

        {/* Info Section - Full width on mobile, 50% on desktop */}
        <div className="w-full md:w-1/2 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href={`/breeding/${auction.auctionId}`}>
                <h2 className="text-xl font-bold hover:text-primary transition-colors">
                  <span className="text-xl">💕</span> #{aminalOne.aminalIndex} × #
                  {aminalTwo.aminalIndex}
                </h2>
              </Link>
            </div>
            <Badge
              variant={auction.finished ? 'secondary' : 'default'}
              className={cn(
                'transition-all duration-300 px-3 py-1.5 font-medium',
                auction.finished
                  ? 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                  : 'bg-green-100 text-green-700 group-hover:bg-green-200'
              )}
            >
              {auction.finished ? '🎉 Completed' : '🔥 Active'}
            </Badge>
          </div>

          <div className="space-y-3 bg-gray-50/80 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-2.5">
                <span className="text-xl">👶</span> Child
              </span>
              <span className="font-semibold text-lg">
                #{auction.childAminal?.aminalIndex}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-2.5">
                <span className="text-xl">❤️</span> Total Love Vote
              </span>
              <span className="font-semibold text-lg">
                {auction.totalLove ? auction.totalLove.toString() : '0'}
              </span>
            </div>
          </div>

          {!auction.finished && (
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <EndAuctionButton auctionId={auction.auctionId} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function AuctionCardActive({ auction }: { auction: GeneAuction }) {
  let { aminalOne, aminalTwo } = auction;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne.tokenURI} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo.tokenURI} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne.aminalIndex} and {aminalTwo.aminalIndex}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>Child ID: #{auction.childAminal?.aminalIndex}</tr>
              </td>
              <td>
                <EndAuctionButton auctionId={auction.auctionId} />
              </td>
            </table>
            <table>
              <ProposeButton auctionId={auction.auctionId} />
            </table>
          </CardContent>
          {/* <CardFooter></CardFooter> */}
        </CardSection>
      </Card>
    </>
  );
}

export function AuctionCardInActive({ auction }: { auction: GeneAuction }) {
  let { aminalOne, aminalTwo } = auction;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne.tokenURI} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo.tokenURI} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne.aminalIndex} and {aminalTwo.aminalIndex}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>Child ID: #{auction.childAminal?.aminalIndex}</tr>
              </td>
              <td>
                u
                <EndAuctionButton auctionId={auction.auctionId} />
              </td>
            </table>
            <table>
              <ProposeButton auctionId={auction.auctionId} />
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
      <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
        Unable to load image
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={image}
        alt="Aminal"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 250px"
      />
    </div>
  );
}
