import fs from 'fs';
import path from 'path';

const PERSONALITIES_DIR = path.join(process.cwd(), 'data', 'personalities');

export interface AminalPersonality {
  aminalAddress: string;
  personality: string;
  svgHash: string; // Hash of the SVG to detect changes
  createdAt: Date;
  updatedAt: Date;
}

// Ensure the personalities directory exists
export function ensurePersonalitiesDir() {
  if (!fs.existsSync(PERSONALITIES_DIR)) {
    fs.mkdirSync(PERSONALITIES_DIR, { recursive: true });
  }
}

// Get personality file path for an Aminal
function getPersonalityFilePath(aminalAddress: string): string {
  return path.join(PERSONALITIES_DIR, `${aminalAddress.toLowerCase()}.json`);
}

// Create a simple hash of SVG content
function hashSvg(svgContent: string): string {
  let hash = 0;
  for (let i = 0; i < svgContent.length; i++) {
    const char = svgContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

// Get cached personality for an Aminal
export async function getCachedPersonality(aminalAddress: string): Promise<AminalPersonality | null> {
  try {
    ensurePersonalitiesDir();
    const filePath = getPersonalityFilePath(aminalAddress);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch (error) {
    console.error('Error reading cached personality:', error);
    return null;
  }
}

// Save personality for an Aminal
export async function savePersonality(
  aminalAddress: string,
  personality: string,
  svgContent: string
): Promise<AminalPersonality> {
  try {
    ensurePersonalitiesDir();
    const filePath = getPersonalityFilePath(aminalAddress);
    const svgHash = hashSvg(svgContent);
    const now = new Date();
    
    // Check if personality already exists
    let existingPersonality: AminalPersonality | null = null;
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        existingPersonality = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        };
      } catch (error) {
        console.error('Error reading existing personality:', error);
      }
    }
    
    const personalityData: AminalPersonality = {
      aminalAddress: aminalAddress.toLowerCase(),
      personality,
      svgHash,
      createdAt: existingPersonality?.createdAt || now,
      updatedAt: now,
    };

    fs.writeFileSync(filePath, JSON.stringify(personalityData, null, 2), 'utf-8');
    
    console.log('💾 Saved personality for Aminal:', aminalAddress);
    return personalityData;
  } catch (error) {
    console.error('Error saving personality:', error);
    throw error;
  }
}

// Get or generate personality for an Aminal
export async function getOrGeneratePersonality(
  aminalAddress: string,
  svgContent: string
): Promise<string> {
  try {
    // Check if we have a cached personality
    const cached = await getCachedPersonality(aminalAddress);
    
    if (cached) {
      const currentSvgHash = hashSvg(svgContent);
      
      // If SVG hasn't changed, return cached personality
      if (cached.svgHash === currentSvgHash) {
        console.log('✨ Using cached personality for Aminal:', aminalAddress);
        return cached.personality;
      }
      
      console.log('🔄 SVG changed for Aminal, regenerating personality:', aminalAddress);
    }
    
    // Generate new personality
    console.log('🎭 Generating new personality for Aminal:', aminalAddress);
    const personality = await generatePersonalityFromSvg(svgContent);
    
    // Save the new personality
    await savePersonality(aminalAddress, personality, svgContent);
    
    return personality;
  } catch (error) {
    console.error('Error getting/generating personality:', error);
    throw error;
  }
}

// Generate personality from SVG (moved from chat.ts)
async function generatePersonalityFromSvg(svgData: string): Promise<string> {
  console.log('🎭 Generating personality from SVG:', { hasSvg: !!svgData, svgLength: svgData?.length });

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

  console.log('🎭 Generated personality:', personality);
  return personality;
}