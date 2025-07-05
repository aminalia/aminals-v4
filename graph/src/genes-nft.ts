import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  GenesNFT as GenesNFTContract,
  Transfer as TransferEvent
} from "../generated/GenesNFT/GenesNFT";
import {
  GeneNFT,
  User
} from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  // Skip mint events where from is zero address
  if (event.params.from.equals(Address.zero())) {
    // This is a mint event - create new GeneNFT entity
    let geneNFT = new GeneNFT(
      event.address.concat(Bytes.fromI32(event.params.tokenId.toI32()))
    );
    geneNFT.tokenId = event.params.tokenId;
    
    // Get contract to read metadata
    let contract = GenesNFTContract.bind(event.address);
    
    // Try to get gene info (svg and category)
    let geneInfoResult = contract.try_getGeneInfo(event.params.tokenId);
    if (!geneInfoResult.reverted) {
      geneNFT.traitType = geneInfoResult.value.value1; // category
      geneNFT.svg = geneInfoResult.value.value0; // svg
    } else {
      geneNFT.traitType = 0; // Default to BACK trait
      geneNFT.svg = "";
    }
    
    // Set default metadata (tokenURI contains base64 encoded JSON)
    geneNFT.name = "Aminal Gene #" + event.params.tokenId.toString();
    geneNFT.description = "A gene NFT representing a trait for Aminals";
    
    // Set creator (minter)
    let creator = User.load(event.params.to);
    if (!creator) {
      creator = new User(event.params.to);
      creator.address = event.params.to;
      creator.save();
    }
    geneNFT.creator = creator.id;
    
    // Set initial owner
    geneNFT.owner = creator.id;
    
    // Initialize empty arrays
    geneNFT.aminalsUsingGene = [];
    
    // Creation info
    geneNFT.blockNumber = event.block.number;
    geneNFT.blockTimestamp = event.block.timestamp;
    geneNFT.transactionHash = event.transaction.hash;
    
    geneNFT.save();
    
    log.info("Gene NFT minted: token ID {} to {}", [
      event.params.tokenId.toString(),
      event.params.to.toHexString()
    ]);
  } else {
    // This is a transfer event - update owner
    let geneNFT = GeneNFT.load(
      event.address.concat(Bytes.fromI32(event.params.tokenId.toI32()))
    );
    
    if (geneNFT) {
      // Create or load new owner
      let newOwner = User.load(event.params.to);
      if (!newOwner) {
        newOwner = new User(event.params.to);
        newOwner.address = event.params.to;
        newOwner.save();
      }
      
      geneNFT.owner = newOwner.id;
      geneNFT.save();
      
      log.info("Gene NFT transferred: token ID {} from {} to {}", [
        event.params.tokenId.toString(),
        event.params.from.toHexString(),
        event.params.to.toHexString()
      ]);
    } else {
      log.error("Gene NFT not found for transfer: token ID {}", [
        event.params.tokenId.toString()
      ]);
    }
  }
}