import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { useAuctionVotes } from '@/resources/auctions';
import { useMemo } from 'react';

interface VoteStatsProps {
  auctionId: string;
}

const VoteStats = ({ auctionId }: VoteStatsProps) => {
  const { data: votes, isLoading } = useAuctionVotes(auctionId);

  const voteStats = useMemo(() => {
    if (!votes || votes.length === 0) return {};

    const stats: { [traitType: number]: { [geneId: string]: { votes: number; totalLove: number; geneName: string; svg: string } } } = {};

    votes.forEach(vote => {
      const traitType = vote.proposal.traitType;
      const geneId = vote.proposal.geneNFT.tokenId;
      const geneName = vote.proposal.geneNFT.name || `Gene #${geneId}`;
      const svg = vote.proposal.geneNFT.svg || '';
      const loveAmount = Number(vote.loveAmount);

      if (!stats[traitType]) {
        stats[traitType] = {};
      }

      if (!stats[traitType][geneId]) {
        stats[traitType][geneId] = {
          votes: 0,
          totalLove: 0,
          geneName,
          svg,
        };
      }

      if (!vote.isRemoveVote) {
        stats[traitType][geneId].votes += 1;
        stats[traitType][geneId].totalLove += loveAmount;
      }
    });

    return stats;
  }, [votes]);

  if (isLoading) {
    return <div className="text-center py-4">Loading vote statistics...</div>;
  }

  if (Object.keys(voteStats).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-4">Vote Statistics</h3>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            <div className="text-lg mb-2">📊</div>
            <div className="font-medium">No votes cast yet</div>
            <div className="text-sm mt-1">Vote on proposed genes to see statistics here</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Vote Statistics</h3>
      
      {Object.entries(voteStats).map(([traitType, genes]) => {
        const categoryIndex = Number(traitType);
        const category = TRAIT_CATEGORIES[categoryIndex as keyof typeof TRAIT_CATEGORIES];
        
        return (
          <div key={traitType} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{category?.emoji}</span>
              <h4 className="font-semibold">{category?.name}</h4>
            </div>
            
            <div className="space-y-2">
              {Object.entries(genes)
                .sort(([,a], [,b]) => b.totalLove - a.totalLove)
                .map(([geneId, stats]) => (
                  <div key={geneId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-gray-200">
                        {stats.svg ? (
                          <svg
                            viewBox="0 0 1000 1000"
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: stats.svg }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            No SVG
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{stats.geneName}</div>
                        <div className="text-sm text-gray-600">Gene #{geneId}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">{stats.totalLove} ❤️</div>
                      <div className="text-sm text-gray-600">{stats.votes} votes</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VoteStats;