// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/**
 * @title Gene NFT System Test
 * @notice Tests for the gene NFT system including creation, validation, and basic functionality.
 * For full design voting tests, see Breeding.t.sol
 */
contract GeneNFTSystemTest is Test, IAminalStructs {
    AminalFactory public aminalFactory;
    Genes public genes;
    GeneRegistry public geneRegistry;
    GeneAuction public geneAuction;
    AminalProposals public proposals;

    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);
    address public david = address(0x4);

    string constant SAMPLE_BACKGROUND = '<rect width="1000" height="1000" fill="#87CEEB"/>';

    function setUp() public {
        // Deploy all contracts
        genes = new Genes();
        geneRegistry = new GeneRegistry(address(genes));
        geneAuction = new GeneAuction(address(genes), address(geneRegistry));
        proposals = new AminalProposals();
        aminalFactory = new AminalFactory();

        // Initialize contracts
        aminalFactory.initialize(address(geneAuction), address(proposals), address(genes));
        genes.setup(address(aminalFactory), address(geneRegistry));
        geneAuction.setup(address(aminalFactory));
        proposals.setup(address(aminalFactory));
        aminalFactory.setup();

        // Give test users ETH
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
        vm.deal(david, 10 ether);
    }

    function testGeneCreation() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Sky Background", "A blue sky", "Background");

        assertEq(geneId, 1, "First gene should have ID 1 (not 0, to avoid empty slot collision)");
        assertEq(genes.ownerOf(geneId), alice, "Alice should own the gene");
        assertEq(genes.getGeneSVG(geneId), SAMPLE_BACKGROUND, "SVG should match");
        assertTrue(geneRegistry.isValidGene(geneId), "Gene should be valid");
    }

    function testInvalidGeneValidation() public {
        assertFalse(geneRegistry.isValidGene(999), "Non-existent gene should not be valid");
    }

    // NOTE: Category tests removed - genes no longer have categories
    // With per-Aminal placement, any gene can be placed in any slot

    function testGeneTransfer() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        // Alice transfers to Bob
        vm.prank(alice);
        genes.transferFrom(alice, bob, geneId);

        assertEq(genes.ownerOf(geneId), bob, "Bob should now own the gene");
    }

    function testGeneMintWithZeroAddress() public {
        // Ensure that createGene cannot mint to the zero address
        vm.expectRevert("ERC721: mint to the zero address");
        vm.prank(address(0));
        geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");
    }

    function testMultipleGeneCreation() public {
        vm.prank(alice);
        uint256 gene1 = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        vm.prank(bob);
        uint256 gene2 = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        assertEq(gene1, 1, "First gene ID should be 1 (not 0, to avoid empty slot collision)");
        assertEq(gene2, 2, "Second gene ID should be 2");
        assertEq(genes.ownerOf(gene1), alice, "Alice owns first gene");
        assertEq(genes.ownerOf(gene2), bob, "Bob owns second gene");
    }

    function testSameContentForDifferentGenes() public {
        // Same SVG content can be used for different gene NFTs
        vm.prank(alice);
        uint256 gene1 = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        vm.prank(bob);
        uint256 gene2 = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        assertEq(genes.getGeneSVG(gene1), SAMPLE_BACKGROUND, "Gene1 SVG matches");
        assertEq(genes.getGeneSVG(gene2), SAMPLE_BACKGROUND, "Gene2 SVG matches");
        // Both genes can be placed in any slot with per-Aminal placement
    }

    function testGeneOwnershipQuery() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        assertEq(genes.ownerOf(geneId), alice, "Correct owner returned");
    }

    function testGeneValidation() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        assertTrue(geneRegistry.isValidGene(geneId), "Created gene should be valid");
        assertFalse(geneRegistry.isValidGene(geneId + 1), "Non-existent gene should not be valid");
    }

    function testBreedingCreatesAuction() public {
        // First spawn some initial Aminals to test with
        Visuals[] memory initialVisuals = new Visuals[](2);
        // Parent 1 - 9 genes in first 9 slots
        for (uint256 i = 0; i < 9; i++) {
            initialVisuals[0].genes[i] = i + 1;
        }
        // Parent 2 - 8 different genes in first 9 slots
        for (uint256 i = 0; i < 9; i++) {
            initialVisuals[1].genes[i] = i + 9;
        }
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Get aminal addresses and feed them so Alice has love to propose genes
        address aminal1 = aminalFactory.getAminalByIndex(0);
        address aminal2 = aminalFactory.getAminalByIndex(1);

        // Alice feeds both aminals to get love
        vm.prank(alice);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        // Alice breeds aminals which creates an auction
        vm.prank(alice);
        uint256 auctionId = aminalFactory.breedAminals(aminal1, aminal2, 0);

        assertTrue(geneAuction.isVotingActive(auctionId));
    }

    function testCreateGeneFor() public {
        // Alice creates a gene for Bob
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGeneFor(bob, SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        // Verify gene was created correctly
        assertEq(geneId, 1, "First gene should have ID 1 (not 0, to avoid empty slot collision)");
        assertEq(genes.ownerOf(geneId), bob, "Bob should own the gene");
    }

    function testCreateGeneForZeroAddress() public {
        vm.prank(alice);
        vm.expectRevert("ERC721: mint to the zero address");
        geneRegistry.createGeneFor(address(0), SAMPLE_BACKGROUND, "Test Gene", "", "Background");
    }

    function testSVGStorageAndRetrieval() public {
        string memory longSvg =
            '<svg width="1000" height="1000"><rect x="0" y="0" width="1000" height="1000" fill="blue"/><circle cx="500" cy="500" r="200" fill="yellow"/></svg>';

        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(longSvg, "Test Gene", "", "Background");

        assertEq(genes.getGeneSVG(geneId), longSvg, "Long SVG should be stored and retrieved correctly");
    }

    function testGeneBalance() public {
        // Alice creates multiple genes
        vm.startPrank(alice);
        geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");
        geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");
        geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");
        vm.stopPrank();

        assertEq(genes.balanceOf(alice), 3, "Alice should own 3 genes");
        assertEq(genes.balanceOf(bob), 0, "Bob should own 0 genes");
    }

    function testGeneApproval() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        // Alice approves Bob
        vm.prank(alice);
        genes.approve(bob, geneId);

        assertEq(genes.getApproved(geneId), bob, "Bob should be approved");

        // Bob can now transfer
        vm.prank(bob);
        genes.transferFrom(alice, charlie, geneId);

        assertEq(genes.ownerOf(geneId), charlie, "Charlie should now own the gene");
    }

    // NOTE: Gene metadata (placement) tests have been moved to gene auction tests
    // since placement is now per-Aminal via the auction, not global per-gene

    // Helper function to feed aminals
    function _feedAminals(address aminal1, address aminal2) internal {
        // Feed both aminals so users have love
        address[4] memory users = [alice, bob, charlie, david];
        for (uint256 i = 0; i < users.length; i++) {
            vm.prank(users[i]);
            AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
            vm.prank(users[i]);
            AminalContract(payable(aminal2)).feed{value: 0.1 ether}();
        }
    }
}
