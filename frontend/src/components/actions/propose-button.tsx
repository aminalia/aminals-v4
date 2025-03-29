import { useWriteVisualsAuctionProposeVisual } from '@/contracts/generated';
import { useState } from 'react';
import { parseEther } from 'viem';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAccount } from 'wagmi';

interface ProposeButtonProps {
  auctionId: bigint | string;
  className?: string;
}

interface CategoryOption {
  id: number;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 0, label: 'Background' },
  { id: 1, label: 'Arms' },
  { id: 2, label: 'Tail' },
  { id: 3, label: 'Ears' },
  { id: 4, label: 'Body' },
  { id: 5, label: 'Face' },
  { id: 6, label: 'Mouth' },
  { id: 7, label: 'Misc' }
];

const PROPOSE_COST = '0.05';

export default function ProposeButton({ auctionId, className }: ProposeButtonProps) {
  const [catId, setCatId] = useState<number>(0);
  const [vizId, setVizId] = useState<number>(0);
  const proposeVisual = useWriteVisualsAuctionProposeVisual();
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;

  const handlePropose = async () => {
    if (!enabled) return;
    await proposeVisual.writeContractAsync({
      args: [BigInt(auctionId), catId, BigInt(vizId)],
      value: BigInt(parseEther(PROPOSE_COST)),
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500">
            Category
          </label>
          <select
            value={catId}
            onChange={(e) => setCatId(Number(e.target.value))}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500">
            Visual ID
          </label>
          <Input
            type="number"
            min="0"
            value={vizId}
            onChange={(e) => setVizId(Number(e.target.value))}
            className="h-9"
          />
        </div>
      </div>
      
      <Button
        type="button"
        onClick={handlePropose}
        disabled={!enabled}
        className={`w-full ${enabled ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-gray-400 cursor-not-allowed'}`}
      >
        {enabled ? `Propose New Visual (${PROPOSE_COST} ETH)` : 'Connect wallet to propose'}
      </Button>
    </div>
  );
}
