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
            <span className="text-lg font-semibold">Trait #{trait.visualId}</span>
            <span className="text-sm text-gray-500">Category: {trait.catEnum}</span>
          </div>
          
          <div className="text-sm text-gray-600">
            <span>Created by: </span>
            <span className="font-mono">{trait.creator.address.slice(0, 6)}...{trait.creator.address.slice(-4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraitCard; 