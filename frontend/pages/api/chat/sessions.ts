import type { NextApiRequest, NextApiResponse } from 'next';
import { createChatSession, getUserChatSessions, deleteChatSession, deleteAllUserSessions, ChatSession } from '../../../lib/chat-storage';

interface CreateSessionRequest {
  aminalAddress: string;
  userAddress: string;
  title?: string;
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
      const { aminalAddress, userAddress, title }: CreateSessionRequest = req.body;

      if (!aminalAddress || !userAddress) {
        return res.status(400).json({ error: 'aminalAddress and userAddress are required' });
      }

      const session = await createChatSession(aminalAddress, userAddress, title);
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