import type { NextApiRequest, NextApiResponse } from 'next';
import { getChatSession, ChatSession } from '../../../../lib/chat-storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatSession | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const sessionId = id as string;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await getChatSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
}