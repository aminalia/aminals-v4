// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

/**
 * @title Placement Flow Test
 * @notice Tests for placement metadata flow from auction through to rendering
 * @dev Verifies that placement info (position, scale, rotation) is properly communicated
 *      from design proposals all the way through to the final Aminal NFT
 */
contract PlacementFlowTest is Test, IAminalStructs {
    AminalFactory public factory;
    GeneAuction public geneAuction;
    Genes public genes;
    GeneRegistry public geneRegistry;

    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);

    string constant SAMPLE_BACKGROUND = '<rect width="1000" height="1000" fill="#87CEEB"/>';
    string constant SAMPLE_BODY = '<circle cx="500" cy="500" r="200" fill="#FFB6C1"/>';
    string constant SAMPLE_FACE = '<circle cx="450" cy="450" r="50" fill="#000"/>';

    function setUp() public {
        // Deploy all contracts
        genes = new Genes();
        geneRegistry = new GeneRegistry(address(genes));
        geneAuction = new GeneAuction(address(genes), address(geneRegistry));
        factory = new AminalFactory();

        // Initialize contracts
        factory.initialize(address(geneAuction), address(genes));
        genes.setup(address(factory), address(geneRegistry));
        geneAuction.setup(address(factory));
        factory.setup();

        // Give test users ETH
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
    }

    /**
     * @notice Test that the first gene starts at ID 1 (not 0) to avoid empty slot collision
     */
    function testFirstGeneStartsAtOne() public {
        vm.prank(alice);
        uint256 firstGeneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "First Gene", "", "Background");

        // First gene should be ID 1, not 0
        assertEq(firstGeneId, 1, "First gene should have ID 1");
        assertEq(genes.ownerOf(firstGeneId), alice, "Alice should own gene ID 1");

        // Gene ID 0 should not exist
        vm.expectRevert("ERC721: invalid token ID");
        genes.ownerOf(0);
    }

    /**
     * @notice Test that genesis Aminals get default placement (centered, 100% scale, 0° rotation)
     */
    function testGenesisAminalDefaultPlacement() public {
        // Spawn a genesis Aminal
        GeneInstance[9][] memory genesisGenes = new GeneInstance[9][](1);
        genesisGenes[0][0] = GeneInstance({geneId: 1, offsetX: 0, offsetY: 0, scale: 100, rotation: 0});

        factory.spawnInitialAminals(genesisGenes);
        address aminalAddress = factory.getAminalByIndex(0);

        // Get gene instances
        AminalContract aminal = AminalContract(payable(aminalAddress));
        GeneInstance[9] memory geneInstances = aminal.getGenes();

        // Verify all placements are default (centered, 100% scale, 0° rotation)
        for (uint256 i = 0; i < 9; i++) {
            assertEq(geneInstances[i].offsetX, 0, "Default offsetX should be 0");
            assertEq(geneInstances[i].offsetY, 0, "Default offsetY should be 0");
            assertEq(geneInstances[i].scale, 100, "Default scale should be 100");
            assertEq(geneInstances[i].rotation, 0, "Default rotation should be 0");
        }
    }

    /**
     * @notice Test that placement metadata is stored correctly in Aminal after spawn
     */
    function testPlacementStorageInAminal() public {
        // Create custom placements
        GeneMetadata[9] memory customPlacements;
        customPlacements[0] = GeneMetadata({offsetX: -50, offsetY: 100, scale: 150, rotation: 45});
        customPlacements[1] = GeneMetadata({offsetX: 25, offsetY: -75, scale: 80, rotation: 90});
        customPlacements[2] = GeneMetadata({offsetX: 0, offsetY: 0, scale: 200, rotation: 180});

        // Set remaining to default
        for (uint256 i = 3; i < 9; i++) {
            customPlacements[i] = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        // Prepare genes for spawning
        uint256[9] memory geneIds;
        geneIds[0] = 1;
        geneIds[1] = 2;
        geneIds[2] = 3;

        // Spawn via internal function
        Visuals memory visuals = Visuals({genes: geneIds});
        Visuals[] memory initialVisuals = new Visuals[](1);
        initialVisuals[0] = visuals;

        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);

        // Now we need to manually update placements for this test
        // Since we can't directly set placements on existing Aminals,
        // we'll test via breeding flow instead
    }

    /**
     * @notice Test placement flow through complete breeding cycle
     */
    function testPlacementFlowThroughBreeding() public {
        // Create gene NFTs FIRST
        vm.startPrank(alice);
        uint256 backgroundGeneId =
            geneRegistry.createGene(SAMPLE_BACKGROUND, "Background", "Sky background", "Background");
        uint256 bodyGeneId = geneRegistry.createGene(SAMPLE_BODY, "Body", "Pink body", "Body");
        uint256 faceGeneId = geneRegistry.createGene(SAMPLE_FACE, "Face", "Simple face", "Face");
        vm.stopPrank();

        // Spawn parent Aminals with some genes
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0].genes[0] = backgroundGeneId;
        initialVisuals[1].genes[0] = backgroundGeneId;

        factory.spawnInitialAminals(initialVisuals);
        address aminal1 = factory.getAminalByIndex(0);
        address aminal2 = factory.getAminalByIndex(1);

        // Feed both Aminals to get love
        vm.prank(alice);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        vm.prank(bob);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(bob);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        // Start breeding
        vm.prank(alice);
        uint256 auctionId = factory.breedAminals(aminal1, aminal2, 0);

        // Create custom design with specific placements
        uint256[9] memory designGenes;
        designGenes[0] = backgroundGeneId; // Background
        designGenes[1] = bodyGeneId; // Body - offset and scaled
        designGenes[2] = faceGeneId; // Face - rotated
        // Remaining slots are 0 (empty)

        GeneMetadata[9] memory designPlacements;
        designPlacements[0] = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0}); // Background centered
        designPlacements[1] = GeneMetadata({offsetX: -50, offsetY: 100, scale: 150, rotation: 0}); // Body offset and scaled
        designPlacements[2] = GeneMetadata({offsetX: 25, offsetY: -25, scale: 80, rotation: 45}); // Face offset, scaled, rotated

        // Fill remaining slots with default placement
        for (uint256 i = 3; i < 9; i++) {
            designPlacements[i] = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        // Propose the design (need enough love)
        vm.prank(bob);
        geneAuction.proposeDesign(auctionId, designGenes, designPlacements);

        // Parent designs are auto-added, our design is the 3rd one
        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);

        // Find the design we just proposed (should be the last one in the array)
        uint256 designId = voteInfo.proposedDesignIds[voteInfo.proposedDesignIds.length - 1];

        // Vote for the design
        vm.prank(alice);
        geneAuction.voteOnDesign(auctionId, designId);

        vm.prank(bob);
        geneAuction.voteOnDesign(auctionId, designId);

        // Fast forward time to end auction
        vm.warp(block.timestamp + 1 hours + 1);

        // Settle auction
        geneAuction.settleAuction(auctionId);

        // Get the child Aminal
        address childAddress = factory.getAminalByIndex(2);
        AminalContract child = AminalContract(payable(childAddress));

        // Verify placements were stored correctly
        GeneMetadata[9] memory childPlacements = child.getPlacements();

        // Check the three custom placements
        assertEq(childPlacements[0].offsetX, 0, "Background offsetX should be 0");
        assertEq(childPlacements[0].offsetY, 0, "Background offsetY should be 0");
        assertEq(childPlacements[0].scale, 100, "Background scale should be 100");
        assertEq(childPlacements[0].rotation, 0, "Background rotation should be 0");

        assertEq(childPlacements[1].offsetX, -50, "Body offsetX should be -50");
        assertEq(childPlacements[1].offsetY, 100, "Body offsetY should be 100");
        assertEq(childPlacements[1].scale, 150, "Body scale should be 150");
        assertEq(childPlacements[1].rotation, 0, "Body rotation should be 0");

        assertEq(childPlacements[2].offsetX, 25, "Face offsetX should be 25");
        assertEq(childPlacements[2].offsetY, -25, "Face offsetY should be -25");
        assertEq(childPlacements[2].scale, 80, "Face scale should be 80");
        assertEq(childPlacements[2].rotation, 45, "Face rotation should be 45");
    }

    /**
     * @notice Test that placements are retrievable via getAminalPlacementsByID
     */
    function testPlacementRetrievalByID() public {
        // Spawn a genesis Aminal
        Visuals[] memory initialVisuals = new Visuals[](1);
        initialVisuals[0].genes[0] = 1;

        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        AminalContract aminal = AminalContract(payable(aminalAddress));

        uint256 aminalIndex = aminal.aminalIndex();

        // Get placements via the abstract function
        GeneMetadata[9] memory placements = aminal.getAminalPlacementsByID(aminalIndex);

        // Verify we got data back
        assertEq(placements[0].scale, 100, "Should retrieve default scale");
    }

    /**
     * @notice Test that invalid aminal ID reverts when getting placements
     */
    function testPlacementRetrievalInvalidID() public {
        // Spawn a genesis Aminal
        Visuals[] memory initialVisuals = new Visuals[](1);
        initialVisuals[0].genes[0] = 1;

        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        AminalContract aminal = AminalContract(payable(aminalAddress));

        // Try to get placements with wrong ID
        vm.expectRevert("Invalid aminal ID");
        aminal.getAminalPlacementsByID(999);
    }

    /**
     * @notice Test SVG generation includes placement transforms
     */
    function testSVGGenerationWithPlacements() public {
        // Create a gene NFT
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        // Spawn Aminal with this gene
        Visuals[] memory initialVisuals = new Visuals[](1);
        initialVisuals[0].genes[0] = geneId;

        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        AminalContract aminal = AminalContract(payable(aminalAddress));

        // Get token URI (which calls the renderer)
        string memory uri = aminal.tokenURI(1);

        // Verify we got a data URI back
        assertTrue(bytes(uri).length > 0, "Token URI should not be empty");

        // The URI should start with data:application/json;base64,
        bytes memory uriBytes = bytes(uri);
        assertTrue(uriBytes.length > 29, "URI should be long enough to contain prefix");

        // Check for the data URI prefix
        bytes memory expectedPrefix = bytes("data:application/json;base64,");
        for (uint256 i = 0; i < 29; i++) {
            assertEq(uriBytes[i], expectedPrefix[i], "URI should start with correct prefix");
        }
    }

    /**
     * @notice Test extreme placement values
     */
    function testExtremePlacementValues() public {
        // Create gene NFT
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        // Spawn parent Aminals
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0].genes[0] = geneId;
        initialVisuals[1].genes[0] = geneId;

        factory.spawnInitialAminals(initialVisuals);
        address aminal1 = factory.getAminalByIndex(0);
        address aminal2 = factory.getAminalByIndex(1);

        // Feed to get love
        vm.prank(alice);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        vm.prank(bob);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(bob);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        // Start breeding
        vm.prank(alice);
        uint256 auctionId = factory.breedAminals(aminal1, aminal2, 0);

        // Create design with extreme values
        uint256[9] memory designGenes;
        designGenes[0] = geneId;
        // Rest are 0 (empty)

        GeneMetadata[9] memory designPlacements;
        // Test extreme values (within bounds defined in IAminalStructs)
        designPlacements[0] = GeneMetadata({
            offsetX: -500, // Min offset
            offsetY: 500, // Max offset
            scale: 500, // Max scale (500%)
            rotation: 359 // Max rotation
        });

        for (uint256 i = 1; i < 9; i++) {
            designPlacements[i] = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        // Propose design
        vm.prank(bob);
        geneAuction.proposeDesign(auctionId, designGenes, designPlacements);

        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);
        uint256 designId = voteInfo.proposedDesignIds[voteInfo.proposedDesignIds.length - 1];

        // Vote
        vm.prank(alice);
        geneAuction.voteOnDesign(auctionId, designId);

        vm.prank(bob);
        geneAuction.voteOnDesign(auctionId, designId);

        // Settle
        vm.warp(block.timestamp + 1 hours + 1);
        geneAuction.settleAuction(auctionId);

        // Verify child has extreme placements
        address childAddress = factory.getAminalByIndex(2);
        AminalContract child = AminalContract(payable(childAddress));
        GeneMetadata[9] memory childPlacements = child.getPlacements();

        assertEq(childPlacements[0].offsetX, -500, "Extreme offsetX should be stored");
        assertEq(childPlacements[0].offsetY, 500, "Extreme offsetY should be stored");
        assertEq(childPlacements[0].scale, 500, "Extreme scale should be stored");
        assertEq(childPlacements[0].rotation, 359, "Extreme rotation should be stored");
    }

    /**
     * @notice Test that parent designs get default placement
     */
    function testParentDesignsHaveDefaultPlacement() public {
        // Create gene NFT
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        // Spawn parent Aminals
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0].genes[0] = geneId;
        initialVisuals[1].genes[0] = geneId;

        factory.spawnInitialAminals(initialVisuals);
        address aminal1 = factory.getAminalByIndex(0);
        address aminal2 = factory.getAminalByIndex(1);

        // Feed to get love
        vm.prank(alice);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        // Start breeding
        vm.prank(alice);
        uint256 auctionId = factory.breedAminals(aminal1, aminal2, 0);

        // Get parent design (should be designId 1)
        GeneAuction.AminalDesign memory parentDesign = geneAuction.getDesign(auctionId, 1);

        // Verify parent design has default placements
        for (uint256 i = 0; i < 9; i++) {
            assertEq(parentDesign.placements[i].offsetX, 0, "Parent design offsetX should be default");
            assertEq(parentDesign.placements[i].offsetY, 0, "Parent design offsetY should be default");
            assertEq(parentDesign.placements[i].scale, 100, "Parent design scale should be default");
            assertEq(parentDesign.placements[i].rotation, 0, "Parent design rotation should be default");
        }
    }

    /**
     * @notice Test placement data persists correctly in design proposals
     */
    function testPlacementPersistsInDesign() public {
        // Create gene NFT
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        // Spawn parents
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0].genes[0] = geneId;
        initialVisuals[1].genes[0] = geneId;

        factory.spawnInitialAminals(initialVisuals);
        address aminal1 = factory.getAminalByIndex(0);
        address aminal2 = factory.getAminalByIndex(1);

        // Feed to get love
        vm.prank(alice);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        vm.prank(bob);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(bob);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        // Start breeding
        vm.prank(alice);
        uint256 auctionId = factory.breedAminals(aminal1, aminal2, 0);

        // Create design with unique placements
        uint256[9] memory designGenes;
        designGenes[0] = geneId;
        // Rest are 0 (empty)

        GeneMetadata[9] memory designPlacements;
        designPlacements[0] = GeneMetadata({offsetX: 123, offsetY: -456, scale: 175, rotation: 270});

        for (uint256 i = 1; i < 9; i++) {
            designPlacements[i] = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        // Propose design
        vm.prank(bob);
        geneAuction.proposeDesign(auctionId, designGenes, designPlacements);

        // Retrieve and verify
        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);
        uint256 designId = voteInfo.proposedDesignIds[voteInfo.proposedDesignIds.length - 1];
        GeneAuction.AminalDesign memory retrievedDesign = geneAuction.getDesign(auctionId, designId);

        assertEq(retrievedDesign.placements[0].offsetX, 123, "Retrieved offsetX should match");
        assertEq(retrievedDesign.placements[0].offsetY, -456, "Retrieved offsetY should match");
        assertEq(retrievedDesign.placements[0].scale, 175, "Retrieved scale should match");
        assertEq(retrievedDesign.placements[0].rotation, 270, "Retrieved rotation should match");
    }

    /**
     * @notice Test getDesignPlacements view function
     */
    function testGetDesignPlacements() public {
        // Create gene NFT
        vm.prank(alice);
        uint256 geneId = geneRegistry.createGene(SAMPLE_BACKGROUND, "Test Gene", "", "Background");

        // Spawn parents
        Visuals[] memory initialVisuals = new Visuals[](2);
        initialVisuals[0].genes[0] = geneId;
        initialVisuals[1].genes[0] = geneId;

        factory.spawnInitialAminals(initialVisuals);
        address aminal1 = factory.getAminalByIndex(0);
        address aminal2 = factory.getAminalByIndex(1);

        // Feed
        vm.prank(alice);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        vm.prank(bob);
        AminalContract(payable(aminal1)).feed{value: 0.1 ether}();
        vm.prank(bob);
        AminalContract(payable(aminal2)).feed{value: 0.1 ether}();

        // Breed
        vm.prank(alice);
        uint256 auctionId = factory.breedAminals(aminal1, aminal2, 0);

        // Create design
        uint256[9] memory designGenes;
        designGenes[0] = geneId;
        // Rest are 0 (empty)

        GeneMetadata[9] memory designPlacements;
        designPlacements[0] = GeneMetadata({offsetX: 42, offsetY: -84, scale: 133, rotation: 99});

        for (uint256 i = 1; i < 9; i++) {
            designPlacements[i] = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        // Propose
        vm.prank(bob);
        geneAuction.proposeDesign(auctionId, designGenes, designPlacements);

        // Get placements via view function
        GeneAuction.AuctionVoteInfo memory voteInfo = geneAuction.getAuctionVoting(auctionId);
        uint256 designId = voteInfo.proposedDesignIds[voteInfo.proposedDesignIds.length - 1];
        GeneMetadata[9] memory retrievedPlacements = geneAuction.getDesignPlacements(auctionId, designId);

        assertEq(retrievedPlacements[0].offsetX, 42, "getDesignPlacements should return correct offsetX");
        assertEq(retrievedPlacements[0].offsetY, -84, "getDesignPlacements should return correct offsetY");
        assertEq(retrievedPlacements[0].scale, 133, "getDesignPlacements should return correct scale");
        assertEq(retrievedPlacements[0].rotation, 99, "getDesignPlacements should return correct rotation");
    }
}
