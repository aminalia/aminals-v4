// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {MoveTwice} from "src/skills/MoveTwice.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {GenesNFT} from "src/genes/GenesNFT.sol";
import {GeneNFTFactory} from "src/genes/GeneNFTFactory.sol";

contract SkillComposabilityTest is Test, IAminalStructs {
    AminalFactory public factory;
    GeneAuction public geneAuction;
    AminalProposals public proposals;
    GenesNFT public genesNFT;
    GeneNFTFactory public geneFactory;
    Move2D public move2DSkill;
    MoveTwice public moveTwiceSkill;

    AminalContract public aminal;

    address public alice = address(0x1);

    function setUp() public {
        // Deploy real dependencies
        genesNFT = new GenesNFT();
        geneFactory = new GeneNFTFactory(address(genesNFT));
        geneAuction = new GeneAuction(address(genesNFT), address(geneFactory));
        proposals = new AminalProposals();

        // Deploy factory
        factory = new AminalFactory();
        factory.initialize(address(geneAuction), address(proposals), address(genesNFT));

        // Setup contracts properly
        genesNFT.setup(address(factory));
        genesNFT.setFactory(address(geneFactory));
        geneAuction.setup(address(factory), address(factory));
        proposals.setup(address(factory));
        factory.setup();

        // Deploy skills
        move2DSkill = new Move2D(address(factory));
        moveTwiceSkill = new MoveTwice(address(factory), address(move2DSkill));

        // Skills are globally accessible - no registration needed

        // Spawn a test Aminal
        Visuals[] memory initialVisuals = new Visuals[](1);
        initialVisuals[0] =
            Visuals({backId: 1, armId: 1, tailId: 1, earsId: 1, bodyId: 1, faceId: 1, mouthId: 1, miscId: 1});

        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        aminal = AminalContract(payable(aminalAddress));
    }

    function testSkillComposability() public {
        vm.deal(alice, 1 ether);

        // Feed the Aminal to give it energy
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        uint256 initialEnergy = aminal.getEnergy();

        // Use the MoveTwice skill which calls Move2D skill twice
        bytes memory skillData = moveTwiceSkill.getSkillData(10, 20, 30, 40);
        vm.prank(alice);
        aminal.callSkill{value: 0.002 ether}(address(moveTwiceSkill), skillData);

        // Check final coordinates (should be at second move position)
        (uint256 x, uint256 y) = move2DSkill.getCoords(address(aminal));
        assertEq(x, 30, "X coordinate should be 30 after second move");
        assertEq(y, 40, "Y coordinate should be 40 after second move");

        // Energy should be consumed by the skill calls
        assertTrue(aminal.getEnergy() < initialEnergy, "Energy should be consumed");
    }

    function testSkillComposabilityWithMinimalValue() public {
        vm.deal(alice, 1 ether);

        // Feed the Aminal to give it energy
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        // Use MoveTwice skill with minimal value (it splits value in half)
        bytes memory skillData = moveTwiceSkill.getSkillData(10, 20, 30, 40);
        vm.prank(alice);
        aminal.callSkill{value: 0.0001 ether}(address(moveTwiceSkill), skillData);

        // Should still work since MoveTwice splits the value
        (uint256 x, uint256 y) = move2DSkill.getCoords(address(aminal));
        assertEq(x, 30, "X coordinate should be 30 after second move");
        assertEq(y, 40, "Y coordinate should be 40 after second move");
    }

    function testGlobalSkillAccessibility() public {
        // Create a second Aminal by temporarily enabling initial spawn
        // Reset the initial spawn flag to allow spawning another Aminal
        vm.store(address(factory), bytes32(uint256(2)), bytes32(uint256(0))); // Reset initialAminalSpawned flag

        Visuals[] memory additionalVisuals = new Visuals[](1);
        additionalVisuals[0] = Visuals(2, 2, 2, 2, 2, 2, 2, 2);
        factory.spawnInitialAminals(additionalVisuals);
        address aminal2Address = factory.getAminalByIndex(1);
        AminalContract aminal2 = AminalContract(payable(aminal2Address));

        vm.deal(alice, 1 ether);

        // Feed both Aminals
        vm.startPrank(alice);
        aminal.feed{value: 0.1 ether}();
        aminal2.feed{value: 0.1 ether}();
        vm.stopPrank();

        // Both Aminals should be able to use the same skill
        bytes memory skillData = move2DSkill.getSkillData(100, 200);

        vm.prank(alice);
        aminal.callSkill{value: 0.001 ether}(address(move2DSkill), skillData);

        vm.prank(alice);
        aminal2.callSkill{value: 0.001 ether}(address(move2DSkill), skillData);

        // Both should have moved to the same coordinates
        (uint256 x1, uint256 y1) = move2DSkill.getCoords(address(aminal));
        (uint256 x2, uint256 y2) = move2DSkill.getCoords(address(aminal2));

        assertEq(x1, 100, "First Aminal should be at x=100");
        assertEq(y1, 200, "First Aminal should be at y=200");
        assertEq(x2, 100, "Second Aminal should be at x=100");
        assertEq(y2, 200, "Second Aminal should be at y=200");
    }

    function testSkillSecurityModel() public {
        // Test that skills can only be called by Aminal contracts
        vm.deal(alice, 1 ether);

        bytes memory skillData = move2DSkill.getSkillData(50, 60);

        // Direct call to skill should fail
        vm.prank(alice);
        vm.expectRevert("Only Aminal contracts can call this");
        move2DSkill.useSkill{value: 0.001 ether}(alice, address(0), skillData);

        // Call through Aminal should work
        vm.prank(alice);
        aminal.feed{value: 0.1 ether}();

        vm.prank(alice);
        aminal.callSkill{value: 0.001 ether}(address(move2DSkill), skillData);

        (uint256 x, uint256 y) = move2DSkill.getCoords(address(aminal));
        assertEq(x, 50, "X should be 50");
        assertEq(y, 60, "Y should be 60");
    }
}
