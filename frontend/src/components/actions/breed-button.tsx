import { useState } from 'react';
import { parseEther, isAddress } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
const aminalAbi = require('../../../deployments/Aminal.json').abi;
const geneAuctionAbi = require('../../../deployments/GeneAuction.json').abi;

const GENE_AUCTION_ADDRESS = '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605' as const;

export default function BreedButton({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const [partnerAddress, setPartnerAddress] = useState<string>('');
  const [step, setStep] = useState<'consent' | 'auction'>('consent');
  const { writeContractAsync, isPending } = useWriteContract();

  async function giveConsent() {
    if (enabled && isAddress(partnerAddress)) {
      await writeContractAsync({
        abi: aminalAbi,
        address: contractAddress,
        functionName: 'setBreedableWith',
        args: [partnerAddress as `0x${string}`, true],
      });
      setStep('auction');
    }
  }

  async function startAuction() {
    if (enabled && isAddress(partnerAddress)) {
      await writeContractAsync({
        abi: geneAuctionAbi,
        address: GENE_AUCTION_ADDRESS,
        functionName: 'createVoting',
        args: [contractAddress, partnerAddress as `0x${string}`],
        value: parseEther('0.001'),
      });
    }
  }

  return (
    <div className="space-y-2">
      <Input 
        placeholder="Enter partner contract address (0x...)" 
        value={partnerAddress}
        onChange={(e) => setPartnerAddress(e.target.value)}
        className="w-full"
      />
      
      {step === 'consent' ? (
        <Button
          onClick={giveConsent}
          disabled={!enabled || !isAddress(partnerAddress) || isPending}
          variant="outline"
          className="w-full"
        >
          {isPending ? '⏳ Giving Consent...' : '💕 Give Breeding Consent'}
        </Button>
      ) : (
        <Button
          onClick={startAuction}
          disabled={!enabled || !isAddress(partnerAddress) || isPending}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        >
          {isPending ? '⏳ Starting Auction...' : '🍼 Start Gene Auction (0.001 ETH)'}
        </Button>
      )}
      
      {step === 'auction' && (
        <p className="text-sm text-gray-600">
          Consent given! Now start the gene auction to create offspring.
        </p>
      )}
    </div>
  );
}
