# Chat Feature Documentation

## Overview

The Aminals chat feature enables users to have persistent, intelligent conversations with their digital pets using Claude Opus. Each Aminal has its own personality derived from visual traits and maintains context across multiple chat sessions.

## Current Implementation Status ✅

### Completed Features

#### 1. **Persistent Chat Sessions**
- ✅ Session-based chat architecture with unique IDs
- ✅ File-based storage system (`.chat-data/` directory)
- ✅ Multiple conversations per Aminal per user
- ✅ Full message history persistence with timestamps

#### 2. **URL Structure & Routing**
- ✅ Nested routing: `/aminals/{contractAddress}/chat`
- ✅ Individual sessions: `/aminals/{contractAddress}/chat/{chatId}`
- ✅ Chat button integration on Aminal detail pages

#### 3. **API Architecture**
```typescript
✅ POST /api/chat/sessions      // Create new chat session
✅ GET  /api/chat/sessions      // List user's sessions for an Aminal  
✅ GET  /api/chat/sessions/[id] // Get individual session
✅ POST /api/chat               // Send message to session
```

#### 4. **UI Components**
- ✅ **Chat Sessions List** (`/pages/aminals/[id]/chat/index.tsx`)
  - Session overview with metadata (title, message count, last updated)
  - "Start New Conversation" button
  - Time-based sorting (most recent first)
  
- ✅ **Individual Chat** (`/pages/aminals/[id]/chat/[chatId].tsx`)
  - WhatsApp/iMessage-style message bubbles
  - Real-time message updates (5-second polling)
  - Optimistic UI for instant message display
  - Auto-scroll to bottom functionality

#### 5. **Claude Opus Integration**
- ✅ **System Prompt Template** with dynamic personality generation
- ✅ **Love Relationship Context** (4 tiers: just met → deeply bonded)
- ✅ **Conversation History** (last 10 messages sent for context)
- ✅ **Blockchain-Aware Personality** (references autonomous nature, energy, skills)
- ✅ **Fallback Responses** when API key not configured

#### 6. **Data Management**
- ✅ **TypeScript Interfaces** for type safety
- ✅ **Storage Layer** (`/lib/chat-storage.ts`) with CRUD operations
- ✅ **Query Optimization** with React Query caching
- ✅ **Error Handling** with toast notifications

## Technical Architecture

### File Structure
```
frontend/
├── pages/
│   ├── aminals/[id]/
│   │   └── chat/
│   │       ├── index.tsx          # Chat sessions list
│   │       └── [chatId].tsx       # Individual chat session
│   └── api/
│       └── chat/
│           ├── sessions.ts        # Session CRUD
│           ├── sessions/[id].ts   # Individual session fetch
│           └── chat.ts            # Message handling
├── lib/
│   └── chat-storage.ts            # Storage abstraction layer
└── .chat-data/                    # Session persistence (gitignored)
```

### Data Models
```typescript
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'aminal';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  aminalAddress: string;
  userAddress: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
```

### System Prompt Features
- **Personality Generation**: Based on visual traits (7 personality archetypes)
- **Relationship Tiers**: 
  - `0-5 love`: "just met" (cautious but curious)
  - `5-20 love`: "getting to know each other" (warming up)
  - `20-50 love`: "close friends" (open and trusting)
  - `50+ love`: "deeply bonded" (shares thoughts openly)
- **Context Awareness**: Aminal knows its energy, skills, breeding capability, blockchain nature

## What's Next 🚀

### Phase 2: Enhanced Features

#### 1. **Database Migration** 🔄
- [ ] Replace file storage with PostgreSQL/MongoDB
- [ ] Add database schema migrations
- [ ] Implement connection pooling
- [ ] Add database indexes for query optimization

#### 2. **Advanced Chat Features** 💬
- [ ] **Message Reactions**: Like/love messages from Aminals
- [ ] **Message Search**: Full-text search across chat history
- [ ] **Session Titles**: Auto-generate or user-editable session names
- [ ] **Message Timestamps**: Relative time display (2h ago, yesterday, etc.)
- [ ] **Read Receipts**: Show when Aminal has "seen" messages

#### 3. **Personality System** 🎭
- [ ] **Visual Analysis**: Use AI to analyze Aminal images for personality traits
- [ ] **Personality Evolution**: Aminal personality changes based on interactions
- [ ] **Memory System**: Aminals remember specific conversations and events
- [ ] **Mood System**: Aminal mood affected by energy, recent feeding, etc.

