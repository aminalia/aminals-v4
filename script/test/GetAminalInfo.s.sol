pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal} from "src/Aminal.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

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
        console.log("Genes NFT:", address(factory.genes()));

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

            // Get visuals (flexible 1-10 gene system)
            IAminalStructs.Visuals memory visuals = aminal.getVisuals();
            console.log("Genes (1-10 flexible system):");
            for (uint256 j = 0; j < 10; j++) {
                if (visuals.genes[j] != 0) {
                    console.log("  Gene slot", j, ":", visuals.genes[j]);
                }
            }

            // Show token URI
            console.log("Token URI available - call tokenURI() to view");
        }

        console.log("\n=== GENE NFT SYSTEM ===");
        console.log("Note: Traits are now managed through the Gene NFT system");
        console.log("Anyone can create Gene NFTs for traits through the GeneRegistry");
        console.log("Traits are selected through love-based voting in gene auctions");
    }
}
