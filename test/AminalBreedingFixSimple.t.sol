// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {GenesNFT} from "src/genes/GenesNFT.sol";
import {GeneNFTFactory} from "src/genes/GeneNFTFactory.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/**
 * @title Simple Breeding Fix Test
 * @dev Tests that the fixed breedAminals function correctly handles mutual consent
 */
contract AminalBreedingFixSimpleTest is Test, IAminalStructs {
    AminalFactory public factory;
    GenesNFT public genesNFT;
    GeneNFTFactory public geneFactory;
    GeneAuction public geneAuction;
    AminalProposals public proposals;

    address public alice = address(0x1);
    address public aminal1Address;
    address public aminal2Address;

    function setUp() public {
        // Deploy all contracts
        factory = new AminalFactory();
        genesNFT = new GenesNFT();
        geneFactory = new GeneNFTFactory(address(genesNFT));
        geneAuction = new GeneAuction(address(genesNFT), address(geneFactory));
        proposals = new AminalProposals();

        // Initialize factory
        factory.initialize(address(geneAuction), address(proposals), address(genesNFT));
        
        // Setup contracts properly
        genesNFT.setup(address(factory));
        genesNFT.setFactory(address(geneFactory));
        geneAuction.setup(address(factory), address(factory));
        proposals.setup(address(factory));
        factory.setup();

        // Give test accounts some ETH
        vm.deal(alice, 100 ether);

        // Spawn initial Aminals for testing
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] = Visuals({
            backId: 0, armId: 0, tailId: 0, earsId: 0,
            bodyId: 0, faceId: 0, mouthId: 0, miscId: 0
        });
        initialVisuals[1] = Visuals({
            backId: 0, armId: 0, tailId: 0, earsId: 0,
            bodyId: 0, faceId: 0, mouthId: 0, miscId: 0
        });

        factory.spawnInitialAminals(initialVisuals);

        aminal1Address = factory.getAminalByIndex(0);
        aminal2Address = factory.getAminalByIndex(1);

        // Create basic genes
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}('<rect width="1000" height="1000" fill="#87CEEB"/>', VisualsCat.BACK);
    }

    function testMutualConsentWorksNow() public {
        console.log("=== TESTING MUTUAL CONSENT BREEDING FIX ===");

        // Feed both Aminals to build love
        vm.prank(alice);
        AminalContract(payable(aminal1Address)).feed{value: 1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2Address)).feed{value: 1 ether}();

        uint256 love1 = AminalContract(payable(aminal1Address)).getLoveByUser(alice);
        uint256 love2 = AminalContract(payable(aminal2Address)).getLoveByUser(alice);
        console.log("Alice's love for Aminal 1:", love1);
        console.log("Alice's love for Aminal 2:", love2);

        // Set up mutual consent through the factory breeding flow
        console.log("Setting up mutual consent through factory breeding calls...");
        
        // First call to set aminal1 -> aminal2 consent
        vm.prank(alice);
        uint256 result1 = factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);
        assertEq(result1, 0, "First call should set consent and return 0");
        
        // Second call to set aminal2 -> aminal1 consent
        vm.prank(alice);
        uint256 result2 = factory.breedAminals{value: 0.001 ether}(aminal2Address, aminal1Address);
        assertEq(result2, 0, "Second call should set consent and return 0");

        // Verify mutual consent exists
        assertTrue(AminalContract(payable(aminal1Address)).isBreedableWith(aminal2Address));
        assertTrue(AminalContract(payable(aminal2Address)).isBreedableWith(aminal1Address));
        console.log("Mutual consent confirmed");

        // Now test the FIX: This should create an auction, not fail with "Already breedable"
        vm.prank(alice);
        uint256 auctionId = factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);
        
        assertTrue(auctionId > 0, "Auction should be created with mutual consent - THIS IS THE FIX");
        console.log("SUCCESS: Auction created with ID:", auctionId);
        console.log("=== MUTUAL CONSENT FIX VERIFIED ===");
    }

    function testSingleConsentStillWorks() public {
        console.log("=== TESTING SINGLE CONSENT STILL WORKS ===");

        // Feed both Aminals to build love
        vm.prank(alice);
        AminalContract(payable(aminal1Address)).feed{value: 1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2Address)).feed{value: 1 ether}();

        // Test that single consent setting still works
        vm.prank(alice);
        uint256 result = factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);
        
        assertEq(result, 0, "Should return 0 for consent setting");
        assertTrue(AminalContract(payable(aminal1Address)).isBreedableWith(aminal2Address));
        assertFalse(AminalContract(payable(aminal2Address)).isBreedableWith(aminal1Address));
        
        console.log("SUCCESS: Single consent setting works correctly");
        console.log("=== SINGLE CONSENT TEST PASSED ===");
    }
}