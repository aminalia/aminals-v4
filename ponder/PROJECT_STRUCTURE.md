# Ponder Project Structure

## Directory Layout

```
ponder/
├── .gitignore              # Git ignore rules
├── .env.local              # Local environment variables (not committed)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── ponder.config.ts        # Main Ponder configuration
├── ponder.schema.ts        # Database schema definition
│
├── abis/                   # Contract ABIs (copied from ../out/)
│   ├── AminalFactory.json
│   ├── Aminal.json
│   ├── GeneAuction.json
│   ├── Genes.json
│   └── GeneRegistry.json
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
    ├── TRAIT_ORDER.md
    └── PROJECT_STRUCTURE.md (this file)
```

## File Templates

### `.gitignore`

```gitignore
# Dependencies
node_modules/
.npm-store/

# Ponder internal
.ponder/

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
ponder.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### `.env.local`

```env
# Sepolia RPC URL
# Get free RPC from: https://www.alchemy.com or https://infura.io
PONDER_RPC_URL_11155111=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# OR use public RPC (may be rate limited)
# PONDER_RPC_URL_11155111=https://rpc.sepolia.org

# Database (optional - defaults to PGlite for local dev)
# DATABASE_URL=postgresql://user:password@localhost:5432/ponder

# Ponder settings (optional)
# PONDER_LOG_LEVEL=debug
# PONDER_PORT=42069
```

### `package.json`

```json
{
  "name": "aminals-ponder-indexer",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "ponder dev",
    "start": "ponder start",
    "serve": "ponder serve",
    "codegen": "ponder codegen"
  },
  "dependencies": {
    "@ponder/core": "^0.7.0",
    "viem": "^2.21.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "rootDir": ".",
    "types": ["node"]
  },
  "include": [
    "ponder.config.ts",
    "ponder.schema.ts",
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    ".ponder"
  ]
}
```

## File Responsibilities

### Configuration Files

#### `ponder.config.ts`
- **Purpose**: Main configuration for Ponder
- **Contains**:
  - Network configuration (Sepolia RPC)
  - Contract addresses and ABIs
  - Start blocks
  - Event filters
- **Example**:
```typescript
import { createConfig } from "@ponder/core";
import { http } from "viem";

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_11155111),
    },
  },
  contracts: {
    AminalFactory: {
      network: "sepolia",
      abi: "./abis/AminalFactory.json",
      address: "0xfd69b3285974f11ac0e8490d86a2dc4ee7d2ce9c",
      startBlock: 8828041,
    },
    // ... other contracts
  },
});
```

#### `ponder.schema.ts`
- **Purpose**: Database schema definition
- **Contains**:
  - All table definitions
  - Column types and constraints
  - Relationship definitions
  - Indexes
- **Note**: Already drafted, ready to finalize

### Source Code

#### `src/index.ts`
- **Purpose**: Main event handler registry
- **Contains**:
  - All `ponder.on()` handler registrations
  - Event processing logic
- **Pattern**:
```typescript
import { ponder } from "@/generated";

ponder.on("AminalFactory:AminalSpawned", async ({ event, context }) => {
  // Handler logic
});

ponder.on("Aminal:FeedAminal", async ({ event, context }) => {
  // Handler logic
});

// ... all other handlers
```

#### `src/utils/constants.ts`
- **Purpose**: Shared constants
- **Contains**:
  - Trait index constants (TRAIT_BACK, TRAIT_ARM, etc.)
  - Contract addresses
  - Trait names array
  - Type definitions
- **Example**:
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

export type TraitType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Contract addresses
export const GENES_CONTRACT = "0xb70c1d4ab9e90eb73b7f8972bd3eeb139201cd43" as const;
```

#### `src/utils/helpers.ts`
- **Purpose**: Reusable utility functions
- **Contains**:
  - `getOrCreateUser()` - Create user if doesn't exist
  - `createCompositeId()` - Generate composite IDs
  - `validateTraits()` - Validate trait arrays
  - Any other shared logic
- **Example**:
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

