pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {InitialGenesMinter} from "script/genes/InitialGenesMinter.sol";

/*
Mint initial genes using single contract with 4 separate function calls

Usage:
forge script script/MintInitialGenes.s.sol:MintInitialGenes --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vv
*/

contract MintInitialGenes is Script {
    GeneRegistry public geneRegistry;
    address public minterAddress;

    function readDeploymentSummary() public returns (address geneRegistryAddr) {
        string memory json = vm.readFile("deployment-summary.json");

        // Parse the JSON to extract GeneRegistry address
        geneRegistryAddr = vm.parseJsonAddress(json, ".contracts.GeneRegistry");

        require(geneRegistryAddr != address(0), "GeneRegistry address not found in deployment summary");
    }

    function deployMinter() public {
        console.log("Deploying InitialGenesMinter contract...");

        // Deploy the single minter contract
        InitialGenesMinter minter = new InitialGenesMinter();
        minterAddress = address(minter);
        console.log("InitialGenesMinter deployed to:", address(minter));
    }

    function mintGenesInSeparateTransactions() public {
        console.log("Minting genes in 4 separate transactions...");

        // Get minter contract
        InitialGenesMinter minter = InitialGenesMinter(minterAddress);

        // Transaction 1: Mint Cute Orangey Aminal genes
        console.log("Minting Cute Orangey Aminal genes (8 genes)...");
        minter.mintCuteOrangeyGenes(geneRegistry);
        console.log("Cute Orangey Aminal genes minted successfully!");

        // Transaction 2: Mint Three-Eyed Aminal genes
        console.log("Minting Three-Eyed Aminal genes (8 genes)...");
        minter.mintThreeEyedGenes(geneRegistry);
        console.log("Three-Eyed Aminal genes minted successfully!");

        // Transaction 3: Mint Blue Animated Aminal genes
        console.log("Minting Blue Animated Aminal genes (8 genes)...");
        minter.mintBlueAnimatedGenes(geneRegistry);
        console.log("Blue Animated Aminal genes minted successfully!");

        // Transaction 4: Mint Red Animated Aminal genes
        console.log("Minting Red Animated Aminal genes (8 genes)...");
        minter.mintRedAnimatedGenes(geneRegistry);
        console.log("Red Animated Aminal genes minted successfully!");

        console.log("All 32 initial genes minted across 4 transactions!");
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

        // Create updated JSON with minter address
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
            vm.toString(minterAddress),
            '"\n',
            "  }\n",
            "}"
        );

        vm.writeFile("deployment-summary.json", updatedJson);
        console.log("Deployment summary updated with InitialGenesMinter address");
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Read GeneRegistry address
        address geneRegistryAddr = readDeploymentSummary();
        geneRegistry = GeneRegistry(geneRegistryAddr);
        console.log("Using GeneRegistry at:", address(geneRegistry));

        vm.startBroadcast(deployerPrivateKey);

        // Deploy minter contract in one transaction
        deployMinter();

        // Mint genes in 4 separate transactions (each will be broadcast separately)
        mintGenesInSeparateTransactions();

        vm.stopBroadcast();

        // Update deployment summary after broadcasting is complete
        updateDeploymentSummary();

        console.log("");
        console.log("Gene minting deployment complete!");
        console.log("Summary:");
        console.log("   - InitialGenesMinter contract deployed");
        console.log("   - 32 genes minted across 4 Aminals");
        console.log("   - 5 total transactions executed (1 deploy + 4 minting)");
        console.log("");
        console.log("Next step: Run SpawnInitialAminals.s.sol");
    }
}
