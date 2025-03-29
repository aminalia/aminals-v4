import { useWriteAminalsProposeAddSkill } from '@/contracts/generated';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';
import { parseEther } from 'viem';

interface ProposeSkillButtonProps {
  id: string;
}

export default function ProposeSkillButton({ id }: ProposeSkillButtonProps) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const proposeSkill = useWriteAminalsProposeAddSkill();

  const [skillName, setSkillName] = useState('');
  const [skillAddress, setSkillAddress] = useState('');
  const [isProposing, setIsProposing] = useState(false);

  async function action() {
    if (!enabled || !skillName || !skillAddress) return;

    try {
      setIsProposing(true);
      await proposeSkill.writeContractAsync({
        args: [BigInt(id), skillName, skillAddress],
        value: parseEther('0.01'), // This is a base fee, it will be adjusted by the contract based on love
      });
    } catch (error) {
      console.error('Error proposing skill:', error);
    } finally {
      setIsProposing(false);
      // Reset form
      setSkillName('');
      setSkillAddress('');
    }
  }

  if (!enabled) {
    return (
      <Button disabled className="w-full">
        Connect wallet to propose skill
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Input
          placeholder="Skill Name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          disabled={isProposing}
        />
        <Input
          placeholder="Skill Address (0x...)"
          value={skillAddress}
          onChange={(e) => setSkillAddress(e.target.value)}
          pattern="^0x[a-fA-F0-9]{40}$"
          disabled={isProposing}
        />
      </div>
      <Button
        onClick={action}
        disabled={!skillName || !skillAddress || isProposing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isProposing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Proposing Skill...</span>
          </div>
        ) : (
          '🎯 Propose Skill (0.01 ETH)'
        )}
      </Button>
    </div>
  );
} 