export function createProposalId(
  auctionId: bigint,
  traitType: number,
  geneId: bigint
): `0x${string}` {
  return `${auctionId}-${traitType}-${geneId}` as `0x${string}`;
}
```

#### `src/utils/validation.ts`
- **Purpose**: Data validation functions
- **Contains**:
  - `validateTraits()` - Ensure traits array is valid
  - `validateParentGeneIds()` - Ensure 16 elements
  - Any other validation logic
- **Example**:
```typescript
export function validateTraits(traits: bigint[]): void {
  if (traits.length !== 8) {
    throw new Error(
      `Invalid traits array length: ${traits.length}, expected 8`
    );
  }

  for (let i = 0; i < 8; i++) {
    if (traits[i] < 0n) {
      throw new Error(`Invalid trait at index ${i}: ${traits[i]}`);
    }
  }
}

export function validateParentGeneIds(geneIds: bigint[]): void {
  if (geneIds.length !== 16) {
    throw new Error(
      `Invalid parentGeneIds length: ${geneIds.length}, expected 16`
    );
  }
}
```

### Generated Files (by Ponder)

#### `.ponder/` Directory
- **Purpose**: Ponder's internal working directory
- **Contains**:
  - SQLite database (local dev)
  - Type definitions (generated)
  - Cache files
  - Logs
- **Note**: Should be gitignored, regenerated on startup

#### `generated/` (via import)
- **Purpose**: TypeScript types for Ponder
- **Generated from**: `ponder.schema.ts` and `ponder.config.ts`
- **Imported as**: `@/generated` or `@ponder/generated`
- **Contains**:
  - Database context types
  - Event types
  - Schema types
  - `ponder` registry object

## Development Workflow

### Initial Setup

```bash
cd /workspace/ponder

# Initialize npm (if not done)
npm init

# Install Ponder
npm add @ponder/core viem

# Install dev dependencies
npm add -D @types/node typescript

# Copy ABIs
mkdir -p abis
cp ../out/AminalFactory.sol/AminalFactory.json abis/
cp ../out/Aminal.sol/Aminal.json abis/
cp ../out/GeneAuction.sol/GeneAuction.json abis/
cp ../out/Genes.sol/Genes.json abis/
cp ../out/Genes.sol/GeneRegistry.json abis/

# Create .env.local
echo "PONDER_RPC_URL_11155111=https://rpc.sepolia.org" > .env.local

# Start dev server
npm dev
```

### Daily Development

```bash
# Start Ponder (auto-reload on file changes)
npm dev

# In another terminal: test queries
open http://localhost:42069

# Edit files in src/
# Ponder will hot-reload automatically
```

### Testing

```bash
# Check logs in terminal running `npm dev`

# Query GraphiQL: http://localhost:42069

# Or use curl for specific queries
curl -X POST http://localhost:42069/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{aminals{id}}"}'
```

### Debugging

1. **Check logs**: Terminal running `npm dev` shows all logs
2. **Add console.log**: In any handler
3. **Check database**: Use GraphiQL to query data
4. **Reset state**: Delete `.ponder/` and restart

## Best Practices

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
- ✅ Keep this PROJECT_STRUCTURE.md updated

## Quick Reference

### Commands

```bash
npm dev        # Start development server (hot reload)
npm start      # Start production indexer
npm serve      # Start HTTP server only (no indexing)
npm codegen    # Generate types (usually automatic)
```

### Ports

- `42069` - GraphQL API (default)
- GraphiQL available at: `http://localhost:42069`

### Environment Variables

- `PONDER_RPC_URL_11155111` - Sepolia RPC URL
- `PONDER_PORT` - Change API port (default 42069)
- `PONDER_LOG_LEVEL` - debug | info | warn | error
- `DATABASE_URL` - Postgres connection (optional)

### Important Files

- `ponder.config.ts` - Contract config
- `ponder.schema.ts` - Database schema
- `src/index.ts` - Event handlers
- `src/utils/constants.ts` - Trait constants
- `.env.local` - Environment variables

### Key Concepts

- **Trait Order**: [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
- **Parent Gene IDs**: 16 elements (8 from each parent)
- **Composite IDs**: Use tx hash + log index or meaningful strings
- **Validation**: Always validate array lengths

## Next Steps

1. Review this structure
2. Set up the project (`npm init`, install deps)
3. Create config files
4. Finalize schema
5. Start implementing handlers (Phase 3 of IMPLEMENTATION_GUIDE.md)
