import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Aminal } from '../../.graphclient';
import BreedButton from './actions/breed-button';
import FeedButton from './actions/feed-button';
import Link from 'next/link';

export default function AminalCard({ aminal }: { aminal: Aminal }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
      <CardMedia className="relative w-full aspect-square overflow-hidden">
        <TokenUriImage tokenUri={aminal.tokenUri} aminalId={aminal.aminalId} />
      </CardMedia>
      
      <CardSection className="border-t flex-1 flex flex-col">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              <Link href={`/aminals/${aminal.aminalId}`} className="hover:text-blue-600 transition-colors">
                Aminal #{aminal.aminalId}
              </Link>
            </CardTitle>
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {(aminal.energy / 1e18).toFixed(2)} Energy
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50">
            <div>
              <div className="text-sm text-gray-500">Total Love</div>
              <div className="text-lg font-semibold text-pink-600">
                {(aminal.totalLove / 1e18).toFixed(2)} ❤️
              </div>
            </div>
            {aminal.lovers[0] && (
              <div>
                <div className="text-sm text-gray-500">Your Love</div>
                <div className="text-lg font-semibold text-pink-600">
                  {(aminal.lovers[0].love / 1e18).toFixed(2)} ❤️
                </div>
              </div>
            )}
          </div>

          {/* Breeding Info */}
          {aminal.breedableWith.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1.5">
                Breedable with
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aminal.breedableWith.map((buddy) => (
                  buddy && (
                    <span
                      key={buddy.aminalTwo.aminalId}
                      className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700"
                    >
                      #{buddy.aminalTwo.aminalId}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto pt-3">
            <FeedButton id={aminal.aminalId} />
            <BreedButton id={aminal.aminalId} />
          </div>
        </CardContent>
      </CardSection>
    </Card>
  );
}

interface TokenUriImageProps {
  tokenUri: string;
  aminalId: string;
}

function TokenUriImage({ tokenUri, aminalId }: TokenUriImageProps) {
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
      <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">Unable to load image</div>
        </div>
      </div>
    );
  }
  
  return (
    <Image 
      src={image} 
      alt={`Aminal #${aminalId}`}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
      priority
    />
  );
}
