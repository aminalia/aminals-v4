import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { 
  AminalFactory as AminalFactoryContract,
  AminalSpawned as AminalSpawnedEvent,
  BreedAminal as BreedAminalEvent
} from "../generated/AminalFactory/AminalFactory";
import { Aminal as AminalContract } from "../generated/templates/Aminal/Aminal";
import { Aminal as AminalTemplate } from "../generated/templates";
import {
  AminalFactory,
  Aminal,
  BreedAminalEvent as BreedAminal,
  GeneAuction,
  GeneNFT,
  User
} from "../generated/schema";

// Helper function to fetch tokenURI for an Aminal
function fetchTokenURI(aminalAddress: Address): string | null {
  let aminalContract = AminalContract.bind(aminalAddress);
  let tokenURIResult = aminalContract.try_tokenURI(BigInt.fromI32(1)); // Aminals use token ID 1
  
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  } else {
    log.warning("Failed to fetch tokenURI for Aminal {}", [aminalAddress.toHexString()]);
    return null;
  }
}

// Helper function to update Gene NFT relationships
function updateGeneNFTUsage(geneNFTContractAddress: Address, geneId: BigInt, aminalAddress: Address): void {
  log.info("Attempting to update Gene NFT usage for geneId: {}, aminalAddress: {}, contractAddress: {}", [
    geneId.toString(),
    aminalAddress.toHexString(),
    geneNFTContractAddress.toHexString()
  ]);
  
  if (geneId.gt(BigInt.fromI32(0))) {
    let geneNFTId = geneNFTContractAddress.concat(Bytes.fromI32(geneId.toI32()));
    log.info("Looking for Gene NFT with ID: {}", [geneNFTId.toHexString()]);
    
    let geneNFT = GeneNFT.load(geneNFTId);
    
    if (geneNFT) {
      log.info("Found Gene NFT {}, current usage count: {}", [
        geneId.toString(),
        geneNFT.aminalsUsingGene.length.toString()
      ]);
      
      // Add this Aminal to the gene's usage list
      let aminals = geneNFT.aminalsUsingGene;
      if (aminals.indexOf(aminalAddress) == -1) {
        aminals.push(aminalAddress);
        geneNFT.aminalsUsingGene = aminals;
        geneNFT.save();
        
        log.info("Updated Gene NFT {} to include Aminal {}, new usage count: {}", [
          geneId.toString(),
          aminalAddress.toHexString(),
          aminals.length.toString()
        ]);
      } else {
        log.info("Gene NFT {} already includes Aminal {}", [
          geneId.toString(),
          aminalAddress.toHexString()
        ]);
      }
    } else {
      log.warning("Gene NFT not found for ID {} (composite ID: {})", [
        geneId.toString(),
        geneNFTId.toHexString()
      ]);
    }
  } else {
    log.info("Skipping gene ID {} because it's zero", [geneId.toString()]);
  }
}

