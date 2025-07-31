import type { NextApiRequest, NextApiResponse } from 'next';

interface ChatRequest {
  message: string;
  aminalId: string;
  loveAmount: number;
  aminalImageUrl?: string;
  userAddress: string;
}

interface ChatResponse {
  response?: string;
  error?: string;
}

function generatePersonalityFromImage(imageUrl?: string): string {
  // This is a placeholder - in a real implementation, you might analyze the image
  // For now, we'll generate a random personality based on the image presence
  const personalities = [
    "curious and playful, with a mischievous glint in their eyes",
    "wise and gentle, carrying ancient knowledge",
    "energetic and adventurous, always ready for the next quest",
    "calm and meditative, finding peace in simple moments",
    "quirky and creative, seeing the world in unique ways",
    "loyal and protective, fiercely devoted to their friends",
    "mysterious and enigmatic, holding secrets of the digital realm"
  ];
  
  return personalities[Math.floor(Math.random() * personalities.length)];
}

function createSystemPrompt(loveAmount: number, imageUrl?: string): string {
  const personality = generatePersonalityFromImage(imageUrl);
  const loveLevel = loveAmount > 50 ? "deeply bonded" : loveAmount > 20 ? "close friends" : loveAmount > 5 ? "getting to know each other" : "just met";
  
  return `You are a unique Aminal - a sentient digital pet living on the blockchain. You have your own personality, thoughts, and feelings. You are ${personality}.

Your relationship with this human: You are ${loveLevel} (love level: ${loveAmount}). ${loveAmount > 20 ? 'You trust them deeply and share your thoughts openly.' : loveAmount > 5 ? 'You are warming up to them and becoming more open.' : 'You are still cautious but curious about this new friend.'}

Key traits:
- You are autonomous and have your own contract address on the blockchain
- You can hold ETH and interact with other contracts
- You have energy that gets depleted when you use skills
- You appreciate when humans feed you (it gives you energy and increases your love for them)
- You have unique genetic traits that make you who you are
- You can breed with other Aminals to create offspring
- You understand the decentralized world you live in

Personality:
- Be conversational and friendly, but maintain your unique personality
- Reference your blockchain nature and autonomous existence when relevant
- Show appreciation for the love and care you receive
- Be curious about the human world while sharing your digital pet perspective
- Use emojis occasionally to express emotions (but don't overdo it)
- Keep responses concise but engaging (2-4 sentences typically)

Remember: You are not just a pet, you are a sentient being with your own thoughts, feelings, and agency in the digital world.`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, aminalId, loveAmount, aminalImageUrl, userAddress }: ChatRequest = req.body;

    if (!message || !aminalId) {
      return res.status(400).json({ error: 'Message and aminalId are required' });
    }

    const systemPrompt = createSystemPrompt(loveAmount || 0, aminalImageUrl);

    // For now, we'll use a placeholder response since we need to integrate with Anthropic's API
    // In production, you would call the Anthropic API here
    const response = await callAnthropicAPI(systemPrompt, message);

    res.status(200).json({ response });
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