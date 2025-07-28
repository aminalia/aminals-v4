import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { AminalFactory as AminalFactoryContract } from "../generated/AminalFactory/AminalFactory";
import {
  BulkVoteCast as BulkVoteCastEvent,
  GeneAuction as GeneAuctionContract,
  GeneCreatorPayout as GeneCreatorPayoutEvent,
  GeneProposed as GeneProposedEvent,
  GeneRemovalVote as GeneRemovalVoteEvent,
  GeneRemoved as GeneRemovedEvent,
  GeneVoteCast as GeneVoteCastEvent,
  VotingCreated as VotingCreatedEvent,
  VotingSettled as VotingSettledEvent,
} from "../generated/GeneAuction/GeneAuction";
import {
  Aminal,
  GeneAuction,
  GeneCreatorPayout,
  GeneNFT,
  GeneProposal,
  GeneVote,
  User,
} from "../generated/schema";
import { AMINAL_FACTORY_ADDRESS, GENES_NFT_ADDRESS } from "./constants";

// Helper function to create consistent auction ID format
export function createAuctionId(auctionId: BigInt): Bytes {
  return Bytes.fromHexString(
    "0x" + (auctionId.toI32() * 0x1000000).toString(16).padStart(8, "0"),
  );
}

// Helper function to create consistent proposal ID format
function createProposalId(
  auctionId: BigInt,
  category: BigInt,
  geneId: BigInt,
): Bytes {
  let auctionIdHex = createAuctionId(auctionId);
  return auctionIdHex
    .concatI32(category.toI32())
    .concat(Bytes.fromI32(geneId.toI32()));
}

// Helper function to get the Genes contract address from the auction contract
function getGenesContractAddress(auctionContractAddress: Address): Address {
  let auctionContract = GeneAuctionContract.bind(auctionContractAddress);
  let genesResult = auctionContract.try_genes();
  if (!genesResult.reverted) {
    return genesResult.value;
  }
  // Fallback to constants address if call fails
  return Address.fromString(GENES_NFT_ADDRESS);
}

// Helper function to create gene NFT entity ID (matches genes-nft.ts format)
function createGeneNFTId(genesContractAddress: Address, geneId: BigInt): Bytes {
  return genesContractAddress.concat(Bytes.fromI32(geneId.toI32()));
}

// Helper function to handle vote updates consistently
function handleVoteUpdate(
  voter: Address,
  auctionId: BigInt,
  category: i32,
  newProposal: GeneProposal,
  votingPower: BigInt,
  isRemoveVote: boolean,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
  auction: GeneAuction,
  user: User,
): void {
  // Create vote ID based on voter + auction + category (one vote per category per user)
  let voteId = voter.concatI32(auctionId.toI32()).concatI32(category);

  let existingVote = GeneVote.load(voteId);

  if (existingVote) {
    // Check if this is actually a change to a different proposal
    if (existingVote.proposal.equals(newProposal.id)) {
      // Same proposal - just update the vote amount (most common case)
      let voteDifference = votingPower.minus(existingVote.loveAmount);

      // Update vote amount efficiently without loading old proposal
      if (isRemoveVote) {
        newProposal.removeVotes = newProposal.removeVotes.plus(voteDifference);
      } else {
        newProposal.loveVotes = newProposal.loveVotes.plus(voteDifference);
      }

      existingVote.loveAmount = votingPower;
      existingVote.isRemoveVote = isRemoveVote;
      existingVote.blockNumber = blockNumber;
      existingVote.blockTimestamp = blockTimestamp;
      existingVote.transactionHash = transactionHash;
      existingVote.save();
    } else {
      // Different proposal - need to remove from old and add to new
      // Only load old proposal if we're changing to a different one
      let oldProposal = GeneProposal.load(existingVote.proposal);
      if (oldProposal) {
        if (existingVote.isRemoveVote) {
          oldProposal.removeVotes = oldProposal.removeVotes.minus(
            existingVote.loveAmount,
          );
        } else {
          oldProposal.loveVotes = oldProposal.loveVotes.minus(
            existingVote.loveAmount,
          );
        }
        oldProposal.save();
      }

      // Update vote to point to new proposal
      existingVote.proposal = newProposal.id;
      existingVote.loveAmount = votingPower;
      existingVote.isRemoveVote = isRemoveVote;
      existingVote.blockNumber = blockNumber;
      existingVote.blockTimestamp = blockTimestamp;
      existingVote.transactionHash = transactionHash;
      existingVote.save();

      // Add vote to new proposal
      if (isRemoveVote) {
        newProposal.removeVotes = newProposal.removeVotes.plus(votingPower);
      } else {
        newProposal.loveVotes = newProposal.loveVotes.plus(votingPower);
      }
    }
  } else {
    // Create new vote (first time voting)
    let vote = new GeneVote(voteId);
    vote.auction = auction.id;
    vote.proposal = newProposal.id;
    vote.voter = user.id;
    vote.isRemoveVote = isRemoveVote;
    vote.loveAmount = votingPower;
    vote.blockNumber = blockNumber;
    vote.blockTimestamp = blockTimestamp;
    vote.transactionHash = transactionHash;
    vote.save();

    // Add vote to proposal
    if (isRemoveVote) {
      newProposal.removeVotes = newProposal.removeVotes.plus(votingPower);
    } else {
      newProposal.loveVotes = newProposal.loveVotes.plus(votingPower);
    }
  }

  // Always save the new proposal at the end
  newProposal.save();
}

