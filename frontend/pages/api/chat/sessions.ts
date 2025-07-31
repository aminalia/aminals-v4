import type { NextApiRequest, NextApiResponse } from 'next';
import { createChatSession, getUserChatSessions, deleteChatSession, deleteAllUserSessions, ChatSession } from '../../../lib/chat-storage';

interface CreateSessionRequest {
  aminalAddress: string;
  userAddress: string;
  title?: string;
  aminalSvg?: string;
  aminalStats?: {
    energy: number;
    totalLove: number;
    ethBalance: string;
    aminalIndex: number;
  };
}

interface GetSessionsRequest {
  aminalAddress: string;
  userAddress: string;
}

async function generatePersonalityFromSvg(
  svgData?: string,
  stats?: CreateSessionRequest['aminalStats']
): Promise<string> {
  console.log('🎭 Generating personality for new chat session:', { hasSvg: !!svgData, stats });

  if (!svgData) {
    return 'mysterious and enigmatic, holding secrets of the digital realm';
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  const personalityPrompt = `You are analyzing the visual appearance of an Aminal (a digital pet NFT) to determine its personality traits. 

Look at this SVG representation and describe the personality this creature would have based on its visual features:

${svgData}

Additional context:
- Current energy level: ${stats?.energy || 50}/100
- Total love received: ${stats?.totalLove || 0}
- ETH balance: ${stats?.ethBalance || '0'} ETH

Based on the visual design, colors, shapes, and overall aesthetic, describe this Aminal's personality in 1-2 sentences. Focus on:
- Core personality traits (e.g., playful, wise, mysterious, energetic)
- Communication style (e.g., cheerful, contemplative, mischievous)
- Unique quirks that match their appearance

Respond with just the personality description, no preamble.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: personalityPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const personality = data.content[0].text.trim();
  
  console.log('🎭 Generated personality for session:', personality);
  return personality;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatSession | ChatSession[] | { success: boolean } | { error: string }>
) {
  if (req.method === 'POST') {
    // Create new chat session
    try {
      const { aminalAddress, userAddress, title, aminalSvg, aminalStats }: CreateSessionRequest = req.body;

      if (!aminalAddress || !userAddress) {
        return res.status(400).json({ error: 'aminalAddress and userAddress are required' });
      }

      // Generate personality from SVG data
      const personality = await generatePersonalityFromSvg(aminalSvg, aminalStats);

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