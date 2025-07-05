import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
const geneAuctionAbi = require('../../../deployments/GeneAuction.json').abi;

const GENE_AUCTION_ADDRESS = '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605' as const;

export default function VoteButton({
  auctionId,
  catId,
  vizId,
}: {
  auctionId: any;
  catId: any;
  vizId: any;
}) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContractAsync } = useWriteContract();

  const action = async () => {
    if (enabled) {
      await writeContractAsync({
        abi: geneAuctionAbi,
        address: GENE_AUCTION_ADDRESS,
        functionName: 'voteVisual',
        args: [auctionId, catId, BigInt(vizId)],
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={action}
      disabled={!enabled}
      className={enabled ? '' : 'text-neutral-400'}
    >
      [Vote on Visual {catId} - {vizId}]
    </Button>
  );
}
