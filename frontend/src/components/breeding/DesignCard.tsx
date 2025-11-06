/**
 * DesignCard Component
 * Display card for a single design proposal with preview and voting info
 */

import { Button } from '@components/ui/Button';
import { useMemo } from 'react';
import type { DesignProposal } from '../../types/breeding';
import VoteOnDesignButton from './VoteOnDesignButton';

export interface DesignCardProps {
  auctionId: string;
  design: DesignProposal;
  userVotedDesignId?: bigint;
  userVotingPower: bigint;
  totalLove: bigint; // Total love in auction for percentage calculation
  onVoteSuccess?: () => void;
  onView: (design: DesignProposal) => void;
  disabled?: boolean;
  isWinning?: boolean;
}

export default function DesignCard({
  auctionId,
  design,
  userVotedDesignId,
  userVotingPower,
  totalLove,
  onVoteSuccess,
  onView,
  disabled = false,
  isWinning = false,
}: DesignCardProps) {
  // Check if this is the user's current vote
  const isUserVote = userVotedDesignId === BigInt(design.designIndex);

  // Calculate vote percentage
  const votePercentage = useMemo(() => {
    if (totalLove === 0n) return 0;
    return Number((design.votes * 100n) / totalLove);
  }, [design.votes, totalLove]);

  // Render design SVG
  const designSvg = useMemo(() => {
    if (!design.genes || design.genes.length === 0) return '';

    return design.geneIds
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
  }, [design]);

  // Count non-empty genes
  const geneCount = design.geneIds.filter((id) => id !== 0n).length;

  return (
    <div
      className={`bg-card rounded-lg border-2 transition-all ${
        isWinning
          ? 'border-success shadow-success/20 shadow-lg'
          : isUserVote
          ? 'border-energy shadow-energy/20 shadow-lg'
          : 'border-border hover:border-energy/50'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      {/* Preview */}
      <div className="aspect-square bg-muted rounded-t-lg overflow-hidden border-b border-border relative">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: designSvg }}
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isWinning && (
            <div className="bg-success text-success-foreground text-xs px-2 py-1 rounded font-medium shadow-lg">
              🏆 Winning
            </div>
          )}
          {isUserVote && (
            <div className="bg-energy text-energy-foreground text-xs px-2 py-1 rounded font-medium shadow-lg">
              ✓ Your Vote
            </div>
          )}
          {design.isParentDesign && (
            <div className="bg-love text-love-foreground text-xs px-2 py-1 rounded font-medium shadow-lg">
              Parent {design.parentIndex}
            </div>
          )}
        </div>

        {/* Gene count indicator */}
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {geneCount} gene{geneCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold">
              Design #{design.designIndex}
            </h3>
            {design.removed && (
              <span className="text-xs text-destructive">Removed</span>
            )}
          </div>

          <div className="text-xs text-muted-foreground truncate">
            {design.isParentDesign
              ? 'System (Parent Design)'
              : `By ${design.proposer.address.slice(
                  0,
                  6
                )}...${design.proposer.address.slice(-4)}`}
          </div>
        </div>

        {/* Vote Stats */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Votes</span>
            <span className="font-medium">
              {design.votes.toString()} ❤️ ({votePercentage.toFixed(1)}%)
            </span>
          </div>

          {/* Vote progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isWinning ? 'bg-success' : isUserVote ? 'bg-energy' : 'bg-love'
              }`}
              style={{ width: `${Math.min(votePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <VoteOnDesignButton
            auctionId={auctionId}
            designId={BigInt(design.designIndex)}
            userVotingPower={userVotingPower}
            isCurrentVote={isUserVote}
            disabled={disabled || design.removed}
            onSuccess={onVoteSuccess}
            className="flex-1"
            size="sm"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(design)}
            disabled={disabled}
          >
            View
          </Button>
        </div>

        {/* Removal votes (if any) */}
        {design.removeVotes > 0n && (
          <div className="text-xs text-destructive flex items-center gap-1">
            <span>⚠️</span>
            <span>{design.removeVotes.toString()} removal votes</span>
          </div>
        )}
      </div>
    </div>
  );
}
