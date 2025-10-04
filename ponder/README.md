# Aminals Ponder Indexer

High-performance blockchain indexer for the Aminals protocol using [Ponder.sh](https://ponder.sh).

## 🎯 Project Status

**Planning Phase Complete** ✅

All architecture and design documents are ready. Ready to begin implementation.

## 📚 Documentation

### Planning Documents (Read in Order)

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture overview and design decisions
2. **[TRAIT_ORDER.md](./TRAIT_ORDER.md)** - **CRITICAL**: Trait array order specification
3. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step implementation plan
4. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - File structure and templates
5. **[SCHEMA_COMPARISON.md](./SCHEMA_COMPARISON.md)** - Migration guide from The Graph

### Quick Reference

- **Contract Addresses**: See IMPLEMENTATION_GUIDE.md
- **Trait Order**: `[BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]` (indices 0-7)
- **Network**: Sepolia testnet (Chain ID: 11155111)
- **Start Block**: 8828041

## 🚀 Implementation Plan

### Phase 1: Setup ⚙️ (30 min)
- Initialize Ponder project
- Configure contracts and network
- Test connection to Sepolia

### Phase 2: Schema 📋 (15 min)
- Finalize `ponder.schema.ts`
- Generate types
- Verify compilation

### Phase 3: Core Entities 🏭 (1 hour)
- AminalFactory (spawning)
- Aminal events (feed, skill, energy)
- User relationships

### Phase 4: Gene System 🧬 (30 min)
- Gene NFT creation
- Gene NFT transfers
- Ownership tracking

### Phase 5: Auction System 🎪 (2 hours)
- Auction creation
- Gene proposals
- Voting (simple + bulk)
- Settlement and payouts

### Phase 6: Testing ✅ (1 hour)
- Compare with Graph indexer
- Validate all queries
- Performance testing

### Phase 7: Frontend Migration 🖥️ (1 hour)
- Update GraphQL endpoint
- Update trait access pattern
- Regenerate types
- Test all pages

**Total Estimated Time**: ~6.5 hours

## 🔑 Key Design Decisions

### 1. Trait Array (Breaking Change)

**OLD (The Graph)**:
```typescript
{
  backId: "123",
  armId: "456",
  tailId: "789",
  // ... 8 separate fields
}
```

**NEW (Ponder)**:
```typescript
{
  traits: ["123", "456", "789", ...] // Array of 8 gene IDs
}
```

**Rationale**: More maintainable, type-safe, and flexible for future changes.

### 2. Performance Optimizations

- ✅ Cached `parentGeneIds` in auctions (eliminates 2 entity loads per bulk vote)
- ✅ Explicit database indexes on common query patterns
- ✅ Separated immutable events from mutable state

### 3. No Backwards Compatibility

- Forward-only migration
- Clean, modern codebase
- Full TypeScript type safety
- Breaking changes are acceptable (documented)

### 4. Local Development First

- Run locally against Sepolia RPC
- Use PGlite for fast local database
- Deploy to production later

## 🏗️ Architecture

### Contracts Indexed

| Contract | Address | Events |
|----------|---------|--------|
| AminalFactory | `0xfd69...e9c` | AminalSpawned |
| Aminal (dynamic) | Multiple | FeedAminal, SkillUsed, EnergyLost |
| GeneAuction | `0x96bd...25d` | 8 events (voting lifecycle) |
| Genes | `0xb70c...d43` | Transfer |
| GeneRegistry | `0x2706...ca4` | GeneCreated |

### Entity Model

```
┌─────────────┐
│   Factory   │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐       ┌─────────┐
│   Aminal    │◄─────►│  User   │
└──────┬──────┘  N:M  └────┬────┘
       │              Relationship
       │                   │
       │ N:1          N:1  │
       │                   │
┌──────▼──────┐       ┌────▼────┐
│ GeneAuction │◄─────►│ GeneNFT │
└──────┬──────┘  N:M  └─────────┘
       │         via
       │        Proposal
       │
   ┌───┴───┐
   │ Vote  │
   └───────┘
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm 8+
- Sepolia RPC URL

### Setup

```bash
cd /workspace/ponder

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Sepolia RPC URL

# Start development server
npm dev

# Open GraphiQL
open http://localhost:42069
```

### Commands

```bash
npm dev      # Start dev server (hot reload)
npm start    # Start production indexer
npm serve    # Serve HTTP API only
npm codegen  # Generate types (auto in dev)
```

## 📊 Schema Overview

### Core Entities
- `factories` - AminalFactory contracts
- `aminals` - Individual Aminals (each is its own ERC-721)
- `users` - Ethereum addresses
- `relationships` - User ↔ Aminal love relationships

### Gene System
- `gene_nfts` - Gene trait NFTs
- `gene_auctions` - Breeding auctions
- `gene_proposals` - Proposed genes for trait slots
- `gene_votes` - Individual votes on proposals
- `gene_creator_payouts` - Payouts to gene creators

### Events
- `feed_events` - Feeding records
- `skill_used_events` - Skill usage records

## 🔍 Example Queries

### Get Aminal with traits

```graphql
query {
  aminal(id: "0x...") {
    aminalIndex
    traits # [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
    energy
    totalLove
    parentOne {
      aminalIndex
    }
    parentTwo {
      aminalIndex
    }
  }
}
```

### Get active auctions

```graphql
query {
  geneAuctions(where: { finished: false }) {
    auctionId
    aminalOne {
      aminalIndex
      traits
    }
    aminalTwo {
      aminalIndex
      traits
    }
    proposals {
      geneNFT {
        tokenId
        svg
      }
      loveVotes
      removed
    }
  }
}
```

### Get user's genes

```graphql
query {
  user(id: "0x...") {
    genesCreated {
      tokenId
      svg
      totalEarnings
    }
    genesOwned {
      tokenId
      traitType
    }
  }
}
```

## ⚠️ Critical Notes

### Trait Order
**The order of the traits array is CRITICAL and must never change.**

Index | Trait | Description
------|-------|------------
0 | BACK | Background/back layer
1 | ARM | Arms
2 | TAIL | Tail
3 | EARS | Ears
4 | BODY | Body
5 | FACE | Face
6 | MOUTH | Mouth
7 | MISC | Miscellaneous/accessories

Always use constants:
```typescript
import { TRAIT_BACK, TRAIT_ARM, ... } from "./utils/constants";

const backGeneId = aminal.traits[TRAIT_BACK];
```

See [TRAIT_ORDER.md](./TRAIT_ORDER.md) for full specification.

### Performance Optimization
The `parentGeneIds` field in auctions caches parent traits to avoid loading Aminal entities during bulk vote processing. This is critical for performance with 100+ vote events.

## 🧪 Testing Checklist

- [ ] All 14 event types indexed correctly
- [ ] Entity counts match Graph indexer
- [ ] Trait arrays populated in correct order
- [ ] Parent relationships work
- [ ] Auction voting works (especially bulk votes)
- [ ] Gene ownership tracked correctly
- [ ] Payouts calculated and totaled
- [ ] All GraphQL queries return expected data
- [ ] Frontend loads and displays correctly

## 📦 Deployment (Future)

When ready for production:

1. Set up production Postgres database
2. Configure production RPC (Alchemy/Infura)
3. Deploy indexer (Railway, Fly.io, or VPS)
4. Wait for full sync
5. Update frontend environment variables
6. Deploy frontend
7. Monitor logs and performance

## 🤝 Contributing

### Code Standards

- ✅ Use TypeScript strict mode
- ✅ Use constants for magic numbers
- ✅ Document trait order in all relevant files
- ✅ Validate array lengths (traits, parentGeneIds)
- ✅ Add JSDoc comments to exported functions
- ✅ Handle errors gracefully (log and skip vs throw)

### Before Committing

- [ ] Code compiles without errors
- [ ] All handlers tested with real data
- [ ] Queries return expected results
- [ ] Documentation updated if needed
- [ ] No console.logs left in code (or use proper logger)

## 📝 License

Same as parent Aminals project.

## 🔗 Resources

- [Ponder Documentation](https://ponder.sh/docs)
- [Aminals Contracts](../src/)
- [Current Graph Indexer](../graph/)
- [Frontend](../frontend/)

---

**Ready to implement?** Start with [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) Phase 1.

**Questions?** Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design rationale.

**Need help?** Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for file templates.