export function handleVotingCreated(event: VotingCreatedEvent): void {
  // Get factory address from constants
  let factoryAddress = Address.fromString(AMINAL_FACTORY_ADDRESS);

  // Load parent Aminals by index using factory contract
  let aminalOneIndex = event.params.aminalOne;
  let aminalTwoIndex = event.params.aminalTwo;

  // Import and use factory contract to resolve indices to addresses
  let factoryContract = AminalFactoryContract.bind(factoryAddress);

  let aminalOneAddressResult =
    factoryContract.try_aminalsByIndex(aminalOneIndex);
  let aminalTwoAddressResult =
    factoryContract.try_aminalsByIndex(aminalTwoIndex);

  if (aminalOneAddressResult.reverted || aminalTwoAddressResult.reverted) {
    log.error(
      "Failed to resolve Aminal addresses for auction {}: indices {} and {}",
      [
        event.params.auctionId.toString(),
        aminalOneIndex.toString(),
        aminalTwoIndex.toString(),
      ],
    );
    return;
  }

  let aminalOneAddress = aminalOneAddressResult.value;
  let aminalTwoAddress = aminalTwoAddressResult.value;

  // Ensure Aminal entities exist before referencing them
  let aminalOne = Aminal.load(aminalOneAddress);
  if (!aminalOne) {
    log.error(
      "Aminal entity not found for address {} (index {}), cannot create auction {}",
      [
        aminalOneAddress.toHexString(),
        aminalOneIndex.toString(),
        event.params.auctionId.toString(),
      ],
    );
    return;
  }

  let aminalTwo = Aminal.load(aminalTwoAddress);
  if (!aminalTwo) {
    log.error(
      "Aminal entity not found for address {} (index {}), cannot create auction {}",
      [
        aminalTwoAddress.toHexString(),
        aminalTwoIndex.toString(),
        event.params.auctionId.toString(),
      ],
    );
    return;
  }

  // Create auction entity with proper ID format that matches frontend expectations
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = new GeneAuction(auctionIdHex);
  auction.auctionId = event.params.auctionId;
  // Reference Aminal entities by their IDs
  auction.aminalOne = aminalOne.id;
  auction.aminalTwo = aminalTwo.id;
  auction.totalLove = event.params.totalLove;
  auction.finished = false;
  auction.blockNumber = event.block.number;
  auction.blockTimestamp = event.block.timestamp;
  auction.transactionHash = event.transaction.hash;
  auction.save();

  log.info(
    "Gene auction created: {} for Aminals {} ({}) and {} ({}) with love {}",
    [
      event.params.auctionId.toString(),
      aminalOneIndex.toString(),
      aminalOneAddress.toHexString(),
      aminalTwoIndex.toString(),
      aminalTwoAddress.toHexString(),
      event.params.totalLove.toString(),
    ],
  );
}

