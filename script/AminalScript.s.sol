pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/IAminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {GenesNFT} from "src/genes/GenesNFT.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {MoveTwice} from "src/skills/MoveTwice.sol";
import {InitialGenesMinter} from "script/InitialGenesMinter.sol";

/*
// Mainnet
forge script script/AminalScript.s.sol:AminalScript --broadcast --verify -vvvv

// Goerli
forge script script/AminalScript.s.sol:AminalScript --chain-id 5  --rpc-url "https://goerli.blockpi.network/v1/rpc/public" --broadcast  --verify -vvvv

// Sepolia
forge script  script/AminalScript.s.sol:AminalScript --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vvv

// Holesky
forge script  script/AminalScript.s.sol:AminalScript --chain-id 17000 --rpc-url "https://ethereum-holesky.publicnode.com" --broadcast --verify -vvv

forge script  script/AminalScript.s.sol:AminalScript --chain-id 17000 --rpc-url "https://ethereum-holesky.publicnode.com" --broadcast --verify -vv


When updating the smart contract:
- replace address of the aminal contract (everywhere) + address of the Visuals in subgraph.yaml
- copy  the ABI in both frontend and graph folder:   out/ContractName.sol/ContractName.json --> frontend/deployments/ + graph/abis/

reload the graph:
graph auth --studio 06bd7ece44455bca6730ca207e1f7606
cd graph
npm i (if needed)
graph codegen && graph build
graph deploy --studio aminals

When updating the graphQL:
- .graphclientrc.yml --> change the endpoint
npm run graphclient:build
*/

contract AminalScript is Script {
    AminalFactory public factory;
    IAminalStructs.Visuals[] public initialVisuals;

    function deployAminalFactory() public returns (address) {
        // Deploy contracts in correct order
        GenesNFT _genesNFT = new GenesNFT();
        // TODO: Deploy GeneNFTFactory when needed for full Gene NFT system
        // For now, we use a placeholder address for the factory
        GeneAuction _geneAuction = new GeneAuction(
            address(_genesNFT),
            address(0x0) // Placeholder for GeneNFTFactory
        );
        AminalProposals _proposals = new AminalProposals();

        AminalFactory _factory = new AminalFactory();

        // Set environment variables for contracts
        vm.setEnv("AMINAL_FACTORY_CONTRACT", vm.toString(address(_factory)));
        vm.setEnv("AMINAL_PROPOSALS_CONTRACT", vm.toString(address(_proposals)));
        vm.setEnv("GENE_AUCTION_CONTRACT", vm.toString(address(_geneAuction)));
        vm.setEnv("GENES_NFT_CONTRACT", vm.toString(address(_genesNFT)));

        // Initialize the factory
        _factory.initialize(address(_geneAuction), address(_proposals), address(_genesNFT));

        // Setup dependencies
        _geneAuction.setup(address(_factory), address(_factory));
        _proposals.setup(address(_factory));
        _genesNFT.setup(address(_factory));

        return address(_factory);
    }

    function spawnInitialAminals(AminalFactory factoryInstance) public {
        // First Aminal with blue/purple theme (genes 0-7)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(0, 2, 1, 3, 4, 5, 6, 7));
        
        // Second Aminal with red/orange theme (genes 8-15)
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId
        initialVisuals.push(IAminalStructs.Visuals(8, 10, 9, 11, 12, 13, 14, 15));
        
        factoryInstance.spawnInitialAminals(initialVisuals);
    }

    function deploySkills(AminalFactory factoryInstance) public {
        // Deploy skills - no registration needed in new architecture
        Move2D move2DSkill = new Move2D(address(factoryInstance));
        MoveTwice moveTwiceSkill = new MoveTwice(address(factoryInstance), address(move2DSkill));

        console.log("Move2D skill deployed to:", address(move2DSkill));
        console.log("MoveTwice skill deployed to:", address(moveTwiceSkill));
        console.log("Skills are globally accessible - no registration required");
    }

    function deployInitialGenes() public {
        GenesNFT genesNFT = GenesNFT(vm.envAddress("GENES_NFT_CONTRACT"));

        // Deploy temporary minter contract
        InitialGenesMinter minter = new InitialGenesMinter();
        console.log("InitialGenesMinter deployed to:", address(minter));

        // Set minter as temporary gene factory
        genesNFT.setFactory(address(minter));
        console.log("Set minter as temporary gene factory");

        // Mint initial genes
        minter.mintInitialGenes(genesNFT, msg.sender);
        console.log("Initial genes minted to:", msg.sender);
        console.log("Gene IDs 0-7: Blue/Purple theme");
        console.log("Gene IDs 8-15: Red/Orange theme");

        // Reset gene factory to address(0) for security
        genesNFT.setFactory(address(0));
        console.log("Gene factory reset to address(0)");
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        factory = AminalFactory(deployAminalFactory());

        // Setup the factory to deploy loveVRGDA
        factory.setup();

        // Deploy and register skills
        deploySkills(factory);

        deployInitialGenes();

        spawnInitialAminals(factory);

        vm.stopBroadcast();
    }
}

// TODO what if invalid visuals get included - how to validate and ignore
