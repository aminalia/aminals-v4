import { TRAIT_CATEGORIES } from '@constants/trait-categories';
import Link from 'next/link';

interface TraitCardProps {
  trait: {
    id: string;
    tokenId: string | bigint;
    traitType: number;
    svg?: string | null;
    name?: string | null;
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

const TraitCard = ({ trait, aminalCount = 0 }: TraitCardProps) => {
  const category =
    TRAIT_CATEGORIES[trait.traitType as keyof typeof TRAIT_CATEGORIES];

  console.log('TraitCard - trait.id:', trait.id, 'tokenId:', trait.tokenId);

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

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">{category?.emoji || '🎨'}</span>
              {category?.name || 'Unknown'} #{trait.tokenId.toString()}
            </span>
            <div className="px-2 py-0.5 bg-energy/20 text-energy rounded-full text-xs">
              {aminalCount} {aminalCount === 1 ? 'Aminal' : 'Aminals'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TraitCard;
