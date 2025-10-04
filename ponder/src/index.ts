/**
 * Ponder Event Handlers for Aminals Indexer
 *
 * This file contains all event handlers for indexing Aminals contracts
 * Organized by contract: Factory, Aminal, GeneRegistry, Genes, GeneAuction
 */

import { ponder } from "ponder:registry";
import type { Address, Hex } from "viem";
import {
  factory,
  aminal,
  user,
  relationship,
  geneNFT,
  geneAuction,
  geneProposal,
  geneVote,
  geneCreatorPayout,
  feedEvent,
  skillUsedEvent,
} from "../ponder.schema";
import {
  makeEventId,
  makeRelationshipId,
  normalizeAddress,
  normalizeTraitArray,
  makeGeneNFTId,
  makeAuctionId,
  makeProposalId,
} from "./utils/helpers";
import { assertValidTraitArray, assertValidParentGeneIds } from "./utils/validation";
import { CONTRACTS } from "./utils/constants";

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

  // Validate trait array
  assertValidTraitArray(geneIds, "AminalSpawned");

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

  // Create Aminal entity
  await db.insert(aminal).values({
    id: normalizeAddress(child),
    contractAddress: normalizeAddress(child),
    aminalIndex,
    factoryId,
    parentOneId: hasParentOne ? normalizeAddress(parentOne) : null,
    parentTwoId: hasParentTwo ? normalizeAddress(parentTwo) : null,
    auctionId: auctionId > 0n ? auctionId : null,
    traits: normalizeTraitArray(geneIds),
    energy: 0n,
    totalLove: 0n,
    ethBalance: 0n,
    tokenURI,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
});

// ============================================================================
// AMINAL EVENTS (Dynamic contracts)
// ============================================================================

/**
 * Handle Aminal:FeedAminal
 * Updates Aminal state and creates feed event
 */
