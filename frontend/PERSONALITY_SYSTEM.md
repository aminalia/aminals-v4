# Aminal Personality System

## Overview

The personality system generates unique, consistent personalities for each Aminal based on their visual appearance (SVG). Personalities are cached per Aminal and shared across all chat sessions with that Aminal.

## Key Features

- **Aminal-specific**: Each Aminal contract address gets one consistent personality
- **SVG-based**: Personalities are generated from visual analysis of the Aminal's SVG
- **Cached**: Generated once per Aminal and reused across all chats
- **Auto-regeneration**: If an Aminal's SVG changes, personality is regenerated

## Architecture

### Files

- `lib/personality-storage.ts` - Core personality caching system
- `pages/api/personalities/[address].ts` - API to view cached personalities (debug)
- `data/personalities/` - Directory storing personality cache files
- `data/chat-sessions/` - Directory storing chat session files

### Flow

1. **First Chat**: User starts first chat with an Aminal
2. **SVG Analysis**: System extracts SVG from Aminal's tokenURI
3. **AI Generation**: Claude Opus analyzes visual features to generate personality
4. **Caching**: Personality saved to `data/personalities/{address}.json`
5. **Reuse**: All subsequent chats use the cached personality

### Integration

- `pages/api/chat.ts` - Uses `getOrGeneratePersonality()` for chat responses
- `pages/api/chat/sessions.ts` - Uses cached personality when creating sessions
- Frontend passes `aminalAddress` to enable personality lookup

## API Changes

### Chat API Request
```typescript
interface ChatRequest {
  message: string;
  sessionId: string;
  loveAmount: number;
  aminalSvg?: string;
  aminalAddress: string; // NEW: Required for personality lookup
  aminalStats?: AminalStats;
}
```

### Session Creation
```typescript
interface CreateSessionRequest {
  aminalAddress: string;
  userAddress: string;
  title?: string;
  aminalSvg?: string; // Stats removed - not used for personality
}
```

## Storage Format

Each Aminal's personality is stored as:

```json
{
  "aminalAddress": "0x...",
  "personality": "playful and energetic, with a mischievous streak...",
  "svgHash": "a1b2c3d4",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Benefits

1. **Consistency**: Same Aminal always has same personality across users/sessions
2. **Performance**: No repeated AI generation for the same Aminal
3. **Cost**: Reduces API calls to Claude Opus
4. **User Experience**: Aminals feel more authentic and consistent

## Migration

Existing session-specific personalities have been migrated to the new Aminal-specific system:
- Run `node scripts/migrate-personalities.js` to migrate from old sessions
- Original TypeScript migration utility available in `lib/migrate-personalities.ts`
- All data now stored consistently in `data/` directory

## Directory Structure

```
data/
├── chat-sessions/          # Chat session files
│   ├── {sessionId}.json    # Individual chat sessions
│   └── sessions_{user}_{aminal}.json  # Session indices
└── personalities/          # Cached personalities
    └── {aminalAddress}.json # Personality per Aminal
```

## Debug API

View cached personality: `GET /api/personalities/[address]`

Example: `/api/personalities/0x1234...` returns the cached personality for that Aminal.