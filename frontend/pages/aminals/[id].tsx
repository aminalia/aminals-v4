import BreedButton from '@/components/actions/breed-button';
import FeedButton from '@/components/actions/feed-button';
import ProposeSkillButton from '@/components/actions/propose-skill-button';
import { TokenUriImage } from '@/components/aminal-card';
import SkillCard from '@/components/skill-card';
import { TRAIT_CATEGORIES } from '@/constants/trait-categories';
import { useAminal } from '@/resources/aminals';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../_layout';

const AminalPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: aminal, isLoading } = useAminal(id as string);
  const [showSkillForm, setShowSkillForm] = useState(false);

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

  // For TypeScript, we need to ensure the component accepts the aminal prop
  const aminalData = aminal as any;

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">
                  Aminal #{aminalData.aminalId}
                </h1>
              </div>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Back to all Aminals
              </Link>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-indigo-50 flex items-center justify-center border border-gray-200">
                <TokenUriImage aminal={aminalData} />
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Stats Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                  <h2 className="text-xl font-semibold">Stats</h2>

                  {/* Energy and Total Love */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm text-gray-500">Energy</div>
                      <div className="text-xl font-semibold text-purple-600">
                        {(aminalData.energy / 1e18).toFixed(2)} ⚡
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm text-gray-500">Total Love</div>
                      <div className="text-xl font-semibold text-pink-600">
                        {(aminalData.totalLove / 1e18).toFixed(2)} ❤️
                      </div>
                    </div>
                  </div>

                  {/* Your Love - Show if the user has given love to this Aminal */}
                  {aminalData.lovers && aminalData.lovers[0] && (
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                      <div className="text-sm text-gray-500">Your Love</div>
                      <div className="text-xl font-semibold text-pink-600">
                        {(aminalData.lovers[0].love / 1e18).toFixed(2)} ❤️
                      </div>
                    </div>
                  )}
                </div>

                {/* Feed Button */}
                <FeedButton id={aminalData.aminalId} />
              </div>
            </div>

            {/* Info Section - Full width, with two columns, no border */}
            <div className="p-2 space-y-4">
              <h2 className="text-xl font-semibold px-3">Info</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Lineage and Breeding */}
                <div className="space-y-6">
                  {/* Lineage */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2 px-3">
                      <span className="text-blue-600 text-lg">👪</span>
                      Lineage
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500">Mom</div>
                        <div className="font-medium">#{aminalData.mom}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500">Dad</div>
                        <div className="font-medium">#{aminalData.dad}</div>
                      </div>
                    </div>
                  </div>

                  {/* Breeding */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2 px-3">
                      <span className="text-blue-600 text-lg">🧬</span>
                      Breeding
                    </h3>
                    {aminalData.breedableWith &&
                    aminalData.breedableWith.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 px-3">
                          This Aminal can breed with:
                        </p>
                        <div className="flex flex-wrap gap-2 px-3">
                          {aminalData.breedableWith.map(
                            (buddy: any) =>
                              buddy && (
                                <Link
                                  key={buddy.aminalTwo.aminalId}
                                  href={`/aminals/${buddy.aminalTwo.aminalId}`}
                                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                >
                                  Aminal #{buddy.aminalTwo.aminalId}
                                </Link>
                              )
                          )}
                        </div>
                        <div className="mt-3 px-3">
                          <BreedButton id={aminalData.aminalId} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 px-3">
                          This Aminal cannot breed with any of your other
                          Aminals at the moment.
                        </p>
                        <div className="mt-3 px-3">
                          <BreedButton id={aminalData.aminalId} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Traits */}
                <div>
                  {aminalData.traits && aminalData.traits.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2 px-3">
                        <span className="text-blue-600 text-lg">🎭</span>
                        Traits
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => {
                          const trait = aminalData.traits.find(
                            (t: any) => Number(t.catEnum) === i
                          );
                          return (
                            <div
                              key={i}
                              className={`p-3 rounded-lg border ${
                                trait
                                  ? 'bg-blue-50 border-blue-100'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {
                                    TRAIT_CATEGORIES[
                                      i as keyof typeof TRAIT_CATEGORIES
                                    ].emoji
                                  }
                                </span>
                                <div>
                                  <div className="text-sm font-medium">
                                    {
                                      TRAIT_CATEGORIES[
                                        i as keyof typeof TRAIT_CATEGORIES
                                      ].name
                                    }
                                  </div>
                                  {trait ? (
                                    <Link
                                      href={`/traits/${trait.id}`}
                                      className="text-xs text-blue-700 font-medium hover:underline"
                                    >
                                      #{trait.visualId}
                                    </Link>
                                  ) : (
                                    <div className="text-xs text-gray-500">
                                      None
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-2xl font-bold">Skills</h2>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    {aminalData.skills
                      ? aminalData.skills.filter((s: any) => s && !s.removed)
                          .length
                      : 0}{' '}
                    Active Skills
                  </div>
                  <button
                    onClick={() => setShowSkillForm(!showSkillForm)}
                    className={`px-4 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1.5 ${
                      showSkillForm
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {showSkillForm ? (
                      <>
                        <span>✕</span>
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <span>🎯</span>
                        <span>Propose Skill</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showSkillForm && (
                <div className="bg-blue-50 p-5 rounded-lg mb-6 border border-blue-100">
                  <div className="mb-3">
                    <h3 className="text-lg font-medium text-blue-800 mb-1">
                      Add a new skill
                    </h3>
                    <p className="text-sm text-blue-600">
                      Skills enable your Aminal to perform special actions
                      on-chain
                    </p>
                  </div>
                  <ProposeSkillButton id={aminalData.aminalId} />
                </div>
              )}

              {!aminalData.skills?.length ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-xl p-10 text-gray-500 border border-gray-100">
                  <div className="text-5xl mb-4">🧠</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No Skills Yet
                  </h3>
                  <p className="text-center max-w-md">
                    This Aminal doesn't have any skills yet. Skills give your
                    Aminal special abilities!
                  </p>
                  {!showSkillForm && (
                    <button
                      onClick={() => setShowSkillForm(true)}
                      className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      🎯 Propose First Skill
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aminalData.skills.map((skill: any) => {
                    if (!skill) return null;
                    return (
                      <SkillCard
                        key={skill.id}
                        skill={{
                          id: skill.id,
                          skillAddress: skill.skillAddress,
                          removed: skill.removed,
                          blockTimestamp: String(Date.now()),
                          skillName: skill.skillName || '',
                        }}
                        compact
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AminalPage;
