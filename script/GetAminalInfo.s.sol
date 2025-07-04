pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal} from "src/Aminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";

/*
Get information about all Aminals in the factory

Usage:
forge script script/GetAminalInfo.s.sol:GetAminalInfo --rpc-url $RPC_URL
*/

contract GetAminalInfo is Script {
    function run() external view {
        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));
        
        console.log("=== AMINAL FACTORY INFO ===");
        console.log("Factory address:", address(factory));
        console.log("Total Aminals:", factory.totalAminals());
        console.log("Gene Auction:", address(factory.geneAuction()));
        console.log("Proposals:", address(factory.proposals()));
        console.log("Genes NFT:", address(factory.genesNFT()));
        
        console.log("\n=== INDIVIDUAL AMINALS ===");
        
        for (uint256 i = 0; i < factory.totalAminals(); i++) {
            address aminalAddress = factory.aminalsByIndex(i);
            Aminal aminal = Aminal(payable(aminalAddress));
            
            console.log("\n--- Aminal", i, "---");
            console.log("Address:", aminalAddress);
            console.log("Index:", aminal.aminalIndex());
            console.log("Mom:", aminal.momAddress());
            console.log("Dad:", aminal.dadAddress());
            console.log("Total Love:", aminal.getTotalLove());
            console.log("Energy:", aminal.getEnergy());
            console.log("Breeding:", aminal.breeding());
            
            // Get visuals
            IAminalStructs.Visuals memory visuals = aminal.getVisuals();
            console.log("Visuals - Back:", visuals.backId);
            console.log("Visuals - Arm:", visuals.armId);
            console.log("Visuals - Tail:", visuals.tailId);
            console.log("Visuals - Ears:", visuals.earsId);
            console.log("Visuals - Body:", visuals.bodyId);
            console.log("Visuals - Face:", visuals.faceId);
            console.log("Visuals - Mouth:", visuals.mouthId);
            console.log("Visuals - Misc:", visuals.miscId);
            
            // Show token URI
            console.log("Token URI available - call tokenURI() to view");
        }
        
        console.log("\n=== TRAIT COUNTS ===");
        console.log("Backgrounds:", factory.getBackgroundsLength());
        console.log("Arms:", factory.getArmsLength());
        console.log("Tails:", factory.getTailsLength());
        console.log("Ears:", factory.getEarsLength());
        console.log("Bodies:", factory.getBodiesLength());
        console.log("Faces:", factory.getFacesLength());
        console.log("Mouths:", factory.getMouthsLength());
        console.log("Misc:", factory.getMiscsLength());
    }
}