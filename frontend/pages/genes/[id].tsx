import AminalCard from '@components/AminalCard';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { EmptyState } from '@components/ui/EmptyState';
import { PageLoadingSpinner } from '@components/ui/LoadingSpinner';
import { TRAIT_CATEGORIES } from '@constants/trait-categories';
import { genesAddress } from '@contracts/generated';
import { useGene } from '@hooks';
import { ExternalLink } from 'lucide-react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../_layout';

const GeneDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Show loading state if router is not ready or ID is not available
  const isRouterReady =
    router.isReady && id && typeof id === 'string' && id !== 'undefined';

  const { data: gene, isLoading } = useGene(
    isRouterReady ? (id as string) : ''
  );

  // Handle fallback state for static export
  if (router.isFallback) {
    return (
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isRouterReady || isLoading) {
    return (
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <PageLoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!gene) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon="🧬"
            title="Gene not found"
            description="The gene you're looking for doesn't exist."
          />
        </div>
      </Layout>
    );
  }

  const category =
    TRAIT_CATEGORIES[gene.traitType as keyof typeof TRAIT_CATEGORIES];

  // Get aminals that have this gene in their traits
  const aminalsWithGene = gene.aminals || [];
  const aminalCount = aminalsWithGene.length;

  // Format total earnings from wei to ETH
  const formatEarnings = (totalEarnings: string) => {
    const earningsInEth = Number(totalEarnings) / 1e18;
    return earningsInEth.toFixed(4);
  };

  // OpenSea URL
  const openSeaUrl = `https://testnets.opensea.io/assets/sepolia/${genesAddress}/${gene.tokenId}`;

  return (
    <Layout>
      <div className="py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{category.emoji}</span>
                  Gene #{gene.tokenId.toString()}
                </h1>
                <Badge variant="default" size="lg">
                  {category.name}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex items-center gap-2"
              >
                <Link
                  href={openSeaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on OpenSea
                </Link>
              </Button>
            </div>
            <Link
              href="/genes"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              ← Back to all Genes
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - SVG Display */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-primary/5 flex items-center justify-center p-6 border">
                <svg
                  viewBox="0 0 1000 1000"
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{
                    __html: gene.svg || '',
                  }}
                />
              </div>
              {/* Description as image caption */}
              {gene.description && (
                <div className="text-center text-sm text-muted-foreground italic leading-relaxed px-2">
                  {gene.description}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Creator Info */}
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-3">
                <h2 className="text-xl font-semibold">Creator</h2>
                <div className="flex items-center gap-3">
                  <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="font-mono text-sm text-muted-foreground">
                      {gene.creator?.address || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-3">
                <h2 className="text-xl font-semibold">Current Owner</h2>
                <div className="flex items-center gap-3">
                  <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    🏠
                  </div>
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="font-mono text-sm text-muted-foreground">
                      {gene.owner?.address || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Section */}
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-3">
                <h2 className="text-xl font-semibold">Earnings</h2>
                <div className="p-4 bg-muted rounded-lg border">
                  <div className="text-sm text-muted-foreground">
                    Total Earnings
                  </div>
                  <div className="text-2xl font-semibold text-success">
                    {formatEarnings(gene.totalEarnings.toString())} ETH
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aminals with this Trait */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Aminals with this Gene</h2>
              <Badge variant="secondary" size="lg">
                {aminalCount} {aminalCount === 1 ? 'Aminal' : 'Aminals'}
              </Badge>
            </div>
            {aminalCount === 0 ? (
              <EmptyState
                icon="🐾"
                title="No Aminals found"
                description="No Aminals have this gene yet."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {aminalsWithGene.map((aminal: any) => (
                  <AminalCard key={aminal.id} aminal={aminal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeneDetailPage;

// Remove static generation - use server-side rendering for dynamic routes