ponder.on("Aminal:FeedAminal", async ({ event, context }) => {
  const { sender, loveGained, love, totalLove, energyGained, energy } = event.args;
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
  await db
    .update(aminal, { id: aminalId })
    .set({
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
  const { sender, energyCost, skillAddress, selector } = event.args;
  const { db } = context;

  const aminalId = normalizeAddress(event.log.address);
  const callerId = normalizeAddress(sender);

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

  const newEnergy = (aminalRecord?.energy ?? 0n) - energyCost;
  const finalEnergy = newEnergy < 0n ? 0n : newEnergy;

  // Update Aminal energy
  await db
    .update(aminal, { id: aminalId })
    .set({
      energy: finalEnergy,
    });

  // Create skill used event
  await db.insert(skillUsedEvent).values({
    id: makeEventId(event.transaction.hash, event.log.logIndex),
    aminalId,
    callerId,
    skillAddress: normalizeAddress(skillAddress),
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
  const { owner, energyLost, newEnergy } = event.args;
  const { db } = context;

  const aminalId = normalizeAddress(event.log.address);

  // Update Aminal energy
  await db
    .update(aminal, { id: aminalId })
    .set({
      energy: newEnergy,
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
  const { tokenId, creator, traitType, svg } = event.args;
  const { db, client } = context;

  const creatorId = normalizeAddress(creator);

  // Ensure creator user exists
  await db
    .insert(user)
    .values({
      id: creatorId,
      address: creatorId,
    })
    .onConflictDoNothing();

  // Fetch additional metadata from Genes contract
  let name: string | null = null;
  let description: string | null = null;

  try {
    // Fetch gene info from Genes contract
    const geneInfo = await client.readContract({
      address: CONTRACTS.Genes as Address,
      abi: [
        {
          type: "function",
          name: "getGeneInfo",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [
            { name: "name", type: "string" },
            { name: "description", type: "string" },
            { name: "svg", type: "string" },
            { name: "traitType", type: "uint8" },
          ],
          stateMutability: "view",
        },
      ],
      functionName: "getGeneInfo",
      args: [tokenId],
    });

    const [geneName, geneDesc] = geneInfo as [string, string, string, number];
    name = geneName;
    description = geneDesc;
  } catch (error) {
    console.log(`Could not fetch gene metadata for token ${tokenId}`);
  }

  // Create GeneNFT entity
  await db.insert(geneNFT).values({
    id: makeGeneNFTId(tokenId),
    tokenId,
    traitType: Number(traitType),
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
  await db
    .update(geneNFT, { id: makeGeneNFTId(tokenId) })
    .set({
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
  const { db, client } = context;

  // Resolve Aminal indices to addresses using factory contract
  const factoryAddress = CONTRACTS.AminalFactory as Address;

  let aminalOneAddress: Address;
  let aminalTwoAddress: Address;

  try {
    aminalOneAddress = (await client.readContract({
      address: factoryAddress,
      abi: [
        {
          type: "function",
          name: "aminalByIndex",
          inputs: [{ name: "index", type: "uint256" }],
          outputs: [{ name: "", type: "address" }],
          stateMutability: "view",
        },
      ],
      functionName: "aminalByIndex",
      args: [aminalOne],
    })) as Address;

    aminalTwoAddress = (await client.readContract({
      address: factoryAddress,
      abi: [
        {
          type: "function",
          name: "aminalByIndex",
          inputs: [{ name: "index", type: "uint256" }],
          outputs: [{ name: "", type: "address" }],
          stateMutability: "view",
        },
      ],
      functionName: "aminalByIndex",
      args: [aminalTwo],
    })) as Address;
  } catch (error) {
    console.error(`Failed to resolve Aminal addresses for auction ${auctionId}:`, error);
    return;
  }

  const aminalOneId = normalizeAddress(aminalOneAddress);
  const aminalTwoId = normalizeAddress(aminalTwoAddress);

  // Load parent Aminals to get their traits
  const aminal1 = await db.find(aminal, { id: aminalOneId });
  const aminal2 = await db.find(aminal, { id: aminalTwoId });

  if (!aminal1 || !aminal2) {
    console.error(`Parent Aminals not found for auction ${auctionId}`);
    return;
  }

  // Cache parent gene IDs for bulk vote optimization
  // Array of 16: [parent1: 8 traits, parent2: 8 traits]
  const parentGeneIds = [
    ...aminal1.traits, // Parent 1: indices 0-7
    ...aminal2.traits, // Parent 2: indices 8-15
  ];

  assertValidParentGeneIds(parentGeneIds, "VotingCreated");

  // Create auction entity
  await db.insert(geneAuction).values({
    id: makeAuctionId(auctionId),
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
});

/**
 * Handle GeneAuction:VotingSettled
 * Marks auction as finished
 */
ponder.on("GeneAuction:VotingSettled", async ({ event, context }) => {
  const { auctionId, winningGeneIds, childIndex } = event.args;
  const { db } = context;

  // Update auction as finished
  await db
    .update(geneAuction, { id: makeAuctionId(auctionId) })
    .set({
      finished: true,
    });
});

/**
 * Handle GeneAuction:GeneProposed
 * Creates proposal entity for a gene in an auction
 */
ponder.on("GeneAuction:GeneProposed", async ({ event, context }) => {
  const { auctionId, category, geneId, proposer } = event.args;
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

  // Create proposal
  await db.insert(geneProposal).values({
    id: makeProposalId(auctionId, Number(category), geneId),
    auctionId: makeAuctionId(auctionId),
    geneNFTId: makeGeneNFTId(geneId),
    traitType: Number(category),
    proposerId,
    loveVotes: 0n,
    removeVotes: 0n,
    removed: false,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
});

/**
 * Handle GeneAuction:GeneVoteCast
 * Records individual vote on a gene proposal
 */
ponder.on("GeneAuction:GeneVoteCast", async ({ event, context }) => {
  const { auctionId, category, geneId, voter, voteWeight } = event.args;
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

  const proposalId = makeProposalId(auctionId, Number(category), geneId);
  const voteId = makeEventId(event.transaction.hash, event.log.logIndex);

  // Create vote entity
  await db.insert(geneVote).values({
    id: voteId,
    auctionId: makeAuctionId(auctionId),
    proposalId,
    voterId,
    isRemoveVote: false,
    loveAmount: voteWeight,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  // Update proposal vote count
  await db
    .update(geneProposal, { id: proposalId })
    .set((row) => ({
      loveVotes: row.loveVotes + voteWeight,
    }));
});

/**
 * Handle GeneAuction:GeneRemovalVote
 * Records vote to remove a gene proposal
 */
ponder.on("GeneAuction:GeneRemovalVote", async ({ event, context }) => {
  const { auctionId, category, geneId, voter, voteWeight } = event.args;
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

  const proposalId = makeProposalId(auctionId, Number(category), geneId);
  const voteId = makeEventId(event.transaction.hash, event.log.logIndex);

  // Create vote entity
  await db.insert(geneVote).values({
    id: voteId,
    auctionId: makeAuctionId(auctionId),
    proposalId,
    voterId,
    isRemoveVote: true,
    loveAmount: voteWeight,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });

  // Update proposal remove vote count
  await db
    .update(geneProposal, { id: proposalId })
    .set((row) => ({
      removeVotes: row.removeVotes + voteWeight,
    }));
});

/**
 * Handle GeneAuction:GeneRemoved
 * Marks proposal as removed from auction
 */
ponder.on("GeneAuction:GeneRemoved", async ({ event, context }) => {
  const { auctionId, category, geneId } = event.args;
  const { db } = context;

  const proposalId = makeProposalId(auctionId, Number(category), geneId);

  // Mark proposal as removed
  await db
    .update(geneProposal, { id: proposalId })
    .set({
      removed: true,
    });
});

/**
 * Handle GeneAuction:BulkVoteCast
 * CRITICAL: Handles bulk voting with optimization using cached parent traits
 * This is the most complex handler due to implicit proposal creation
 */
ponder.on("GeneAuction:BulkVoteCast", async ({ event, context }) => {
  const { auctionId, voter, geneIds, userVotingPower } = event.args;
  const { db } = context;

  const voterId = normalizeAddress(voter);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  // Ensure voter exists
  await db
    .insert(user)
    .values({
      id: voterId,
      address: voterId,
    })
    .onConflictDoNothing();

  // Ensure system user exists for implicit proposals
  await db
    .insert(user)
    .values({
      id: zeroAddress as Hex,
      address: zeroAddress as Hex,
    })
    .onConflictDoNothing();

  // Load auction to get cached parent traits
  const auction = await db.find(geneAuction, { id: makeAuctionId(auctionId) });

  if (!auction) {
    console.error(`Auction not found for bulk vote: ${auctionId}`);
    return;
  }

  const parentGeneIds = auction.parentGeneIds;

  // Process each gene ID in the bulk vote (8 traits)
  for (let i = 0; i < geneIds.length; i++) {
    const geneId = geneIds[i];

    // Skip zero gene IDs (no vote for this category)
    if (geneId === 0n) {
      continue;
    }

    const proposalId = makeProposalId(auctionId, i, geneId);

    // Check if proposal exists
    const proposalRecord = await db.find(geneProposal, { id: proposalId });

    if (!proposalRecord) {
      // Proposal doesn't exist - check if it's a parent trait
      const parent1TraitId = parentGeneIds[i]; // Parent 1: indices 0-7
      const parent2TraitId = parentGeneIds[i + 8]; // Parent 2: indices 8-15

      const isParentTrait = geneId === parent1TraitId || geneId === parent2TraitId;

      if (!isParentTrait) {
        console.warn(
          `Gene ${geneId} is not a valid parent trait for auction ${auctionId} trait ${i} - skipping`
        );
        continue;
      }

      // Create implicit proposal for parent trait
      await db.insert(geneProposal).values({
        id: proposalId,
        auctionId: makeAuctionId(auctionId),
        geneNFTId: makeGeneNFTId(geneId),
        traitType: i,
        proposerId: zeroAddress as Hex, // System user
        loveVotes: 0n,
        removeVotes: 0n,
        removed: false,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,
      });

      console.log(
        `Created implicit proposal for parent trait: auction ${auctionId} gene ${geneId} trait ${i}`
      );
    }

    // Create vote entity for this trait
    const voteId = makeEventId(event.transaction.hash, BigInt(event.log.logIndex) + BigInt(i));

    await db.insert(geneVote).values({
      id: voteId,
      auctionId: makeAuctionId(auctionId),
      proposalId,
      voterId,
      isRemoveVote: false,
      loveAmount: userVotingPower,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    });

    // Update proposal vote count
    await db
      .update(geneProposal, { id: proposalId })
      .set((row) => ({
        loveVotes: row.loveVotes + userVotingPower,
      }));
  }
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
  await db
    .update(geneNFT, { id: makeGeneNFTId(geneId) })
    .set((row) => ({
      totalEarnings: row.totalEarnings + amount,
    }));
});
