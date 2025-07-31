import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedPersonality, AminalPersonality } from '../../../lib/personality-storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AminalPersonality | { error: string } | null>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.query;
    const aminalAddress = address as string;

    if (!aminalAddress) {
      return res.status(400).json({ error: 'Aminal address is required' });
    }

    const personality = await getCachedPersonality(aminalAddress);
    
    if (!personality) {
      return res.status(404).json({ error: 'No cached personality found for this Aminal' });
    }

    res.status(200).json(personality);
  } catch (error) {
    console.error('Error fetching cached personality:', error);
    res.status(500).json({ error: 'Failed to fetch cached personality' });
  }
}