export function handleAminalSpawned(event: AminalSpawnedEvent): void {
  // Create or load factory entity
  let factory = AminalFactory.load(event.address);
  if (!factory) {
    factory = new AminalFactory(event.address);
    factory.totalAminals = BigInt.fromI32(0);
    factory.initialAminalSpawned = false;
    
    // Get factory contract to read state
    let factoryContract = AminalFactoryContract.bind(event.address);
    let geneAuctionResult = factoryContract.try_geneAuction();
    let genesNFTResult = factoryContract.try_genesNFT();
    let loveVRGDAResult = factoryContract.try_loveVRGDA();
    
    if (!geneAuctionResult.reverted) {
      factory.geneAuction = geneAuctionResult.value;
    } else {
      factory.geneAuction = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
    }
    
    if (!genesNFTResult.reverted) {
      factory.genesNFT = genesNFTResult.value;
    } else {
      factory.genesNFT = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
    }
    
    if (!loveVRGDAResult.reverted) {
      factory.loveVRGDA = loveVRGDAResult.value;
    } else {
      factory.loveVRGDA = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
    }
    
    factory.blockNumber = event.block.number;
    factory.blockTimestamp = event.block.timestamp;
    factory.transactionHash = event.transaction.hash;
  }
  
  // Update factory stats
  factory.totalAminals = factory.totalAminals.plus(BigInt.fromI32(1));
  if (event.params.aminalIndex.gt(BigInt.fromI32(0))) {
    factory.initialAminalSpawned = true;
  }
  factory.save();
  
  // Create new Aminal entity
  let aminal = new Aminal(event.params.aminalAddress);
  aminal.contractAddress = event.params.aminalAddress;
  aminal.aminalIndex = event.params.aminalIndex;
  aminal.factory = factory.id;
  
  // Set parent addresses and relationships
  if (event.params.mom != BigInt.fromI32(0)) {
    // Load mother by index
    let factoryContract = AminalFactoryContract.bind(event.address);
    let motherAddressResult = factoryContract.try_aminalsByIndex(event.params.mom);
    if (!motherAddressResult.reverted) {
      aminal.momAddress = motherAddressResult.value;
      aminal.mother = motherAddressResult.value;
    }
  }
  
  if (event.params.dad != BigInt.fromI32(0)) {
    // Load father by index
    let factoryContract = AminalFactoryContract.bind(event.address);
    let fatherAddressResult = factoryContract.try_aminalsByIndex(event.params.dad);
    if (!fatherAddressResult.reverted) {
      aminal.dadAddress = fatherAddressResult.value;
      aminal.father = fatherAddressResult.value;
    }
  }
  
  // Set visual traits (Gene NFT IDs)
  aminal.backId = event.params.backId;
  aminal.armId = event.params.armId;
  aminal.tailId = event.params.tailId;
  aminal.earsId = event.params.earsId;
  aminal.bodyId = event.params.bodyId;
  aminal.faceId = event.params.faceId;
  aminal.mouthId = event.params.mouthId;
  aminal.miscId = event.params.miscId;
  
  // Update Gene NFT usage relationships
  let genesNFTAddress = Address.fromBytes(factory.genesNFT);
  updateGeneNFTUsage(genesNFTAddress, event.params.backId, event.params.aminalAddress);
  updateGeneNFTUsage(genesNFTAddress, event.params.armId, event.params.aminalAddress);
  updateGeneNFTUsage(genesNFTAddress, event.params.tailId, event.params.aminalAddress);
  updateGeneNFTUsage(genesNFTAddress, event.params.earsId, event.params.aminalAddress);
  updateGeneNFTUsage(genesNFTAddress, event.params.bodyId, event.params.aminalAddress);
  updateGeneNFTUsage(genesNFTAddress, event.params.faceId, event.params.aminalAddress);
  updateGeneNFTUsage(genesNFTAddress, event.params.mouthId, event.params.aminalAddress);
  updateGeneNFTUsage(genesNFTAddress, event.params.miscId, event.params.aminalAddress);
  
  // Fetch tokenURI metadata
  let tokenURI = fetchTokenURI(event.params.aminalAddress);
  if (tokenURI) {
    aminal.tokenURI = tokenURI;
  }
  
  // Initialize state
  aminal.energy = BigInt.fromI32(50); // Default starting energy
  aminal.totalLove = BigInt.fromI32(0);
  aminal.breeding = false;
  
  // Creation info
  aminal.blockNumber = event.block.number;
  aminal.blockTimestamp = event.block.timestamp;
  aminal.transactionHash = event.transaction.hash;
  
  aminal.save();
  
  // Create a data source for this individual Aminal contract
  AminalTemplate.create(event.params.aminalAddress);
  
  log.info("New Aminal spawned: {} at index {}", [
    event.params.aminalAddress.toHexString(),
    event.params.aminalIndex.toString()
  ]);
}

export function handleBreedAminal(event: BreedAminalEvent): void {
  // Load the Aminal entities
  let aminalOne = Aminal.load(event.params.aminalOne);
  let aminalTwo = Aminal.load(event.params.aminalTwo);
  
  if (!aminalOne || !aminalTwo) {
    log.error("One or both Aminals not found for breeding event: {} and {}", [
      event.params.aminalOne.toHexString(),
      event.params.aminalTwo.toHexString()
    ]);
    return;
  }
  
  // Create breed event entity
  let breedEvent = new BreedAminal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  breedEvent.aminalOne = aminalOne.id;
  breedEvent.aminalTwo = aminalTwo.id;
  breedEvent.auctionId = event.params.auctionId;
  
  // Link to auction if one was created
  if (event.params.auctionId.gt(BigInt.fromI32(0))) {
    breedEvent.auction = Bytes.fromI32(event.params.auctionId.toI32());
    
    // Set breeding status
    aminalOne.breeding = true;
    aminalTwo.breeding = true;
    
    aminalOne.save();
    aminalTwo.save();
  }
  
  breedEvent.blockNumber = event.block.number;
  breedEvent.blockTimestamp = event.block.timestamp;
  breedEvent.transactionHash = event.transaction.hash;
  
  breedEvent.save();
  
  log.info("Breed event created between {} and {} with auction ID {}", [
    event.params.aminalOne.toHexString(),
    event.params.aminalTwo.toHexString(),
    event.params.auctionId.toString()
  ]);
}