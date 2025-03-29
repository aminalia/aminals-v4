import TraitCard from '@/components/trait-card';
import { useTraits } from '@/resources/traits';
import type { NextPage } from 'next';
import Layout from '../_layout';

const TraitsPage: NextPage = () => {
  const { data: traits, isLoading: isLoadingTraits } = useTraits();

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Traits Gallery</h1>
        
        {isLoadingTraits || !traits ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading traits...</p>
          </div>
        ) : traits.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No traits available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {traits.map((trait) => (
              <TraitCard key={trait.id} trait={trait} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TraitsPage;
