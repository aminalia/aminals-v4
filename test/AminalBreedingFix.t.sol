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
import {IAminalStructs} from "src/IAminalStructs.sol";

/**
 * @title AminalBreedingFix Test
 * @dev Tests the fix for the breeding consent logic bug
 */
contract AminalBreedingFixTest is Test, IAminalStructs {
    AminalFactory public factory;
    GenesNFT public genesNFT;
    GeneNFTFactory public geneFactory;
    GeneAuction public geneAuction;
    AminalProposals public proposals;

    address public alice = address(0x1);
    address public bob = address(0x2);

    address public aminal1Address;
    address public aminal2Address;

    // Sample SVG content for testing
    string constant SAMPLE_BACK = '<rect width="1000" height="1000" fill="#87CEEB"/>';
    string constant SAMPLE_ARM = '<rect x="200" y="400" width="50" height="200" fill="#FFB6C1"/>';
    string constant SAMPLE_TAIL = '<ellipse cx="500" cy="800" rx="30" ry="100" fill="#DDA0DD"/>';
    string constant SAMPLE_EARS = '<ellipse cx="400" cy="200" rx="50" ry="80" fill="#F0E68C"/>';
    string constant SAMPLE_BODY = '<ellipse cx="500" cy="600" rx="150" ry="200" fill="#DDA0DD"/>';
    string constant SAMPLE_FACE = '<circle cx="500" cy="400" r="100" fill="#FFB6C1"/>';
    string constant SAMPLE_MOUTH = '<ellipse cx="500" cy="450" rx="30" ry="15" fill="#FF69B4"/>';
    string constant SAMPLE_MISC = '<rect x="480" y="350" width="40" height="5" fill="#000"/>';

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
        vm.deal(bob, 100 ether);

        // Spawn initial Aminals for testing - use same setup as working test
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

        // Create some basic gene NFTs for the default IDs
        _createBasicGenes();
    }

    function testBreedingConsentLogic() public {
        console.log("=== TESTING BREEDING CONSENT LOGIC FIX ===");

        console.log("Aminal 1 address:", aminal1Address);
        console.log("Aminal 2 address:", aminal2Address);

        // Give Alice love for both Aminals (test with smaller amounts first)
        console.log("Feeding Aminal 1...");
        vm.prank(alice);
        AminalContract(payable(aminal1Address)).feed{value: 0.1 ether}();
        console.log("Feeding Aminal 2...");
        vm.prank(alice);
        AminalContract(payable(aminal2Address)).feed{value: 0.1 ether}();

        // Check love amounts
        uint256 love1 = AminalContract(payable(aminal1Address)).getLoveByUser(alice);
        uint256 love2 = AminalContract(payable(aminal2Address)).getLoveByUser(alice);
        console.log("Alice's love for Aminal 1:", love1);
        console.log("Alice's love for Aminal 2:", love2);
        
        // If not enough, feed more
        if (love1 < 10) {
            vm.prank(alice);
            AminalContract(payable(aminal1Address)).feed{value: 1 ether}();
            love1 = AminalContract(payable(aminal1Address)).getLoveByUser(alice);
            console.log("Alice's love for Aminal 1 after more feeding:", love1);
        }
        if (love2 < 10) {
            vm.prank(alice);
            AminalContract(payable(aminal2Address)).feed{value: 1 ether}();
            love2 = AminalContract(payable(aminal2Address)).getLoveByUser(alice);
            console.log("Alice's love for Aminal 2 after more feeding:", love2);
        }
        
        assertTrue(love1 >= 10, "Alice should have enough love for Aminal 1");
        assertTrue(love2 >= 10, "Alice should have enough love for Aminal 2");

        // Step 1: Set consent from Aminal 1 to Aminal 2
        console.log("Step 1: Setting consent from Aminal 1 to Aminal 2");
        vm.prank(alice);
        uint256 result1 = factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);
        assertEq(result1, 0, "First call should return 0 (consent setting)");
        
        // Verify consent was set
        assertTrue(
            AminalContract(payable(aminal1Address)).isBreedableWith(aminal2Address),
            "Aminal 1 should be breedable with Aminal 2"
        );
        assertFalse(
            AminalContract(payable(aminal2Address)).isBreedableWith(aminal1Address),
            "Aminal 2 should not yet be breedable with Aminal 1"
        );

        // Step 2: Set consent from Aminal 2 to Aminal 1
        console.log("Step 2: Setting consent from Aminal 2 to Aminal 1");
        vm.prank(alice);
        uint256 result2 = factory.breedAminals{value: 0.001 ether}(aminal2Address, aminal1Address);
        assertEq(result2, 0, "Second call should return 0 (consent setting)");
        
        // Verify mutual consent exists
        assertTrue(
            AminalContract(payable(aminal1Address)).isBreedableWith(aminal2Address),
            "Aminal 1 should be breedable with Aminal 2"
        );
        assertTrue(
            AminalContract(payable(aminal2Address)).isBreedableWith(aminal1Address),
            "Aminal 2 should be breedable with Aminal 1"
        );

        // Step 3: Create auction with mutual consent (THE FIX)
        console.log("Step 3: Creating auction with mutual consent");
        vm.prank(alice);
        uint256 auctionId = factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);
        assertTrue(auctionId > 0, "Auction should be created with mutual consent");
        
        console.log("Auction created with ID:", auctionId);
        console.log("=== BREEDING CONSENT LOGIC FIX TEST PASSED ===");
    }

    function testBreedingConsentLogicReverse() public {
        console.log("=== TESTING BREEDING CONSENT LOGIC (REVERSE ORDER) ===");

        // Give Alice love for both Aminals
        vm.prank(alice);
        AminalContract(payable(aminal1Address)).feed{value: 1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2Address)).feed{value: 1 ether}();

        // Step 1: Set consent from Aminal 2 to Aminal 1 (reverse order)
        console.log("Step 1: Setting consent from Aminal 2 to Aminal 1");
        vm.prank(alice);
        uint256 result1 = factory.breedAminals{value: 0.001 ether}(aminal2Address, aminal1Address);
        assertEq(result1, 0, "First call should return 0 (consent setting)");

        // Step 2: Set consent from Aminal 1 to Aminal 2
        console.log("Step 2: Setting consent from Aminal 1 to Aminal 2");
        vm.prank(alice);
        uint256 result2 = factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);
        assertEq(result2, 0, "Second call should return 0 (consent setting)");

        // Step 3: Create auction with mutual consent
        console.log("Step 3: Creating auction with mutual consent (reverse order)");
        vm.prank(alice);
        uint256 auctionId = factory.breedAminals{value: 0.001 ether}(aminal2Address, aminal1Address);
        assertTrue(auctionId > 0, "Auction should be created with mutual consent (reverse order)");
        
        console.log("Auction created with ID:", auctionId);
        console.log("=== REVERSE ORDER TEST PASSED ===");
    }

    function testBreedingFailsWithoutMutualConsent() public {
        console.log("=== TESTING BREEDING FAILS WITHOUT MUTUAL CONSENT ===");

        // Give Alice love for both Aminals
        vm.prank(alice);
        AminalContract(payable(aminal1Address)).feed{value: 1 ether}();
        vm.prank(alice);
        AminalContract(payable(aminal2Address)).feed{value: 1 ether}();

        // Set consent only one way
        vm.prank(alice);
        uint256 result1 = factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);
        assertEq(result1, 0, "First call should return 0 (consent setting)");

        // Try to breed again without mutual consent - should just set consent again
        vm.expectRevert("Already breedable");
        vm.prank(alice);
        factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);

        console.log("=== CORRECTLY PREVENTS DUPLICATE CONSENT ===");
    }

    function testBreedingRequiresLove() public {
        console.log("=== TESTING BREEDING REQUIRES LOVE ===");

        // Don't feed the Aminals (no love)
        
        // Try to breed without love
        vm.expectRevert("Not enough love");
        vm.prank(alice);
        factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);

        console.log("=== CORRECTLY REQUIRES LOVE ===");
    }

    function testBreedingRequiresPayment() public {
        console.log("=== TESTING BREEDING REQUIRES PAYMENT ===");

        // Try to breed without enough ETH
        vm.expectRevert("Not enough ether");
        vm.prank(alice);
        factory.breedAminals{value: 0.0001 ether}(aminal1Address, aminal2Address);

        console.log("=== CORRECTLY REQUIRES PAYMENT ===");
    }

    function _createBasicGenes() internal {
        // Create gene NFTs for ID 0 (which our Aminals use)
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(SAMPLE_BACK, IAminalStructs.VisualsCat.BACK);
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(SAMPLE_ARM, IAminalStructs.VisualsCat.ARM);
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(SAMPLE_TAIL, IAminalStructs.VisualsCat.TAIL);
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(SAMPLE_EARS, IAminalStructs.VisualsCat.EARS);
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(SAMPLE_BODY, IAminalStructs.VisualsCat.BODY);
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(SAMPLE_FACE, IAminalStructs.VisualsCat.FACE);
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(SAMPLE_MOUTH, IAminalStructs.VisualsCat.MOUTH);
        vm.prank(alice);
        geneFactory.createGene{value: 0.001 ether}(SAMPLE_MISC, IAminalStructs.VisualsCat.MISC);
    }
}