import { promises as fs } from 'fs';
import path from 'path';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'aminal';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  aminalAddress: string;
  userAddress: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const CHAT_DATA_DIR = path.join(process.cwd(), '.chat-data');

// Ensure the chat data directory exists
async function ensureChatDataDir() {
  try {
    await fs.access(CHAT_DATA_DIR);
  } catch {
    await fs.mkdir(CHAT_DATA_DIR, { recursive: true });
  }
}

function getSessionFilePath(sessionId: string): string {
  return path.join(CHAT_DATA_DIR, `${sessionId}.json`);
}

function getUserSessionsFilePath(userAddress: string, aminalAddress: string): string {
  return path.join(CHAT_DATA_DIR, `sessions_${userAddress}_${aminalAddress}.json`);
}

export async function createChatSession(
  aminalAddress: string,
  userAddress: string,
  title?: string
): Promise<ChatSession> {
  await ensureChatDataDir();
  
  const sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  
  const session: ChatSession = {
    id: sessionId,
    aminalAddress,
    userAddress,
    title: title || `Chat ${new Date().toLocaleDateString()}`,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  // Save the session
  const sessionPath = getSessionFilePath(sessionId);
  await fs.writeFile(sessionPath, JSON.stringify(session, null, 2));

  // Update the user's session list
  await addSessionToUserList(userAddress, aminalAddress, sessionId);

  return session;
}

export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  try {
    const sessionPath = getSessionFilePath(sessionId);
    const data = await fs.readFile(sessionPath, 'utf-8');
    const session = JSON.parse(data);
    
    // Convert date strings back to Date objects
    session.createdAt = new Date(session.createdAt);
    session.updatedAt = new Date(session.updatedAt);
    session.messages = session.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    
    return session;
  } catch (error) {
    console.error('Error getting chat session:', error);
    return null;
  }
}

export async function updateChatSession(session: ChatSession): Promise<void> {
  session.updatedAt = new Date();
  const sessionPath = getSessionFilePath(session.id);
  await fs.writeFile(sessionPath, JSON.stringify(session, null, 2));
}

export async function addMessageToSession(
  sessionId: string,
  message: Omit<Message, 'id'>
): Promise<Message> {
  const session = await getChatSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const newMessage: Message = {
    ...message,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  session.messages.push(newMessage);
  await updateChatSession(session);
  
  return newMessage;
}

async function addSessionToUserList(
  userAddress: string,
  aminalAddress: string,
  sessionId: string
): Promise<void> {
  const userSessionsPath = getUserSessionsFilePath(userAddress, aminalAddress);
  
  let sessions: string[] = [];
  try {
    const data = await fs.readFile(userSessionsPath, 'utf-8');
    sessions = JSON.parse(data);
  } catch {
    // File doesn't exist yet, that's okay
  }

  if (!sessions.includes(sessionId)) {
    sessions.push(sessionId);
    await fs.writeFile(userSessionsPath, JSON.stringify(sessions, null, 2));
  }
}

export async function getUserChatSessions(
  userAddress: string,
  aminalAddress: string
): Promise<ChatSession[]> {
  try {
    const userSessionsPath = getUserSessionsFilePath(userAddress, aminalAddress);
    const data = await fs.readFile(userSessionsPath, 'utf-8');
    const sessionIds: string[] = JSON.parse(data);
    
    const sessions: ChatSession[] = [];
    for (const sessionId of sessionIds) {
      const session = await getChatSession(sessionId);
      if (session) {
        sessions.push(session);
      }
    }
    
    // Sort by most recent first
    return sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    // No sessions yet
    return [];
  }
}