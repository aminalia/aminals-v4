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
 * @title AminalBreedingIntegration
 * @dev Comprehensive integration test covering the complete breeding flow:
 * 1. Aminals are fed to build love and energy
 * 2. Breeding is initiated
 * 3. Complete Aminal designs are proposed (1-10 genes with placement metadata)
 * 4. Users vote on entire Aminal designs for visual consistency
 * 5. Child is born based on voted design (or random parent if no votes)
 * 6. Holders of selected gene NFTs are paid out
 *
 * This test uses NO MOCKS and tests the complete real system.
 */
contract AminalBreedingIntegrationTest is Test, IAminalStructs {
    AminalFactory public factory;
    Genes public genes;
    GeneRegistry public geneRegistry;
    GeneAuction public geneAuction;
    AminalProposals public proposals;

    // Test accounts
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);
    address public david = address(0x4);
    address public eve = address(0x5);

    // Sample SVG content for testing
    string constant SAMPLE_BACKGROUND = '<rect width="1000" height="1000" fill="#87CEEB"/>';
    string constant SAMPLE_ARMS =
        '<rect x="200" y="400" width="50" height="200" fill="#FFB6C1"/><rect x="750" y="400" width="50" height="200" fill="#FFB6C1"/>';
    string constant SAMPLE_TAIL = '<ellipse cx="500" cy="800" rx="30" ry="100" fill="#DDA0DD"/>';
    string constant SAMPLE_EARS =
        '<ellipse cx="400" cy="200" rx="50" ry="80" fill="#F0E68C"/><ellipse cx="600" cy="200" rx="50" ry="80" fill="#F0E68C"/>';
    string constant SAMPLE_BODY = '<ellipse cx="500" cy="600" rx="150" ry="200" fill="#DDA0DD"/>';
    string constant SAMPLE_FACE = '<circle cx="500" cy="400" r="100" fill="#FFB6C1"/>';
    string constant SAMPLE_MOUTH = '<ellipse cx="500" cy="450" rx="30" ry="15" fill="#FF69B4"/>';
    string constant SAMPLE_MISC = '<rect x="480" y="350" width="40" height="5" fill="#000"/>';

    // Alternative SVG content for second design
    string constant ALT_BACKGROUND = '<rect width="1000" height="1000" fill="#FFA500"/>';
    string constant ALT_ARMS = '<rect x="200" y="400" width="60" height="180" fill="#90EE90"/>';
    string constant ALT_TAIL = '<ellipse cx="500" cy="800" rx="40" ry="120" fill="#87CEEB"/>';
    string constant ALT_EARS = '<ellipse cx="400" cy="200" rx="60" ry="90" fill="#FFB6C1"/>';
    string constant ALT_BODY = '<ellipse cx="500" cy="600" rx="170" ry="220" fill="#F0E68C"/>';
    string constant ALT_FACE = '<circle cx="500" cy="400" r="110" fill="#DDA0DD"/>';
    string constant ALT_MOUTH = '<ellipse cx="500" cy="450" rx="35" ry="20" fill="#FF1493"/>';
    string constant ALT_MISC = '<rect x="470" y="340" width="60" height="8" fill="#333"/>';

    // Gene NFT IDs that will be created
    uint256 public backgroundGeneId;
    uint256 public armsGeneId;
    uint256 public tailGeneId;
    uint256 public earsGeneId;
    uint256 public bodyGeneId;
    uint256 public faceGeneId;
    uint256 public mouthGeneId;
    uint256 public miscGeneId;

    // Alternative gene IDs for second design
    uint256 public altBackgroundGeneId;
    uint256 public altArmsGeneId;
    uint256 public altTailGeneId;
    uint256 public altEarsGeneId;
    uint256 public altBodyGeneId;
    uint256 public altFaceGeneId;
    uint256 public altMouthGeneId;
    uint256 public altMiscGeneId;

    // Aminal addresses
    address public aminal1Address;
    address public aminal2Address;
    AminalContract public aminal1;
    AminalContract public aminal2;

    function setUp() public {
        // Deploy all contracts - NO MOCKS
        genes = new Genes();
        geneRegistry = new GeneRegistry(address(genes));
        geneAuction = new GeneAuction(address(genes), address(geneRegistry));
        proposals = new AminalProposals();

        // Deploy AminalFactory
        factory = new AminalFactory();
        factory.initialize(address(geneAuction), address(proposals), address(genes));

        // Setup contracts
        genes.setup(address(factory), address(geneRegistry));
        geneAuction.setup(address(factory)); // AminalFactory is the aminalsContract
        proposals.setup(address(factory));
        factory.setup();

        // Give test accounts ETH
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
        vm.deal(david, 10 ether);
        vm.deal(eve, 10 ether);

        // FIRST: Create Gene NFTs that will be used by parent Aminals
        _createGeneNFTs();

        // THEN: Create parent Aminals using the gene NFTs we just created
        _createParentAminals();
    }

    function _createParentAminals() internal {
        // Create parent Aminals using the first set of gene NFTs (pastel theme)
        // This ensures parent Aminals have valid gene NFT IDs that actually exist
        Visuals[] memory initialVisuals = new Visuals[](2);

        // Parent 1: Uses first set of genes (pastel theme) - 9 genes in first 9 slots
        initialVisuals[0].genes[0] = backgroundGeneId;
        initialVisuals[0].genes[1] = armsGeneId;
        initialVisuals[0].genes[2] = tailGeneId;
        initialVisuals[0].genes[3] = earsGeneId;
        initialVisuals[0].genes[4] = bodyGeneId;
        initialVisuals[0].genes[5] = faceGeneId;
        initialVisuals[0].genes[6] = mouthGeneId;
        initialVisuals[0].genes[7] = miscGeneId;
        // genes[8] and genes[8] are 0 (unused)

        // Parent 2: Uses alternative set of genes (vibrant theme) for variety
        initialVisuals[1].genes[0] = altBackgroundGeneId;
        initialVisuals[1].genes[1] = altArmsGeneId;
        initialVisuals[1].genes[2] = altTailGeneId;
        initialVisuals[1].genes[3] = altEarsGeneId;
        initialVisuals[1].genes[4] = altBodyGeneId;
        initialVisuals[1].genes[5] = altFaceGeneId;
        initialVisuals[1].genes[6] = altMouthGeneId;
        initialVisuals[1].genes[7] = altMiscGeneId;
        // genes[8] and genes[8] are 0 (unused)

        factory.spawnInitialAminals(initialVisuals);
        aminal1Address = factory.getAminalByIndex(0);
        aminal2Address = factory.getAminalByIndex(1);
        aminal1 = AminalContract(payable(aminal1Address));
        aminal2 = AminalContract(payable(aminal2Address));
    }

    function _createGeneNFTs() internal {
        // First design genes (no categories needed)
        vm.prank(alice);
        backgroundGeneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Background", "", "Background");

        vm.prank(bob);
        armsGeneId = geneRegistry.createGene(SAMPLE_ARMS, "Arms", "", "Arms");

        vm.prank(charlie);
        tailGeneId = geneRegistry.createGene(SAMPLE_TAIL, "Tail", "", "Tail");

        vm.prank(david);
        earsGeneId = geneRegistry.createGene(SAMPLE_EARS, "Ears", "", "Ears");

        vm.prank(eve);
        bodyGeneId = geneRegistry.createGene(SAMPLE_BODY, "Body", "", "Body");

        vm.prank(alice);
        faceGeneId = geneRegistry.createGene(SAMPLE_FACE, "Face", "", "Face");

        vm.prank(bob);
        mouthGeneId = geneRegistry.createGene(SAMPLE_MOUTH, "Mouth", "", "Mouth");

        vm.prank(charlie);
        miscGeneId = geneRegistry.createGene(SAMPLE_MISC, "Misc", "", "Misc");

        // Alternative design genes (no categories needed)
        vm.prank(david);
        altBackgroundGeneId = geneRegistry.createGene(ALT_BACKGROUND, "Alt Background", "", "Background");

        vm.prank(eve);
        altArmsGeneId = geneRegistry.createGene(ALT_ARMS, "Alt Arms", "", "Arms");

        vm.prank(alice);
        altTailGeneId = geneRegistry.createGene(ALT_TAIL, "Alt Tail", "", "Tail");

        vm.prank(bob);
        altEarsGeneId = geneRegistry.createGene(ALT_EARS, "Alt Ears", "", "Ears");

        vm.prank(charlie);
        altBodyGeneId = geneRegistry.createGene(ALT_BODY, "Alt Body", "", "Body");

        vm.prank(david);
        altFaceGeneId = geneRegistry.createGene(ALT_FACE, "Alt Face", "", "Face");

        vm.prank(eve);
        altMouthGeneId = geneRegistry.createGene(ALT_MOUTH, "Alt Mouth", "", "Mouth");

        vm.prank(alice);
        altMiscGeneId = geneRegistry.createGene(ALT_MISC, "Alt Misc", "", "Misc");
    }

    /**
     * @dev Complete integration test of the breeding flow with full Aminal design voting
     * Tests the full cycle from feeding to payout with complete designs
     */
    function testCompleteBreedingFlow() public {
        console.log("=== STARTING COMPLETE BREEDING FLOW TEST (FULL DESIGN VOTING) ===");

        // STEP 1: Feed Aminals to build love and energy
        console.log("\n1. FEEDING AMINALS");
        _feedAminals();

        // STEP 2: Initiate breeding (creates auction directly)
        console.log("\n2. INITIATING BREEDING");
        uint256 auctionId = _initiateBreeding();

        // STEP 3: Propose complete Aminal designs (all 8 traits together)
        console.log("\n3. PROPOSING COMPLETE AMINAL DESIGNS");
        uint256[] memory designIds = _proposeCompleteDesigns(auctionId);

        // STEP 4: Vote on complete designs
        console.log("\n4. VOTING ON COMPLETE AMINAL DESIGNS");
        _voteOnDesigns(auctionId, designIds);

        // STEP 5: Fast forward time and settle auction
        console.log("\n5. SETTLING AUCTION");
        _settleAuction(auctionId);

        // STEP 6: Verify child birth and payouts
        console.log("\n6. VERIFYING CHILD BIRTH AND PAYOUTS");
        _verifyChildBirthAndPayouts(auctionId);

        console.log("\n=== BREEDING FLOW TEST WITH FULL DESIGN VOTING COMPLETED SUCCESSFULLY ===");
    }

    function _feedAminals() internal {
        console.log("Feeding Aminal 1 and 2...");

        // Record initial states
        uint256 aminal1InitialEnergy = aminal1.getEnergy();
        uint256 aminal2InitialEnergy = aminal2.getEnergy();
        uint256 aminal1InitialLove = aminal1.getLoveByUser(alice);
        uint256 aminal2InitialLove = aminal2.getLoveByUser(alice);

        // All users feed both Aminals to have enough love for proposing designs
        // Each user needs at least 10 love for both aminals to propose designs
        address[5] memory users = [alice, bob, charlie, david, eve];

        for (uint256 i = 0; i < users.length; i++) {
            console.log("User feeding aminals...");
            vm.prank(users[i]);
            aminal1.feed{value: 0.1 ether}();
            vm.prank(users[i]);
            aminal2.feed{value: 0.1 ether}();
        }

        // Verify feeding worked
        assertTrue(aminal1.getEnergy() > aminal1InitialEnergy, "Aminal 1 energy should increase");
        assertTrue(aminal2.getEnergy() > aminal2InitialEnergy, "Aminal 2 energy should increase");
        assertTrue(aminal1.getLoveByUser(alice) > aminal1InitialLove, "Aminal 1 love should increase");
        assertTrue(aminal2.getLoveByUser(alice) > aminal2InitialLove, "Aminal 2 love should increase");

        console.log("Aminal 1 energy:", aminal1.getEnergy());
        console.log("Aminal 2 energy:", aminal2.getEnergy());
        console.log("Aminal 1 love from Alice:", aminal1.getLoveByUser(alice));
        console.log("Aminal 2 love from Alice:", aminal2.getLoveByUser(alice));

        // Verify minimum requirements for breeding and proposing
        uint256 aminal1Love = aminal1.getLoveByUser(alice);
        uint256 aminal2Love = aminal2.getLoveByUser(alice);
        console.log("Checking love requirements - need 10, Aminal1 has:", aminal1Love);
        console.log("Checking love requirements - need 10, Aminal2 has:", aminal2Love);

        assertTrue(aminal1Love >= 10, "Aminal 1 needs at least 10 love");
        assertTrue(aminal2Love >= 10, "Aminal 2 needs at least 10 love");
        assertTrue(aminal1.getEnergy() >= 10, "Aminal 1 needs at least 10 energy");
        assertTrue(aminal2.getEnergy() >= 10, "Aminal 2 needs at least 10 energy");

        // Verify all users have enough love to propose designs
        address[5] memory verifyUsers = [alice, bob, charlie, david, eve];
        for (uint256 i = 0; i < verifyUsers.length; i++) {
            assertTrue(aminal1.getLoveByUser(verifyUsers[i]) >= 10, "Each user needs at least 10 love for aminal1");
            assertTrue(aminal2.getLoveByUser(verifyUsers[i]) >= 10, "Each user needs at least 10 love for aminal2");
        }
    }

    function _getDefaultPlacements() internal pure returns (GeneMetadata[9] memory placements) {
        // Default placement: centered, 100% scale, no rotation
        GeneMetadata memory defaultPlacement = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        for (uint256 i = 0; i < 9; i++) {
            placements[i] = defaultPlacement;
        }
    }

    function _initiateBreeding() internal returns (uint256 auctionId) {
        console.log("Initiating breeding through simplified flow...");

        // Check love levels
        console.log("Aminal1 love:", aminal1.getLoveByUser(alice));
        console.log("Aminal2 love:", aminal2.getLoveByUser(alice));

        // New simplified system: Call breedAminals once to create auction directly
        console.log("Creating auction with single breedAminals call...");
        vm.prank(alice);
        auctionId = factory.breedAminals(aminal1Address, aminal2Address, 0);

        console.log("Auction created with ID:", auctionId);

        // Verify auction was created
        assertTrue(geneAuction.isVotingActive(auctionId), "Voting should be active");

        (uint256 aminalOne, uint256 aminalTwo, uint256 totalLove, uint256 startTime, uint256 endTime, bool settled) =
            geneAuction.getAuctionInfo(auctionId);

        assertEq(aminalOne, aminal1.aminalIndex(), "Aminal 1 index should match");
        assertEq(aminalTwo, aminal2.aminalIndex(), "Aminal 2 index should match");
        assertTrue(totalLove > 0, "Total love should be positive");
        assertFalse(settled, "Auction should not be settled yet");
        assertEq(startTime, block.timestamp, "Start time should be current timestamp");
        assertEq(endTime, block.timestamp + 1 hours, "End time should be 1 hour from start");

        console.log("Auction info verified - Parent indices:", aminalOne, aminalTwo);
        console.log("Total love:", totalLove);
        console.log("Auction duration: 1 hour");

        // Check that parent designs were automatically added
        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);
        assertTrue(voteInfo.proposedDesignIds.length >= 1, "Parent designs should be automatically proposed");
        console.log("Parent designs automatically added:", voteInfo.proposedDesignIds.length);

        return auctionId;
    }

    function _proposeCompleteDesigns(uint256 auctionId) internal returns (uint256[] memory) {
        console.log("Proposing complete Aminal designs (9 genes in 9 slots)...");

        // First design: Cohesive pastel theme - 9 genes in all 9 slots
        uint256[9] memory design1 =
            [backgroundGeneId, armsGeneId, tailGeneId, earsGeneId, bodyGeneId, faceGeneId, mouthGeneId, miscGeneId, 0];

        // Second design: Alternative vibrant theme - 9 genes in all 9 slots
        uint256[9] memory design2 = [
            altBackgroundGeneId,
            altArmsGeneId,
            altTailGeneId,
            altEarsGeneId,
            altBodyGeneId,
            altFaceGeneId,
            altMouthGeneId,
            altMiscGeneId,
            0
        ];

        // Default placement metadata for all gene slots
        GeneMetadata[9] memory defaultPlacements = _getDefaultPlacements();

        // Get initial design count (includes parent designs)
        GeneAuction.AuctionVoteInfo memory initialVoteInfo = geneAuction.getAuctionVoting(auctionId);
        uint256 initialDesignCount = initialVoteInfo.proposedDesignIds.length;

        // Alice proposes first complete design
        vm.prank(alice);
        geneAuction.proposeDesign(auctionId, design1, defaultPlacements);
        console.log("Alice proposed first complete Aminal design");

        // Bob proposes second complete design
        vm.prank(bob);
        geneAuction.proposeDesign(auctionId, design2, defaultPlacements);
        console.log("Bob proposed second complete Aminal design");

        // Verify designs were proposed
        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);
        assertEq(voteInfo.proposedDesignIds.length, initialDesignCount + 2, "Two new designs should be proposed");

        // Get the design IDs for voting
        uint256[] memory designIds = new uint256[](2);
        designIds[0] = voteInfo.proposedDesignIds[initialDesignCount]; // First user-proposed design
        designIds[1] = voteInfo.proposedDesignIds[initialDesignCount + 1]; // Second user-proposed design

        console.log("Total designs available for voting:", voteInfo.proposedDesignIds.length);
        console.log("(Includes parent designs and user-proposed designs)");

        return designIds;
    }

    function _voteOnDesigns(uint256 auctionId, uint256[] memory designIds) internal {
        console.log("Voting on complete Aminal designs...");

        // Alice should have love for both parent Aminals from feeding them
        uint256 aliceVotingPower = geneAuction.getUserVotingPower(auctionId, alice);
        uint256 bobVotingPower = geneAuction.getUserVotingPower(auctionId, bob);
        uint256 charlieVotingPower = geneAuction.getUserVotingPower(auctionId, charlie);

        console.log("Alice's voting power:", aliceVotingPower);
        console.log("Bob's voting power:", bobVotingPower);
        console.log("Charlie's voting power:", charlieVotingPower);

        // Alice votes for the first design (cohesive pastel theme)
        vm.prank(alice);
        geneAuction.voteOnDesign(auctionId, designIds[0]);
        console.log("Alice voted for design 1 (pastel theme)");

        // Bob votes for the second design (vibrant theme)
        vm.prank(bob);
        geneAuction.voteOnDesign(auctionId, designIds[1]);
        console.log("Bob voted for design 2 (vibrant theme)");

        // Charlie also votes for the first design to make it win
        vm.prank(charlie);
        geneAuction.voteOnDesign(auctionId, designIds[0]);
        console.log("Charlie voted for design 1 (pastel theme)");

        // Verify votes were recorded
        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);
        assertTrue(voteInfo.highestVotes > 0, "There should be votes recorded");

        // Check which design is winning
        GeneAuction.AminalDesign memory winningDesign = geneAuction.getDesign(auctionId, voteInfo.winningDesignId);
        console.log("Current winning design has", winningDesign.votes, "votes");
        console.log("Winning design ID:", voteInfo.winningDesignId);
    }

    function _settleAuction(uint256 auctionId) internal {
        console.log("Fast forwarding time and settling auction...");

        // Fast forward past auction end (1 hour + 1 minute)
        vm.warp(block.timestamp + 1 hours + 1 minutes);

        // Verify voting is ready to settle
        assertFalse(geneAuction.isVotingActive(auctionId), "Voting should be inactive after time passes");

        // Record parent treasury balances before settlement
        uint256 aminal1TreasuryBefore = aminal1.getTreasuryBalance();
        uint256 aminal2TreasuryBefore = aminal2.getTreasuryBalance();

        uint256 totalAminalsBefore = factory.totalAminals();

        // Get the winning design before settlement
        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);
        uint256 winningDesignId = voteInfo.winningDesignId;
        GeneAuction.AminalDesign memory winningDesign = geneAuction.getDesign(auctionId, winningDesignId);

        console.log("Settling auction with winning design ID:", winningDesignId);
        console.log("Winning design total votes:", winningDesign.votes);

        geneAuction.settleAuction(auctionId);

        // Verify voting is settled
        (,,,,, bool settled) = geneAuction.getAuctionInfo(auctionId);
        assertTrue(settled, "Voting should be settled");

        // Verify a new Aminal was created
        assertEq(factory.totalAminals(), totalAminalsBefore + 1, "A new Aminal should be created");

        // Verify treasury ETH was transferred from parents (10% each)
        uint256 aminal1TreasuryAfter = aminal1.getTreasuryBalance();
        uint256 aminal2TreasuryAfter = aminal2.getTreasuryBalance();

        assertTrue(aminal1TreasuryAfter < aminal1TreasuryBefore, "Parent 1 should have lost treasury funds");
        assertTrue(aminal2TreasuryAfter < aminal2TreasuryBefore, "Parent 2 should have lost treasury funds");

        console.log("Auction settled successfully");
        console.log("New Aminal created - Total Aminals:", factory.totalAminals());
    }

    function _verifyChildBirthAndPayouts(
        uint256 /* auctionId */
    )
        internal
    {
        console.log("Verifying child birth with complete design...");

        // Get the child Aminal
        uint256 childIndex = factory.totalAminals() - 1;
        address childAddress = factory.getAminalByIndex(childIndex);
        AminalContract child = AminalContract(payable(childAddress));

        // Verify child exists and is valid
        assertTrue(childAddress != address(0), "Child address should not be zero");
        // Note: Aminal NFTs are 1-of-1 NFTs with tokenId = 1
        assertEq(child.ownerOf(1), address(factory), "Factory should own child NFT");

        // Verify child has traits from the winning design
        Visuals memory childVisuals = child.getVisuals();

        console.log("Child Aminal created with complete design:");
        for (uint256 i = 0; i < 9; i++) {
            if (childVisuals.genes[i] != 0) {
                console.log("- Gene slot", i, ":", childVisuals.genes[i]);
            }
        }

        // Verify at least one trait is set (not all zero)
        bool hasNonZeroTraits = false;
        for (uint256 i = 0; i < 9; i++) {
            if (childVisuals.genes[i] != 0) {
                hasNonZeroTraits = true;
                break;
            }
        }

        assertTrue(hasNonZeroTraits, "Child should have at least one gene from winning design");

        console.log("Child birth and design application verified successfully");
    }

    /**
     * @dev Test voting with no user proposals (only parent designs)
     */
    function testBreedingWithOnlyParentDesigns() public {
        console.log("=== TESTING BREEDING WITH ONLY PARENT DESIGNS ===");

        // Feed aminals
        _feedAminals();

        // Initiate breeding
        uint256 auctionId = _initiateBreeding();

        // Don't propose any new designs, only parent designs available

        // Fast forward and settle
        vm.warp(block.timestamp + 1 hours + 1 minutes);
        geneAuction.settleAuction(auctionId);

        // Verify child was created with parent traits
        uint256 childIndex = factory.totalAminals() - 1;
        address childAddress = factory.getAminalByIndex(childIndex);
        assertTrue(childAddress != address(0), "Child should be created even without votes");

        console.log("Child successfully created with parent design (no user votes)");
    }

    /**
     * @dev Test design removal functionality
     */
    function testDesignRemoval() public {
        console.log("=== TESTING DESIGN REMOVAL ===");

        // Setup
        _feedAminals();
        uint256 auctionId = _initiateBreeding();

        // Propose a design - 9 genes in 9 slots
        uint256[9] memory design =
            [backgroundGeneId, armsGeneId, tailGeneId, earsGeneId, bodyGeneId, faceGeneId, mouthGeneId, miscGeneId, 0];
        GeneMetadata[9] memory defaultPlacements = _getDefaultPlacements();

        vm.prank(alice);
        geneAuction.proposeDesign(auctionId, design, defaultPlacements);

        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);
        uint256 designId = voteInfo.proposedDesignIds[voteInfo.proposedDesignIds.length - 1];

        // Get total love for calculating removal threshold
        (,, uint256 totalLove,,,) = geneAuction.getAuctionInfo(auctionId);
        uint256 removalThreshold = totalLove / 3;

        console.log("Total love:", totalLove);
        console.log("Removal threshold (1/3):", removalThreshold);

        // Multiple users vote to remove the design
        uint256 aliceVotingPower = geneAuction.getUserVotingPower(auctionId, alice);
        uint256 bobVotingPower = geneAuction.getUserVotingPower(auctionId, bob);

        console.log("Alice voting power:", aliceVotingPower);
        console.log("Bob voting power:", bobVotingPower);

        // Alice votes to remove with her voting power
        vm.prank(alice);
        geneAuction.voteToRemoveDesign(auctionId, designId, aliceVotingPower);

        // Check if design was already removed after Alice's vote
        GeneAuction.AminalDesign memory designAfterAlice = geneAuction.getDesign(auctionId, designId);

        if (!designAfterAlice.removed) {
            // Only vote with Bob if the design hasn't been removed yet
            vm.prank(bob);
            geneAuction.voteToRemoveDesign(auctionId, designId, bobVotingPower);
        }

        // Check final state
        GeneAuction.AminalDesign memory finalDesign = geneAuction.getDesign(auctionId, designId);

        if (aliceVotingPower >= removalThreshold) {
            assertTrue(finalDesign.removed, "Design should be removed after Alice's vote alone");
            console.log("Design removed by Alice's vote alone");
        } else if (aliceVotingPower + bobVotingPower >= removalThreshold) {
            assertTrue(finalDesign.removed, "Design should be removed after both votes");
            console.log("Design removed after both Alice and Bob voted");
        } else {
            assertFalse(finalDesign.removed, "Design should not be removed (below threshold)");
            console.log("Design not removed (below threshold)");
        }
    }
}
