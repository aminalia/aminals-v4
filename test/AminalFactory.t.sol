// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {MockVisualsAuction} from "test/mocks/MockVisualsAuction.sol";
import {MockAminalProposals} from "test/mocks/MockAminalProposals.sol";
import {MockGenesNFT} from "test/mocks/MockGenesNFT.sol";

contract AminalFactoryTest is Test, IAminalStructs {
    AminalFactory public factory;
    MockVisualsAuction public visualsAuction;
    MockAminalProposals public proposals;
    MockGenesNFT public genesNFT;
    Move2D public move2DSkill;
    
    address public alice = address(0x1);
    address public bob = address(0x2);
    
    function setUp() public {
        // Deploy dependencies (simplified for testing)
        visualsAuction = new MockVisualsAuction();
        proposals = new MockAminalProposals();
        genesNFT = new MockGenesNFT();
        
        // Deploy factory
        factory = new AminalFactory(
            address(visualsAuction),
            address(proposals),
            address(genesNFT)
        );
        
        // Setup factory
        factory.setup();
        
        // Deploy a skill
        move2DSkill = new Move2D(address(factory));
    }
    
    function testSpawnInitialAminals() public {
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
        
        factory.spawnInitialAminals(initialVisuals);
        
        assertEq(factory.totalAminals(), 2);
        
        address aminal1 = factory.getAminalByIndex(0);
        address aminal2 = factory.getAminalByIndex(1);
        
        assertTrue(aminal1 != address(0));
        assertTrue(aminal2 != address(0));
        assertTrue(aminal1 != aminal2);
        
        assertTrue(factory.isAminal(aminal1));
        assertTrue(factory.isAminal(aminal2));
    }
    
    function testAminalBasicFunctionality() public {
        // Spawn an Aminal first
        Visuals[] memory initialVisuals = new Visuals[](1);
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
        
        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        AminalContract aminal = AminalContract(payable(aminalAddress));
        
        // Test initial state
        assertEq(aminal.getTotalLove(), 0);
        assertEq(aminal.getEnergy(), 50 * 10**18);
        assertEq(aminal.getLoveByUser(alice), 0);
        
        // Test feeding
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        aminal.feed{value: 0.01 ether}();
        
        assertTrue(aminal.getLoveByUser(alice) > 0);
        assertTrue(aminal.getTotalLove() > 0);
        assertTrue(aminal.getEnergy() > 50 * 10**18);
    }
    
    function testSkillRegistrationAndUsage() public {
        // Register the skill in the factory
        vm.prank(address(proposals)); // Simulate proposal contract calling
        factory.addSkill(address(move2DSkill));
        
        assertTrue(factory.isSkillRegistered(address(move2DSkill)));
        
        // Spawn an Aminal
        Visuals[] memory initialVisuals = new Visuals[](1);
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
        
        factory.spawnInitialAminals(initialVisuals);
        address aminalAddress = factory.getAminalByIndex(0);
        AminalContract aminal = AminalContract(payable(aminalAddress));
        
        // Feed the Aminal first to give it energy
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        aminal.feed{value: 0.01 ether}();
        
        // Use the skill
        bytes memory skillData = move2DSkill.getSkillData(10, 20);
        vm.prank(alice);
        aminal.callSkill{value: 0.001 ether}(address(move2DSkill), skillData);
        
        // Check that the skill was executed
        (uint256 x, uint256 y) = move2DSkill.getCoords(aminalAddress);
        assertEq(x, 10);
        assertEq(y, 20);
        
        // Check that energy was consumed
        assertTrue(aminal.getEnergy() < 51 * 10**18); // Should be less due to squeak cost
    }
    
    function testBreedingSetup() public {
        // Spawn two Aminals
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
        
        factory.spawnInitialAminals(initialVisuals);
        address aminal1Address = factory.getAminalByIndex(0);
        address aminal2Address = factory.getAminalByIndex(1);
        
        AminalContract aminal1 = AminalContract(payable(aminal1Address));
        AminalContract aminal2 = AminalContract(payable(aminal2Address));
        
        // Feed both Aminals to build love
        vm.deal(alice, 1 ether);
        vm.startPrank(alice);
        aminal1.feed{value: 0.1 ether}();
        aminal2.feed{value: 0.1 ether}();
        vm.stopPrank();
        
        // Set breeding preferences
        vm.prank(alice);
        aminal1.setBreedableWith(aminal2Address, true);
        
        assertTrue(aminal1.isBreedableWith(aminal2Address));
        assertFalse(aminal2.isBreedableWith(aminal1Address));
    }
    
    function testAminalUniqueness() public {
        // Spawn multiple Aminals and verify they all have unique addresses
        Visuals[] memory initialVisuals = new Visuals[](5);
        for (uint256 i = 0; i < 5; i++) {
            initialVisuals[i] = Visuals({
                backId: 0,
                armId: 0,
                tailId: 0,
                earsId: 0,
                bodyId: 0,
                faceId: 0,
                mouthId: 0,
                miscId: 0
            });
        }
        
        factory.spawnInitialAminals(initialVisuals);
        
        address[] memory aminalAddresses = new address[](5);
        for (uint256 i = 0; i < 5; i++) {
            aminalAddresses[i] = factory.getAminalByIndex(i);
            assertTrue(factory.isAminal(aminalAddresses[i]));
        }
        
        // Verify all addresses are unique
        for (uint256 i = 0; i < 5; i++) {
            for (uint256 j = i + 1; j < 5; j++) {
                assertTrue(aminalAddresses[i] != aminalAddresses[j]);
            }
        }
    }
}