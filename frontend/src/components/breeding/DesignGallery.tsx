/**
 * DesignGallery Component
 * Browse and vote on submitted design proposals
 */

import { useState, useMemo } from 'react';
import type { DesignProposal } from '@types/breeding';
import DesignCard from './DesignCard';
import { Button } from '@components/ui/Button';

export interface DesignGalleryProps {
  auctionId: string;
  designs: DesignProposal[];
  userVotedDesignId?: bigint;
  userVotingPower: bigint;
  totalLove: bigint;
  winningDesignId?: bigint;
  onVoteSuccess?: () => void;
  onViewDesign: (design: DesignProposal) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

type SortOption = 'most-votes' | 'newest' | 'parent-first';
type FilterOption = 'all' | 'parent-only' | 'community-only';

export default function DesignGallery({
  auctionId,
  designs,
  userVotedDesignId,
  userVotingPower,
  totalLove,
  winningDesignId,
  onVoteSuccess,
  onViewDesign,
  disabled = false,
  isLoading = false,
}: DesignGalleryProps) {
  const [sortBy, setSortBy] = useState<SortOption>('most-votes');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Filter designs
  const filteredDesigns = useMemo(() => {
    let filtered = [...designs];

    // Apply filter
    if (filterBy === 'parent-only') {
      filtered = filtered.filter((d) => d.isParentDesign);
    } else if (filterBy === 'community-only') {
      filtered = filtered.filter((d) => !d.isParentDesign);
    }

    // Remove removed designs
    filtered = filtered.filter((d) => !d.removed);

    // Apply sort
    if (sortBy === 'most-votes') {
      filtered.sort((a, b) => {
        // Winning design first
        if (winningDesignId) {
          if (a.designIndex === Number(winningDesignId)) return -1;
          if (b.designIndex === Number(winningDesignId)) return 1;
        }
        // Then by votes
        return Number(b.votes - a.votes);
      });
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => Number(b.blockTimestamp - a.blockTimestamp));
    } else if (sortBy === 'parent-first') {
      filtered.sort((a, b) => {
        if (a.isParentDesign && !b.isParentDesign) return -1;
        if (!a.isParentDesign && b.isParentDesign) return 1;
        return Number(b.votes - a.votes);
      });
    }

    return filtered;
  }, [designs, filterBy, sortBy, winningDesignId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy mb-4"></div>
        <p className="text-muted-foreground">Loading designs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card rounded-lg border border-border p-4">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm bg-muted border border-border rounded px-3 py-1.5"
            disabled={disabled}
          >
            <option value="most-votes">Most Votes</option>
            <option value="newest">Newest First</option>
            <option value="parent-first">Parents First</option>
          </select>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="text-sm bg-muted border border-border rounded px-3 py-1.5"
            disabled={disabled}
          >
            <option value="all">All Designs</option>
            <option value="parent-only">Parent Designs Only</option>
            <option value="community-only">Community Only</option>
          </select>
        </div>

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredDesigns.length} of {designs.length} design
          {designs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Empty State */}
      {filteredDesigns.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg border border-border">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold mb-2">No designs found</h3>
          <p className="text-sm text-muted-foreground">
            {filterBy === 'parent-only'
              ? 'No parent designs available'
              : filterBy === 'community-only'
                ? 'No community designs yet. Be the first to propose one!'
                : 'No designs proposed yet. Be the first!'}
          </p>
        </div>
      ) : (
        <>
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDesigns.map((design) => (
              <DesignCard
                key={design.id}
                auctionId={auctionId}
                design={design}
                userVotedDesignId={userVotedDesignId}
                userVotingPower={userVotingPower}
                totalLove={totalLove}
                onVoteSuccess={onVoteSuccess}
                onView={onViewDesign}
                disabled={disabled}
                isWinning={
                  winningDesignId !== undefined &&
                  design.designIndex === Number(winningDesignId)
                }
              />
            ))}
          </div>

          {/* Load More (if needed) */}
          {/* TODO: Implement pagination if designs > 20 */}
        </>
      )}
    </div>
  );
}
