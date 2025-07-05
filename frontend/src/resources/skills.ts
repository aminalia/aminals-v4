import { useQuery } from '@tanstack/react-query';
import { GlobalSkillsListDocument, GlobalSkillsListQuery, execute } from '../../.graphclient';

const BASE_KEY = 'skills';

export const useSkills = () => {
  return useQuery<GlobalSkillsListQuery['globalSkills']>({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      const response = await execute(GlobalSkillsListDocument, {});
      if (response.errors) throw new Error(response.errors[0].message);
      return response.data.globalSkills;
    },
  });
};

// Note: Individual skill lookup not implemented in new schema
// Skills are now globally accessible without individual entities