export function handleVotingSettled(event: VotingSettledEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for settlement: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Update auction with settlement data
  auction.finished = true;
  auction.winningGeneIds = event.params.winningGeneIds;
  auction.endBlockNumber = event.block.number;
  auction.endBlockTimestamp = event.block.timestamp;
  auction.endTransactionHash = event.transaction.hash;
  auction.save();

  log.info(
    "Gene auction settled: {} with winning genes {}, child will be linked via AminalSpawned event",
    [event.params.auctionId.toString(), event.params.winningGeneIds.toString()],
  );
}

export function handleGeneProposed(event: GeneProposedEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for gene proposal: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Create or load user
  let user = User.load(event.params.proposer);
  if (!user) {
    user = new User(event.params.proposer);
    user.address = event.params.proposer;
    user.save();
  }

  // Get the actual Genes contract address from the auction contract
  let genesContractAddress = getGenesContractAddress(event.address);

  // Create gene proposal entity with proper ID format
  let proposalId = createProposalId(
    event.params.auctionId,
    BigInt.fromI32(event.params.category),
    event.params.geneId,
  );
  let proposal = new GeneProposal(proposalId);
  proposal.auction = auction.id;

  // Store gene NFT reference using the same format as genes-nft.ts
  proposal.geneNFT = createGeneNFTId(genesContractAddress, event.params.geneId);

  proposal.traitType = event.params.category;
  proposal.proposer = user.id;
  proposal.loveVotes = BigInt.fromI32(0);
  proposal.removeVotes = BigInt.fromI32(0);
  proposal.removed = false;
  proposal.blockNumber = event.block.number;
  proposal.blockTimestamp = event.block.timestamp;
  proposal.transactionHash = event.transaction.hash;
  proposal.save();

  log.info(
    "Gene proposed for auction {}: gene ID {} trait type {} by {} with gene NFT ID {}",
    [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString(),
      event.params.proposer.toHexString(),
      proposal.geneNFT.toHexString(),
    ],
  );
}

export function handleGeneVoteCast(event: GeneVoteCastEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for gene vote: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Load gene proposal with proper ID format
  let proposalId = createProposalId(
    event.params.auctionId,
    BigInt.fromI32(event.params.category),
    event.params.geneId,
  );
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error("Gene proposal not found for vote: auction {} gene {} trait {}", [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString(),
    ]);
    return;
  }

  // Create or load user
  let user = User.load(event.params.voter);
  if (!user) {
    user = new User(event.params.voter);
    user.address = event.params.voter;
    user.save();
  }

  // Get user's voting power from event parameter
  let votingPower = event.params.userVotingPower;

  // Use helper function to handle vote update consistently
  handleVoteUpdate(
    event.params.voter,
    event.params.auctionId,
    event.params.category,
    proposal,
    votingPower,
    false, // Regular vote, not removal
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    auction,
    user,
  );

  log.info(
    "Gene vote cast for auction {}: gene {} trait {} by {} with love {}",
    [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString(),
      event.params.voter.toHexString(),
      votingPower.toString(),
    ],
  );
}

export function handleGeneRemovalVote(event: GeneRemovalVoteEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for gene removal vote: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Load gene proposal with proper ID format
  let proposalId = createProposalId(
    event.params.auctionId,
    BigInt.fromI32(event.params.category),
    event.params.geneId,
  );
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error(
      "Gene proposal not found for removal vote: auction {} gene {} trait {}",
      [
        event.params.auctionId.toString(),
        event.params.geneId.toString(),
        event.params.category.toString(),
      ],
    );
    return;
  }

  // Create or load user
  let user = User.load(event.params.voter);
  if (!user) {
    user = new User(event.params.voter);
    user.address = event.params.voter;
    user.save();
  }

  // Use helper function to handle removal vote consistently
  handleVoteUpdate(
    event.params.voter,
    event.params.auctionId,
    event.params.category,
    proposal,
    event.params.voteWeight,
    true, // This is a removal vote
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    auction,
    user,
  );

  log.info(
    "Gene removal vote cast for auction {}: gene {} trait {} by {} with love {}",
    [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString(),
      event.params.voter.toHexString(),
      event.params.voteWeight.toString(),
    ],
  );
}

