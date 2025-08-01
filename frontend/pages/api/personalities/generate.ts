import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrGenerateAminalPersonality } from '../../../lib/gene-personality-storage';
import { execute, GenesByIdsDocument } from '../../../.graphclient';

interface GeneratePersonalityRequest {
  aminalAddress: string;
  geneIds: {
    backId?: string;
    armId?: string;
    tailId?: string;
    earsId?: string;
    bodyId?: string;
    faceId?: string;
    mouthId?: string;
    miscId?: string;
  };
}

interface GeneratePersonalityResponse {
  personality: string;
  traits: Record<string, string>;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneratePersonalityResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' } as GeneratePersonalityResponse);
  }

  try {
    const { aminalAddress, geneIds }: GeneratePersonalityRequest = req.body;

    if (!aminalAddress || !geneIds) {
      return res.status(400).json({ error: 'aminalAddress and geneIds are required' } as GeneratePersonalityResponse);
    }

    // Collect all valid gene IDs and map them to trait types
    const geneData: Array<{
      geneId: string;
      traitType: number;
      svg: string;
      name?: string;
    }> = [];

    const geneIdArray = Object.entries(geneIds)
      .filter(([_, id]) => id && id !== '0')
      .map(([_, id]) => id as string);

    if (geneIdArray.length === 0) {
      return res.status(400).json({ error: 'No valid gene IDs provided' } as GeneratePersonalityResponse);
    }

    // Fetch gene data from GraphQL
    const response = await execute(GenesByIdsDocument, {
      ids: geneIdArray,
    });

    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new Error(`GraphQL error: ${response.errors[0].message}`);
    }

    const genes = response.data?.geneNFTs || [];

    // Map genes to trait types
    const traitTypeMap: Record<string, number> = {
      backId: 0,
      armId: 1,
      tailId: 2,
      earsId: 3,
      bodyId: 4,
      faceId: 5,
      mouthId: 6,
      miscId: 7,
    };

    for (const [geneKey, geneId] of Object.entries(geneIds)) {
      if (!geneId || geneId === '0') continue;

      const gene = genes.find(g => g.tokenId === geneId);
      if (gene && gene.svg) {
        geneData.push({
          geneId,
          traitType: traitTypeMap[geneKey],
          svg: gene.svg,
          name: gene.name || undefined,
        });
      }
    }

    if (geneData.length === 0) {
      return res.status(400).json({ error: 'No valid genes found with SVG data' } as GeneratePersonalityResponse);
    }

    // Generate personality from genes
    const personality = await getOrGenerateAminalPersonality(aminalAddress, geneData);

    // Get the individual traits for response
    const traits: Record<string, string> = {};
    // This is a simplified response - in a full implementation you might want to return individual traits

    res.status(200).json({
      personality,
      traits,
    });
  } catch (error) {
    console.error('Error generating personality:', error);
    res.status(500).json({ error: 'Failed to generate personality' } as GeneratePersonalityResponse);
  }
}