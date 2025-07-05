import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import FeedButton from './actions/feed-button';

// New Aminal type for the refactored architecture
interface NewAminal {
  id: string;
  contractAddress: string;
  aminalIndex: string;
  energy: string;
  totalLove: string;
  tokenURI?: string;
  backId: string;
  armId: string;
  tailId: string;
  earsId: string;
  bodyId: string;
  faceId: string;
  mouthId: string;
  miscId: string;
}

export default function AminalCard({ aminal }: { aminal: NewAminal }) {
  // Add null checks to prevent crashes
  if (!aminal) {
    return (
      <Card className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="p-4 text-center text-gray-500">
          <div className="text-4xl mb-2">🐾</div>
          <div>Loading Aminal...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl transition-all hover:shadow-lg flex flex-col h-full border border-gray-200 bg-white">
      <CardMedia className="relative w-full aspect-square overflow-hidden">
        <AminalVisualImage aminal={aminal} />
      </CardMedia>

      <CardSection className="border-t flex-1 flex flex-col">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              <Link
                href={`/aminals/${aminal.contractAddress || 'unknown'}`}
                className="hover:text-blue-600 transition-colors"
              >
                Aminal #{aminal.aminalIndex || 'Unknown'}
              </Link>
            </CardTitle>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
              <span>⚡</span>
              {(Number(aminal.energy || 0) / 1e18).toFixed(2)} Energy
            </span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {aminal.contractAddress ? `${aminal.contractAddress.slice(0, 10)}...` : 'No address'}
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4 flex-1 flex flex-col">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div>
              <div className="text-sm text-gray-500">Total Love</div>
              <div className="text-lg font-semibold text-pink-600">
                ❤️ {(Number(aminal.totalLove || 0) / 1e18).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Gene Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>🎨 Traits: B{aminal.backId || '?'} A{aminal.armId || '?'} T{aminal.tailId || '?'}</div>
            <div>👂 E{aminal.earsId || '?'} 👤 B{aminal.bodyId || '?'} 😊 F{aminal.faceId || '?'}</div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto pt-2">
            {aminal.contractAddress && (
              <FeedButton contractAddress={aminal.contractAddress as `0x${string}`} />
            )}
          </div>
        </CardContent>
      </CardSection>
    </Card>
  );
}

interface AminalVisualImageProps {
  aminal: NewAminal;
}

export function AminalVisualImage({ aminal }: AminalVisualImageProps) {
  if (!aminal) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <div className="text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  // If we have tokenURI, try to use it for the actual image
  if (aminal.tokenURI) {
    return <TokenUriImage tokenUri={aminal.tokenURI} aminalId={aminal.aminalIndex} />;
  }

  // Fallback to gene information display
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-600">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4">🐾</div>
        <div className="text-sm font-medium">Aminal #{aminal.aminalIndex || 'Unknown'}</div>
        <div className="text-xs text-gray-500 space-y-1">
          <div>Back: {aminal.backId || '?'}</div>
          <div>Body: {aminal.bodyId || '?'}</div>
          <div>Face: {aminal.faceId || '?'}</div>
        </div>
      </div>
    </div>
  );
}

// Legacy component for backward compatibility
interface TokenUriImageProps {
  tokenUri?: string;
  aminalId?: string;
  aminal?: any;
}

export function TokenUriImage({
  tokenUri,
  aminalId,
  aminal,
}: TokenUriImageProps) {
  const finalTokenUri = tokenUri || (aminal && aminal.tokenUri);
  const finalAminalId = aminalId || (aminal && aminal.aminalId);

  let image,
    error = null;
  try {
    const base64Payload = finalTokenUri.split(',')[1];
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
    <div className="relative w-full h-full flex items-center justify-center bg-indigo-50">
      <Image
        src={image}
        alt={`Aminal #${finalAminalId}`}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        priority
      />
    </div>
  );
}
