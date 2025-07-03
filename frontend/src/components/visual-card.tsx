import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { VisualProposal } from '../../.graphclient';
import VoteButton from './actions/vote-button';

interface VisualCardProps {
  visual: VisualProposal;
  userLove?: bigint;
}

const VisualCard = ({ visual, userLove }: VisualCardProps) => {
  const category =
    TRAIT_CATEGORIES[visual.catEnum as keyof typeof TRAIT_CATEGORIES];

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white p-6 transition-all hover:shadow-lg">
      <div className="flex flex-col gap-4">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          dangerouslySetInnerHTML={{
            __html: visual.svg,
          }}
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">{category.emoji}</span>
              Visual #{visual.visualId}
            </span>
            <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">
              {category.name}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <span>Proposed by: </span>
            <span className="font-mono">
              {visual.proposer.address.slice(0, 6)}...
              {visual.proposer.address.slice(-4)}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <span>Votes: </span>
            <span className="font-semibold">{visual.loveVote}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <VoteButton
            auctionId={visual.auctionId}
            catId={visual.catEnum}
            vizId={visual.visualId}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualCard;
