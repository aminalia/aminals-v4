import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  GeneAuction as GeneAuctionContract,
  VotingCreated as VotingCreatedEvent,
  VotingSettled as VotingSettledEvent,
  GeneProposed as GeneProposedEvent,
  GeneVoteCast as GeneVoteCastEvent,
  GeneRemovalVote as GeneRemovalVoteEvent,
  GeneRemoved as GeneRemovedEvent,
  BulkVoteCast as BulkVoteCastEvent
} from "../generated/GeneAuction/GeneAuction";
import {
  GeneAuction,
  GeneProposal,
  GeneVote,
  GeneNFT,
  Aminal,
  User
} from "../generated/schema";

export function handleVotingCreated(event: VotingCreatedEvent): void {
  // Load parent Aminals by index (need to get addresses from factory)
  let aminalOneIndex = event.params.aminalOne;
  let aminalTwoIndex = event.params.aminalTwo;
  
  // Create auction entity
  let auction = new GeneAuction(Bytes.fromI32(event.params.auctionId.toI32()));
  auction.auctionId = event.params.auctionId;
  // Store parent indices for now - we'll resolve to addresses in settlement
  auction.aminalOne = Bytes.fromI32(aminalOneIndex.toI32());
  auction.aminalTwo = Bytes.fromI32(aminalTwoIndex.toI32());
  auction.totalLove = event.params.totalLove;
  auction.finished = false;
  auction.blockNumber = event.block.number;
  auction.blockTimestamp = event.block.timestamp;
  auction.transactionHash = event.transaction.hash;
  auction.save();
  
  log.info("Gene auction created: {} for Aminals {} and {} with love {}", [
    event.params.auctionId.toString(),
    aminalOneIndex.toString(),
    aminalTwoIndex.toString(),
    event.params.totalLove.toString()
  ]);
}

export function handleVotingSettled(event: VotingSettledEvent): void {
  // Load auction entity
  let auction = GeneAuction.load(Bytes.fromI32(event.params.auctionId.toI32()));
  if (!auction) {
    log.error("Auction not found for settlement: {}", [event.params.auctionId.toString()]);
    return;
  }
  
  // Update auction with settlement data
  auction.finished = true;
  auction.winningGeneIds = event.params.winningGeneIds;
  // childAminalId is the index, we need to resolve to address later
  auction.endBlockNumber = event.block.number;
  auction.endBlockTimestamp = event.block.timestamp;
  auction.endTransactionHash = event.transaction.hash;
  auction.save();
  
  log.info("Gene auction settled: {} with child Aminal index {}", [
    event.params.auctionId.toString(),
    event.params.childAminalId.toString()
  ]);
}

export function handleGeneProposed(event: GeneProposedEvent): void {
  // Load auction entity
  let auction = GeneAuction.load(Bytes.fromI32(event.params.auctionId.toI32()));
  if (!auction) {
    log.error("Auction not found for gene proposal: {}", [event.params.auctionId.toString()]);
    return;
  }
  
  // Create or load user
  let user = User.load(event.params.proposer);
  if (!user) {
    user = new User(event.params.proposer);
    user.address = event.params.proposer;
    user.save();
  }
  
  // Create gene proposal entity (gene NFT might not exist yet in subgraph)
  let proposalId = Bytes.fromI32(event.params.auctionId.toI32())
    .concatI32(event.params.category)
    .concat(Bytes.fromI32(event.params.geneId.toI32()));
  let proposal = new GeneProposal(proposalId);
  proposal.auction = auction.id;
  // Store gene NFT reference (will be resolved later)
  proposal.geneNFT = event.address.concat(Bytes.fromI32(event.params.geneId.toI32()));
  proposal.traitType = event.params.category;
  proposal.proposer = user.id;
  proposal.loveVotes = BigInt.fromI32(0);
  proposal.removeVotes = BigInt.fromI32(0);
  proposal.removed = false;
  proposal.blockNumber = event.block.number;
  proposal.blockTimestamp = event.block.timestamp;
  proposal.transactionHash = event.transaction.hash;
  proposal.save();
  
  log.info("Gene proposed for auction {}: gene ID {} trait type {} by {}", [
    event.params.auctionId.toString(),
    event.params.geneId.toString(),
    event.params.category.toString(),
    event.params.proposer.toHexString()
  ]);
}

