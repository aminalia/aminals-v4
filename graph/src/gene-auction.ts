import { Address, BigInt, Bytes, log, store } from "@graphprotocol/graph-ts";
import {
  GeneAuction as GeneAuctionContract,
  VotingCreated as VotingCreatedEvent,
  VotingSettled as VotingSettledEvent,
  GeneProposed as GeneProposedEvent,
  GeneVoteCast as GeneVoteCastEvent,
  GeneRemovalVote as GeneRemovalVoteEvent,
  GeneRemoved as GeneRemovedEvent,
  BulkVoteCast as BulkVoteCastEvent,
  GeneCreatorPayout as GeneCreatorPayoutEvent,
} from "../generated/GeneAuction/GeneAuction";
import { AminalFactory as AminalFactoryContract } from "../generated/AminalFactory/AminalFactory";
import {
  GeneAuction,
  GeneProposal,
  GeneVote,
  GeneCreatorPayout,
  GeneNFT,
  Aminal,
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
      ]
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
      ]
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

  // Get user's voting power from contract since the event doesn't include it
  let geneAuctionContract = GeneAuctionContract.bind(event.address);
  let votingPowerResult = geneAuctionContract.try_getUserVotingPower(
    event.params.auctionId,
    event.params.voter,
  );
  let votingPower = votingPowerResult.reverted
    ? BigInt.fromI32(0)
    : votingPowerResult.value;

  // Find and subtract any previous regular votes by this user on this proposal
  let existingVotes = proposal.votes.load();
  for (let i = 0; i < existingVotes.length; i++) {
    let existingVote = existingVotes[i];
    if (existingVote.voter.equals(user.id) && !existingVote.isRemoveVote) {
      // Subtract the previous vote amount
      proposal.loveVotes = proposal.loveVotes.minus(existingVote.loveAmount);
    }
  }

  // Create new vote entity (always create new since GeneVote is immutable)
  let voteId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let vote = new GeneVote(voteId);
  vote.auction = auction.id;
  vote.proposal = proposal.id;
  vote.voter = user.id;
  vote.isRemoveVote = false; // Regular vote
  vote.loveAmount = votingPower;
  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;
  vote.transactionHash = event.transaction.hash;
  vote.save();

  // Add the new vote amount
  proposal.loveVotes = proposal.loveVotes.plus(votingPower);
  proposal.save();

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

  // Find and subtract any previous removal votes by this user on this proposal
  let existingVotes = proposal.votes.load();
  for (let i = 0; i < existingVotes.length; i++) {
    let existingVote = existingVotes[i];
    if (existingVote.voter.equals(user.id) && existingVote.isRemoveVote) {
      // Subtract the previous removal vote amount
      proposal.removeVotes = proposal.removeVotes.minus(existingVote.loveAmount);
    }
  }

  // Create new removal vote entity (always create new since GeneVote is immutable)
  let voteId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let vote = new GeneVote(voteId);
  vote.auction = auction.id;
  vote.proposal = proposal.id;
  vote.voter = user.id;
  vote.isRemoveVote = true; // Removal vote
  vote.loveAmount = event.params.voteWeight;
  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;
  vote.transactionHash = event.transaction.hash;
  vote.save();

  // Add the new removal vote amount
  proposal.removeVotes = proposal.removeVotes.plus(event.params.voteWeight);
  proposal.save();

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

  // Get user's voting power from contract since the event doesn't include it
  let geneAuctionContract = GeneAuctionContract.bind(event.address);
  let votingPowerResult = geneAuctionContract.try_getUserVotingPower(
    event.params.auctionId,
    event.params.voter,
  );
  let votingPower = votingPowerResult.reverted
    ? BigInt.fromI32(0)
    : votingPowerResult.value;

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
    if (!geneId.isZero()) {
      // Create proposal ID for this gene/category combination
      let proposalId = createProposalId(
        event.params.auctionId,
        BigInt.fromI32(i),
        geneId,
      );
      let proposal = GeneProposal.load(proposalId);

      if (!proposal) {
        log.warning(
          "Gene proposal not found for bulk vote: auction {} gene {} trait {} - creating proposal automatically",
          [event.params.auctionId.toString(), geneId.toString(), i.toString()],
        );

        // Auto-create the proposal if it doesn't exist
        let genesContractAddress = getGenesContractAddress(event.address);
        proposal = new GeneProposal(proposalId);
        proposal.auction = auction.id;
        proposal.geneNFT = createGeneNFTId(genesContractAddress, geneId);
        proposal.traitType = i;
        proposal.proposer = user.id; // The voter becomes the proposer
        proposal.loveVotes = BigInt.fromI32(0);
        proposal.removeVotes = BigInt.fromI32(0);
        proposal.removed = false;
        proposal.blockNumber = event.block.number;
        proposal.blockTimestamp = event.block.timestamp;
        proposal.transactionHash = event.transaction.hash;
        proposal.save();

        log.info(
          "Auto-created gene proposal for bulk vote: auction {} gene {} trait {}",
          [event.params.auctionId.toString(), geneId.toString(), i.toString()],
        );
      }

      // Find and subtract any previous regular votes by this user on this proposal
      let existingVotes = proposal.votes.load();
      for (let j = 0; j < existingVotes.length; j++) {
        let existingVote = existingVotes[j];
        if (existingVote.voter.equals(user.id) && !existingVote.isRemoveVote) {
          // Subtract the previous vote amount
          proposal.loveVotes = proposal.loveVotes.minus(existingVote.loveAmount);
        }
      }

      // Create new vote entity for this individual vote (always create new since GeneVote is immutable)
      // Use a unique ID that includes the trait category to avoid collisions
      let voteId = event.transaction.hash
        .concatI32(event.logIndex.toI32())
        .concatI32(i); // Add category index to make it unique
      let vote = new GeneVote(voteId);
      vote.auction = auction.id;
      vote.proposal = proposal.id;
      vote.voter = user.id;
      vote.isRemoveVote = false; // Regular vote
      vote.loveAmount = votingPower;
      vote.blockNumber = event.block.number;
      vote.blockTimestamp = event.block.timestamp;
      vote.transactionHash = event.transaction.hash;
      vote.save();

      // Add the new vote amount
      proposal.loveVotes = proposal.loveVotes.plus(votingPower);
      proposal.save();

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
