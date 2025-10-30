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
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        assertEq(geneId, 0, "First gene should have ID 0");
        assertEq(genes.ownerOf(geneId), alice, "Alice should own the gene");
        assertEq(geneRegistry.geneSVGs(geneId), SAMPLE_BACKGROUND, "SVG should match");
        assertEq(uint256(geneRegistry.getGeneCategory(geneId)), uint256(VisualsCat.BACK), "Category should be BACK");
        assertTrue(geneRegistry.isValidGene(geneId), "Gene should be valid");
    }

    function testInvalidGeneValidation() public {
        assertFalse(geneRegistry.isValidGene(999), "Non-existent gene should not be valid");
    }

    function testGeneCategoryRetrieval() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        VisualsCat category = geneRegistry.getGeneCategory(geneId);
        assertEq(uint256(category), uint256(VisualsCat.BACK), "Should return correct category");
    }

    function testInvalidGeneCategoryReturnsDefault() public {
        // Non-existent gene returns default category value (BACK = 0)
        VisualsCat category = geneRegistry.getGeneCategory(999);
        assertEq(uint256(category), 0, "Non-existent gene should return default category");
    }

    function testGeneTransfer() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        // Alice transfers to Bob
        vm.prank(alice);
        genes.transferFrom(alice, bob, geneId);

        assertEq(genes.ownerOf(geneId), bob, "Bob should now own the gene");
    }

    function testGeneMintWithZeroAddress() public {
        // Ensure that createGene cannot mint to the zero address
        vm.expectRevert("ERC721: mint to the zero address");
        vm.prank(address(0));
        geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);
    }

    function testMultipleGeneCreation() public {
        vm.prank(alice);
        uint256 gene1 = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        vm.prank(bob);
        uint256 gene2 = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.ARM);

        assertEq(gene1, 0, "First gene ID should be 0");
        assertEq(gene2, 1, "Second gene ID should be 1");
        assertEq(genes.ownerOf(gene1), alice, "Alice owns first gene");
        assertEq(genes.ownerOf(gene2), bob, "Bob owns second gene");
    }

    function testSameContentDifferentCategory() public {
        // Same SVG content can be used for different categories
        vm.prank(alice);
        uint256 gene1 = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        vm.prank(bob);
        uint256 gene2 = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.ARM);

        assertEq(geneRegistry.geneSVGs(gene1), SAMPLE_BACKGROUND, "Gene1 SVG matches");
        assertEq(geneRegistry.geneSVGs(gene2), SAMPLE_BACKGROUND, "Gene2 SVG matches");
        assertEq(uint256(geneRegistry.getGeneCategory(gene1)), uint256(VisualsCat.BACK), "Gene1 is BACK");
        assertEq(uint256(geneRegistry.getGeneCategory(gene2)), uint256(VisualsCat.ARM), "Gene2 is ARM");
    }

    function testGeneOwnershipQuery() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        assertEq(genes.ownerOf(geneId), alice, "Correct owner returned");
    }

    function testGeneValidation() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        assertTrue(geneRegistry.isValidGene(geneId), "Created gene should be valid");
        assertFalse(geneRegistry.isValidGene(geneId + 1), "Non-existent gene should not be valid");
    }

    function testBreedingCreatesAuction() public {
        // First spawn some initial Aminals to test with
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});
        initialVisuals[1] =
            Visuals({backId: 2, armId: 2, tailId: 2, earsId: 2, bodyId: 2, faceId: 2, mouthId: 2, miscId: 2});
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
        uint256 auctionId = aminalFactory.breedAminals(aminal1, aminal2);

        assertTrue(geneAuction.isVotingActive(auctionId));
    }

    function testCreateGeneFor() public {
        // Alice creates a gene for Bob
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGeneFor(bob, SAMPLE_BACKGROUND, VisualsCat.BACK);

        // Verify gene was created correctly
        assertEq(geneId, 0, "First gene should have ID 0");
        assertEq(genes.ownerOf(geneId), bob, "Bob should own the gene");
    }

    function testCreateGeneForZeroAddress() public {
        vm.prank(alice);
        vm.expectRevert("ERC721: mint to the zero address");
        geneRegistry.createGeneFor(address(0), SAMPLE_BACKGROUND, VisualsCat.BACK);
    }

    function testSVGStorageAndRetrieval() public {
        string memory longSvg = '<svg width="1000" height="1000"><rect x="0" y="0" width="1000" height="1000" fill="blue"/><circle cx="500" cy="500" r="200" fill="yellow"/></svg>';

        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(longSvg, VisualsCat.FACE);

        assertEq(geneRegistry.geneSVGs(geneId), longSvg, "Long SVG should be stored and retrieved correctly");
    }

    function testGeneBalance() public {
        // Alice creates multiple genes
        vm.startPrank(alice);
        geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);
        geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.ARM);
        geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.TAIL);
        vm.stopPrank();

        assertEq(genes.balanceOf(alice), 3, "Alice should own 3 genes");
        assertEq(genes.balanceOf(bob), 0, "Bob should own 0 genes");
    }

    function testGeneApproval() public {
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, VisualsCat.BACK);

        // Alice approves Bob
        vm.prank(alice);
        genes.approve(bob, geneId);

        assertEq(genes.getApproved(geneId), bob, "Bob should be approved");

        // Bob can now transfer
        vm.prank(bob);
        genes.transferFrom(alice, charlie, geneId);

        assertEq(genes.ownerOf(geneId), charlie, "Charlie should now own the gene");
    }

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