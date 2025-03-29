import { useWriteVisualsAuctionEndAuction } from '@/contracts/generated';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';

export default function EndAuctionButton({ auctionId }: { auctionId: any }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const endAuction = useWriteVisualsAuctionEndAuction();

  const action = async () => {
    if (enabled) {
      await endAuction.writeContractAsync({ args: [auctionId] });
    }
  };

  return (
    <Button
      type="button"
      onClick={action}
      disabled={!enabled}
      variant={enabled ? "destructive" : "outline"}
      size="sm"
      className={!enabled ? "text-gray-400" : ""}
    >
      End Auction
    </Button>
  );
}
