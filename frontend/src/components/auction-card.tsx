import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Auction } from '../../.graphclient';
import EndAuctionButton from './actions/endauction-button';
import ProposeButton from './actions/propose-button';

import '../../styles/index.module.css';

export default function AuctionCard({ auction }: { auction: Auction }) {
  const { aminalOne, aminalTwo } = auction;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="grid grid-cols-2 gap-2 p-4 bg-gradient-to-b from-gray-50 to-white">
        <CardMedia className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <TokenUriImage tokenUri={aminalOne.tokenUri} />
        </CardMedia>
        <CardMedia className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <TokenUriImage tokenUri={aminalTwo.tokenUri} />
        </CardMedia>
      </div>
      
      <CardSection className="border-t">
        <CardHeader className="p-4">
          <Link href={`/auctions/${auction.auctionId}`}>
            <CardTitle className="text-xl font-bold hover:text-blue-600 transition-colors">
              Auction #{auction.auctionId}
            </CardTitle>
          </Link>
          <CardDescription className="text-sm text-gray-500">
            Between Aminal #{aminalOne.aminalId} and #{aminalTwo.aminalId}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2 py-1 text-sm rounded-full ${
                  auction.finished 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {auction.finished ? 'Finished' : 'In Progress'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Child ID: #{auction.childAminalId}
              </div>
            </div>
            <EndAuctionButton auctionId={auction.auctionId} />
          </div>
        </CardContent>
      </CardSection>
    </Card>
  );
}

export function AuctionCardActive({ auction }: { auction: Auction }) {
  let { aminalOne, aminalTwo } = auction;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne.tokenUri} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo.tokenUri} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne.aminalId} and {aminalTwo.aminalId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>Child ID: #{auction.childAminalId}</tr>
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

export function AuctionCardInActive({ auction }: { auction: Auction }) {
  let { aminalOne, aminalTwo } = auction;

  return (
    <>
      <Card>
        <CardMedia>
          <TokenUriImage tokenUri={aminalOne.tokenUri} />
        </CardMedia>
        <CardMedia>
          <TokenUriImage tokenUri={aminalTwo.tokenUri} />
        </CardMedia>
        <CardSection>
          <CardHeader>
            <Link href={`/auctions/${auction.auctionId}`}>
              <CardTitle>Auction #{auction.auctionId}</CardTitle>
            </Link>
            <CardDescription>
              Between {aminalOne.aminalId} and {aminalTwo.aminalId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table>
              <td>
                <tr>{auction.finished ? 'Finished' : 'In Progress'} </tr>
                <tr>Child ID: #{auction.childAminalId}</tr>
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

function TokenUriImage({ tokenUri }: { tokenUri: string }) {
  let image,
    error = null;
  try {
    const base64Payload = tokenUri.split(',')[1];
    const decodedJsonString = atob(base64Payload);
    const json = JSON.parse(decodedJsonString);
    image = json.image;
  } catch (e) {
    error = e;
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
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