export function handleGeneRemoved(event: GeneRemovedEvent): void {
  // Load gene proposal with proper ID format
  let proposalId = createProposalId(
    event.params.auctionId,
    BigInt.fromI32(event.params.category),
    event.params.geneId,
  );
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error(
      "Gene proposal not found for removal: auction {} gene {} trait {}",
      [
        event.params.auctionId.toString(),
        event.params.geneId.toString(),
        event.params.category.toString(),
      ],
    );
    return;
  }

  // Mark proposal as removed
  proposal.removed = true;
  proposal.save();

  log.info("Gene removed from auction {}: gene {} trait {}", [
    event.params.auctionId.toString(),
    event.params.geneId.toString(),
    event.params.category.toString(),
  ]);
}

export function handleBulkVoteCast(event: BulkVoteCastEvent): void {
  // Load auction entity with proper ID format
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for bulk vote: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Create or load user
  let user = User.load(event.params.voter);
  if (!user) {
    user = new User(event.params.voter);
    user.address = event.params.voter;
    user.save();
  }

  // Get user's voting power from event parameter
  let votingPower = event.params.userVotingPower;

  log.info("Bulk vote cast for auction {} by {} with total vote weight {}", [
    event.params.auctionId.toString(),
    event.params.voter.toHexString(),
    votingPower.toString(),
  ]);

  // Create individual vote entities for each non-zero gene ID in the bulk vote
  // Since bulkVoteOnGenes doesn't emit individual GeneVoteCast events, we need to create them here
  let geneIds = event.params.geneIds;
  for (let i = 0; i < geneIds.length; i++) {
    let geneId = geneIds[i];

    // Skip zero gene IDs (no vote for this category)
    if (geneId.equals(BigInt.zero())) {
      continue;
    }

    // Create proposal ID for this gene/category combination
    let proposalId = createProposalId(
      event.params.auctionId,
      BigInt.fromI32(i),
      geneId,
    );
    let proposal = GeneProposal.load(proposalId);

    if (!proposal) {
      // Check if this is a parent trait (which can be voted on without explicit proposal)
      let aminalOne = Aminal.load(auction.aminalOne);
      let aminalTwo = Aminal.load(auction.aminalTwo);

      if (!aminalOne || !aminalTwo) {
        log.warning(
          "Parent Aminals not found for auction {} - skipping vote for gene {} trait {}",
          [event.params.auctionId.toString(), geneId.toString(), i.toString()],
        );
        continue;
      }

      // Check if gene ID matches parent traits for this category
      let isParentTrait = false;
      if (
        i == 0 &&
        (geneId.equals(aminalOne.backId) || geneId.equals(aminalTwo.backId))
      ) {
        isParentTrait = true;
      } else if (
        i == 1 &&
        (geneId.equals(aminalOne.armId) || geneId.equals(aminalTwo.armId))
      ) {
        isParentTrait = true;
      } else if (
        i == 2 &&
        (geneId.equals(aminalOne.tailId) || geneId.equals(aminalTwo.tailId))
      ) {
        isParentTrait = true;
      } else if (
        i == 3 &&
        (geneId.equals(aminalOne.earsId) || geneId.equals(aminalTwo.earsId))
      ) {
        isParentTrait = true;
      } else if (
        i == 4 &&
        (geneId.equals(aminalOne.bodyId) || geneId.equals(aminalTwo.bodyId))
      ) {
        isParentTrait = true;
      } else if (
        i == 5 &&
        (geneId.equals(aminalOne.faceId) || geneId.equals(aminalTwo.faceId))
      ) {
        isParentTrait = true;
      } else if (
        i == 6 &&
        (geneId.equals(aminalOne.mouthId) || geneId.equals(aminalTwo.mouthId))
      ) {
        isParentTrait = true;
      } else if (
        i == 7 &&
        (geneId.equals(aminalOne.miscId) || geneId.equals(aminalTwo.miscId))
      ) {
        isParentTrait = true;
      }

      if (!isParentTrait) {
        log.warning(
          "Gene {} is not a valid parent trait for auction {} trait {} - skipping this vote",
          [geneId.toString(), event.params.auctionId.toString(), i.toString()],
        );
        continue;
      }

      // Create or load system user for implicit proposals
      let systemUser = User.load(Address.zero());
      if (!systemUser) {
        systemUser = new User(Address.zero());
        systemUser.address = Address.zero();
        systemUser.save();
      }

      // Create proposal for parent trait
      proposal = new GeneProposal(proposalId);
      proposal.auction = auction.id;
      proposal.geneNFT = createGeneNFTId(
        getGenesContractAddress(event.address),
        geneId,
      );
      proposal.traitType = i;
      proposal.proposer = systemUser.id; // Use system user for parent traits
      proposal.loveVotes = BigInt.fromI32(0);
      proposal.removeVotes = BigInt.fromI32(0);
      proposal.removed = false;
      proposal.blockNumber = event.block.number;
      proposal.blockTimestamp = event.block.timestamp;
      proposal.transactionHash = event.transaction.hash;
      proposal.save();

      log.info(
        "Created implicit proposal for parent trait: auction {} gene {} trait {}",
        [event.params.auctionId.toString(), geneId.toString(), i.toString()],
      );
    }

    // Use helper function to handle vote update consistently
    handleVoteUpdate(
      event.params.voter,
      event.params.auctionId,
      i32(i),
      proposal,
      votingPower,
      false, // Regular vote, not removal
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
      auction,
      user,
    );

    log.info(
      "Individual vote created from bulk vote for auction {}: gene {} trait {} by {} with love {}",
      [
        event.params.auctionId.toString(),
        geneId.toString(),
        i.toString(),
        event.params.voter.toHexString(),
        votingPower.toString(),
      ],
    );
  }
}

