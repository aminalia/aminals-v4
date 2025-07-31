import type { NextApiRequest, NextApiResponse } from 'next';
import { getChatSession, addMessageToSession, Message } from '../../lib/chat-storage';

interface ChatRequest {
  message: string;
  sessionId: string;
  loveAmount: number;
  aminalSvg?: string; // The actual SVG representation of the Aminal
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

async function generatePersonalityFromSvg(
  svgData?: string,
  stats?: ChatRequest['aminalStats']
): Promise<string> {
  console.log('🎭 Generating personality from SVG and stats:', { hasSvg: !!svgData, stats });

  if (!svgData) {
    return 'mysterious and enigmatic, holding secrets of the digital realm';
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    // Fallback to simple analysis based on stats
    const basePersonality = 'curious and playful digital being';
    if (stats) {
      if (stats.energy > 80) return `${basePersonality}, currently bursting with energy`;
      if (stats.energy < 20) return `${basePersonality}, feeling contemplative and sleepy`;
      if (stats.totalLove > 100) return `${basePersonality}, radiating warmth from all the love received`;
    }
    return basePersonality;
  }

  try {
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
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const personality = data.content[0].text.trim();
    
    console.log('🎭 Generated personality:', personality);
    return personality;
  } catch (error) {
    console.error('Failed to generate personality from SVG:', error);
    return 'curious and adaptive digital being, learning to express their unique nature';
  }
}

async function createSystemPrompt(
  loveAmount: number, 
  svgData?: string,
  stats?: ChatRequest['aminalStats']
): Promise<string> {
  const personality = await generatePersonalityFromSvg(svgData, stats);
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
    const { message, sessionId, loveAmount, aminalSvg, aminalStats }: ChatRequest = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
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

    const systemPrompt = await createSystemPrompt(loveAmount || 0, aminalSvg, aminalStats);
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
  // Placeholder implementation - you'll need to integrate with Anthropic's API
  // For now, return a simple response based on the system prompt context
  
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    // Fallback response for development
    return "Hi there! I'm still learning to talk, but I appreciate you reaching out! 🐾 The developers are still setting up my connection to the Anthropic API. Once that's ready, I'll be able to have full conversations with you!";
  }

  try {
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
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Anthropic API call failed:', error);
    // Fallback response
    return "I'm having trouble connecting to my AI brain right now, but I'm here! 🤖 Please try again in a moment.";
  }
}