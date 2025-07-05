import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
const geneAuctionAbi = require('../../deployments/GeneAuction.json').abi;

const GENE_AUCTION_ADDRESS = '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605' as const;

interface GeneAuction {
  id: string;
  parentOneAddress: string;
  parentTwoAddress: string;
  childAddress?: string;
  settled: boolean;
  blockTimestamp: string;
}

export default function GeneAuctionCard({ auction }: { auction: GeneAuction }) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContractAsync, isPending } = useWriteContract();
  
  const [geneId, setGeneId] = useState<string>('');
  const [category, setCategory] = useState<string>('0'); // 0 = BACK, 1 = ARM, etc.

  async function proposeGene() {
    if (enabled && geneId && category) {
      await writeContractAsync({
        abi: geneAuctionAbi,
        address: GENE_AUCTION_ADDRESS,
        functionName: 'proposeGene',
        args: [auction.id, BigInt(geneId), BigInt(category)],
        value: parseEther('0.001'),
      });
    }
  }

  async function voteForGene() {
    if (enabled && geneId && category) {
      await writeContractAsync({
        abi: geneAuctionAbi,
        address: GENE_AUCTION_ADDRESS,
        functionName: 'voteGene',
        args: [auction.id, BigInt(geneId), BigInt(category)],
        value: parseEther('0.001'),
      });
    }
  }

  async function settleAuction() {
    if (enabled) {
      await writeContractAsync({
        abi: geneAuctionAbi,
        address: GENE_AUCTION_ADDRESS,
        functionName: 'settleVoting',
        args: [auction.id],
      });
    }
  }

  const categories = [
    { value: '0', label: 'Back' },
    { value: '1', label: 'Arms' },
    { value: '2', label: 'Tail' },
    { value: '3', label: 'Ears' },
    { value: '4', label: 'Body' },
    { value: '5', label: 'Face' },
    { value: '6', label: 'Mouth' },
    { value: '7', label: 'Misc' },
  ];

  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold">
          Gene Auction #{auction.id}
        </CardTitle>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Parent 1: {auction.parentOneAddress.slice(0, 10)}...</div>
          <div>Parent 2: {auction.parentTwoAddress.slice(0, 10)}...</div>
          {auction.childAddress && (
            <div>Child: {auction.childAddress.slice(0, 10)}...</div>
          )}
          <div>Status: {auction.settled ? '✅ Settled' : '⏳ Active'}</div>
        </div>
      </CardHeader>

      {!auction.settled && (
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gene Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gene NFT ID</label>
            <Input
              placeholder="Enter Gene NFT ID"
              value={geneId}
              onChange={(e) => setGeneId(e.target.value)}
              type="number"
              min="1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={proposeGene}
              disabled={!enabled || !geneId || isPending}
              variant="outline"
              className="flex-1"
            >
              {isPending ? '⏳' : '💡'} Propose
            </Button>
            <Button
              onClick={voteForGene}
              disabled={!enabled || !geneId || isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? '⏳' : '🗳️'} Vote
            </Button>
          </div>

          <Button
            onClick={settleAuction}
            disabled={!enabled || isPending}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isPending ? '⏳ Settling...' : '🎯 Settle Auction'}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}