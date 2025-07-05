pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {GeneNFTFactory} from "src/genes/GeneNFTFactory.sol";
import {GenesNFT} from "src/genes/GenesNFT.sol";

// TODO not sure if we need this script
contract DeployGeneFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get existing GenesNFT address from latest deployment
        address genesNFTAddress = 0x4C7fBa8CC9555Abb6F51b7Da33c82C0eEe8C6485;
        
        // Deploy GeneNFTFactory
        GeneNFTFactory geneFactory = new GeneNFTFactory(genesNFTAddress);
        console.log("GeneNFTFactory deployed to:", address(geneFactory));
        
        // Set the factory in GenesNFT
        GenesNFT genesNFT = GenesNFT(genesNFTAddress);
        genesNFT.setFactory(address(geneFactory));
        console.log("Set GeneNFTFactory as the factory in GenesNFT");

        vm.stopBroadcast();
    }
}
