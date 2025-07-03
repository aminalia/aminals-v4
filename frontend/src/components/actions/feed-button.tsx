import { useWriteAminalsFeed } from '@/contracts/generated';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';

export default function FeedButton({ id }: { id: string }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const feed = useWriteAminalsFeed();

  async function action() {
    if (enabled) {
      await feed.writeContractAsync({
        args: [BigInt(id)],
        value: parseEther('0.01'),
      });
    }
  }

  return (
    <Button
      onClick={action}
      disabled={!enabled}
      className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
    >
      🍖 Feed (0.01 ETH)
    </Button>
  );
}
