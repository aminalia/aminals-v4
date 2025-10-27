pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {InitialGenesMinter} from "script/genes/InitialGenesMinter.sol";
import {InitialGenesMinter2} from "script/genes/InitialGenesMinter2.sol";

/*
Mint initial genes using deployed contracts

Usage:
forge script script/MintInitialGenes.s.sol:MintInitialGenes --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vv
*/

contract MintInitialGenes is Script {
    GeneRegistry public geneRegistry;
    address public minter1Address;
    address public minter2Address;

    function readDeploymentSummary() public returns (address geneRegistryAddr) {
        string memory json = vm.readFile("deployment-summary.json");

        // Parse the JSON to extract GeneRegistry address
        geneRegistryAddr = vm.parseJsonAddress(json, ".contracts.GeneRegistry");

        require(geneRegistryAddr != address(0), "GeneRegistry address not found in deployment summary");
    }

    function mintInitialGenes() public {
        address geneRegistryAddr = readDeploymentSummary();
        geneRegistry = GeneRegistry(geneRegistryAddr);

        console.log("Using GeneRegistry at:", address(geneRegistry));

        // Deploy temporary minter contracts
        InitialGenesMinter minter = new InitialGenesMinter();
        minter1Address = address(minter);
        console.log("InitialGenesMinter deployed to:", address(minter));

        InitialGenesMinter2 minter2 = new InitialGenesMinter2();
        minter2Address = address(minter2);
        console.log("InitialGenesMinter2 deployed to:", address(minter2));

        // Mint initial genes through the GeneRegistry (properly emits events for Ponder)
        minter.mintInitialGenesAnimated(geneRegistry);
        console.log("Initial genes (set 1) created through GeneRegistry");

        minter2.mintInitialGenesAnimated(geneRegistry);
        console.log("Initial genes (set 2) created through GeneRegistry");
    }

    function updateDeploymentSummary() public {
        string memory json = vm.readFile("deployment-summary.json");

        // Parse existing data
        uint256 chainIdValue = vm.parseJsonUint(json, ".chainId");
        uint256 timestamp = vm.parseJsonUint(json, ".timestamp");
        address deployer = vm.parseJsonAddress(json, ".deployer");
        address genesAddr = vm.parseJsonAddress(json, ".contracts.Genes");
        address geneRegistryAddr = vm.parseJsonAddress(json, ".contracts.GeneRegistry");
        address geneAuctionAddr = vm.parseJsonAddress(json, ".contracts.GeneAuction");
        address proposalsAddr = vm.parseJsonAddress(json, ".contracts.AminalProposals");
        address factoryAddr = vm.parseJsonAddress(json, ".contracts.AminalFactory");
        address move2DAddr = vm.parseJsonAddress(json, ".contracts.Move2D");
        address fightSkillAddr = vm.parseJsonAddress(json, ".contracts.FightSkill");

        // Create updated JSON with minter addresses
        string memory updatedJson = string.concat(
            "{\n",
            '  "chainId": ',
            vm.toString(chainIdValue),
            ",\n",
            '  "timestamp": ',
            vm.toString(timestamp),
            ",\n",
            '  "deployer": "',
            vm.toString(deployer),
            '",\n',
            '  "contracts": {\n',
            '    "Genes": "',
            vm.toString(genesAddr),
            '",\n',
            '    "GeneRegistry": "',
            vm.toString(geneRegistryAddr),
            '",\n',
            '    "GeneAuction": "',
            vm.toString(geneAuctionAddr),
            '",\n',
            '    "AminalProposals": "',
            vm.toString(proposalsAddr),
            '",\n',
            '    "AminalFactory": "',
            vm.toString(factoryAddr),
            '",\n',
            '    "Move2D": "',
            vm.toString(move2DAddr),
            '",\n',
            '    "FightSkill": "',
            vm.toString(fightSkillAddr),
            '",\n',
            '    "InitialGenesMinter": "',
            vm.toString(minter1Address),
            '",\n',
            '    "InitialGenesMinter2": "',
            vm.toString(minter2Address),
            '"\n',
            "  }\n",
            "}"
        );

        vm.writeFile("deployment-summary.json", updatedJson);
        console.log("Deployment summary updated with minter addresses");
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        mintInitialGenes();

        vm.stopBroadcast();

        // Update deployment summary after broadcasting is complete
        updateDeploymentSummary();

        console.log("Initial genes minting complete!");
        console.log("Next step: Run SpawnInitialAminals.s.sol");
    }
}
