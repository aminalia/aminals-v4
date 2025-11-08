pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/*
Spawn initial Aminals using deployed contracts

Usage:
forge script script/SpawnInitialAminals.s.sol:SpawnInitialAminals --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vv
*/

contract SpawnInitialAminals is Script {
    AminalFactory public factory;

    function readDeploymentSummary() public returns (address factoryAddr) {
        string memory json = vm.readFile("deployment-summary.json");

        // Parse the JSON to extract AminalFactory address
        factoryAddr = vm.parseJsonAddress(json, ".contracts.AminalFactory");

        require(factoryAddr != address(0), "AminalFactory address not found in deployment summary");
    }

    function spawnInitialAminals() public {
        address factoryAddr = readDeploymentSummary();
        factory = AminalFactory(factoryAddr);

        console.log("Using AminalFactory at:", address(factory));

        IAminalStructs.GeneInstance[9][] memory genesisGenes = new IAminalStructs.GeneInstance[9][](4);

        // First Aminal with cute orangey theme (genes 0-7 in first 8 slots)
        // Default placement: centered, 100% scale, no rotation
        for (uint256 i = 0; i < 8; i++) {
            genesisGenes[0][i] =
                IAminalStructs.GeneInstance({geneId: i, offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        // Second Aminal with 3 eyed monster theme (genes 8-15 in first 8 slots)
        for (uint256 i = 0; i < 8; i++) {
            genesisGenes[1][i] =
                IAminalStructs.GeneInstance({geneId: 8 + i, offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        // Third Aminal with blue/moon theme (genes 16-23 in first 8 slots)
        for (uint256 i = 0; i < 8; i++) {
            genesisGenes[2][i] =
                IAminalStructs.GeneInstance({geneId: 16 + i, offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        // Fourth Aminal (genes 24-31 in first 8 slots)
        for (uint256 i = 0; i < 8; i++) {
            genesisGenes[3][i] =
                IAminalStructs.GeneInstance({geneId: 24 + i, offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        factory.spawnInitialAminals(genesisGenes);
        console.log("Spawned", genesisGenes.length, "initial Aminals");
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        spawnInitialAminals();

        vm.stopBroadcast();

        console.log("Initial Aminals spawning complete!");
        console.log("Full deployment process finished!");
        console.log("Next steps:");
        console.log("1. Update contract addresses in graph/subgraph.yaml");
        console.log("2. Update start blocks to deployment blocks");
        console.log("3. Deploy subgraph");
    }
}
