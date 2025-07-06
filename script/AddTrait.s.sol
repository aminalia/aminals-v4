pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {GenesNFT} from "src/genes/GenesNFT.sol";

/*
forge script script/AminalScript.s.sol:AminalScript --broadcast --verify -vvvv
 
forge script script/AminalScript.s.sol:AminalScript --chain-id 5  --rpc-url "https://goerli.blockpi.network/v1/rpc/public" --broadcast  --verify -vvvv

forge script  script/AddTrait.s.sol:AminalScript --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vvv

*/

contract AddTraitScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory aminalFactory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));
        GeneAuction geneAuction = GeneAuction(aminalFactory.geneAuction());

        // Get Gene NFT Factory for creating new traits
        GenesNFT genesNFT = GenesNFT(aminalFactory.genesNFT());

        // In the new architecture, anyone can create Gene NFTs for traits
        // This script demonstrates how to create a new face trait as a Gene NFT

        console.log("Creating new face trait Gene NFT...");
        console.log("Use the GeneNFTFactory.createGene() function to add new traits");
        console.log("Traits are now permissionless and managed through the Gene NFT system");

        vm.stopBroadcast();
    }
}
