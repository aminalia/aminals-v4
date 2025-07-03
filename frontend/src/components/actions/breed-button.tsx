import { useWriteAminalsBreedWith } from '@/contracts/generated';
import { isBigInt } from '@/lib/utils';
import { ChangeEvent, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function BreedButton({ id }: { id: string }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const [breedWithId, setBreedWithId] = useState<string>('');
  const breedWith = useWriteAminalsBreedWith();

  async function action() {
    if (enabled && isBigInt(breedWithId)) {
      await breedWith.writeContractAsync({
        args: [BigInt(id), BigInt(breedWithId)],
        value: parseEther('0.001'),
      });
    }
  }

  return (
    <div className="flex gap-2">
      <Input 
        placeholder="Enter mate ID" 
        value={breedWithId}
        onChange={(e) => setBreedWithId(e.target.value)}
        type="number"
        min="0"
        className="flex-1"
      />
      <Button
        onClick={action}
        disabled={!enabled || !breedWithId}
        variant="outline"
        className="whitespace-nowrap"
      >
        Breed (0.001 ETH)
      </Button>
    </div>
  );
}
