import { parseEther } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
const aminalAbi = require('../../../deployments/Aminal.json').abi;

export default function FeedButton({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContractAsync, isPending } = useWriteContract();

  async function action() {
    if (enabled && contractAddress) {
      await writeContractAsync({
        abi: aminalAbi,
        address: contractAddress,
        functionName: 'feed',
        args: [],
        value: parseEther('0.01'),
      });
    }
  }

  return (
    <Button
      onClick={action}
      disabled={!enabled || isPending}
      className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
    >
      {isPending ? '⏳ Feeding...' : '🍖 Feed (0.01 ETH)'}
    </Button>
  );
}
