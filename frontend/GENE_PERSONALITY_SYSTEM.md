# Gene-Based Personality System

## Overview

The new personality system generates unique, consistent personalities for each Aminal by analyzing their individual gene traits. Each gene contributes a specific personality trait, and Aminals with the same genes share those traits.

## Key Features

- **Gene-specific traits**: Each gene NFT contributes one personality trait
- **Trait consistency**: Aminals with the same gene always share that trait
- **Compositional personalities**: Full Aminal personality combines all gene traits
- **Efficient caching**: Traits cached per gene, personalities cached per Aminal
- **Automatic updates**: Personalities regenerate when gene composition changes

## Architecture

### Two-Level Caching System

1. **Gene Traits** (`data/gene-traits/`): Individual personality traits per gene
2. **Aminal Personalities** (`data/personalities/`): Combined personalities per Aminal

### Gene Trait Mapping

Each Aminal has up to 8 genes, each contributing a personality trait:

| Gene Type | Trait Type | Example Trait |
|-----------|------------|---------------|
| `backId` (0) | Background trait | "Has a bold and adventurous spirit" |
| `armId` (1) | Arms trait | "Shows gentle and nurturing gestures" |
| `tailId` (2) | Tail trait | "Displays playful and energetic movements" |
| `earsId` (3) | Ears trait | "Listens carefully with keen attention" |
| `bodyId` (4) | Body trait | "Carries themselves with quiet confidence" |
| `faceId` (5) | Face trait | "Expresses emotions openly and honestly" |
| `mouthId` (6) | Mouth trait | "Speaks with thoughtful consideration" |
| `miscId` (7) | Misc trait | "Has a mischievous streak for harmless fun" |

## Implementation

### Gene Trait Generation

```typescript
// For each gene, generate one personality trait
const trait = await generateTraitFromGeneSvg(
  geneId,
  traitType, // 0-7 for different gene categories
  svgContent,
  geneName
);
```

### Personality Composition

```typescript
// Combine all gene traits into full personality
const personality = combineTraitsIntoPersonality({
  back: "Has a bold and adventurous spirit",
  arms: "Shows gentle and nurturing gestures", 
  face: "Expresses emotions openly and honestly",
  // ... other traits
});
// Result: "This Aminal has a bold and adventurous spirit, shows gentle and nurturing gestures, expresses emotions openly and honestly."
```

## Storage Format

### Gene Trait Storage

```json
{
  "geneId": "123",
  "traitType": 5,
  "trait": "Expresses emotions openly and honestly",
  "svgHash": "a1b2c3d4",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Aminal Personality Storage

```json
{
  "aminalAddress": "0x1234...",
  "traits": {
    "back": "Has a bold and adventurous spirit",
    "arms": "Shows gentle and nurturing gestures",
    "face": "Expresses emotions openly and honestly"
  },
  "geneIds": {
    "backId": "123",
    "armId": "456", 
    "faceId": "789"
  },
  "fullPersonality": "This Aminal has a bold and adventurous spirit, shows gentle and nurturing gestures, expresses emotions openly and honestly.",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## API Changes

### Chat Request

```typescript
interface ChatRequest {
  message: string;
  sessionId: string;
  loveAmount: number;
  aminalAddress: string;
  geneIds: {
    backId?: string;
    armId?: string;
    // ... other gene IDs
  };
  aminalStats?: AminalStats;
}
```

### Session Creation

```typescript
interface CreateSessionRequest {
  aminalAddress: string;
  userAddress: string;
  title?: string;
  geneIds: {
    backId?: string;
    armId?: string;
    // ... other gene IDs
  };
}
```

## Benefits

1. **Consistency**: Same genes always produce same traits across all Aminals
2. **Compositionality**: Rich personalities from combining multiple traits
3. **Efficiency**: Traits cached per gene, reused across all Aminals with that gene
4. **Scalability**: Only generates new traits when new genes are encountered
5. **Authenticity**: Personalities directly tied to visual appearance

## Directory Structure

```
data/
├── gene-traits/           # Individual gene personality traits
│   ├── {geneId}.json     # One trait per gene NFT
│   └── ...
├── personalities/         # Complete Aminal personalities  
│   ├── {aminalAddress}.json # Combined personality per Aminal
│   └── ...
└── chat-sessions/         # Chat session data
    └── ...
```

## Clean Architecture

The gene-based system replaces the previous SVG-based approach entirely:
- No backwards compatibility needed
- Clean data structures optimized for gene-trait composition
- Gene traits build up incrementally as new genes are encountered

## Example Flow

1. **User starts chat** with Aminal having genes [123, 456, 789]
2. **Check gene traits**: Look for cached traits for genes 123, 456, 789
3. **Generate missing traits**: If gene 123 has no cached trait, analyze its SVG
4. **Cache gene trait**: Save "Has a bold spirit" for gene 123
5. **Combine traits**: Merge all gene traits into full personality
6. **Cache personality**: Save combined personality for this Aminal
7. **Use in chat**: Apply personality to chat system prompts

## Debug APIs

- View gene trait: `GET /api/personalities/gene/[geneId]` (to be implemented)
- View Aminal personality: `GET /api/personalities/[address]`
- Generate personality: `POST /api/personalities/generate`