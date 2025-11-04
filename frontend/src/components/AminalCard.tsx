import { Badge } from '@components/ui/Badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from '@components/ui/Card';
import { AminalWithRelations } from '@hooks';
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
      <Card className="overflow-hidden">
        <div className="p-4 text-center text-muted-foreground">
          <div className="text-4xl mb-2">🐾</div>
          <div>Loading Aminal...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
      <Link
        href={`/aminals/${aminal.contractAddress || 'unknown'}`}
        className="flex flex-col h-full"
      >
        <CardMedia className="relative w-full aspect-square overflow-hidden">
          <AminalVisualImage aminal={aminal} />
        </CardMedia>

        <CardSection className="border-t flex-1 flex flex-col">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                Aminal #
                {aminal.aminalIndex !== undefined
                  ? Number(aminal.aminalIndex)
                  : 'Unknown'}
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
                <div className="text-sm font-semibold text-love">
                  ❤️ {Number(aminal.totalLove || 0).toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Love 4 U</div>
                <div className="text-sm font-semibold text-energy">
                  {aminal.lovers &&
                  aminal.lovers.items &&
                  aminal.lovers.items.length > 0 ? (
                    <>
                      💜 {Number(aminal.lovers.items[0].love || 0).toFixed(1)}
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">ETH Balance</div>
                <div className="text-sm font-semibold text-primary">
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
      <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
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
    <div className="flex items-center justify-center w-full h-full bg-secondary text-secondary-foreground">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4">🐾</div>
        <div className="text-sm font-medium">
          Aminal #
          {aminal.aminalIndex !== undefined
            ? Number(aminal.aminalIndex)
            : 'Unknown'}
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Genes: {(aminal.genes || []).length} / 10</div>
          {(aminal.genes || []).slice(0, 3).map((gene, i) => (
            <div key={i}>
              Slot {i}: {gene?.toString() || '0'}
            </div>
          ))}
          {(aminal.genes || []).length > 3 && <div>...</div>}
        </div>
        <div className="text-xs text-primary mt-2">
          🔧 Flexible gene system (1-10 genes)
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
      <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">Unable to load image</div>
          <div className="text-xs mt-1 text-destructive">
            {error?.message || 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-secondary">
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
