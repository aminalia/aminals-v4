import { getCategoryEmoji } from '@constants/trait-categories';
import Link from 'next/link';

interface GeneCardProps {
  trait: {
    id: string;
    tokenId: string | bigint;
    category?: string | null;
    svg?: string | null;
    name?: string | null;
    totalEarnings?: bigint | string | number;
    creator?: {
      address: string;
    };
    proposals?: {
      items: {
        id: string;
        auction?: {
          id: string;
          aminalOne?: {
            id: string;
            aminalIndex: string;
          };
          aminalTwo?: {
            id: string;
            aminalIndex: string;
          };
        };
      }[];
    };
  };
  aminalCount?: number;
}

const GeneCard = ({ trait, aminalCount = 0 }: GeneCardProps) => {
  // Display the gene name, or fallback to "Gene #tokenId"
  const displayName = trait.name || `Gene #${trait.tokenId.toString()}`;

  // Format earnings from wei to ETH
  const formatEarnings = (earnings: bigint | string | number | undefined) => {
    if (!earnings) return '0';
    const earningsNum = typeof earnings === 'bigint' ? Number(earnings) : Number(earnings);
    const earningsInEth = earningsNum / 1e18;
    if (earningsInEth === 0) return '0';
    if (earningsInEth < 0.0001) return '<0.0001';
    return earningsInEth.toFixed(4);
  };

  const earnings = formatEarnings(trait.totalEarnings);
  const hasEarnings = trait.totalEarnings && Number(trait.totalEarnings) > 0;

  return (
    <Link href={`/genes/${trait.id}`} className="block">
      <div className="rounded-xl border border-border shadow-sm bg-card overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-square bg-secondary flex items-center justify-center p-4">
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full"
            dangerouslySetInnerHTML={{
              __html: trait?.svg || '',
            }}
          />
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <span className="text-base font-semibold leading-tight">
              {displayName}
            </span>
            {trait.category && (
              <span className="shrink-0 px-2 py-0.5 bg-secondary text-muted-foreground rounded-full text-xs flex items-center gap-1">
                <span>{getCategoryEmoji(trait.category)}</span>
                <span>{trait.category}</span>
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {aminalCount} {aminalCount === 1 ? 'Aminal' : 'Aminals'}
            </span>
            {hasEarnings && (
              <span className="text-success font-medium">
                {earnings} Ξ earned
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GeneCard;
