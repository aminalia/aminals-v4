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

        IAminalStructs.Visuals[] memory initialVisuals = new IAminalStructs.Visuals[](4);

        // First Aminal with cute orangey theme (genes 0-7 in first 8 slots)
        for (uint256 i = 0; i < 8; i++) {
            initialVisuals[0].genes[i] = i;
        }

        // Second Aminal with 3 eyed monster theme (genes 8-15 in first 8 slots)
        for (uint256 i = 0; i < 8; i++) {
            initialVisuals[1].genes[i] = 8 + i;
        }

        // Third Aminal with blue/moon theme (genes 16-23 in first 8 slots)
        for (uint256 i = 0; i < 8; i++) {
            initialVisuals[2].genes[i] = 16 + i;
        }

        // Fourth Aminal (genes 24-31 in first 8 slots)
        for (uint256 i = 0; i < 8; i++) {
            initialVisuals[3].genes[i] = 24 + i;
        }

        factory.spawnInitialAminals(initialVisuals);
        console.log("Spawned", initialVisuals.length, "initial Aminals");
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
