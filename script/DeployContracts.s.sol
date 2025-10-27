pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Genes} from "src/genes/Genes.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {FightSkill} from "src/skills/FightSkill.sol";

/*
Deploy core contracts only

Usage:
forge script script/DeployContracts.s.sol:DeployContracts --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vv
*/

contract DeployContracts is Script {
    AminalFactory public factory;
    GeneRegistry public geneRegistry;

    // Track deployed addresses for summary
    address public genesAddress;
    address public geneAuctionAddress;
    address public proposalsAddress;
    address public factoryAddress;
    address public move2DAddress;
    address public fightSkillAddress;

    function deployAminalFactory() public returns (address) {
        // Deploy contracts in correct order
        Genes _Genes = new Genes();
        genesAddress = address(_Genes);
        console.log("Genes deployed to:", genesAddress);

        // Deploy GeneRegistry with the Genes contract address
        geneRegistry = new GeneRegistry(address(_Genes));
        console.log("GeneRegistry deployed to:", address(geneRegistry));

        GeneAuction _geneAuction = new GeneAuction(address(_Genes), address(geneRegistry));
        geneAuctionAddress = address(_geneAuction);
        console.log("GeneAuction deployed to:", geneAuctionAddress);

        AminalProposals _proposals = new AminalProposals();
        proposalsAddress = address(_proposals);
        console.log("AminalProposals deployed to:", proposalsAddress);

        AminalFactory _factory = new AminalFactory();
        factoryAddress = address(_factory);
        console.log("AminalFactory deployed to:", factoryAddress);

        // Initialize the factory
        _factory.initialize(address(_geneAuction), address(_proposals), address(_Genes));
        console.log("AminalFactory initialized");

        // Setup dependencies
        _geneAuction.setup(address(_factory));
        console.log("GeneAuction setup complete");

        _proposals.setup(address(_factory));
        console.log("AminalProposals setup complete");

        _Genes.setup(address(_factory), address(geneRegistry));
        console.log("Genes setup complete");

        return address(_factory);
    }

    function deploySkills(AminalFactory factoryInstance) public {
        // Deploy skills - no registration needed in new architecture
        Move2D move2DSkill = new Move2D(address(factoryInstance));
        move2DAddress = address(move2DSkill);

        FightSkill fightSkiller = new FightSkill(address(factoryInstance));
        fightSkillAddress = address(fightSkiller);

        console.log("Move2D skill deployed to:", address(move2DSkill));
        console.log("FightSkill deployed to:", address(fightSkiller));
        console.log("Skills are globally accessible - no registration required");
    }

    function writeDeploymentSummary() public {
        string memory chainId = vm.toString(block.chainid);
        string memory timestamp = vm.toString(block.timestamp);

        string memory json = string.concat(
            "{\n",
            '  "chainId": ',
            chainId,
            ",\n",
            '  "timestamp": ',
            timestamp,
            ",\n",
            '  "deployer": "',
            vm.toString(msg.sender),
            '",\n',
            '  "contracts": {\n',
            '    "Genes": "',
            vm.toString(genesAddress),
            '",\n',
            '    "GeneRegistry": "',
            vm.toString(address(geneRegistry)),
            '",\n',
            '    "GeneAuction": "',
            vm.toString(geneAuctionAddress),
            '",\n',
            '    "AminalProposals": "',
            vm.toString(proposalsAddress),
            '",\n',
            '    "AminalFactory": "',
            vm.toString(factoryAddress),
            '",\n',
            '    "Move2D": "',
            vm.toString(move2DAddress),
            '",\n',
            '    "FightSkill": "',
            vm.toString(fightSkillAddress),
            '"\n',
            "  }\n",
            "}"
        );

        vm.writeFile("deployment-summary.json", json);
        console.log("Deployment summary written to deployment-summary.json");
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy core contracts
        factory = AminalFactory(deployAminalFactory());

        // Setup the factory to deploy loveVRGDA
        factory.setup();
        console.log("Factory setup complete with loveVRGDA");

        // Deploy and register skills
        deploySkills(factory);

        vm.stopBroadcast();

        // Write deployment summary after broadcasting is complete
        writeDeploymentSummary();

        console.log("Core contracts deployment complete!");
        console.log("Next steps:");
        console.log("1. Run MintInitialGenes.s.sol");
        console.log("2. Run SpawnInitialAminals.s.sol");
    }
}
