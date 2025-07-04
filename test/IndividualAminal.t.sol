// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {GenesNFT} from "src/genes/GenesNFT.sol";
import {GeneNFTFactory} from "src/genes/GeneNFTFactory.sol";

contract IndividualAminalTest is Test, IAminalStructs {
    AminalFactory public factory;
    GeneAuction public geneAuction;
    AminalProposals public proposals;
    GenesNFT public genesNFT;
    GeneNFTFactory public geneFactory;
    Move2D public move2DSkill;

    AminalContract public aminal;

    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);

    function setUp() public {
        // Deploy real dependencies
        genesNFT = new GenesNFT();
        geneFactory = new GeneNFTFactory(address(genesNFT));
        geneAuction = new GeneAuction(address(genesNFT), address(geneFactory));
        proposals = new AminalProposals();

        // Deploy factory
        factory = new AminalFactory();
        factory.initialize(
            address(geneAuction),
            address(proposals),
            address(genesNFT)
        );

        // Setup contracts properly
        genesNFT.setup(address(factory));
        genesNFT.setFactory(address(geneFactory));
        geneAuction.setup(address(factory), address(factory));
        proposals.setup(address(factory));
        factory.setup();

        // Deploy a skill
        move2DSkill = new Move2D(address(factory));

        // Skills are globally accessible - no registration needed

        // Spawn a test Aminal
        Visuals[] memory initialVisuals = new Visuals[](1);
        initialVisuals[0] = Visuals({
            backId: 1,
            armId: 1,
            tailId: 1,
            earsId: 1,
            bodyId: 1,
            faceId: 1,
            mouthId: 1,
            miscId: 1
        });

        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        aminal = AminalContract(payable(aminalAddress));
    }

    function testAminalInitialState() public {
        // Test initial state
        assertEq(aminal.getTotalLove(), 0);
        assertEq(aminal.getEnergy(), 50 * 10 ** 18);
        assertEq(aminal.getLoveByUser(alice), 0);

        // Test visuals
        Visuals memory visuals = aminal.getVisuals();
        assertEq(visuals.backId, 1);
        assertEq(visuals.armId, 1);
        assertEq(visuals.tailId, 1);
        assertEq(visuals.earsId, 1);
        assertEq(visuals.bodyId, 1);
        assertEq(visuals.faceId, 1);
        assertEq(visuals.mouthId, 1);
        assertEq(visuals.miscId, 1);

        // Test parents (should be zero addresses for initial Aminals)
        (address mom, address dad) = aminal.getParents();
        assertEq(mom, address(0));
        assertEq(dad, address(0));
    }

    function testAminalFeeding() public {
        vm.deal(alice, 1 ether);

        // Test feeding increases love and energy
        vm.prank(alice);
        uint256 energyDelta = aminal.feed{value: 0.01 ether}();

        assertTrue(aminal.getLoveByUser(alice) > 0);
        assertTrue(aminal.getTotalLove() > 0);
        assertTrue(aminal.getEnergy() > 50 * 10 ** 18);
        assertTrue(energyDelta > 0);

        assertEq(aminal.getLoveByUser(alice), 0.01 ether);
        assertEq(aminal.getTotalLove(), 0.01 ether);
    }

    function testAminalFeedingMultipleUsers() public {
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);

        // Alice feeds
        vm.prank(alice);
        aminal.feed{value: 0.01 ether}();

        // Bob feeds
        vm.prank(bob);
        aminal.feed{value: 0.02 ether}();

        assertEq(aminal.getLoveByUser(alice), 0.01 ether);
        assertEq(aminal.getLoveByUser(bob), 0.02 ether);
        assertEq(aminal.getTotalLove(), 0.03 ether);
    }

    function testAminalSqueaking() public {
        vm.deal(alice, 1 ether);

        // Feed first to get love
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        uint256 initialEnergy = aminal.getEnergy();
        uint256 initialLove = aminal.getLoveByUser(alice);

        // Squeak
        vm.prank(alice);
        aminal.squeak{value: 0.001 ether}(1000);

        // Energy should decrease
        assertTrue(aminal.getEnergy() < initialEnergy);
        // Love should decrease
        assertTrue(aminal.getLoveByUser(alice) < initialLove);
    }

    function testAminalSqueakingWithoutLove() public {
        vm.deal(alice, 1 ether);

        // Try to squeak without love
        vm.prank(alice);
        vm.expectRevert();
        aminal.squeak{value: 0.001 ether}(1000);
    }

    function testAminalBreedingSettings() public {
        vm.deal(alice, 1 ether);

        // Feed to get love
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        // Create another Aminal for breeding partner
        address aminal2Address = factory.spawnAminalForTesting(
            address(0),
            address(0),
            2, // backId
            2, // armId
            2, // tailId
            2, // earsId
            2, // bodyId
            2, // faceId
            2, // mouthId
            2 // miscId
        );

        // Set breeding preference
        vm.prank(alice);
        aminal.setBreedableWith(aminal2Address, true);

        assertTrue(aminal.isBreedableWith(aminal2Address));
    }

    function testAminalBreedingSettingsWithoutLove() public {
        // Create another Aminal for breeding partner
        address aminal2Address = factory.spawnAminalForTesting(
            address(0),
            address(0),
            2, // backId
            2, // armId
            2, // tailId
            2, // earsId
            2, // bodyId
            2, // faceId
            2, // mouthId
            2 // miscId
        );

        // Try to set breeding preference without love
        vm.prank(alice);
        vm.expectRevert("Not enough love");
        aminal.setBreedableWith(aminal2Address, true);
    }

    function testAminalSkillUsage() public {
        vm.deal(alice, 1 ether);

        // Feed to get energy and love
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        uint256 initialEnergy = aminal.getEnergy();

        // Use the skill
        bytes memory skillData = move2DSkill.getSkillData(10, 20);
        vm.prank(alice);
        aminal.callSkill{value: 0.001 ether}(address(move2DSkill), skillData);

        // Check that the skill was executed
        (uint256 x, uint256 y) = move2DSkill.getCoords(address(aminal));
        assertEq(x, 10);
        assertEq(y, 20);

        // Check that energy was consumed
        assertTrue(aminal.getEnergy() <= initialEnergy);
    }

    function testAminalSkillUsageWithUnregisteredSkill() public {
        vm.deal(alice, 1 ether);

        // Deploy another skill (all skills are globally accessible)
        Move2D anotherSkill = new Move2D(address(factory));

        // Feed to get energy
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        // Use the skill (should work since all skills are accessible)
        bytes memory skillData = anotherSkill.getSkillData(10, 20);
        vm.prank(alice);
        aminal.callSkill{value: 0.001 ether}(
            address(anotherSkill),
            skillData
        );
        
        // Check that the skill was executed
        (uint256 x, uint256 y) = anotherSkill.getCoords(address(aminal));
        assertEq(x, 10);
        assertEq(y, 20);
    }

    function testAminalLoveDrivenPrice() public {
        vm.deal(alice, 1 ether);

        // Test initial price (no love)
        uint128 initialPrice = aminal.loveDrivenPrice(alice);
        assertEq(initialPrice, 100 * 10 ** 15); // Should be 100 * 10**15 for no love

        // Feed to add love
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        // Price should be different now
        uint128 newPrice = aminal.loveDrivenPrice(alice);
        assertTrue(newPrice != initialPrice);
    }

    function testAminalNFTFunctionality() public {
        // Test NFT ownership
        assertEq(aminal.ownerOf(1), address(factory));
        assertEq(aminal.balanceOf(address(factory)), 1);

        // Test token URI
        string memory uri = aminal.tokenURI(1);
        assertTrue(bytes(uri).length > 0);

        // Test invalid token ID
        vm.expectRevert("Token does not exist");
        aminal.tokenURI(2);

        // Note: Aminals are soulbound NFTs and cannot be transferred
        // The NFT functionality is primarily for identification and metadata
    }

    function testAminalSkillPropertyStorage() public {
        vm.deal(alice, 1 ether);

        // Feed to get energy
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        // Test skill property storage (this would be called by a skill)
        vm.prank(address(move2DSkill));
        aminal.setSkillProperty("test_key", bytes32("test_value"));

        bytes32 value = aminal.getSkillProperty(
            address(move2DSkill),
            "test_key"
        );
        assertEq(value, bytes32("test_value"));
    }

    function testAminalSkillPropertyStorageUnauthorized() public {
        // Skills are globally accessible - any address can set properties
        vm.prank(alice);
        aminal.setSkillProperty("test_key", bytes32("test_value"));
        
        bytes32 value = aminal.getSkillProperty(alice, "test_key");
        assertEq(value, bytes32("test_value"));
    }

    function testAminalReceiveFunction() public {
        vm.deal(alice, 1 ether);

        uint256 initialLove = aminal.getLoveByUser(alice);
        uint256 initialEnergy = aminal.getEnergy();

        // Send ETH directly to the contract
        vm.prank(alice);
        (bool success, ) = address(aminal).call{value: 0.01 ether}("");
        assertTrue(success);

        // Should have fed the Aminal
        assertTrue(aminal.getLoveByUser(alice) > initialLove);
        assertTrue(aminal.getEnergy() > initialEnergy);
    }
}
