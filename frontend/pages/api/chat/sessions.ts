import type { NextApiRequest, NextApiResponse } from 'next';
import { createChatSession, getUserChatSessions, deleteChatSession, deleteAllUserSessions, ChatSession } from '../../../lib/chat-storage';
import { getOrGenerateAminalPersonality } from '../../../lib/gene-personality-storage';
import { execute, GenesByIdsDocument } from '../../../.graphclient';

interface CreateSessionRequest {
  aminalAddress: string;
  userAddress: string;
  title?: string;
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

interface GetSessionsRequest {
  aminalAddress: string;
  userAddress: string;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatSession | ChatSession[] | { success: boolean } | { error: string }>
) {
  if (req.method === 'POST') {
    // Create new chat session
    try {
      const { aminalAddress, userAddress, title, geneIds }: CreateSessionRequest = req.body;

      if (!aminalAddress || !userAddress) {
        return res.status(400).json({ error: 'aminalAddress and userAddress are required' });
      }

      // Get or generate personality for this Aminal based on genes
      let personality = 'mysterious and enigmatic, holding secrets of the digital realm';
      
      try {
        // Collect valid gene IDs
        const geneIdArray = Object.entries(geneIds)
          .filter(([_, id]) => id && id !== '0')
          .map(([_, id]) => id as string);

        if (geneIdArray.length > 0) {
          // Fetch gene data from GraphQL
          const response = await execute(GenesByIdsDocument, {
            ids: geneIdArray,
          });

          if (!response.errors && response.data?.geneNFTs) {
            const genes = response.data.geneNFTs;
            
            // Map genes to trait types
            const traitTypeMap: Record<string, number> = {
              backId: 0, armId: 1, tailId: 2, earsId: 3,
              bodyId: 4, faceId: 5, mouthId: 6, miscId: 7,
            };

            const geneData = Object.entries(geneIds)
              .filter(([_, geneId]) => geneId && geneId !== '0')
              .map(([geneKey, geneId]) => {
                const gene = genes.find(g => g.tokenId === geneId);
                return gene && gene.svg ? {
                  geneId: geneId!,
                  traitType: traitTypeMap[geneKey],
                  svg: gene.svg,
                  name: gene.name || undefined,
                } : null;
              })
              .filter(Boolean) as Array<{
                geneId: string;
                traitType: number;
                svg: string;
                name?: string;
              }>;

            if (geneData.length > 0) {
              personality = await getOrGenerateAminalPersonality(aminalAddress, geneData);
            }
          }
        }
      } catch (error) {
        console.error('Error generating gene-based personality for session, using fallback:', error);
      }

      const session = await createChatSession(aminalAddress, userAddress, title, personality);
      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating chat session:', error);
      res.status(500).json({ error: 'Failed to create chat session' });
    }
  } else if (req.method === 'GET') {
    // Get user's chat sessions for a specific aminal
    try {
      const { aminalAddress, userAddress } = req.query;

      if (!aminalAddress || !userAddress || typeof aminalAddress !== 'string' || typeof userAddress !== 'string') {
        return res.status(400).json({ error: 'aminalAddress and userAddress are required' });
      }

      const sessions = await getUserChatSessions(userAddress, aminalAddress);
      res.status(200).json(sessions);
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      res.status(500).json({ error: 'Failed to get chat sessions' });
    }
  } else if (req.method === 'DELETE') {
    // Delete chat sessions
    try {
      const { sessionId, aminalAddress, userAddress, deleteAll } = req.query;

      if (deleteAll === 'true') {
        // Delete all sessions for a user/aminal combination
        if (!aminalAddress || !userAddress || typeof aminalAddress !== 'string' || typeof userAddress !== 'string') {
          return res.status(400).json({ error: 'aminalAddress and userAddress are required for bulk delete' });
        }

        await deleteAllUserSessions(userAddress, aminalAddress);
        res.status(200).json({ success: true });
      } else {
        // Delete single session
        if (!sessionId || typeof sessionId !== 'string') {
          return res.status(400).json({ error: 'sessionId is required for single delete' });
        }

        await deleteChatSession(sessionId);
        res.status(200).json({ success: true });
      }
    } catch (error) {
      console.error('Error deleting chat session(s):', error);
      res.status(500).json({ error: 'Failed to delete chat session(s)' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}