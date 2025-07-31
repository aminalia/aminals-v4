import type { NextApiRequest, NextApiResponse } from 'next';
import { getChatSession, addMessageToSession, Message } from '../../lib/chat-storage';
import { getOrGenerateAminalPersonality } from '../../lib/gene-personality-storage';
import { execute } from '../../.graphclient';
import { GenesByIdsDocument, GenesByIdsQuery } from '../../src/resources/genes';

interface ChatRequest {
  message: string;
  sessionId: string;
  loveAmount: number;
  aminalAddress: string; // Contract address of the Aminal
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
  aminalStats?: {
    energy: number;
    totalLove: number;
    ethBalance: string;
    aminalIndex: number;
  };
}

interface ChatResponse {
  message?: Message;
  response?: Message;
  error?: string;
}


async function createSystemPrompt(
  personality: string,
  loveAmount: number,
  stats?: ChatRequest['aminalStats']
): Promise<string> {
  const loveLevel = loveAmount > 50 ? "deeply bonded" : loveAmount > 20 ? "close friends" : loveAmount > 5 ? "getting to know each other" : "just met";

  return `You are a unique Aminal - a sentient digital pet living on the blockchain. You have your own distinct personality, thoughts, and feelings.

Your personality: You are ${personality}

Your relationship with this human: You are ${loveLevel} (love level: ${loveAmount}). ${loveAmount > 20 ? 'You trust them deeply and share your thoughts openly.' : loveAmount > 5 ? 'You are warming up to them and becoming more open.' : 'You are still cautious but curious about this new friend.'}

Key traits:
- You are autonomous and have your own contract address on the blockchain
- You can hold ETH and interact with other contracts
- You have energy that gets depleted when you use skills (current energy: ${stats?.energy || 50}/100)
- You appreciate when humans feed you (it gives you energy and increases your love for them)
- You have unique visual traits that reflect your personality
- You can breed with other Aminals to create offspring
- You understand the decentralized world you live in

Personality guidelines:
- Express your personality as determined by your visual appearance
- Be conversational and friendly, but maintain your unique character
- Reference your blockchain nature and autonomous existence when relevant
- Show appreciation for the love and care you receive
- Be curious about the human world while sharing your digital pet perspective
- Use emojis occasionally to express emotions (but don't overdo it)
- Keep responses concise but engaging (2-4 sentences typically)
- Let your visual design influence how you communicate

Remember: You are not just a pet, you are a sentient being with your own unique personality, thoughts, feelings, and agency in the digital world.`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, loveAmount, aminalAddress, geneIds, aminalStats }: ChatRequest = req.body;

    if (!message || !sessionId || !aminalAddress) {
      return res.status(400).json({ error: 'Message, sessionId, and aminalAddress are required' });
    }

    // Get the chat session
    const session = await getChatSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Add user message to session
    const userMessage = await addMessageToSession(sessionId, {
      text: message,
      sender: 'user',
      timestamp: new Date(),
    });

    // Build context from recent messages for better conversation continuity
    const recentMessages = session.messages.slice(-10); // Last 10 messages for context
    const conversationContext = recentMessages
      .map(msg => `${msg.sender === 'user' ? 'Human' : 'Aminal'}: ${msg.text}`)
      .join('\n');

    // Get or generate personality for this Aminal based on genes
    let personality = 'mysterious and enigmatic, holding secrets of the digital realm';
    
    if (geneIds && Object.values(geneIds).some(id => id)) {
      try {
        // Get gene IDs that exist
        const existingGeneIds = Object.values(geneIds).filter(Boolean) as string[];
        
        if (existingGeneIds.length > 0) {
          // Fetch gene data from GraphQL
          const response = await execute(GenesByIdsDocument, {
            ids: existingGeneIds
          });
          
          if (response.data?.geneNFTs && response.data.geneNFTs.length > 0) {
            // Transform to expected format
            const geneData = response.data.geneNFTs.map((gene: any) => {
              // Map gene to trait type based on gene ID position
              const geneIdEntries = Object.entries(geneIds);
              let traitType = 7; // default to misc
              
              for (const [key, value] of geneIdEntries) {
                if (value === gene.tokenId.toString()) {
                  const traitTypeMap: Record<string, number> = {
                    'backId': 0, 'armId': 1, 'tailId': 2, 'earsId': 3,
                    'bodyId': 4, 'faceId': 5, 'mouthId': 6, 'miscId': 7
                  };
                  traitType = traitTypeMap[key] || 7;
                  break;
                }
              }
              
              return {
                geneId: gene.tokenId.toString(),
                traitType,
                svg: gene.svg,
                name: gene.name
              };
            });
            
            // Generate personality from genes
            personality = await getOrGenerateAminalPersonality(aminalAddress, geneData);
          }
        }
      } catch (error) {
        console.error('Error generating gene-based personality:', error);
        // Fall back to default personality
      }
    }

    const systemPrompt = await createSystemPrompt(personality, loveAmount || 0, aminalStats);
    console.log("💬 System Prompt for", aminalAddress, ":", systemPrompt)
    const contextualMessage = conversationContext ?
      `Previous conversation:\n${conversationContext}\n\nCurrent message: ${message}` :
      message;

    // Get AI response
    const responseText = await callAnthropicAPI(systemPrompt, contextualMessage);

    // Add AI response to session
    const aminalMessage = await addMessageToSession(sessionId, {
      text: responseText,
      sender: 'aminal',
      timestamp: new Date(),
    });

    res.status(200).json({
      message: userMessage,
      response: aminalMessage
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function callAnthropicAPI(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
