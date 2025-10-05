import type { AminalWithRelations } from '@/hooks';
import AminalCard from './AminalCard';

export default function AminalGrid({
  aminals,
}: {
  aminals: AminalWithRelations[];
}) {
  const validAminals = aminals?.filter(Boolean) || [];

  if (!validAminals.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No Aminals Found
        </h3>
        <p className="text-gray-500 max-w-md">
          There are currently no Aminals to display. Try connecting your wallet
          or check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {validAminals.map((aminal, index) => {
        if (!aminal) return null;
        return (
          <AminalCard
            key={`${aminal.contractAddress || aminal.id || index}-${index}`}
            aminal={aminal}
          />
        );
      })}
    </div>
  );
}
