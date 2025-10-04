# Ready to Start Implementation! 🚀

## Current Status

✅ **Planning Phase Complete**
✅ **Ponder Project Initialized** (via `create ponder`)
✅ **Documentation Complete** (8 comprehensive documents)
✅ **Dependencies Installed** (npm, not pnpm)
✅ **Project Structure Ready**

## What's Already Done

### Project Files (via create ponder)
- ✅ `package.json` - Configured with npm scripts
- ✅ `ponder.config.ts` - Template ready to configure
- ✅ `ponder.schema.ts` - Template ready to replace
- ✅ `src/index.ts` - Handler registry ready
- ✅ `src/api/index.ts` - GraphQL/SQL API configured
- ✅ `.env.local` - Template ready for RPC URL
- ✅ `.gitignore` - Configured
- ✅ `tsconfig.json` - TypeScript ready
- ✅ `node_modules/` - Dependencies installed

### Documentation (8 files)
1. ✅ `README.md` - Project overview
2. ✅ `ARCHITECTURE.md` - Design decisions
3. ✅ `TRAIT_ORDER.md` - **CRITICAL** trait spec
4. ✅ `IMPLEMENTATION_GUIDE.md` - Step-by-step guide (updated!)
5. ✅ `PROJECT_STRUCTURE.md` - File organization
6. ✅ `SCHEMA_COMPARISON.md` - Migration from Graph
7. ✅ `CHECKLIST.md` - Implementation tracker
8. ✅ `ponder.schema.ts.draft` - Complete schema ready to use

### All Docs Updated
- ✅ Changed `pnpm` → `npm` throughout
- ✅ Updated Phase 1 to reflect current state
- ✅ Updated Phase 2 with file locations

## What We Need to Do (7 Phases)

### Phase 1: Project Setup ⚙️ (~20 min)

**Current State**: ✅ Most setup done via `create ponder`

**Remaining Tasks**:
1. Copy 5 ABIs from `/workspace/out/` to `/workspace/ponder/abis/`
2. Update `ponder.config.ts` with Sepolia network + 5 contracts
3. Add Sepolia RPC URL to `.env.local`
4. Delete `ExampleContractAbi.ts` (example file)
5. Test: `npm run dev`

**ABIs to Copy**:

NOTE: just reference the abis from the `..out` folder directly.

**Config to Write**:
- Network: Sepolia (11155111)
- Start Block: 8828041
- 5 contracts with addresses from `graph/subgraph.yaml`

---

### Phase 2: Schema 📋 (~15 min)

**Tasks**:
1. Replace `ponder.schema.ts` with `ponder.schema.ts.draft` contents
2. Create `src/utils/constants.ts` (trait constants)
3. Create `src/utils/helpers.ts` (helper functions)
4. Create `src/utils/validation.ts` (validators)
5. Test: `npm run dev` - verify schema compiles

---

### Phase 3: Core Entities 🏭 (~1 hour)

**Event Handlers to Implement**:
1. `AminalFactory:AminalSpawned` - Create Aminal entities
2. `Aminal:FeedAminal` - Track feeding
3. `Aminal:SkillUsed` - Track skills
4. `Aminal:EnergyLost` - Update energy

**Key Challenge**: Dynamic Aminal contract tracking

---

### Phase 4: Gene System 🧬 (~30 min)

**Event Handlers to Implement**:
1. `GeneRegistry:GeneCreated` - New genes
2. `Genes:Transfer` - Track ownership

**Key Challenge**: Handle mints vs transfers correctly

---

### Phase 5: Auction System 🎪 (~2 hours)

**Event Handlers to Implement**:
1. `VotingCreated` - Create auction + cache parent traits
2. `GeneProposed` - Create proposals
3. `GeneVoteCast` - Individual votes
4. `GeneRemovalVote` - Removal votes
5. `GeneRemoved` - Mark removed
6. `BulkVoteCast` - **CRITICAL** bulk voting with cached traits
7. `VotingSettled` - Settle auction
8. `GeneCreatorPayout` - Track payouts

**Key Challenge**: Bulk vote optimization using `parentGeneIds` cache

---

### Phase 6: Testing ✅ (~1 hour)

