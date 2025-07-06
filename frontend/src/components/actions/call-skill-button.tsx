import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
const aminalAbi = require('../../../deployments/Aminal.json').abi;

// Known skill addresses (these would be loaded from a registry or config in production)
const KNOWN_SKILLS = [
  {
    address: '0xcf5e739449e7a7a1b83f750e962f5dd87bb99556',
    name: 'Move2D',
    description: 'Move your Aminal in 2D space',
  },
  {
    address: '0x99ea2abb821942d604b11065156fc8639dff5701', 
    name: 'MoveTwice',
    description: 'Move your Aminal twice in one action',
  },
] as const;

interface CallSkillButtonProps {
  aminalContractAddress: `0x${string}`;
}

export default function CallSkillButton({ aminalContractAddress }: CallSkillButtonProps) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;
  const { writeContractAsync, isPending } = useWriteContract();
  
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [skillData, setSkillData] = useState<string>('');

  async function callSkill() {
    if (enabled && selectedSkill) {
      // Convert skill data to bytes (for now just use empty bytes)
      const data = skillData ? `0x${Buffer.from(skillData).toString('hex')}` : '0x';
      
      await writeContractAsync({
        abi: aminalAbi,
        address: aminalContractAddress,
        functionName: 'callSkill',
        args: [selectedSkill as `0x${string}`, data as `0x${string}`],
        value: BigInt(0), // Skills may cost energy but not ETH
      });
    }
  }

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
      <h4 className="font-medium text-sm">🔮 Call Global Skill</h4>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Skill</label>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          <option value="">Select a skill...</option>
          {KNOWN_SKILLS.map(skill => (
            <option key={skill.address} value={skill.address}>
              {skill.name} - {skill.description}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Skill Data (optional)</label>
        <Input
          placeholder="Enter skill parameters"
          value={skillData}
          onChange={(e) => setSkillData(e.target.value)}
          className="text-sm"
        />
      </div>

      <Button
        onClick={callSkill}
        disabled={!enabled || !selectedSkill || isPending}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        size="sm"
      >
        {isPending ? '⏳ Calling Skill...' : '🚀 Call Skill'}
      </Button>
      
      {selectedSkill && (
        <div className="text-xs text-gray-600 mt-2">
          <strong>Note:</strong> Skills are globally available and may consume energy from your Aminal.
        </div>
      )}
    </div>
  );
}