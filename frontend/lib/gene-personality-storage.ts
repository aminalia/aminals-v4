import fs from 'fs';
import path from 'path';

const GENE_TRAITS_DIR = path.join(process.cwd(), 'data', 'gene-traits');
const AMINAL_PERSONALITIES_DIR = path.join(process.cwd(), 'data', 'personalities');

export interface GeneTrait {
  geneId: string;
  traitType: number; // 0=back, 1=arms, 2=tail, 3=ears, 4=body, 5=face, 6=mouth, 7=misc
  trait: string; // One sentence personality trait
  svgHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AminalPersonality {
  aminalAddress: string;
  traits: {
    back?: string;    // backId trait
    arms?: string;    // armId trait  
    tail?: string;    // tailId trait
    ears?: string;    // earsId trait
    body?: string;    // bodyId trait
    face?: string;    // faceId trait
    mouth?: string;   // mouthId trait
    misc?: string;    // miscId trait
  };
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
  fullPersonality: string; // Combined personality from all traits
  createdAt: Date;
  updatedAt: Date;
}

// Trait type mappings
const TRAIT_TYPE_NAMES: Record<number, keyof AminalPersonality['traits']> = {
  0: 'back',
  1: 'arms', 
  2: 'tail',
  3: 'ears',
  4: 'body',
  5: 'face',
  6: 'mouth',
  7: 'misc'
};

const GENE_ID_NAMES: Record<number, keyof AminalPersonality['geneIds']> = {
  0: 'backId',
  1: 'armId',
  2: 'tailId', 
  3: 'earsId',
  4: 'bodyId',
  5: 'faceId',
  6: 'mouthId',
  7: 'miscId'
};

// Ensure directories exist
export function ensureDirectories() {
  if (!fs.existsSync(GENE_TRAITS_DIR)) {
    fs.mkdirSync(GENE_TRAITS_DIR, { recursive: true });
  }
  if (!fs.existsSync(AMINAL_PERSONALITIES_DIR)) {
    fs.mkdirSync(AMINAL_PERSONALITIES_DIR, { recursive: true });
  }
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

// Get gene trait file path
function getGeneTraitFilePath(geneId: string): string {
  return path.join(GENE_TRAITS_DIR, `${geneId}.json`);
}

// Get Aminal personality file path
function getAminalPersonalityFilePath(aminalAddress: string): string {
  return path.join(AMINAL_PERSONALITIES_DIR, `${aminalAddress.toLowerCase()}.json`);
}

// Get cached gene trait
export async function getCachedGeneTrait(geneId: string): Promise<GeneTrait | null> {
  try {
    ensureDirectories();
    const filePath = getGeneTraitFilePath(geneId);
    
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
    console.error('Error reading cached gene trait:', error);
    return null;
  }
}

// Save gene trait
export async function saveGeneTrait(
  geneId: string,
  traitType: number,
  trait: string,
  svgContent: string
): Promise<GeneTrait> {
  try {
    ensureDirectories();
    const filePath = getGeneTraitFilePath(geneId);
    const svgHash = hashSvg(svgContent);
    const now = new Date();
    
    // Check if trait already exists
    let existingTrait: GeneTrait | null = null;
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        existingTrait = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        };
      } catch (error) {
        console.error('Error reading existing gene trait:', error);
      }
    }
    
    const traitData: GeneTrait = {
      geneId,
      traitType,
      trait,
      svgHash,
      createdAt: existingTrait?.createdAt || now,
      updatedAt: now,
    };

    fs.writeFileSync(filePath, JSON.stringify(traitData, null, 2), 'utf-8');
    
    console.log('💾 Saved gene trait for gene:', geneId);
    return traitData;
  } catch (error) {
    console.error('Error saving gene trait:', error);
    throw error;
  }
}