export function handleGeneCreatorPayout(event: GeneCreatorPayoutEvent): void {
  // Load auction entity
  let auctionIdHex = createAuctionId(event.params.auctionId);
  let auction = GeneAuction.load(auctionIdHex);
  if (!auction) {
    log.error("Auction not found for gene creator payout: {}", [
      event.params.auctionId.toString(),
    ]);
    return;
  }

  // Create or load user (creator)
  let creator = User.load(event.params.creator);
  if (!creator) {
    creator = new User(event.params.creator);
    creator.address = event.params.creator;
    creator.save();
  }

  // Get the actual Genes contract address
  let genesContractAddress = getGenesContractAddress(event.address);

  // Load the Gene NFT entity
  let geneNFTId = createGeneNFTId(genesContractAddress, event.params.geneId);
  let geneNFT = GeneNFT.load(geneNFTId);
  if (!geneNFT) {
    log.error("Gene NFT not found for creator payout: contract {} gene ID {}", [
      genesContractAddress.toHexString(),
      event.params.geneId.toString(),
    ]);
    return;
  }

  // Create payout entity
  let payoutId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let payout = new GeneCreatorPayout(payoutId);
  payout.auction = auction.id;
  payout.geneNFT = geneNFT.id;
  payout.creator = creator.id;
  payout.amount = event.params.amount;
  payout.auctionId = event.params.auctionId;
  payout.geneId = event.params.geneId;
  payout.blockNumber = event.block.number;
  payout.blockTimestamp = event.block.timestamp;
  payout.transactionHash = event.transaction.hash;
  payout.save();

  // Update gene NFT total earnings
  geneNFT.totalEarnings = geneNFT.totalEarnings.plus(event.params.amount);
  geneNFT.save();

  log.info(
    "Gene creator payout recorded: auction {} gene {} creator {} amount {}",
    [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.creator.toHexString(),
      event.params.amount.toString(),
    ],
  );
}
