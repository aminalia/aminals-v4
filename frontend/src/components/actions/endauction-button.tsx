import { useWriteContract } from 'wagmi';
import { Web3Button } from '../ui/web3-button';
const geneAuctionAbi = require('../../../deployments/GeneAuction.json').abi;

const GENE_AUCTION_ADDRESS = '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605' as const;

interface EndAuctionButtonProps {
  auctionId: bigint | string;
  className?: string;
}

export default function EndAuctionButton({ auctionId, className }: EndAuctionButtonProps) {
  const { writeContractAsync } = useWriteContract();

  const handleEndAuction = async () => {
    await writeContractAsync({
      abi: geneAuctionAbi,
      address: GENE_AUCTION_ADDRESS,
      functionName: 'endAuction',
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
