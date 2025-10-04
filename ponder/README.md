# Aminals Ponder Indexer

High-performance blockchain indexer for the Aminals protocol using [Ponder.sh](https://ponder.sh).

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

## 📁 Project Structure

### Directory Layout

```
ponder/
├── .gitignore              # Git ignore rules
├── .env.local              # Local environment variables (not committed)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── ponder.config.ts        # Main Ponder configuration
├── ponder.schema.ts        # Database schema definition
│
├── src/                    # Source code
│   ├── index.ts           # Main event handlers
│   │
│   └── utils/             # Utility functions
│       ├── constants.ts   # Contract addresses, trait constants
│       ├── helpers.ts     # Shared helper functions
│       └── validation.ts  # Validation functions
│
├── .ponder/               # Ponder internal (generated, gitignored)
│   ├── sqlite/           # Local database
│   └── cache/            # Event cache
│
└── docs/                  # Documentation (planning phase)
    ├── ARCHITECTURE.md
    ├── IMPLEMENTATION_GUIDE.md
    ├── SCHEMA_COMPARISON.md
    └── TRAIT_ORDER.md
```

### File Responsibilities

#### Configuration Files

**`ponder.config.ts`** - Main configuration for Ponder
- Network configuration (Sepolia RPC)
- Contract addresses and ABIs
- Start blocks and event filters

**`ponder.schema.ts`** - Database schema definition
- All table definitions
- Column types and constraints
- Relationship definitions and indexes

#### Source Code

**`src/index.ts`** - Main event handler registry
```typescript
import { ponder } from "@/generated";

ponder.on("AminalFactory:AminalSpawned", async ({ event, context }) => {
  // Handler logic
});

ponder.on("Aminal:FeedAminal", async ({ event, context }) => {
  // Handler logic
});
```

**`src/utils/constants.ts`** - Shared constants
```typescript
// Trait indices - CRITICAL ORDER
export const TRAIT_BACK = 0;
export const TRAIT_ARM = 1;
export const TRAIT_TAIL = 2;
export const TRAIT_EARS = 3;
export const TRAIT_BODY = 4;
export const TRAIT_FACE = 5;
export const TRAIT_MOUTH = 6;
export const TRAIT_MISC = 7;

export const TRAIT_NAMES = [
  "BACK", "ARM", "TAIL", "EARS",
  "BODY", "FACE", "MOUTH", "MISC"
] as const;
```

**`src/utils/helpers.ts`** - Reusable utility functions
```typescript
import type { Context } from "@/generated";

export async function getOrCreateUser(
  context: Context,
  address: `0x${string}`
) {
  let user = await context.db.users.findUnique({ id: address });
  if (!user) {
    user = await context.db.users.create({
      id: address,
      data: { address },
    });
  }
  return user;
}
```

**`src/utils/validation.ts`** - Data validation functions
```typescript
export function validateTraits(traits: bigint[]): void {
  if (traits.length !== 8) {
    throw new Error(
      `Invalid traits array length: ${traits.length}, expected 8`
    );
  }
}
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
npm dev        # Start development server (hot reload)
npm start      # Start production indexer
npm serve      # Start HTTP server only (no indexing)
npm codegen    # Generate types (usually automatic)
```

### Environment Variables

- `PONDER_RPC_URL_11155111` - Sepolia RPC URL
- `PONDER_PORT` - Change API port (default 42069)
- `PONDER_LOG_LEVEL` - debug | info | warn | error
- `DATABASE_URL` - Postgres connection (optional)

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

### Key Concepts
- **Trait Order**: [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
- **Parent Gene IDs**: 16 elements (8 from each parent)
- **Composite IDs**: Use tx hash + log index or meaningful strings
- **Validation**: Always validate array lengths

## 🏆 Best Practices

### Code Organization
- ✅ Keep handlers in `src/index.ts` (or split by contract if it gets large)
- ✅ Extract reusable logic to `src/utils/helpers.ts`
- ✅ Keep constants in one place (`src/utils/constants.ts`)
- ✅ Add JSDoc comments to all exported functions
- ✅ Use TypeScript strict mode

### Error Handling
- ✅ Check if entities exist before accessing
- ✅ Validate array lengths (traits, parentGeneIds)
- ✅ Log errors with context (event name, tx hash)
- ✅ Don't throw unless critical - log and skip bad data

### Performance
- ✅ Use cached data (parentGeneIds) to avoid extra queries
- ✅ Batch database operations when possible
- ✅ Add indexes for frequently queried fields
- ✅ Avoid loading unnecessary relationships

### Documentation
- ✅ Document trait order wherever traits are used
- ✅ Add comments explaining complex logic
- ✅ Reference Solidity event signatures in handlers

## 🐛 Debugging

1. **Check logs**: Terminal running `npm dev` shows all logs
2. **Add console.log**: In any handler
3. **Check database**: Use GraphiQL to query data
4. **Reset state**: Delete `.ponder/` and restart

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

## 📚 Quick Reference

### Ports
- `42069` - GraphQL API (default)
- GraphiQL available at: `http://localhost:42069`

### Important Files
- `ponder.config.ts` - Contract config
- `ponder.schema.ts` - Database schema
- `src/index.ts` - Event handlers
- `src/utils/constants.ts` - Trait constants
- `.env.local` - Environment variables

### Generated Files (by Ponder)
- `.ponder/` - SQLite database, cache, logs (gitignored)
- `@/generated` - TypeScript types from schema and config

## 🔗 Resources

- [Ponder Documentation](https://ponder.sh/docs)
- [Aminals Contracts](../src/)
- [Current Graph Indexer](../graph/)
- [Frontend](../frontend/)

## 📝 License

Same as parent Aminals project.