export function handleGeneVoteCast(event: GeneVoteCastEvent): void {
  // Load auction entity
  let auction = GeneAuction.load(Bytes.fromI32(event.params.auctionId.toI32()));
  if (!auction) {
    log.error("Auction not found for gene vote: {}", [event.params.auctionId.toString()]);
    return;
  }
  
  // Load gene proposal
  let proposalId = Bytes.fromI32(event.params.auctionId.toI32())
    .concatI32(event.params.category)
    .concat(Bytes.fromI32(event.params.geneId.toI32()));
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error("Gene proposal not found for vote: auction {} gene {} trait {}", [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString()
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
  
  // Create gene vote entity
  let voteId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let vote = new GeneVote(voteId);
  vote.auction = auction.id;
  vote.proposal = proposal.id;
  vote.voter = user.id;
  vote.isRemoveVote = false; // Regular vote
  vote.loveAmount = event.params.voteWeight;
  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;
  vote.transactionHash = event.transaction.hash;
  vote.save();
  
  // Update proposal vote counts
  proposal.loveVotes = proposal.loveVotes.plus(event.params.voteWeight);
  proposal.save();
  
  log.info("Gene vote cast for auction {}: gene {} trait {} by {} with love {}", [
    event.params.auctionId.toString(),
    event.params.geneId.toString(),
    event.params.category.toString(),
    event.params.voter.toHexString(),
    event.params.voteWeight.toString()
  ]);
}

export function handleGeneRemovalVote(event: GeneRemovalVoteEvent): void {
  // Load auction entity
  let auction = GeneAuction.load(Bytes.fromI32(event.params.auctionId.toI32()));
  if (!auction) {
    log.error("Auction not found for gene removal vote: {}", [event.params.auctionId.toString()]);
    return;
  }
  
  // Load gene proposal
  let proposalId = Bytes.fromI32(event.params.auctionId.toI32())
    .concatI32(event.params.category)
    .concat(Bytes.fromI32(event.params.geneId.toI32()));
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error("Gene proposal not found for removal vote: auction {} gene {} trait {}", [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString()
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
  
  // Create gene vote entity for removal
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
  
  // Update proposal removal vote counts
  proposal.removeVotes = proposal.removeVotes.plus(event.params.voteWeight);
  proposal.save();
  
  log.info("Gene removal vote cast for auction {}: gene {} trait {} by {} with love {}", [
    event.params.auctionId.toString(),
    event.params.geneId.toString(),
    event.params.category.toString(),
    event.params.voter.toHexString(),
    event.params.voteWeight.toString()
  ]);
}

export function handleGeneRemoved(event: GeneRemovedEvent): void {
  // Load gene proposal
  let proposalId = Bytes.fromI32(event.params.auctionId.toI32())
    .concatI32(event.params.category)
    .concat(Bytes.fromI32(event.params.geneId.toI32()));
  let proposal = GeneProposal.load(proposalId);
  if (!proposal) {
    log.error("Gene proposal not found for removal: auction {} gene {} trait {}", [
      event.params.auctionId.toString(),
      event.params.geneId.toString(),
      event.params.category.toString()
    ]);
    return;
  }
  
  // Mark proposal as removed
  proposal.removed = true;
  proposal.save();
  
  log.info("Gene removed from auction {}: gene {} trait {}", [
    event.params.auctionId.toString(),
    event.params.geneId.toString(),
    event.params.category.toString()
  ]);
}

export function handleBulkVoteCast(event: BulkVoteCastEvent): void {
  // Load auction entity
  let auction = GeneAuction.load(Bytes.fromI32(event.params.auctionId.toI32()));
  if (!auction) {
    log.error("Auction not found for bulk vote: {}", [event.params.auctionId.toString()]);
    return;
  }
  
  // Create or load user
  let user = User.load(event.params.voter);
  if (!user) {
    user = new User(event.params.voter);
    user.address = event.params.voter;
    user.save();
  }
  
  log.info("Bulk vote cast for auction {} by {} with total vote weight {}", [
    event.params.auctionId.toString(),
    event.params.voter.toHexString(),
    event.params.totalVoteWeight.toString()
  ]);
  
  // Note: Individual gene votes will be handled by handleGeneVoteCast events
  // This event is mainly for tracking bulk operations
}