import { useAccount } from 'wagmi';
import { useVisualProposalsByAuctionId } from '../resources/visuals';
import VisualCard from './visual-card';

interface VisualsListProps {
  auctionId: string;
}

const VisualsList = ({ auctionId }: VisualsListProps) => {
  const { address } = useAccount();
  const {
    data: visuals,
    isLoading,
    error,
  } = useVisualProposalsByAuctionId(auctionId);

  if (isLoading) {
    return <div className="text-center py-8">Loading visuals...</div>;
  }

  if (error) {
    console.error('Visuals loading error:', error);
    return (
      <div className="text-center py-8 text-red-500">
        <div>Error loading visuals</div>
        <div className="text-sm mt-2">{error.message}</div>
      </div>
    );
  }

  if (!visuals || visuals.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-600">
          <div className="text-lg mb-2">🎨</div>
          <div className="font-medium">No community proposals yet</div>
          <div className="text-sm mt-1">Be the first to propose a gene for this breeding!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visuals.map((visual) => (
        <VisualCard
          key={`${visual.auction.auctionId}-${visual.geneNFT.tokenId}`}
          visual={visual}
        />
      ))}
    </div>
  );
};

export default VisualsList;
