/**
 * Ponder Schema for Aminals Indexer
 *
 * This schema defines the database structure for indexing Aminals contracts.
 *
 * Key Design Decisions:
 * 1. Using hex() for all addresses to match Ethereum conventions
 * 2. Using bigint() for all token amounts and IDs
 * 3. Separating immutable events from mutable state
 * 4. Using arrays for repeated data (traits, parentGeneIds)
 * 5. Explicit relationships using references and relations
 */

import { onchainTable, relations } from "ponder";

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * AminalFactory - The factory contract that spawns individual Aminals
 */
export const factory = onchainTable("factory", (t) => ({
  id: t.hex().primaryKey(), // Factory contract address
  totalAminals: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

/**
 * Aminal - Individual Aminal contracts (each Aminal is its own ERC-721)
 *
 * Breaking change from Graph: traits stored as array instead of 8 separate fields
 * traits array order: [backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId]
 */
export const aminal = onchainTable("aminal", (t) => ({
  id: t.hex().primaryKey(), // Aminal contract address
  contractAddress: t.hex().notNull(), // Same as id, kept for compatibility
  aminalIndex: t.bigint().notNull(), // Index in factory (for sorting)
  factoryId: t.hex().notNull(),

  // Parent relationships (null for genesis Aminals)
  parentOneId: t.hex(),
  parentTwoId: t.hex(),

  // Auction info
  auctionId: t.bigint(), // Gene auction ID that created this child (null for genesis)

  // Visual traits - array of 8 gene NFT IDs
  // Order: [BACK, ARM, TAIL, EARS, BODY, FACE, MOUTH, MISC]
  traits: t.bigint().array().notNull(),

  // State
  energy: t.bigint().notNull(),
  totalLove: t.bigint().notNull(),
  ethBalance: t.bigint().notNull(),

  // Metadata
  tokenURI: t.text(),

  // Creation info
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// Index for common queries
// Note: Ponder will auto-generate these based on schema, but we can hint
// CREATE INDEX aminals_index ON aminals(aminalIndex);
// CREATE INDEX aminals_factory ON aminals(factoryId);

/**
 * User - Ethereum addresses that interact with the system
 */
export const user = onchainTable("user", (t) => ({
  id: t.hex().primaryKey(), // User address
  address: t.hex().notNull(), // Same as id, kept for compatibility

  // Computed fields (derived from relationships)
  // Note: These will be available via GraphQL relations, no need to store
}));

/**
 * Relationship - Love relationship between a User and an Aminal
 * This is a many-to-many join table
 */
export const relationship = onchainTable("relationship", (t) => ({
  id: t.hex().primaryKey(), // user address + aminal address concatenated
  userId: t.hex().notNull(),
  aminalId: t.hex().notNull(),
  love: t.bigint().notNull(),
}));

// Composite index for lookups
// CREATE INDEX relationships_user ON relationships(userId);
// CREATE INDEX relationships_aminal ON relationships(aminalId);

// ============================================================================
// GENE SYSTEM
// ============================================================================

/**
 * GeneNFT - Gene trait NFTs that can be used in breeding
 */
export const geneNFT = onchainTable("geneNFT", (t) => ({
  id: t.hex().primaryKey(), // Genes contract address + token ID
  tokenId: t.bigint().notNull(),
  traitType: t.integer().notNull(), // 0-7 for trait categories

  // Ownership
  ownerId: t.hex().notNull(),
  creatorId: t.hex().notNull(),

  // Metadata
  svg: t.text(),
  name: t.text(),
  description: t.text(),

  // Earnings tracking
  totalEarnings: t.bigint().notNull(),

  // Creation info
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// Index for common queries
// CREATE INDEX gene_nfts_trait_type ON gene_nfts(traitType);
// CREATE INDEX gene_nfts_creator ON gene_nfts(creatorId);
// CREATE INDEX gene_nfts_owner ON gene_nfts(ownerId);

/**
 * AminalGene - Join table tracking which Aminals have which genes
 * This is a many-to-many relationship for efficient querying
 */
export const aminalGene = onchainTable("aminalGene", (t) => ({
  id: t.hex().primaryKey(), // aminal address + gene token ID + trait type
  aminalId: t.hex().notNull(),
  geneNFTId: t.hex().notNull(),
  traitType: t.integer().notNull(), // 0-7 for trait position (BACK, ARM, etc.)
}));

// Composite indexes for lookups
// CREATE INDEX aminal_genes_aminal ON aminal_genes(aminalId);
// CREATE INDEX aminal_genes_gene ON aminal_genes(geneNFTId);
// CREATE INDEX aminal_genes_trait_type ON aminal_genes(traitType);

// ============================================================================
// AUCTION SYSTEM
// ============================================================================

/**
 * GeneAuction - Breeding auctions where users vote on genes
 */
export const geneAuction = onchainTable("geneAuction", (t) => ({
  id: t.hex().primaryKey(), // Composite: "auction" + auction ID
  auctionId: t.bigint().notNull(),

  // Parent Aminals
  aminalOneId: t.hex().notNull(),
  aminalTwoId: t.hex().notNull(),

  // Voting power
  totalLove: t.bigint().notNull(),

  // Cached parent traits for optimization (same as Graph optimization)
  // Array of 16 gene IDs: [parent1: 8 traits, parent2: 8 traits]
  parentGeneIds: t.bigint().array().notNull(),

  // Status
  finished: t.boolean().notNull(),

  // Result (set when auction settles)
  childAminalId: t.hex(),

  // Creation info
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// CREATE INDEX gene_auctions_finished ON gene_auctions(finished);
// CREATE INDEX gene_auctions_parents ON gene_auctions(aminalOneId, aminalTwoId);

/**
 * GeneProposal - Proposed genes for a specific trait slot in an auction
 */
export const geneProposal = onchainTable("geneProposal", (t) => ({
  id: t.hex().primaryKey(), // auction ID + trait type + gene ID
  auctionId: t.hex().notNull(),
  geneNFTId: t.hex().notNull(),
  traitType: t.integer().notNull(), // 0-7
  proposerId: t.hex().notNull(),

  // Voting stats
  loveVotes: t.bigint().notNull(),
  removeVotes: t.bigint().notNull(),
  removed: t.boolean().notNull(),

  // Creation info
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// CREATE INDEX gene_proposals_auction ON gene_proposals(auctionId);
// CREATE INDEX gene_proposals_gene ON gene_proposals(geneNFTId);
// CREATE INDEX gene_proposals_auction_trait ON gene_proposals(auctionId, traitType);

/**
 * GeneVote - Individual vote on a gene proposal
 */
export const geneVote = onchainTable("geneVote", (t) => ({
  id: t.hex().primaryKey(), // transaction hash + log index
  auctionId: t.hex().notNull(),
  proposalId: t.hex().notNull(),
  voterId: t.hex().notNull(),

  // Vote details
  isRemoveVote: t.boolean().notNull(),
  loveAmount: t.bigint().notNull(),

  // Creation info
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// CREATE INDEX gene_votes_auction ON gene_votes(auctionId);
// CREATE INDEX gene_votes_proposal ON gene_votes(proposalId);
// CREATE INDEX gene_votes_voter ON gene_votes(voterId);

/**
 * GeneCreatorPayout - Payments to gene creators from auction settlements
 */
export const geneCreatorPayout = onchainTable("geneCreatorPayout", (t) => ({
  id: t.hex().primaryKey(), // transaction hash + log index
  auctionId: t.hex().notNull(),
  geneNFTId: t.hex().notNull(),
  creatorId: t.hex().notNull(),

  // Payout details
  amount: t.bigint().notNull(),

  // Metadata for dashboard
  auctionIdRaw: t.bigint().notNull(), // The actual auction ID number
  geneIdRaw: t.bigint().notNull(), // The actual gene token ID

  // Creation info
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// CREATE INDEX gene_creator_payouts_auction ON gene_creator_payouts(auctionId);
// CREATE INDEX gene_creator_payouts_gene ON gene_creator_payouts(geneNFTId);
// CREATE INDEX gene_creator_payouts_creator ON gene_creator_payouts(creatorId);

// ============================================================================
// EVENT ENTITIES (Immutable)
// ============================================================================

/**
 * FeedAminalEvent - Record of feeding events
 */
export const feedEvent = onchainTable("feedEvent", (t) => ({
  id: t.hex().primaryKey(), // transaction hash + log index
  aminalId: t.hex().notNull(),
  senderId: t.hex().notNull(),

  // Feed details
  amount: t.bigint().notNull(), // ETH amount
  love: t.bigint().notNull(), // Love gained by sender
  totalLove: t.bigint().notNull(), // Total love for Aminal
  energy: t.bigint().notNull(), // Energy after feeding

  // Event info
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// CREATE INDEX feed_events_aminal ON feed_events(aminalId);
// CREATE INDEX feed_events_sender ON feed_events(senderId);

/**
 * SkillUsed - Record of skill usage events
 */
export const skillUsedEvent = onchainTable("skillUsedEvent", (t) => ({
  id: t.hex().primaryKey(), // transaction hash + log index
  aminalId: t.hex().notNull(),
  callerId: t.hex().notNull(),

  // Skill details
  skillAddress: t.hex().notNull(),
  selector: t.hex().notNull(), // Function selector
  newEnergy: t.bigint().notNull(),

  // Event info
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// CREATE INDEX skill_used_events_aminal ON skill_used_events(aminalId);
// CREATE INDEX skill_used_events_skill ON skill_used_events(skillAddress);

// ============================================================================
// RELATIONS (for GraphQL)
// ============================================================================

/**
 * Define relationships for GraphQL API generation
 * These enable nested queries like: aminal { factory { ... }, feeds { ... } }
 */

export const factoryRelations = relations(factory, ({ many }) => ({
  aminals: many(aminal),
}));

export const aminalRelations = relations(aminal, ({ one, many }) => ({
  factory: one(factory, {
    fields: [aminal.factoryId],
    references: [factory.id],
  }),
  parentOne: one(aminal, {
    fields: [aminal.parentOneId],
    references: [aminal.id],
  }),
  parentTwo: one(aminal, {
    fields: [aminal.parentTwoId],
    references: [aminal.id],
  }),
  childrenAsParentOne: many(aminal, {
    relationName: "parentOneChildren",
  }),
  childrenAsParentTwo: many(aminal, {
    relationName: "parentTwoChildren",
  }),
  lovers: many(relationship),
  feeds: many(feedEvent),
  skillsUsed: many(skillUsedEvent),
  genes: many(aminalGene),
}));

export const userRelations = relations(user, ({ many }) => ({
  lovers: many(relationship),
  genesCreated: many(geneNFT, {
    relationName: "createdGenes",
  }),
  genesOwned: many(geneNFT, {
    relationName: "ownedGenes",
  }),
  geneVotes: many(geneVote),
  proposedGenes: many(geneProposal),
  receivedPayouts: many(geneCreatorPayout),
  feedEvents: many(feedEvent),
  skillEvents: many(skillUsedEvent),
}));

export const relationshipRelations = relations(relationship, ({ one }) => ({
  user: one(user, {
    fields: [relationship.userId],
    references: [user.id],
  }),
  aminal: one(aminal, {
    fields: [relationship.aminalId],
    references: [aminal.id],
  }),
}));

export const geneNFTRelations = relations(geneNFT, ({ one, many }) => ({
  owner: one(user, {
    fields: [geneNFT.ownerId],
    references: [user.id],
    relationName: "ownedGenes",
  }),
  creator: one(user, {
    fields: [geneNFT.creatorId],
    references: [user.id],
    relationName: "createdGenes",
  }),
  proposals: many(geneProposal),
  payouts: many(geneCreatorPayout),
  aminalGenes: many(aminalGene),
}));

export const aminalGeneRelations = relations(aminalGene, ({ one }) => ({
  aminal: one(aminal, {
    fields: [aminalGene.aminalId],
    references: [aminal.id],
  }),
  geneNFT: one(geneNFT, {
    fields: [aminalGene.geneNFTId],
    references: [geneNFT.id],
  }),
}));

export const geneAuctionRelations = relations(geneAuction, ({ one, many }) => ({
  aminalOne: one(aminal, {
    fields: [geneAuction.aminalOneId],
    references: [aminal.id],
    relationName: "auctionAsParentOne",
  }),
  aminalTwo: one(aminal, {
    fields: [geneAuction.aminalTwoId],
    references: [aminal.id],
    relationName: "auctionAsParentTwo",
  }),
  childAminal: one(aminal, {
    fields: [geneAuction.childAminalId],
    references: [aminal.id],
  }),
  proposals: many(geneProposal),
  votes: many(geneVote),
  payouts: many(geneCreatorPayout),
}));

export const geneProposalRelations = relations(
  geneProposal,
  ({ one, many }) => ({
    auction: one(geneAuction, {
      fields: [geneProposal.auctionId],
      references: [geneAuction.id],
    }),
    geneNFT: one(geneNFT, {
      fields: [geneProposal.geneNFTId],
      references: [geneNFT.id],
    }),
    proposer: one(user, {
      fields: [geneProposal.proposerId],
      references: [user.id],
    }),
    votes: many(geneVote),
  })
);

export const geneVoteRelations = relations(geneVote, ({ one }) => ({
  auction: one(geneAuction, {
    fields: [geneVote.auctionId],
    references: [geneAuction.id],
  }),
  proposal: one(geneProposal, {
    fields: [geneVote.proposalId],
    references: [geneProposal.id],
  }),
  voter: one(user, {
    fields: [geneVote.voterId],
    references: [user.id],
  }),
}));

export const geneCreatorPayoutRelations = relations(
  geneCreatorPayout,
  ({ one }) => ({
    auction: one(geneAuction, {
      fields: [geneCreatorPayout.auctionId],
      references: [geneAuction.id],
    }),
    geneNFT: one(geneNFT, {
      fields: [geneCreatorPayout.geneNFTId],
      references: [geneNFT.id],
    }),
    creator: one(user, {
      fields: [geneCreatorPayout.creatorId],
      references: [user.id],
    }),
  })
);

export const feedEventRelations = relations(feedEvent, ({ one }) => ({
  aminal: one(aminal, {
    fields: [feedEvent.aminalId],
    references: [aminal.id],
  }),
  sender: one(user, {
    fields: [feedEvent.senderId],
    references: [user.id],
  }),
}));

export const skillUsedEventRelations = relations(skillUsedEvent, ({ one }) => ({
  aminal: one(aminal, {
    fields: [skillUsedEvent.aminalId],
    references: [aminal.id],
  }),
  caller: one(user, {
    fields: [skillUsedEvent.callerId],
    references: [user.id],
  }),
}));

/**
 * NOTES ON BREAKING CHANGES FROM GRAPH SCHEMA:
 *
 * 1. Aminal.traits is now an array instead of 8 separate fields
 *    - Old: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
 *    - New: traits[0..7]
 *    - Frontend will need to update to use array indexing
 *
 * 2. Table names use snake_case (Postgres convention)
 *    - Old: GeneNFT
 *    - New: gene_nfts
 *    - GraphQL will auto-generate camelCase field names
 *
 * 3. All IDs now use consistent naming
 *    - aminalId instead of just aminal (for references)
 *    - Makes relationships clearer
 *
 * 4. Removed contractAddress field duplication where id is already address
 *    - Kept for backward compatibility in some places
 *
 * 5. Timestamp fields remain as bigint for consistency with blocks
 *    - Could use Ponder's timestamp() type but bigint is fine
 *
 * MIGRATION PATH FOR FRONTEND:
 *
 * 1. Update trait access:
 *    OLD: aminal.backId, aminal.armId, etc.
 *    NEW: aminal.traits[0], aminal.traits[1], etc.
 *
 * 2. Query syntax mostly unchanged, filtering/pagination improved
 *
 * 3. Relationship queries work similarly but with better type safety
 */
