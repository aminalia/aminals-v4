// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {GenesNFT} from "src/genes/GenesNFT.sol";
import {GeneNFTFactory} from "src/genes/GeneNFTFactory.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminalFactory} from "src/IAminalFactory.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";

contract GeneNFTSystemTest is Test, IAminalStructs {
    GenesNFT public genesNFT;
    GeneNFTFactory public geneFactory;
    GeneAuction public geneAuction;
    AminalFactory public aminalFactory;
    AminalProposals public proposals;

    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);

    // Sample SVG content for testing
    string constant SAMPLE_BACKGROUND =
        '<rect width="1000" height="1000" fill="#87CEEB"/>';
    string constant SAMPLE_FACE =
        '<circle cx="500" cy="400" r="100" fill="#FFB6C1"/>';
    string constant SAMPLE_BODY =
        '<ellipse cx="500" cy="600" rx="150" ry="200" fill="#DDA0DD"/>';

    function setUp() public {
        // Deploy contracts
        genesNFT = new GenesNFT();
        geneFactory = new GeneNFTFactory(address(genesNFT));
        geneAuction = new GeneAuction(address(genesNFT), address(geneFactory));
        proposals = new AminalProposals();

        // Deploy AminalFactory
        aminalFactory = new AminalFactory();
        aminalFactory.initialize(
            address(geneAuction),
            address(proposals),
            address(genesNFT)
        );

        // Setup contracts
        genesNFT.setup(address(aminalFactory)); // AminalFactory acts as Aminals contract
        genesNFT.setFactory(address(geneFactory));
        geneAuction.setup(address(this), address(aminalFactory)); // This contract acts as Aminals contract for testing
        proposals.setup(address(aminalFactory));
        aminalFactory.setup();

        // Give test accounts some ETH
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
    }

    function testGeneNFTCreation() public {
        vm.startPrank(alice);

        // Create a background gene
        uint256 geneId = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );

        vm.stopPrank();

        // Verify gene was created correctly
        assertEq(geneId, 0, "First gene should have ID 0");
        assertEq(genesNFT.ownerOf(geneId), alice, "Alice should own the gene");

        // Verify gene info
        (address creator, VisualsCat category, string memory svg) = geneFactory
            .getGeneInfo(geneId);
        assertEq(creator, alice, "Creator should be Alice");
        assertTrue(category == VisualsCat.BACK, "Category should be BACK");
        assertEq(svg, SAMPLE_BACKGROUND, "SVG should match");

        // Verify factory registry
        assertTrue(geneFactory.isValidGene(geneId), "Gene should be valid");

        // Verify counters
        assertEq(geneFactory.totalGenesCreated(), 1, "Total genes should be 1");
    }

    function testMultipleGeneCreation() public {
        // Alice creates background gene
        vm.prank(alice);
        uint256 backgroundGene = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );

        // Bob creates face gene
        vm.prank(bob);
        uint256 faceGene = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_FACE,
            VisualsCat.FACE
        );

        // Charlie creates body gene
        vm.prank(charlie);
        uint256 bodyGene = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BODY,
            VisualsCat.BODY
        );

        // Verify ownership
        assertEq(genesNFT.ownerOf(backgroundGene), alice);
        assertEq(genesNFT.ownerOf(faceGene), bob);
        assertEq(genesNFT.ownerOf(bodyGene), charlie);

        // Verify categories
        (, VisualsCat bgCat, ) = geneFactory.getGeneInfo(backgroundGene);
        (, VisualsCat faceCat, ) = geneFactory.getGeneInfo(faceGene);
        (, VisualsCat bodyCat, ) = geneFactory.getGeneInfo(bodyGene);

        assertTrue(bgCat == VisualsCat.BACK);
        assertTrue(faceCat == VisualsCat.FACE);
        assertTrue(bodyCat == VisualsCat.BODY);

        assertEq(geneFactory.totalGenesCreated(), 3);
    }


    function testGeneTransferability() public {
        vm.prank(alice);
        uint256 geneId = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );

        // Alice transfers gene to Bob
        vm.prank(alice);
        genesNFT.transferFrom(alice, bob, geneId);

        assertEq(genesNFT.ownerOf(geneId), bob, "Bob should now own the gene");
    }

    function testAuctionCreation() public {
        uint256 auctionId = geneAuction.createAuction(1, 2, 100 ether);

        (
            uint256 aminalOne,
            uint256 aminalTwo,
            uint256 totalLove,
            uint256 startTime,
            uint256 endTime,
            bool settled,
            uint256 childAminalId
        ) = geneAuction.getAuctionInfo(auctionId);

        assertEq(aminalOne, 1);
        assertEq(aminalTwo, 2);
        assertEq(totalLove, 100 ether);
        assertEq(startTime, block.timestamp);
        assertEq(endTime, block.timestamp + 7 days);
        assertFalse(settled);
        assertEq(childAminalId, auctionId);

        assertTrue(geneAuction.isAuctionActive(auctionId));
    }

    function testGeneProposalInAuction() public {
        // Create a gene
        vm.prank(alice);
        uint256 geneId = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );

        // Create auction
        uint256 auctionId = geneAuction.createAuction(1, 2, 100 ether);

        // Propose the gene
        vm.prank(alice);
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);

        // Verify gene was proposed
        GeneAuction.CategoryBidInfo memory bidInfo = geneAuction
            .getCategoryBidding(auctionId, VisualsCat.BACK);
        assertEq(bidInfo.proposedGenes.length, 1);
        assertEq(bidInfo.proposedGenes[0], geneId);
    }

    function testGeneBiddingInAuction() public {
        // Create a gene
        vm.prank(alice);
        uint256 geneId = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );

        // Create auction
        uint256 auctionId = geneAuction.createAuction(1, 2, 100 ether);

        // Propose the gene
        vm.prank(alice);
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);

        // Bob bids on the gene
        vm.prank(bob);
        geneAuction.bidOnGene{value: 0.01 ether}(
            auctionId,
            VisualsCat.BACK,
            geneId
        );

        // Verify bid
        (uint256 bidAmount, address bidder) = geneAuction.getGeneBid(
            auctionId,
            VisualsCat.BACK,
            geneId
        );
        assertEq(bidAmount, 0.01 ether);
        assertEq(bidder, bob);

        // Verify category bidding info
        GeneAuction.CategoryBidInfo memory bidInfo = geneAuction
            .getCategoryBidding(auctionId, VisualsCat.BACK);
        assertEq(bidInfo.highestBid, 0.01 ether);
        assertEq(bidInfo.highestBidder, bob);
        assertEq(bidInfo.winningGeneId, geneId);
    }

    function testBidRefund() public {
        // Create a gene
        vm.prank(alice);
        uint256 geneId = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );

        // Create auction
        uint256 auctionId = geneAuction.createAuction(1, 2, 100 ether);

        // Propose the gene
        vm.prank(alice);
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);

        // Bob bids
        uint256 bobInitialBalance = bob.balance;
        vm.prank(bob);
        geneAuction.bidOnGene{value: 0.01 ether}(
            auctionId,
            VisualsCat.BACK,
            geneId
        );

        // Charlie outbids Bob
        vm.prank(charlie);
        geneAuction.bidOnGene{value: 0.02 ether}(
            auctionId,
            VisualsCat.BACK,
            geneId
        );

        // Bob should have been refunded
        assertEq(bob.balance, bobInitialBalance - 0.01 ether + 0.01 ether);

        // Verify new highest bidder
        GeneAuction.CategoryBidInfo memory bidInfo = geneAuction
            .getCategoryBidding(auctionId, VisualsCat.BACK);
        assertEq(bidInfo.highestBidder, charlie);
        assertEq(bidInfo.highestBid, 0.02 ether);
    }

    function testAuctionSettlement() public {
        // Create initial Aminals for parents
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] = Visuals({
            backId: 0,
            armId: 0,
            tailId: 0,
            earsId: 0,
            bodyId: 0,
            faceId: 0,
            mouthId: 0,
            miscId: 0
        });
        initialVisuals[1] = Visuals({
            backId: 0,
            armId: 0,
            tailId: 0,
            earsId: 0,
            bodyId: 0,
            faceId: 0,
            mouthId: 0,
            miscId: 0
        });
        aminalFactory.spawnInitialAminals(initialVisuals);

        // Create a gene
        vm.prank(alice);
        uint256 geneId = geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );

        // Create auction
        uint256 auctionId = geneAuction.createAuction(0, 1, 100 ether);

        // Propose and bid on the gene
        vm.prank(alice);
        geneAuction.proposeGene(auctionId, VisualsCat.BACK, geneId);

        vm.prank(bob);
        geneAuction.bidOnGene{value: 0.05 ether}(
            auctionId,
            VisualsCat.BACK,
            geneId
        );

        // Fast forward past auction end
        vm.warp(block.timestamp + 8 days);

        // Record Alice's balance before settlement
        uint256 aliceBalanceBefore = alice.balance;
        uint256 initialAminalCount = aminalFactory.totalAminals();

        // Settle auction
        geneAuction.settleAuction(auctionId);

        // Verify Alice received payment (she owns the gene)
        assertEq(alice.balance, aliceBalanceBefore + 0.05 ether);

        // Verify auction is settled
        (, , , , , bool settled, ) = geneAuction.getAuctionInfo(auctionId);
        assertTrue(settled);
        assertFalse(geneAuction.isAuctionActive(auctionId));

        // Verify child Aminal was spawned
        assertEq(aminalFactory.totalAminals(), initialAminalCount + 1);
    }

    function testInsufficientCreationFeeFails() public {
        vm.prank(alice);
        vm.expectRevert(GeneNFTFactory.InsufficientFee.selector);
        geneFactory.createGene{value: 0.0005 ether}( // Below minimum
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );
    }

    function testEmptySVGFails() public {
        vm.prank(alice);
        vm.expectRevert(GeneNFTFactory.EmptySVG.selector);
        geneFactory.createGene{value: 0.001 ether}("", VisualsCat.BACK);
    }

    function testGetGenesByCreator() public {
        // Alice creates multiple genes
        vm.startPrank(alice);
        geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );
        geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_FACE,
            VisualsCat.FACE
        );
        vm.stopPrank();

        // Bob creates one gene
        vm.prank(bob);
        geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BODY,
            VisualsCat.BODY
        );

        // Check Alice's genes
        uint256[] memory aliceGenes = geneFactory.getGenesByCreator(alice);
        assertEq(aliceGenes.length, 2);
        assertEq(aliceGenes[0], 0);
        assertEq(aliceGenes[1], 1);

        // Check Bob's genes
        uint256[] memory bobGenes = geneFactory.getGenesByCreator(bob);
        assertEq(bobGenes.length, 1);
        assertEq(bobGenes[0], 2);
    }

    function testGetGenesByCategory() public {
        // Create genes in different categories
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_BACKGROUND,
            VisualsCat.BACK
        );

        vm.prank(bob);
        geneFactory.createGene{value: 0.001 ether}(
            SAMPLE_FACE,
            VisualsCat.FACE
        );

        vm.prank(charlie);
        geneFactory.createGene{value: 0.001 ether}(
            '<rect width="1000" height="1000" fill="#00FF00"/>',
            VisualsCat.BACK
        );

        // Check background genes
        uint256[] memory backgroundGenes = geneFactory.getGenesByCategory(
            VisualsCat.BACK
        );
        assertEq(backgroundGenes.length, 2);
        assertEq(backgroundGenes[0], 0);
        assertEq(backgroundGenes[1], 2);

        // Check face genes
        uint256[] memory faceGenes = geneFactory.getGenesByCategory(
            VisualsCat.FACE
        );
        assertEq(faceGenes.length, 1);
        assertEq(faceGenes[0], 1);
    }

    function testAminalFactoryIntegration() public {
        // Test that AminalFactory can spawn Aminals with gene-based traits
        uint256[8] memory winningGenes = [uint256(1), 2, 3, 4, 5, 6, 7, 8];

        // Create parent Aminals first
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0] = Visuals({
            backId: 0,
            armId: 0,
            tailId: 0,
            earsId: 0,
            bodyId: 0,
            faceId: 0,
            mouthId: 0,
            miscId: 0
        });
        initialVisuals[1] = Visuals({
            backId: 0,
            armId: 0,
            tailId: 0,
            earsId: 0,
            bodyId: 0,
            faceId: 0,
            mouthId: 0,
            miscId: 0
        });
        aminalFactory.spawnInitialAminals(initialVisuals);

        address parent1 = aminalFactory.getAminalByIndex(0);
        address parent2 = aminalFactory.getAminalByIndex(1);

        // Call spawnAminalFromAuction as GeneAuction would
        vm.prank(address(geneAuction));
        address childAminal = aminalFactory.spawnAminalFromAuction(
            parent1,
            parent2,
            winningGenes
        );

        // Verify child was spawned
        assertTrue(aminalFactory.isAminal(childAminal));
        assertEq(aminalFactory.totalAminals(), 3);

        // Verify child has correct traits
        Visuals memory childVisuals = aminalFactory.getAminalVisualsByAddress(
            childAminal
        );
        assertEq(childVisuals.backId, 1);
        assertEq(childVisuals.armId, 2);
        assertEq(childVisuals.tailId, 3);
        assertEq(childVisuals.earsId, 4);
        assertEq(childVisuals.bodyId, 5);
        assertEq(childVisuals.faceId, 6);
        assertEq(childVisuals.mouthId, 7);
        assertEq(childVisuals.miscId, 8);
    }
}
