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
    IAminalStructs.Visuals[] public initialVisuals;

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

        // First Aminal with cute orangey theme (genes 0-7)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(0, 1, 2, 3, 4, 5, 6, 7));

        // Second Aminal with 3 eyed monster theme (genes 8-15)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(8, 9, 10, 11, 12, 13, 14, 15));

        // Third Aminal with blue/moon theme (genes 16-23)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(16, 17, 18, 19, 20, 21, 22, 23));

        // Fourth Aminal with blue/moon theme (genes 24-31)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(24, 25, 26, 27, 28, 29, 30, 31));

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
