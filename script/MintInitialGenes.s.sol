pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {CuteOrangeyGenesMinter} from "script/genes/CuteOrangeyGenesMinter.sol";
import {ThreeEyedGenesMinter} from "script/genes/ThreeEyedGenesMinter.sol";
import {BlueAnimatedGenesMinter} from "script/genes/BlueAnimatedGenesMinter.sol";
import {RedAnimatedGenesMinter} from "script/genes/RedAnimatedGenesMinter.sol";

/*
Mint initial genes using four separate contracts (one per Aminal) to avoid contract size limits

Usage:
forge script script/MintInitialGenes.s.sol:MintInitialGenes --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vv
*/

contract MintInitialGenes is Script {
    GeneRegistry public geneRegistry;

    // Store addresses of the four minter contracts
    address public cuteOrangeyMinterAddress;
    address public threeEyedMinterAddress;
    address public blueAnimatedMinterAddress;
    address public redAnimatedMinterAddress;

    function readDeploymentSummary() public returns (address geneRegistryAddr) {
        string memory json = vm.readFile("deployment-summary.json");

        // Parse the JSON to extract GeneRegistry address
        geneRegistryAddr = vm.parseJsonAddress(json, ".contracts.GeneRegistry");

        require(geneRegistryAddr != address(0), "GeneRegistry address not found in deployment summary");
    }

    function deployMinters() public {
        console.log("Deploying four separate minter contracts...");

        // Deploy Cute Orangey minter
        CuteOrangeyGenesMinter cuteOrangeyMinter = new CuteOrangeyGenesMinter();
        cuteOrangeyMinterAddress = address(cuteOrangeyMinter);
        console.log("CuteOrangeyGenesMinter deployed to:", cuteOrangeyMinterAddress);

        // Deploy Three-Eyed minter
        ThreeEyedGenesMinter threeEyedMinter = new ThreeEyedGenesMinter();
        threeEyedMinterAddress = address(threeEyedMinter);
        console.log("ThreeEyedGenesMinter deployed to:", threeEyedMinterAddress);

        // Deploy Blue Animated minter
        BlueAnimatedGenesMinter blueAnimatedMinter = new BlueAnimatedGenesMinter();
        blueAnimatedMinterAddress = address(blueAnimatedMinter);
        console.log("BlueAnimatedGenesMinter deployed to:", blueAnimatedMinterAddress);

        // Deploy Red Animated minter
        RedAnimatedGenesMinter redAnimatedMinter = new RedAnimatedGenesMinter();
        redAnimatedMinterAddress = address(redAnimatedMinter);
        console.log("RedAnimatedGenesMinter deployed to:", redAnimatedMinterAddress);
    }

    function mintGenesInSeparateTransactions() public {
        console.log("Minting genes using 4 separate contracts in 4 separate transactions...");

        // Transaction 1: Mint Cute Orangey Aminal genes
        console.log("Minting Cute Orangey Aminal genes (8 genes)...");
        CuteOrangeyGenesMinter cuteOrangeyMinter = CuteOrangeyGenesMinter(cuteOrangeyMinterAddress);
        cuteOrangeyMinter.mintGenes(geneRegistry);
        console.log("Cute Orangey Aminal genes minted successfully!");

        // Transaction 2: Mint Three-Eyed Aminal genes
        console.log("Minting Three-Eyed Aminal genes (8 genes)...");
        ThreeEyedGenesMinter threeEyedMinter = ThreeEyedGenesMinter(threeEyedMinterAddress);
        threeEyedMinter.mintGenes(geneRegistry);
        console.log("Three-Eyed Aminal genes minted successfully!");

        // Transaction 3: Mint Blue Animated Aminal genes
        console.log("Minting Blue Animated Aminal genes (8 genes)...");
        BlueAnimatedGenesMinter blueAnimatedMinter = BlueAnimatedGenesMinter(blueAnimatedMinterAddress);
        blueAnimatedMinter.mintGenes(geneRegistry);
        console.log("Blue Animated Aminal genes minted successfully!");

        // Transaction 4: Mint Red Animated Aminal genes
        console.log("Minting Red Animated Aminal genes (8 genes)...");
        RedAnimatedGenesMinter redAnimatedMinter = RedAnimatedGenesMinter(redAnimatedMinterAddress);
        redAnimatedMinter.mintGenes(geneRegistry);
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

        // Create updated JSON with all minter addresses
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
            '    "CuteOrangeyGenesMinter": "',
            vm.toString(cuteOrangeyMinterAddress),
            '",\n',
            '    "ThreeEyedGenesMinter": "',
            vm.toString(threeEyedMinterAddress),
            '",\n',
            '    "BlueAnimatedGenesMinter": "',
            vm.toString(blueAnimatedMinterAddress),
            '",\n',
            '    "RedAnimatedGenesMinter": "',
            vm.toString(redAnimatedMinterAddress),
            '"\n',
            "  }\n",
            "}"
        );

        vm.writeFile("deployment-summary.json", updatedJson);
        console.log("Deployment summary updated with all minter contract addresses");
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Read GeneRegistry address
        address geneRegistryAddr = readDeploymentSummary();
        geneRegistry = GeneRegistry(geneRegistryAddr);
        console.log("Using GeneRegistry at:", address(geneRegistry));

        vm.startBroadcast(deployerPrivateKey);

        // Deploy all four minter contracts in separate transactions
        deployMinters();

        // Mint genes using the four contracts in 4 separate transactions
        mintGenesInSeparateTransactions();

        vm.stopBroadcast();

        // Update deployment summary after broadcasting is complete
        updateDeploymentSummary();

        console.log("");
        console.log("Gene minting deployment complete!");
        console.log("Summary:");
        console.log("   - 4 minter contracts deployed (one per Aminal)");
        console.log("   - 32 genes minted across 4 Aminals");
        console.log("   - 8 total transactions executed (4 deploys + 4 minting)");
        console.log("");
        console.log("Next step: Run SpawnInitialAminals.s.sol");
    }
}
