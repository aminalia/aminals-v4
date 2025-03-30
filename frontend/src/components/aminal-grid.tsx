import { Aminal } from '../../.graphclient';
import AminalCard from './aminal-card';

export default function AminalGrid({ aminals }: { aminals: Aminal[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {aminals.map((aminal) => (
        <AminalCard key={aminal.aminalId} aminal={aminal} />
      ))}
    </div>
  );
}
