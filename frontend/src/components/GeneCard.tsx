import { Badge } from '@components/ui/Badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardSection,
} from '@components/ui/Card';
import type { DesignProposalWithRelations } from '@hooks/useGeneProposals';
import Link from 'next/link';
import VoteButton from './actions/VoteButton';

interface GeneCardProps {
  gene: DesignProposalWithRelations;
  userLove?: bigint;
}

const GeneCard = ({ gene, userLove }: GeneCardProps) => {
  // TODO: Complete refactoring for design-based proposals
  // Note: DesignProposal now represents a complete Aminal design (1-10 genes + placements)
  // This component was designed for single-gene proposals and needs to be redesigned
  // to show complete designs instead

  return (
    <Card className="p-4 text-center text-muted-foreground">
      <div className="text-4xl mb-2">🎨</div>
      <div className="font-medium">Design Proposal</div>
      <div className="text-sm mt-2">
        {(gene.geneIds || []).length} genes in design
      </div>
      <div className="text-xs mt-1">Component needs refactoring</div>
    </Card>
  );

  // Old single-gene proposal code (NEEDS REFACTORING):
  /*
  const geneTypeNames = [
    'Background',
    'Arms',
    'Tail',
    'Ears',
    'Body',
    'Face',
    'Mouth',
    'Misc',
  ];
  const categoryName = geneTypeNames[gene.traitType] || 'Unknown';
  const categoryEmoji = '🧬';

  // TODO: Add usage count metadata when available
  // const { data: usageCount } = useGeneUsageCount(gene.geneNFT.tokenId);

  // Add null checks for related data
  if (!gene.geneNFT) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        <div className="text-4xl mb-2">🧬</div>
        <div>Gene data not available</div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <Link href={`/genes/${gene.geneNFT.tokenId}`} className="block">
        <CardMedia className="relative aspect-square overflow-hidden bg-secondary">
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full transition-transform group-hover:scale-105"
            dangerouslySetInnerHTML={{
              __html: gene.geneNFT.svg || '',
            }}
          />
        </CardMedia>

        <CardSection className="border-t">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-xl">{categoryEmoji}</span>
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    Gene #{gene.geneNFT.tokenId.toString()}
                  </h3>
                  {gene.geneNFT.name && (
                    <p className="text-sm text-muted-foreground">
                      {gene.geneNFT.name}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="secondary" size="sm">
                {categoryName}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            {/* Metadata */}
            <div className="space-y-2">
              {/* Proposer */}
              {gene.proposer && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Proposed by:</span>
                  <span className="font-mono text-xs">
                    {gene.proposer.id.slice(0, 6)}...
                    {gene.proposer.id.slice(-4)}
                  </span>
                </div>
              )}

              {/* Vote count */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Votes:</span>
                <Badge variant="love" size="sm">
                  {gene.loveVotes.toString()} ❤️
                </Badge>
              </div>
            </div>

            {/* View Details Indicator *\/}
            <div className="flex items-center justify-center pt-2">
              <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                Click to view details →
              </div>
            </div>
          </CardContent>
        </CardSection>
      </Link>

      {/* Actions - positioned outside the link to prevent nested interactivity *\/}
      <div className="p-4 pt-0 border-t bg-muted/30">
        <VoteButton
          auctionId={gene.auctionId}
          catId={gene.traitType}
          vizId={gene.geneNFT.tokenId}
        />
      </div>
    </Card>
  );
  */
};

export default GeneCard;
