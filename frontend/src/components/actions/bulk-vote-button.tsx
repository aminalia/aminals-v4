import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
const geneAuctionAbi = require('../../../deployments/GeneAuction.json').abi;

const GENE_AUCTION_ADDRESS = '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605' as const;

export default function BulkVoteButton({
  auctionId,
  backId,
  armId,
  tailId,
  earsId,
  bodyId,
  faceId,
  mouthId,
  miscId,
}: {
  auctionId: any;
  backId: any;
  armId: any;
  tailId: any;
  earsId: any;
  bodyId: any;
  faceId: any;
  mouthId: any;
  miscId: any;
}) {
  console.log([backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId]);

  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContractAsync, isPending } = useWriteContract();

  const action = async () => {
    if (enabled) {
      await writeContractAsync({
        abi: geneAuctionAbi,
        address: GENE_AUCTION_ADDRESS,
        functionName: 'bulkVote',
        args: [
          auctionId,
          [backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId],
        ],
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={action}
      disabled={!enabled || isPending}
      className={enabled ? '' : 'text-neutral-400'}
    >
      Vote
    </Button>
  );
}
