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
    return (
      <div className="text-center py-8 text-red-500">Error loading visuals</div>
    );
  }

  if (!visuals || visuals.length === 0) {
    return <div className="text-center py-8">No visuals proposed yet</div>;
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
