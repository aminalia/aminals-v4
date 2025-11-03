/**
 * Ponder Event Handlers for Aminals Indexer
 *
 * This file contains all event handlers for indexing Aminals contracts
 * Organized by contract: Factory, Aminal, GeneRegistry, Genes, GeneAuction
 */

import { ponder } from "ponder:registry";
import type { Address, Hex } from "viem";
import {
  aminal,
  aminalGene,
  designProposal,
  designVote,
  factory,
  feedEvent,
  geneAuction,
  geneCreatorPayout,
  geneNFT,
  relationship,
  skillUsedEvent,
  user,
} from "../ponder.schema";
import {
  makeAminalGeneId,
  makeAuctionId,
  makeDesignId,
  makeEventId,
  makeGeneNFTId,
  makeRelationshipId,
  normalizeAddress,
  normalizeGeneArray,
} from "./utils/helpers";
import {
  assertValidParentGeneIds,
  assertValidGeneArray,
} from "./utils/validation";

// ============================================================================
// FACTORY EVENTS
// ============================================================================

/**
 * Handle AminalFactory:AminalSpawned
 * Creates new Aminal entity when factory spawns an Aminal
 */
ponder.on("AminalFactory:AminalSpawned", async ({ event, context }) => {
  const { child, parentOne, parentTwo, auctionId, geneIds } = event.args;
  const { db, client } = context;

  // Validate gene array (1-10 genes)
  assertValidGeneArray(geneIds, "AminalSpawned");

  const factoryId = normalizeAddress(event.log.address);

  // Create or load factory
  await db
    .insert(factory)
    .values({
      id: factoryId,
      totalAminals: 0n,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    })
    .onConflictDoNothing();

  // Get current total to use as index
  const factoryRecord = await db.find(factory, { id: factoryId });
  const aminalIndex = factoryRecord?.totalAminals ?? 0n;

  // Increment factory total
  await db
    .update(factory, { id: factoryId })
    .set((row) => ({ totalAminals: row.totalAminals + 1n }));

  // Check if parents are zero addresses (genesis Aminal)
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const hasParentOne = parentOne.toLowerCase() !== zeroAddress;
  const hasParentTwo = parentTwo.toLowerCase() !== zeroAddress;

  // Fetch tokenURI from the Aminal contract
  let tokenURI: string | null = null;
  try {
    // Try to fetch tokenURI (Aminals use token ID 1)
    const result = await client.readContract({
      address: child,
      abi: [
        {
          type: "function",
          name: "tokenURI",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "string" }],
          stateMutability: "view",
        },
      ],
      functionName: "tokenURI",
      args: [1n],
    });
    tokenURI = result as string;
  } catch (error) {
    // TokenURI fetch failed, which is fine for new Aminals
    console.log(`TokenURI not available yet for ${child}`);
  }

  const aminalId = normalizeAddress(child);
  const genesArray = normalizeGeneArray(geneIds);

  // Create Aminal entity
  await db.insert(aminal).values({
    id: aminalId,
    contractAddress: aminalId,
    aminalIndex,
    factoryId,
    parentOneId: hasParentOne ? normalizeAddress(parentOne) : null,
    parentTwoId: hasParentTwo ? normalizeAddress(parentTwo) : null,
    auctionId: auctionId > 0n ? auctionId : null,
    genes: genesArray,
    energy: 0n,
    totalLove: 0n,
    ethBalance: 0n,
    tokenURI,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  // Create AminalGene join table entries for each gene slot
  // genes array: 10 elements (0-9 slot indices)
  for (let slotIndex = 0; slotIndex < genesArray.length; slotIndex++) {
    const geneTokenId = genesArray[slotIndex];

    // Skip if gene is 0 or undefined (no gene for this slot)
    if (!geneTokenId || geneTokenId === 0n) continue;

    await db.insert(aminalGene).values({
      id: makeAminalGeneId(child, geneTokenId, slotIndex),
      aminalId,
      geneNFTId: makeGeneNFTId(geneTokenId),
      slotIndex,
    });
  }
});

// ============================================================================
// AMINAL EVENTS (Dynamic contracts)
// ============================================================================

/**
 * Handle Aminal:FeedAminal
 * Updates Aminal state and creates feed event
 */
