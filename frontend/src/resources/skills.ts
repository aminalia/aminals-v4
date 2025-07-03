import { useQuery } from '@tanstack/react-query';
import { SkillsListDocument, SkillsListQuery, SkillByIdDocument, SkillByIdQuery, execute } from '../../.graphclient';

const BASE_KEY = 'skills';

export const useSkills = () => {
  return useQuery<SkillsListQuery['skills']>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(SkillsListDocument, {});
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.skills;
    },
  });
};

export const useSkill = (id: string) => {
  return useQuery<SkillByIdQuery['skill']>({
    queryKey: [BASE_KEY, id],
    queryFn: async () => {
      const response = await execute(SkillByIdDocument, { id });
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.skill;
    },
    enabled: !!id,
  });
};
