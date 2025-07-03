import { useWriteVisualsAuctionEndAuction } from '@/contracts/generated';
import { Web3Button } from '../ui/web3-button';

interface EndAuctionButtonProps {
  auctionId: bigint | string;
  className?: string;
}

export default function EndAuctionButton({ auctionId, className }: EndAuctionButtonProps) {
  const endAuction = useWriteVisualsAuctionEndAuction();

  const handleEndAuction = async () => {
    await endAuction.writeContractAsync({ 
      args: [BigInt(auctionId)] 
    });
  };

  return (
    <Web3Button
      actionMessage="End Auction"
      connectMessage="Connect to end auction"
      onAction={handleEndAuction}
      variant="destructive"
      size="sm"
      className={className}
    />
  );
}