// Generate trait from gene SVG
async function generateTraitFromGeneSvg(
  geneId: string,
  traitType: number,
  svgContent: string,
  geneName?: string
): Promise<string> {
  console.log('🎭 Generating trait for gene:', { geneId, traitType, geneName });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  const traitTypeName = TRAIT_TYPE_NAMES[traitType] || 'unknown';
  
  const traitPrompt = `You are analyzing a gene NFT that represents a specific visual trait for Aminals (digital pet NFTs).

This gene represents the "${traitTypeName}" trait${geneName ? ` called "${geneName}"` : ''}.

Gene SVG:
${svgContent}

Based on this visual element, generate a single sentence personality trait that this gene would contribute to an Aminal. The trait should:
- Be specific to what this visual element suggests about personality
- Be one sentence only
- Focus on behavioral or personality characteristics
- Be consistent - any Aminal with this exact gene should have this same trait

Examples:
- "Has a bold and adventurous spirit that seeks out new challenges"
- "Displays a gentle and nurturing nature towards others"
- "Shows a mischievous tendency to play harmless pranks"

Respond with just the personality trait sentence, no preamble.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: traitPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const trait = data.content[0].text.trim();

  console.log('🎭 Generated trait:', trait);
  return trait;
}

// Get or generate gene trait
export async function getOrGenerateGeneTrait(
  geneId: string,
  traitType: number,
  svgContent: string,
  geneName?: string
): Promise<string> {
  try {
    // Check if we have a cached trait
    const cached = await getCachedGeneTrait(geneId);
    
    if (cached) {
      const currentSvgHash = hashSvg(svgContent);
      
      // If SVG hasn't changed, return cached trait
      if (cached.svgHash === currentSvgHash) {
        console.log('✨ Using cached trait for gene:', geneId);
        return cached.trait;
      }
      
      console.log('🔄 SVG changed for gene, regenerating trait:', geneId);
    }
    
    // Generate new trait
    console.log('🎭 Generating new trait for gene:', geneId);
    const trait = await generateTraitFromGeneSvg(geneId, traitType, svgContent, geneName);
    
    // Save the new trait
    await saveGeneTrait(geneId, traitType, trait, svgContent);
    
    return trait;
  } catch (error) {
    console.error('Error getting/generating gene trait:', error);
    throw error;
  }
}

// Get cached Aminal personality
export async function getCachedAminalPersonality(aminalAddress: string): Promise<AminalPersonality | null> {
  try {
    ensureDirectories();
    const filePath = getAminalPersonalityFilePath(aminalAddress);
    
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
    console.error('Error reading cached Aminal personality:', error);
    return null;
  }
}

// Save Aminal personality
export async function saveAminalPersonality(
  aminalAddress: string,
  traits: AminalPersonality['traits'],
  geneIds: AminalPersonality['geneIds'],
  fullPersonality: string
): Promise<AminalPersonality> {
  try {
    ensureDirectories();
    const filePath = getAminalPersonalityFilePath(aminalAddress);
    const now = new Date();
    
    // Check if personality already exists
    let existingPersonality: AminalPersonality | null = null;
    if (fs.existsSync(filePath)) {
      try {
        existingPersonality = await getCachedAminalPersonality(aminalAddress);
      } catch (error) {
        console.error('Error reading existing Aminal personality:', error);
      }
    }
    
    const personalityData: AminalPersonality = {
      aminalAddress: aminalAddress.toLowerCase(),
      traits,
      geneIds,
      fullPersonality,
      createdAt: existingPersonality?.createdAt || now,
      updatedAt: now,
    };

    fs.writeFileSync(filePath, JSON.stringify(personalityData, null, 2), 'utf-8');
    
    console.log('💾 Saved Aminal personality for:', aminalAddress);
    return personalityData;
  } catch (error) {
    console.error('Error saving Aminal personality:', error);
    throw error;
  }
}

// Combine individual traits into full personality
function combineTraitsIntoPersonality(traits: AminalPersonality['traits']): string {
  const traitList = Object.values(traits).filter(Boolean);
  
  if (traitList.length === 0) {
    return 'mysterious and enigmatic, holding secrets of the digital realm';
  }
  
  if (traitList.length === 1) {
    return traitList[0];
  }
  
  // Combine multiple traits into a coherent personality description
  const intro = "This Aminal";
  const combined = traitList.join(', ');
  return `${intro} ${combined.toLowerCase()}.`;
}

// Get or generate full Aminal personality from genes
export async function getOrGenerateAminalPersonality(
  aminalAddress: string,
  geneData: Array<{
    geneId: string;
    traitType: number;
    svg: string;
    name?: string;
  }>
): Promise<string> {
  try {
    // Check if we have a cached personality and if gene composition is the same
    const cached = await getCachedAminalPersonality(aminalAddress);
    
    // Create current gene IDs mapping
    const currentGeneIds: AminalPersonality['geneIds'] = {};
    geneData.forEach(gene => {
      const idName = GENE_ID_NAMES[gene.traitType];
      if (idName) {
        currentGeneIds[idName] = gene.geneId;
      }
    });
    
    // Check if cached personality matches current genes
    if (cached) {
      const geneIdsMatch = Object.keys(currentGeneIds).every(key => 
        cached.geneIds[key as keyof AminalPersonality['geneIds']] === 
        currentGeneIds[key as keyof AminalPersonality['geneIds']]
      );
      
      if (geneIdsMatch) {
        console.log('✨ Using cached Aminal personality for:', aminalAddress);
        return cached.fullPersonality;
      }
      
      console.log('🔄 Gene composition changed for Aminal, regenerating personality:', aminalAddress);
    }
    
    console.log('🎭 Generating new Aminal personality for:', aminalAddress);
    
    // Generate or get traits for each gene
    const traits: AminalPersonality['traits'] = {};
    
    for (const gene of geneData) {
      const trait = await getOrGenerateGeneTrait(
        gene.geneId,
        gene.traitType,
        gene.svg,
        gene.name
      );
      
      const traitName = TRAIT_TYPE_NAMES[gene.traitType];
      if (traitName) {
        traits[traitName] = trait;
      }
    }
    
    // Combine traits into full personality
    const fullPersonality = combineTraitsIntoPersonality(traits);
    
    // Save the personality
    await saveAminalPersonality(aminalAddress, traits, currentGeneIds, fullPersonality);
    
    return fullPersonality;
  } catch (error) {
    console.error('Error getting/generating Aminal personality:', error);
    throw error;
  }
}