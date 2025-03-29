import { useWriteVisualsAuctionProposeVisual } from '@/contracts/generated';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function ProposeButton({ auctionId }: { auctionId: any }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;

  // Default breadwith ID is set to one
  const [catId, setCatId] = useState(0);
  const [vizId, setVizId] = useState(0);

  const proposeVisual = useWriteVisualsAuctionProposeVisual();

  const action = async () => {
    if (enabled) {
      await proposeVisual.writeContractAsync({
        args: [auctionId, catId, BigInt(vizId)],
        value: BigInt(parseEther('0.05')),
      });
    }
  };

  if (!enabled) {
    return (
      <Button
        variant="outline"
        className="w-full text-gray-400 cursor-not-allowed"
        disabled
      >
        Connect wallet to propose
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label htmlFor="catId" className="text-xs font-medium text-gray-500">
            Category ID
          </label>
          <Input
            id="catId"
            type="number"
            min="0"
            placeholder="0"
            value={catId}
            onChange={(e) => setCatId(Number(e.target.value))}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="vizId" className="text-xs font-medium text-gray-500">
            Visual ID
          </label>
          <Input
            id="vizId"
            type="number"
            min="0"
            placeholder="0"
            value={vizId}
            onChange={(e) => setVizId(Number(e.target.value))}
            className="h-9"
          />
        </div>
      </div>
      <Button
        type="button"
        onClick={action}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Propose New Visual (0.05 ETH)
      </Button>
    </div>
  );
}
