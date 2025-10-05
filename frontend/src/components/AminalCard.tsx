import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@/components/ui/Card';
import { AminalWithRelations } from '@/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { formatEther } from 'viem';
import FeedButton from './actions/FeedButton';

export default function AminalCard({
  aminal,
}: {
  aminal: AminalWithRelations;
}) {
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
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full border-2 hover:border-primary/20">
      <Link
        href={`/aminals/${aminal.contractAddress || 'unknown'}`}
        className="flex flex-col h-full"
      >
        <CardMedia className="relative w-full aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <AminalVisualImage aminal={aminal} />
        </CardMedia>

        <CardSection className="border-t flex-1 flex flex-col">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                Aminal #{aminal.aminalIndex !== undefined ? Number(aminal.aminalIndex) : 'Unknown'}
              </CardTitle>
              <Badge variant="energy" size="sm">
                <span>⚡</span>
                {Number(aminal.energy || 0).toFixed(2)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4 flex-1 flex flex-col">
            {/* Stats - expanded to 3 columns */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted border border-border">
              <div>
                <div className="text-xs text-muted-foreground">Total Love</div>
                <div className="text-sm font-semibold text-love-600">
                  ❤️ {Number(aminal.totalLove || 0).toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Love 4 U</div>
                <div className="text-sm font-semibold text-energy-600">
                  {aminal.lovers &&
                  aminal.lovers.items &&
                  aminal.lovers.items.length > 0 ? (
                    <>💜 {Number(aminal.lovers.items[0].love || 0).toFixed(1)}</>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">ETH Balance</div>
                <div className="text-sm font-semibold text-blue-600">
                  Ξ{' '}
                  {Number(formatEther(BigInt(aminal.ethBalance || 0))).toFixed(
                    3
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </CardSection>
      </Link>

      {/* Actions - positioned outside the link to prevent nested interactivity */}
      <div className="p-4 pt-0">
        {aminal.contractAddress && (
          <FeedButton
            contractAddress={aminal.contractAddress as `0x${string}`}
          />
        )}
      </div>
    </Card>
  );
}

interface AminalVisualImageProps {
  aminal: AminalWithRelations;
}

export function AminalVisualImage({ aminal }: AminalVisualImageProps) {
  if (!aminal) {
    console.log('AminalVisualImage: No aminal provided');
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
    return (
      <TokenUriImage
        tokenUri={aminal.tokenURI}
        aminalId={aminal.aminalIndex.toString()}
      />
    );
  }

  // Try to create a composed visual from gene IDs
  return <ComposedAminalImage aminal={aminal} />;
}

// New component to compose Aminal image from gene traits
interface ComposedAminalImageProps {
  aminal: AminalWithRelations;
}

function ComposedAminalImage({ aminal }: ComposedAminalImageProps) {
  // For now, show a more informative fallback
  // TODO: In the future, this could fetch and compose individual gene SVGs
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-600">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4">🐾</div>
        <div className="text-sm font-medium">
          Aminal #{aminal.aminalIndex !== undefined ? Number(aminal.aminalIndex) : 'Unknown'}
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <div>Back: {aminal.backId || '?'}</div>
          <div>Body: {aminal.bodyId || '?'}</div>
          <div>Face: {aminal.faceId || '?'}</div>
          <div>Arms: {aminal.armId || '?'}</div>
          <div>Tail: {aminal.tailId || '?'}</div>
          <div>Ears: {aminal.earsId || '?'}</div>
        </div>
        <div className="text-xs text-blue-600 mt-2">
          🔧 Visual composition in development
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
    error: Error | null = null;
  try {
    if (!finalTokenUri) {
      throw new Error('No tokenURI provided');
    }

    // Check if it's a data URI
    if (!finalTokenUri.startsWith('data:')) {
      throw new Error(
        `Invalid tokenURI format: ${finalTokenUri.substring(0, 100)}...`
      );
    }

    const base64Payload = finalTokenUri.split(',')[1];
    if (!base64Payload) {
      throw new Error('No base64 payload found in tokenURI');
    }

    const decodedJsonString = atob(base64Payload);
    const json = JSON.parse(decodedJsonString);

    image = json.image;
    if (!image) {
      throw new Error('No image field found in decoded JSON');
    }
  } catch (e) {
    error = e as Error;
    console.error('TokenUriImage Error:', e);
    console.error('TokenURI that failed:', finalTokenUri?.substring(0, 200));
  }

  if (error || !image) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">Unable to load image</div>
          <div className="text-xs mt-1 text-red-500">
            {error?.message || 'Unknown error'}
          </div>
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
