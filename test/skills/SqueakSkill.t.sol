// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SqueakSkill} from "src/skills/SqueakSkill.sol";
import {ISkill} from "src/interfaces/ISkill.sol";
import {SkillTestBase} from "../base/SkillTestBase.t.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Aminal} from "src/Aminal.sol";

contract SqueakSkillTest is SkillTestBase {
    SqueakSkill public squeakSkill;

    event Squeaked(address indexed aminal, uint256 amount);
    event EnergyLost(address indexed user, uint256 amount, uint256 remainingEnergy);
    event LoveConsumed(address indexed user, uint256 amount, uint256 remainingLove);
    // SkillTestBase already declares SkillUsed event

    function setUp() public override {
        super.setUp();
        squeakSkill = new SqueakSkill();
    }

    function test_SqueakSkillSupportsInterface() public {
        assertTrue(squeakSkill.supportsInterface(type(ISkill).interfaceId));
    }

    function test_BasicSqueak() public {
        // SkillTestBase already feeds the aminals in setUp
        uint256 initialEnergy = IAminal(testAminal1).getEnergy();
        uint256 initialLove = IAminal(testAminal1).getLoveByUser(alice);
        uint256 squeakAmount = 100;

        // Prepare squeak call
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        // Expect events
        vm.expectEmit(true, false, false, true);
        emit Squeaked(testAminal1, squeakAmount);

        vm.expectEmit(true, false, false, true);
        emit EnergyLost(alice, squeakAmount, initialEnergy - squeakAmount);

        vm.expectEmit(true, false, false, true);
        emit LoveConsumed(alice, squeakAmount, initialLove - squeakAmount);

        vm.expectEmit(true, true, true, true);
        emit SkillUsed(alice, squeakAmount, address(squeakSkill), SqueakSkill.squeak.selector);

        // Execute squeak
        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Verify state changes
        assertEq(IAminal(testAminal1).getEnergy(), initialEnergy - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(alice), initialLove - squeakAmount);
    }

    function test_SqueakWithDifferentAmounts() public {
        // SkillTestBase already feeds the aminals in setUp

        uint256[] memory amounts = new uint256[](5);
        amounts[0] = 1;
        amounts[1] = 10;
        amounts[2] = 100;
        amounts[3] = 500;
        amounts[4] = 1000;

        for (uint256 i = 0; i < amounts.length; i++) {
            uint256 energyBefore = IAminal(testAminal1).getEnergy();
            uint256 loveBefore = IAminal(testAminal1).getLoveByUser(alice);

            bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, amounts[i]);

            vm.prank(alice);
            IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

            assertEq(IAminal(testAminal1).getEnergy(), energyBefore - amounts[i]);
            assertEq(IAminal(testAminal1).getLoveByUser(alice), loveBefore - amounts[i]);
        }
    }

    function test_SqueakInsufficientEnergy() public {
        // Get current energy from the already-fed aminal
        uint256 energy = IAminal(testAminal1).getEnergy();
        uint256 squeakAmount = energy + 1; // Try to squeak more than available

        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        vm.prank(alice);
        vm.expectRevert(); // Expect any revert for insufficient energy
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);
    }

    function test_SqueakInsufficientLove() public {
        // SkillTestBase already gives alice some love
        // Feed more from bob to add energy but not alice's love
        vm.prank(bob);
        IAminal(testAminal1).feed{value: 0.1 ether}();

        // User1 tries to squeak more than their love but less than the cap
        uint256 aliceLove = IAminal(testAminal1).getLoveByUser(alice);
        uint256 squeakAmount = aliceLove + 1;

        // Ensure the amount is less than or equal to 10000 cap
        assertTrue(squeakAmount <= 10_000, "Squeak amount should be less than or equal to cap");

        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        vm.prank(alice);
        vm.expectRevert(); // Expect any revert for insufficient love
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);
    }

    function test_MultipleUsersSqueak() public {
        // SkillTestBase already feeds alice
        // Feed bob too to give him love
        vm.prank(bob);
        IAminal(testAminal1).feed{value: 1 ether}();

        uint256 squeakAmount = 500;
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        // User1 squeaks
        uint256 energyBefore = IAminal(testAminal1).getEnergy();
        uint256 aliceLoveBefore = IAminal(testAminal1).getLoveByUser(alice);
        uint256 bobLoveBefore = IAminal(testAminal1).getLoveByUser(bob);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        assertEq(IAminal(testAminal1).getEnergy(), energyBefore - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(alice), aliceLoveBefore - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(bob), bobLoveBefore); // User2's love unchanged

        // User2 squeaks
        energyBefore = IAminal(testAminal1).getEnergy();
        bobLoveBefore = IAminal(testAminal1).getLoveByUser(bob);

        vm.prank(bob);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        assertEq(IAminal(testAminal1).getEnergy(), energyBefore - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(bob), bobLoveBefore - squeakAmount);
    }

    function test_SkillCostCalculation() public {
        // Test various amounts
        uint256[] memory amounts = new uint256[](4);
        amounts[0] = 1;
        amounts[1] = 100;
        amounts[2] = 1000;
        amounts[3] = 10_000;

        for (uint256 i = 0; i < amounts.length; i++) {
            bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, amounts[i]);
            uint256 cost = squeakSkill.skillCost(squeakData);
            assertEq(cost, amounts[i]);
        }
    }

    function test_SkillCostWithInvalidSelector() public {
        // Test with an invalid function selector
        bytes memory invalidData = abi.encodeWithSelector(bytes4(keccak256("invalidFunction()")));
        uint256 cost = squeakSkill.skillCost(invalidData);
        assertEq(cost, 1); // Should return default cost
    }

    function test_SqueakZeroAmount() public {
        // SkillTestBase already feeds the aminals in setUp

        // Try to squeak with 0 amount
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, 0);

        // Even though squeak amount is 0, useSkill enforces minimum cost of 1
        uint256 energyBefore = IAminal(testAminal1).getEnergy();
        uint256 loveBefore = IAminal(testAminal1).getLoveByUser(alice);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Should consume 1 unit (minimum cost)
        assertEq(IAminal(testAminal1).getEnergy(), energyBefore - 1);
        assertEq(IAminal(testAminal1).getLoveByUser(alice), loveBefore - 1);
    }

    function testFuzz_SqueakVariousAmounts(uint256 feedAmount, uint256 squeakAmount) public {
        // Bound inputs
        feedAmount = bound(feedAmount, 0.001 ether, 10 ether);
        squeakAmount = bound(squeakAmount, 1, 10_000);

        // Feed the Aminal with specified amount  
        vm.prank(alice);
        IAminal(testAminal1).feed{value: feedAmount}();

        uint256 energy = IAminal(testAminal1).getEnergy();
        uint256 love = IAminal(testAminal1).getLoveByUser(alice);

        // Only squeak if we have enough resources
        vm.assume(squeakAmount <= energy);
        vm.assume(squeakAmount <= love);

        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakAmount);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        assertEq(IAminal(testAminal1).getEnergy(), energy - squeakAmount);
        assertEq(IAminal(testAminal1).getLoveByUser(alice), love - squeakAmount);
    }

    function test_SqueakExhaustAllResources() public {
        // SkillTestBase already feeds the aminals in setUp

        // Get the minimum of energy and love
        uint256 energy = IAminal(testAminal1).getEnergy();
        uint256 love = IAminal(testAminal1).getLoveByUser(alice);
        uint256 maxSqueak = energy < love ? energy : love;

        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, maxSqueak);

        // Squeak the maximum amount
        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Verify we've exhausted at least one resource
        assertTrue(IAminal(testAminal1).getEnergy() == 0 || IAminal(testAminal1).getLoveByUser(alice) == 0);

        // Try to squeak again - should fail
        bytes memory squeakOneData = abi.encodeWithSelector(SqueakSkill.squeak.selector, 1);
        vm.prank(alice);
        vm.expectRevert();
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakOneData);
    }
}
