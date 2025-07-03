import {
  Card,
  CardContent,
  CardHeader,
  CardSection,
  CardTitle,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface SkillCardProps {
  skill: {
    id: string;
    aminal?: {
      id: string;
      aminalId: string;
    };
    skillAddress: string;
    removed: boolean;
    blockTimestamp: string;
    skillName?: string;
  };
  compact?: boolean;
}

export default function SkillCard({ skill, compact = false }: SkillCardProps) {
  const timestamp = new Date(Number(skill.blockTimestamp) * 1000);

  if (compact) {
    return (
      <div className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                skill.removed ? 'bg-red-500' : 'bg-green-500'
              }`}
            ></div>
            <div className="font-medium text-gray-800">
              {skill.skillName || 'Skill'}
            </div>
          </div>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              skill.removed
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {skill.removed ? 'Removed' : 'Active'}
          </span>
        </div>
        <div className="p-3">
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Contract Address</div>
            <div className="font-mono text-xs bg-gray-50 p-2 rounded-md break-all overflow-hidden text-ellipsis">
              {skill.skillAddress}
            </div>
          </div>
          <div className="text-xs text-gray-500 italic">
            Added {formatDistanceToNow(timestamp)} ago
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardSection>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {skill.aminal
                ? `Skill for Aminal #${skill.aminal.aminalId}`
                : skill.skillName || 'Skill'}
            </CardTitle>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                skill.removed
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {skill.removed ? 'Removed' : 'Active'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Skill Address</div>
            <div className="font-mono text-sm bg-gray-50 p-2 rounded-md break-all">
              {skill.skillAddress}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Added {formatDistanceToNow(timestamp)} ago
          </div>
        </CardContent>
      </CardSection>
    </Card>
  );
}