**Tasks**:
1. Compare entity counts with Graph indexer
2. Spot-check data accuracy
3. Test all GraphQL queries
4. Performance testing (bulk votes)
5. Edge case testing

---

### Phase 7: Frontend Migration 🖥️ (~1 hour)

**Tasks**:
1. Update GraphQL endpoint
2. Update trait access (8 fields → array)
3. Regenerate types
4. Test all pages

---

## Quick Start Commands

### Start Development
```bash
cd /workspace/ponder
npm run dev
```

### Test GraphQL API
```bash
# Open GraphiQL
open http://localhost:42069

# Or curl
curl -X POST http://localhost:42069/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{factories{id}}"}'
```

### Reset Database
```bash
rm -rf .ponder/
npm run dev
```

## Critical Reminders

### 1. Trait Order (NEVER CHANGE!)
```typescript
// Index: 0=BACK, 1=ARM, 2=TAIL, 3=EARS, 4=BODY, 5=FACE, 6=MOUTH, 7=MISC
const traits = [
  geneIds[0], // BACK
  geneIds[1], // ARM
  geneIds[2], // TAIL
  geneIds[3], // EARS
  geneIds[4], // BODY
  geneIds[5], // FACE
  geneIds[6], // MOUTH
  geneIds[7], // MISC
];
```

### 2. Parent Gene IDs Cache
```typescript
// Must be 16 elements: parent1 (0-7) + parent2 (8-15)
auction.parentGeneIds = [
  aminalOne.traits[0], aminalOne.traits[1], ..., aminalOne.traits[7],  // Parent 1
  aminalTwo.traits[0], aminalTwo.traits[1], ..., aminalTwo.traits[7],  // Parent 2
];
```

### 3. Bulk Vote Optimization
```typescript
// Use cached traits to check if gene is from parent
const parent1TraitId = auction.parentGeneIds[i];      // i = 0-7
const parent2TraitId = auction.parentGeneIds[i + 8];  // i+8 = 8-15
```

## Contract Addresses (Sepolia)

```typescript
const CONTRACTS = {
  AminalFactory: "0xfd69b3285974f11ac0e8490d86a2dc4ee7d2ce9c",
  GeneAuction: "0x96bd719eb8d32a1210e4e2eb77b5ce6ff157325d",
  Genes: "0xb70c1d4ab9e90eb73b7f8972bd3eeb139201cd43",
  GeneRegistry: "0x2706cf8e08f6cbfd8a0fc32637d0289ab6ed2ca4",
};

const START_BLOCK = 8828041;
const NETWORK = "sepolia"; // Chain ID: 11155111
```

## Documentation to Reference During Implementation

### Primary References
1. **IMPLEMENTATION_GUIDE.md** - Follow phase by phase
2. **TRAIT_ORDER.md** - When working with traits
3. **CHECKLIST.md** - Track your progress

### Secondary References
4. **ARCHITECTURE.md** - Understanding design decisions
5. **SCHEMA_COMPARISON.md** - Understanding schema changes
6. **PROJECT_STRUCTURE.md** - File organization questions

### Quick Lookup
7. **README.md** - Quick overview and examples
8. **ponder.schema.ts.draft** - Complete schema ready to use

## Success Criteria

### Phase Completion
- [ ] Phase 1: `npm run dev` starts, connects to Sepolia
- [ ] Phase 2: Schema compiles, types generated
- [ ] Phase 3: Aminals indexed with correct traits
- [ ] Phase 4: Genes and ownership tracked
- [ ] Phase 5: Complete auction lifecycle works
- [ ] Phase 6: All data matches Graph indexer
- [ ] Phase 7: Frontend fully functional

### Final Validation
- [ ] All 14 event types handled
- [ ] Entity counts match Graph ±1
- [ ] Traits in correct order
- [ ] Bulk votes performant
- [ ] All queries return correct data
- [ ] Frontend renders correctly
- [ ] No errors in logs

## Timeline

**Estimated Total**: ~6 hours for clean implementation

**Target**: Complete today with high-quality, maintainable code

## Let's Go! 🚀

When ready to begin:

1. Review this document
2. Review TRAIT_ORDER.md (critical!)
3. Start with Phase 1 in IMPLEMENTATION_GUIDE.md
4. Use CHECKLIST.md to track progress
5. Reference other docs as needed

**Ready when you are!** 💪
