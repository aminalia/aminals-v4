import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedGeneTrait, GeneTrait } from '../../../../lib/gene-personality-storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneTrait | { error: string } | null>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { geneId } = req.query;
    const geneIdString = geneId as string;

    if (!geneIdString) {
      return res.status(400).json({ error: 'Gene ID is required' });
    }

    const geneTrait = await getCachedGeneTrait(geneIdString);
    
    if (!geneTrait) {
      return res.status(404).json({ error: 'No cached trait found for this gene' });
    }

    res.status(200).json(geneTrait);
  } catch (error) {
    console.error('Error fetching cached gene trait:', error);
    res.status(500).json({ error: 'Failed to fetch cached gene trait' });
  }
}