import { TRAIT_CATEGORIES } from '@/constants/trait-categories';

interface TraitCardProps {
  trait: {
    id: string;
    visualId: string;
    catEnum: number;
    svg: string;
    creator: {
      address: string;
    };
  };
}

const TraitCard = ({ trait }: TraitCardProps) => {
  const category =
    TRAIT_CATEGORIES[trait.catEnum as keyof typeof TRAIT_CATEGORIES];

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white p-6 transition-all hover:shadow-lg">
      <div className="flex flex-col gap-4">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          dangerouslySetInnerHTML={{
            __html: trait?.svg,
          }}
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">{category.emoji}</span>
              Trait #{trait.visualId}
            </span>
            <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">
              {category.name}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <span>Created by: </span>
            <span className="font-mono">
              {trait.creator.address.slice(0, 6)}...
              {trait.creator.address.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraitCard;