ponder.on("Aminal:FeedAminal", async ({ event, context }) => {
  const { sender, loveGained, love, totalLove, energyGained, energy } =
    event.args;
  const { db } = context;

  const aminalId = normalizeAddress(event.log.address);
  const senderId = normalizeAddress(sender);

  // Ensure user exists
  await db
    .insert(user)
    .values({
      id: senderId,
      address: senderId,
    })
    .onConflictDoNothing();

  // Update Aminal state
  await db.update(aminal, { id: aminalId }).set({
    energy: energy,
    totalLove: totalLove,
    ethBalance: event.transaction.value,
  });

  // Create or update relationship (user's love for this Aminal)
  const relationshipId = makeRelationshipId(sender, event.log.address);

  await db
    .insert(relationship)
    .values({
      id: relationshipId,
      userId: senderId,
      aminalId,
      love: loveGained,
    })
    .onConflictDoUpdate((row) => ({
      userId: row.userId,
      aminalId: row.aminalId,
      love: row.love + loveGained,
    }));

  // Create feed event
  await db.insert(feedEvent).values({
    id: makeEventId(event.transaction.hash, event.log.logIndex),
    aminalId,
    senderId,
    amount: event.transaction.value,
    love: loveGained,
    totalLove: totalLove,
    energy: energy,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
});

/**
 * Handle Aminal:SkillUsed
 * Creates skill usage event
 */
ponder.on("Aminal:SkillUsed", async ({ event, context }) => {
  const { user: userAddress, cost, target, selector } = event.args;
  const { db } = context;

  const aminalId = normalizeAddress(event.log.address);
  const callerId = normalizeAddress(userAddress);

  // Ensure user exists
  await db
    .insert(user)
    .values({
      id: callerId,
      address: callerId,
    })
    .onConflictDoNothing();

  // Get current energy and subtract cost
  const aminalRecord = await db.find(aminal, { id: aminalId });

  const newEnergy = (aminalRecord?.energy ?? 0n) - cost;
  const finalEnergy = newEnergy < 0n ? 0n : newEnergy;

  // Update Aminal energy
  await db.update(aminal, { id: aminalId }).set({
    energy: finalEnergy,
  });

  // Create skill used event
  await db.insert(skillUsedEvent).values({
    id: makeEventId(event.transaction.hash, event.log.logIndex),
    aminalId,
    callerId,
    skillAddress: normalizeAddress(target),
    selector: selector as Hex,
    newEnergy: finalEnergy,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
});

/**
 * Handle Aminal:EnergyLost
 * Updates Aminal energy when lost through other means
 */
ponder.on("Aminal:EnergyLost", async ({ event, context }) => {
  const { user, amount, remainingEnergy } = event.args;
  const { db } = context;

  const aminalId = normalizeAddress(event.log.address);

  // Update Aminal energy
  await db.update(aminal, { id: aminalId }).set({
    energy: remainingEnergy,
  });
});

// ============================================================================
// GENE REGISTRY EVENTS
// ============================================================================

/**
 * Handle GeneRegistry:GeneCreated
 * Creates new GeneNFT entity when gene is registered
 */
ponder.on("GeneRegistry:GeneCreated", async ({ event, context }) => {
  const { geneId, creator, svg } = event.args;
  const { db, client, contracts } = context;

  const creatorId = normalizeAddress(creator);

  // Ensure creator user exists
  await db
    .insert(user)
    .values({
      id: creatorId,
      address: creatorId,
    })
    .onConflictDoNothing();

  // Note: Name and description are generated in the tokenURI and not stored separately
  // So we'll just use simple defaults
  const name: string = `Gene #${geneId}`;
  const description: string = "An Aminal gene trait";

  // Create GeneNFT entity
  // No more category or placement metadata - those are per-Aminal now
  await db.insert(geneNFT).values({
    id: makeGeneNFTId(geneId),
    tokenId: geneId,
    ownerId: creatorId, // Creator is initial owner
    creatorId,
    svg,
    name,
    description,
    totalEarnings: 0n,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
});

// ============================================================================
// GENES (ERC-721) EVENTS
// ============================================================================

/**
 * Handle Genes:Transfer
 * Updates GeneNFT owner when transferred
 * Handles both mints (from zero address) and regular transfers
 */
ponder.on("Genes:Transfer", async ({ event, context }) => {
  const { from, to, tokenId } = event.args;
  const { db } = context;

  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const isMint = from.toLowerCase() === zeroAddress;

  // For mints, the GeneCreated event handles creation, so we skip
  if (isMint) {
    return;
  }

  // Regular transfer - update owner
  const newOwnerId = normalizeAddress(to);

  // Ensure new owner exists
  await db
    .insert(user)
    .values({
      id: newOwnerId,
      address: newOwnerId,
    })
    .onConflictDoNothing();

  // Update GeneNFT owner
  await db.update(geneNFT, { id: makeGeneNFTId(tokenId) }).set({
    ownerId: newOwnerId,
  });
});

// ============================================================================
// GENE AUCTION EVENTS
// ============================================================================

/**
 * Handle GeneAuction:VotingCreated
 * Creates new auction entity and caches parent traits for optimization
 */
ponder.on("GeneAuction:VotingCreated", async ({ event, context }) => {
  const { auctionId, aminalOne, aminalTwo, totalLove } = event.args;
  const { db, client, contracts } = context;

  // Resolve Aminal indices to addresses using factory contract
  const factoryAddress = contracts.AminalFactory.address as Address;

  let aminalOneAddress: Address;
  let aminalTwoAddress: Address;

  try {
    aminalOneAddress = (await client.readContract({
      address: factoryAddress,
      abi: [
        {
          type: "function",
          name: "getAminalByIndex",
          inputs: [{ name: "index", type: "uint256" }],
          outputs: [{ name: "aminalAddress", type: "address" }],
          stateMutability: "view",
        },
      ],
      functionName: "getAminalByIndex",
      args: [aminalOne],
    })) as Address;

    aminalTwoAddress = (await client.readContract({
      address: factoryAddress,
      abi: [
        {
          type: "function",
          name: "getAminalByIndex",
          inputs: [{ name: "index", type: "uint256" }],
          outputs: [{ name: "aminalAddress", type: "address" }],
          stateMutability: "view",
        },
      ],
      functionName: "getAminalByIndex",
      args: [aminalTwo],
    })) as Address;
  } catch (error) {
    console.error(
      `❌ Failed to resolve Aminal addresses for auction ${auctionId}:`,
      error
    );
    return;
  }

  const aminalOneId = normalizeAddress(aminalOneAddress);
  const aminalTwoId = normalizeAddress(aminalTwoAddress);

  // Load parent Aminals to get their traits
  const aminal1 = await db.find(aminal, { id: aminalOneId });
  const aminal2 = await db.find(aminal, { id: aminalTwoId });

  if (!aminal1 || !aminal2) {
    console.error(`❌ Parent Aminals not found for auction ${auctionId}`);
    console.error(`   Looking for: ${aminalOneId}, ${aminalTwoId}`);
    console.error(`   Found aminal1: ${!!aminal1}, aminal2: ${!!aminal2}`);
    return;
  }

  // Cache parent gene IDs for optimization
  // Array of 20: [parent1: up to 10 genes, parent2: up to 10 genes]
  const parentGeneIds = [
    ...aminal1.genes, // Parent 1: indices 0-9
    ...aminal2.genes, // Parent 2: indices 10-19
  ];

  assertValidParentGeneIds(parentGeneIds, "VotingCreated");

  const auctionIdFormatted = makeAuctionId(auctionId);

  // Create auction entity
  try {
    await db.insert(geneAuction).values({
      id: auctionIdFormatted,
      auctionId,
      aminalOneId,
      aminalTwoId,
      totalLove,
      parentGeneIds,
      finished: false,
      childAminalId: null,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    });
    console.log(`   ✅ Auction ${auctionId} created successfully!`);
  } catch (error) {
    console.error(`❌ Failed to create auction ${auctionId}:`, error);
    throw error;
  }
});

/**
 * Handle GeneAuction:VotingSettled
 * Marks auction as finished
 */
ponder.on("GeneAuction:VotingSettled", async ({ event, context }) => {
  const { auctionId, winningGeneIds } = event.args;
  const { db } = context;

  // Update auction as finished
  await db.update(geneAuction, { id: makeAuctionId(auctionId) }).set({
    finished: true,
  });
});

// ============================================================================
// DESIGN PROPOSAL/VOTING HANDLERS
// ============================================================================

/**
 * Handle GeneAuction:DesignProposed
 * Creates design proposal entity for a complete Aminal design (1-10 genes with placements)
 */
ponder.on("GeneAuction:DesignProposed", async ({ event, context }) => {
  const { auctionId, designId, proposer, geneIds, placements } = event.args;
  const { db } = context;

  const proposerId = normalizeAddress(proposer);

  // Ensure proposer exists
  await db
    .insert(user)
    .values({
      id: proposerId,
      address: proposerId,
    })
    .onConflictDoNothing();

  // Create design proposal
  // Note: placements is a struct array, serialize to JSON for storage
  await db.insert(designProposal).values({
    id: makeDesignId(auctionId, designId),
    auctionId: makeAuctionId(auctionId),
    designIndex: Number(designId),
    proposerId,
    geneIds: normalizeGeneArray(geneIds),
    placements: JSON.stringify(placements), // Serialize placement metadata
    votes: 0n,
    removeVotes: 0n,
    removed: false,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
});

/**
 * Handle GeneAuction:DesignVoteCast
 * Records vote on a complete Aminal design
 */
ponder.on("GeneAuction:DesignVoteCast", async ({ event, context }) => {
  const { auctionId, designId, voter, userVotingPower } = event.args;
  const { db } = context;

  const voterId = normalizeAddress(voter);

  // Ensure voter exists
  await db
    .insert(user)
    .values({
      id: voterId,
      address: voterId,
    })
    .onConflictDoNothing();

  const proposalId = makeDesignId(auctionId, designId);
  const voteId = makeEventId(event.transaction.hash, event.log.logIndex);

  // Create vote record
  await db.insert(designVote).values({
    id: voteId,
    auctionId: makeAuctionId(auctionId),
    proposalId,
    voterId,
    isRemoveVote: false,
    votingPower: userVotingPower,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  // Update design vote count
  await db.update(designProposal, { id: proposalId }).set((row) => ({
    votes: row.votes + userVotingPower,
  }));
});

/**
 * Handle GeneAuction:DesignRemovalVote
 * Records vote to remove a design from consideration
 */
ponder.on("GeneAuction:DesignRemovalVote", async ({ event, context }) => {
  const { auctionId, designId, voter, voteWeight } = event.args;
  const { db } = context;

  const voterId = normalizeAddress(voter);

  // Ensure voter exists
  await db
    .insert(user)
    .values({
      id: voterId,
      address: voterId,
    })
    .onConflictDoNothing();

  const proposalId = makeDesignId(auctionId, designId);
  const voteId = makeEventId(event.transaction.hash, event.log.logIndex);

  // Create removal vote record
  await db.insert(designVote).values({
    id: voteId,
    auctionId: makeAuctionId(auctionId),
    proposalId,
    voterId,
    isRemoveVote: true,
    votingPower: voteWeight,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  // Update design removal vote count
  await db.update(designProposal, { id: proposalId }).set((row) => ({
    removeVotes: row.removeVotes + voteWeight,
  }));
});

/**
 * Handle GeneAuction:DesignRemoved
 * Marks design as removed from auction
 */
ponder.on("GeneAuction:DesignRemoved", async ({ event, context }) => {
  const { auctionId, designId } = event.args;
  const { db } = context;

  const proposalId = makeDesignId(auctionId, designId);

  // Mark design as removed
  await db.update(designProposal, { id: proposalId }).set({
    removed: true,
  });
});

/**
 * Handle GeneAuction:GeneCreatorPayout
 * Records payout to gene creator and updates gene earnings
 */
ponder.on("GeneAuction:GeneCreatorPayout", async ({ event, context }) => {
  const { auctionId, geneId, creator, amount } = event.args;
  const { db } = context;

  const creatorId = normalizeAddress(creator);

  // Ensure creator exists
  await db
    .insert(user)
    .values({
      id: creatorId,
      address: creatorId,
    })
    .onConflictDoNothing();

  // Create payout entity
  await db.insert(geneCreatorPayout).values({
    id: makeEventId(event.transaction.hash, event.log.logIndex),
    auctionId: makeAuctionId(auctionId),
    geneNFTId: makeGeneNFTId(geneId),
    creatorId,
    amount,
    auctionIdRaw: auctionId,
    geneIdRaw: geneId,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  // Update gene NFT total earnings
  await db.update(geneNFT, { id: makeGeneNFTId(geneId) }).set((row) => ({
    totalEarnings: row.totalEarnings + amount,
  }));
});
