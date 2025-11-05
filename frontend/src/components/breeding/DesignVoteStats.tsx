/**
 * DesignVoteStats Component
 * Display voting statistics for design-based breeding auctions
 */

import { useAuctionVoting, useDesignProposals } from '@hooks';
import type { DesignProposal } from '@types/breeding';
import { useMemo } from 'react';

interface DesignVoteStatsProps {
  auctionId: string;
  totalLove: bigint;
}

export default function DesignVoteStats({
  auctionId,
  totalLove,
}: DesignVoteStatsProps) {
  const { data: designs = [], isLoading } = useDesignProposals(auctionId);
  const { data: votingData } = useAuctionVoting(auctionId);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeDesigns = designs.filter((d) => !d.removed);
    const totalVotes = activeDesigns.reduce((sum, d) => sum + d.votes, 0n);
    const uniqueProposers = new Set(
      activeDesigns.map((d) => d.proposer.address)
    ).size;

    // Sort by votes to find top 3
    const topDesigns = [...activeDesigns]
      .sort((a, b) => Number(b.votes - a.votes))
      .slice(0, 3);

    // Calculate turnout
    const turnoutPercentage =
      totalLove > 0n ? Number((totalVotes * 100n) / totalLove) : 0;

    return {
      totalDesigns: activeDesigns.length,
      totalVotes: Number(totalVotes),
      uniqueProposers,
      topDesigns,
      turnoutPercentage,
      winningDesignId: votingData?.winningDesignId,
    };
  }, [designs, totalLove, votingData]);

  // Render design preview
  const renderDesignPreview = (design: DesignProposal) => {
    const designSvg = design.geneIds
      .map((geneId, index) => {
        if (geneId === 0n) return '';

        const gene = design.genes?.find((g) => BigInt(g.tokenId) === geneId);
        if (!gene?.svg) return '';

        const placement = design.placements[index];
        if (!placement) return gene.svg;

        const { offsetX, offsetY, scale, rotation } = placement;

        return `
          <g transform="translate(${offsetX}, ${offsetY}) rotate(${rotation}, 500, 500) scale(${
          scale / 100
        })">
            ${gene.svg}
          </g>
        `;
      })
      .join('');

    return designSvg;
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy mx-auto mb-2"></div>
        <div className="text-sm text-muted-foreground">
          Loading vote statistics...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Vote Statistics</h3>

      {/* High-level Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-energy/10 border border-energy/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-energy">
            {stats.totalDesigns}
          </div>
          <div className="text-xs text-energy">Designs Proposed</div>
        </div>
        <div className="bg-love/10 border border-love/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-love">{stats.totalVotes}</div>
          <div className="text-xs text-love">Total Votes</div>
        </div>
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-warning">
            {stats.turnoutPercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-warning">Voter Turnout</div>
        </div>
        <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-success">
            {stats.uniqueProposers}
          </div>
          <div className="text-xs text-success">Unique Proposers</div>
        </div>
      </div>

      {/* Top Designs */}
      {stats.topDesigns.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Top Designs
          </h4>
          {stats.topDesigns.map((design, index) => {
            const isWinning =
              stats.winningDesignId !== undefined &&
              design.designIndex === Number(stats.winningDesignId);
            const votePercentage =
              totalLove > 0n ? Number((design.votes * 100n) / totalLove) : 0;
            const geneCount = design.geneIds.filter((id) => id !== 0n).length;

            return (
              <div
                key={design.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isWinning
                    ? 'border-success bg-success/5'
                    : index === 0
                    ? 'border-energy bg-energy/5'
                    : 'border-border'
                }`}
              >
                <div className="flex gap-4">
                  {/* Preview */}
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <svg
                      viewBox="0 0 1000 1000"
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{
                        __html: renderDesignPreview(design),
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isWinning && (
                        <span
                          className="text-lg leading-none"
                          title="Winning Design"
                        >
                          🏆
                        </span>
                      )}
                      {!isWinning && index === 0 && (
                        <span
                          className="text-lg leading-none"
                          title="Most Votes"
                        >
                          ⭐
                        </span>
                      )}
                      <h5 className="text-sm font-semibold">
                        Design #{design.designIndex}
                      </h5>
                      {design.isParentDesign && (
                        <span className="text-xs bg-love text-love-foreground px-2 py-0.5 rounded">
                          Parent {design.parentIndex}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground mb-2">
                      {design.isParentDesign
                        ? 'System (Parent Design)'
                        : `By ${design.proposer.address.slice(
                            0,
                            6
                          )}...${design.proposer.address.slice(-4)}`}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {design.votes.toString()}
                        </span>
                        <span className="text-muted-foreground">❤️</span>
                      </div>
                      <div className="text-muted-foreground">•</div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{geneCount}</span>
                        <span className="text-muted-foreground">genes</span>
                      </div>
                      <div className="text-muted-foreground">•</div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {votePercentage.toFixed(1)}%
                        </span>
                        <span className="text-muted-foreground">of total</span>
                      </div>
                    </div>

                    {/* Vote progress bar */}
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isWinning
                            ? 'bg-success'
                            : index === 0
                            ? 'bg-energy'
                            : 'bg-love'
                        }`}
                        style={{ width: `${Math.min(votePercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted rounded-lg">
          <div className="text-4xl mb-2">🎨</div>
          <h4 className="font-semibold mb-1">No designs proposed yet</h4>
          <p className="text-sm text-muted-foreground">
            Be the first to propose a design for this breeding auction!
          </p>
        </div>
      )}
    </div>
  );
}
