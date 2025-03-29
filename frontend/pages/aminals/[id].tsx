import TokenUriImage from '@/components/aminal-card';
import FeedButton from '@/components/actions/feed-button';
import BreedButton from '@/components/actions/breed-button';
import { useAminal } from '@/resources/aminals';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../_layout';
import Link from 'next/link';
import ProposeSkillButton from '@/components/actions/propose-skill-button';

const AminalPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: aminal, isLoading } = useAminal(id as string);

  if (!aminal) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh] text-gray-500">
            Aminal not found
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-gray-500">Loading Aminal...</div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Aminal #{aminal.aminalId}</h1>
                <Link 
                  href="/"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Back to all Aminals
                </Link>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <TokenUriImage aminal={aminal} />
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Energy</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {(aminal.energy / 1e18).toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Total Love</div>
                      <div className="text-2xl font-bold text-pink-600">
                        {(aminal.totalLove / 1e18).toFixed(2)} ❤️
                      </div>
                    </div>
                  </div>

                  {/* Lineage */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Lineage</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm text-gray-500">Mom</div>
                        <div className="font-medium">#{aminal.mom}</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm text-gray-500">Dad</div>
                        <div className="font-medium">#{aminal.dad}</div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {aminal.skills && aminal.skills.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {aminal.skills.map((skill) => (
                          <div 
                            key={skill.id}
                            className={`px-3 py-1.5 text-sm rounded-full ${
                              skill.removed 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {skill.skillAddress.slice(0, 6)}...{skill.skillAddress.slice(-4)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Traits */}
                  {aminal.traits && aminal.traits.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold">Traits</h2>
                      <div className="flex flex-wrap gap-2">
                        {aminal.traits.map((trait) => (
                          <div 
                            key={trait.id}
                            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full"
                          >
                            {trait.catEnum}: #{trait.visualId}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-4">
                    <FeedButton id={aminal.aminalId} />
                    <BreedButton id={aminal.aminalId} />
                    <ProposeSkillButton id={aminal.aminalId} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AminalPage; 