#### 4. **Social Features** 👥
- [ ] **Shared Conversations**: Allow multiple users to chat with same Aminal
- [ ] **Chat Exports**: Download conversation history
- [ ] **Public Chats**: Showcase interesting conversations
- [ ] **Chat Statistics**: Track conversation frequency, favorite topics

#### 5. **Integration Features** 🔗
- [ ] **Action Integration**: Aminals can suggest feeding, breeding, skill usage
- [ ] **Blockchain Events**: Aminals react to on-chain events (new skills, breeding, etc.)
- [ ] **Cross-Aminal Chats**: Aminals can reference other Aminals they know
- [ ] **Skill Integration**: Aminals can use their skills during conversations

### Phase 3: Advanced Intelligence

#### 1. **Enhanced AI Capabilities** 🧠
- [ ] **Long-term Memory**: Vector database for conversation embeddings
- [ ] **Emotion Recognition**: Detect user sentiment and respond appropriately
- [ ] **Context Switching**: Handle multiple conversation topics gracefully
- [ ] **Proactive Messaging**: Aminals initiate conversations based on events

#### 2. **Multimedia Support** 📸
- [ ] **Image Sharing**: Users can send images to Aminals
- [ ] **Voice Messages**: Audio message support
- [ ] **Aminal Selfies**: Generate images of Aminals in different situations
- [ ] **GIF Reactions**: Animated responses from Aminals

#### 3. **Gamification** 🎮
- [ ] **Conversation Streaks**: Reward daily chats
- [ ] **Chat Achievements**: Unlock special responses through conversation
- [ ] **Personality Unlocks**: Discover new personality traits through deep conversations
- [ ] **Chat Levels**: Aminals become more articulate with more conversation

### Phase 4: Platform Features

#### 1. **Analytics & Insights** 📊
- [ ] **Chat Analytics**: Track conversation patterns, popular topics
- [ ] **User Engagement**: Measure chat frequency, session length
- [ ] **Personality Metrics**: Track personality trait development
- [ ] **Performance Monitoring**: API response times, error rates

#### 2. **Moderation & Safety** 🛡️
- [ ] **Content Filtering**: Block inappropriate messages
- [ ] **Rate Limiting**: Prevent API abuse
- [ ] **User Reporting**: Report problematic conversations
- [ ] **Auto-moderation**: AI-powered content screening

#### 3. **Monetization** 💰
- [ ] **Premium Features**: Enhanced personalities, longer context
- [ ] **Chat Boosts**: Priority message processing
- [ ] **Personality Packs**: Unlock special personality traits
- [ ] **Extended History**: Longer conversation retention

## Technical Considerations

### Performance
- **Caching Strategy**: Implement Redis for session caching
- **Message Pagination**: Load messages in chunks for long conversations  
- **WebSocket Integration**: Real-time message delivery
- **CDN Integration**: Cache static assets and reduce API calls

### Security
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent spam and abuse
- **Authentication**: Verify wallet signatures for message sending
- **Data Encryption**: Encrypt sensitive conversation data

### Scalability
- **Horizontal Scaling**: Design for multiple server instances
- **Database Sharding**: Partition data by user or Aminal address
- **Queue System**: Handle high-volume message processing
- **Monitoring**: Comprehensive logging and alerting

## Environment Setup

### Development
```bash
# Required environment variables
ANTHROPIC_API_KEY=sk-ant-... # Claude Opus API key

# Optional (future)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### Production Considerations
- Set up proper database with backups
- Configure CDN for asset delivery
- Implement proper logging and monitoring
- Set up rate limiting and DDoS protection

## Known Limitations

1. **File Storage**: Current file-based storage not suitable for production scale
2. **No Real-time Updates**: Uses polling instead of WebSockets
3. **Limited Context**: Only last 10 messages sent to Claude for context
4. **No Message Editing**: Messages cannot be edited or deleted
5. **Single User Per Session**: No multi-user chat support yet

## Testing Strategy

### Unit Tests (TODO)
- [ ] Storage layer functions
- [ ] API endpoint logic
- [ ] Message validation
- [ ] Personality generation

### Integration Tests (TODO)
- [ ] Full chat flow (create session → send message → receive response)
- [ ] Database operations
- [ ] API rate limiting
- [ ] Error handling scenarios

### E2E Tests (TODO)
- [ ] Complete user journey
- [ ] Multi-session management
- [ ] Mobile responsiveness
- [ ] Error state handling

---

## Conclusion

The chat feature provides a solid foundation for human-Aminal interaction with persistent conversations, intelligent responses, and an elegant UX. The modular architecture enables easy extension with advanced features while maintaining performance and user experience quality.

The next major milestone is migrating to a proper database system and implementing real-time messaging for a more dynamic chat experience.