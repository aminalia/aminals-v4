import SkillCard from '@/components/skill-card';
import { useSkills } from '@/resources/skills';
import type { NextPage } from 'next';
import Layout from '../_layout';

const SkillsPage: NextPage = () => {
  const { data: skills, isLoading: isLoadingSkills } = useSkills();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Skills Gallery</h1>
            <div className="text-sm text-gray-500">
              {skills?.length || 0} Skills found
            </div>
          </div>

          {isLoadingSkills ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div className="text-gray-500">Loading skills...</div>
              </div>
            </div>
          ) : !skills?.length ? (
            <div className="flex items-center justify-center h-[50vh] text-gray-500">
              No skills available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SkillsPage;
