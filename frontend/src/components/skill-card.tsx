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
    aminal: {
      id: string;
      aminalId: string;
    };
    skillAddress: string;
    removed: boolean;
    blockTimestamp: string;
  };
}

export default function SkillCard({ skill }: SkillCardProps) {
  const timestamp = new Date(Number(skill.blockTimestamp) * 1000);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardSection>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Skill for Aminal #{skill.aminal.aminalId}
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