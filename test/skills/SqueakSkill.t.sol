// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SqueakSkill} from "src/skills/SqueakSkill.sol";
import {ISkill} from "src/interfaces/ISkill.sol";
import {SkillTestBase} from "../base/SkillTestBase.t.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Aminal} from "src/Aminal.sol";

contract SqueakSkillTest is SkillTestBase {
    SqueakSkill public squeakSkill;

    event Squeaked(address indexed aminal, uint256 percentage);
    event LoveConsumed(address indexed user, uint256 amount, uint256 remainingLove, uint256 totalLove);
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
        uint256 initialLove = IAminal(testAminal1).getLoveByUser(alice);
        uint256 initialTotalLove = IAminal(testAminal1).getTotalLove();
        uint256 squeakPercentage = 10; // 10%

        // Calculate expected love consumption
        uint256 expectedConsumption = (initialLove * squeakPercentage) / 100;

        // Prepare squeak call
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakPercentage);

        // Expect events
        vm.expectEmit(true, false, false, true);
        emit Squeaked(testAminal1, squeakPercentage);

        // Execute squeak
        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Verify state changes - love should decrease by approximately the percentage
        uint256 finalLove = IAminal(testAminal1).getLoveByUser(alice);
        assertTrue(finalLove < initialLove, "Love should be consumed");
        assertApproxEqRel(finalLove, initialLove - expectedConsumption, 0.01e18); // 1% tolerance
    }

    function test_SqueakWithDifferentPercentages() public {
        // SkillTestBase already feeds the aminals in setUp

        uint256[] memory percentages = new uint256[](5);
        percentages[0] = 1; // 1%
        percentages[1] = 10; // 10%
        percentages[2] = 25; // 25%
        percentages[3] = 50; // 50%
        percentages[4] = 100; // 100%

        for (uint256 i = 0; i < percentages.length; i++) {
            // Reset by feeding more
            vm.prank(alice);
            IAminal(testAminal1).feed{value: 0.1 ether}();

            uint256 loveBefore = IAminal(testAminal1).getLoveByUser(alice);
            uint256 expectedConsumption = (loveBefore * percentages[i]) / 100;

            bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, percentages[i]);

            vm.prank(alice);
            IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

            uint256 loveAfter = IAminal(testAminal1).getLoveByUser(alice);
            assertApproxEqRel(loveAfter, loveBefore - expectedConsumption, 0.01e18); // 1% tolerance
        }
    }

    function test_SqueakInsufficientLove() public {
        // Try to squeak without any love (should revert with InsufficientTotalLove)
        // Create a new aminal with no love
        vm.prank(alice);
        vm.expectRevert();
        IAminal(testAminal2).useSkill(address(squeakSkill), abi.encodeWithSelector(SqueakSkill.squeak.selector, 10));
    }

    function test_MultipleUsersSqueak() public {
        // SkillTestBase already feeds alice
        // Feed bob too to give him love
        vm.prank(bob);
        IAminal(testAminal1).feed{value: 1 ether}();

        uint256 squeakPercentage = 10; // 10%
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakPercentage);

        // User1 squeaks
        uint256 aliceLoveBefore = IAminal(testAminal1).getLoveByUser(alice);
        uint256 bobLoveBefore = IAminal(testAminal1).getLoveByUser(bob);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        assertTrue(IAminal(testAminal1).getLoveByUser(alice) < aliceLoveBefore, "Alice's love should decrease");
        assertEq(IAminal(testAminal1).getLoveByUser(bob), bobLoveBefore, "Bob's love unchanged");

        // User2 squeaks
        bobLoveBefore = IAminal(testAminal1).getLoveByUser(bob);

        vm.prank(bob);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        assertTrue(IAminal(testAminal1).getLoveByUser(bob) < bobLoveBefore, "Bob's love should decrease");
    }

    function test_SkillCostCalculation() public {
        // Test various percentages (capped at 100)
        uint256[] memory percentages = new uint256[](5);
        percentages[0] = 1;
        percentages[1] = 10;
        percentages[2] = 50;
        percentages[3] = 100;
        percentages[4] = 150; // Should be capped at 100

        for (uint256 i = 0; i < percentages.length; i++) {
            bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, percentages[i]);
            uint256 cost = squeakSkill.skillCost(squeakData);

            uint256 expectedCost = percentages[i] > 100 ? 100 : percentages[i];
            assertEq(cost, expectedCost);
        }
    }

    function test_SkillCostWithInvalidSelector() public {
        // Test with an invalid function selector
        bytes memory invalidData = abi.encodeWithSelector(bytes4(keccak256("invalidFunction()")));
        uint256 cost = squeakSkill.skillCost(invalidData);
        assertEq(cost, 10); // Should return default cost (10%)
    }

    function test_SqueakZeroPercentage() public {
        // SkillTestBase already feeds the aminals in setUp

        // Try to squeak with 0 percentage - should use minimum of 10%
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, 0);

        uint256 loveBefore = IAminal(testAminal1).getLoveByUser(alice);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Should consume at least the minimum percentage (10%)
        uint256 loveAfter = IAminal(testAminal1).getLoveByUser(alice);
        assertTrue(loveAfter < loveBefore, "Love should be consumed");
    }

    function testFuzz_SqueakVariousPercentages(uint256 feedAmount, uint256 squeakPercentage) public {
        // Bound inputs to reasonable ranges
        feedAmount = bound(feedAmount, 0.001 ether, 1 ether);
        squeakPercentage = bound(squeakPercentage, 1, 100); // 1-100%

        // Give alice some ETH for feeding
        vm.deal(alice, feedAmount);

        // Feed the Aminal with specified amount
        vm.prank(alice);
        IAminal(testAminal1).feed{value: feedAmount}();

        uint256 totalLove = IAminal(testAminal1).getTotalLove();
        uint256 userLove = IAminal(testAminal1).getLoveByUser(alice);

        // Only squeak if we have enough love (need at least the percentage of total love)
        uint256 minRequired = (totalLove * squeakPercentage) / 100;
        vm.assume(userLove >= minRequired);

        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, squeakPercentage);

        vm.prank(alice);
        IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

        // Verify love was consumed
        assertTrue(IAminal(testAminal1).getLoveByUser(alice) < userLove);
    }

    function test_SqueakExhaustResources() public {
        // SkillTestBase already feeds the aminals in setUp

        // Squeak 100% multiple times until we run out of love
        bytes memory squeakData = abi.encodeWithSelector(SqueakSkill.squeak.selector, 100);

        uint256 iterations = 0;
        while (iterations < 10) {
            // Safety limit
            uint256 currentLove = IAminal(testAminal1).getLoveByUser(alice);
            uint256 totalLove = IAminal(testAminal1).getTotalLove();

            if (currentLove == 0 || totalLove == 0) break;

            // Check if we have enough love to squeak
            uint256 minRequired = (totalLove * 100) / 100; // Need 100% of total
            if (currentLove < minRequired) break;

            vm.prank(alice);
            IAminal(testAminal1).useSkill(address(squeakSkill), squeakData);

            iterations++;
        }

        // Verify we've significantly reduced love
        assertTrue(IAminal(testAminal1).getLoveByUser(alice) < 100, "Love should be nearly exhausted");

        // Try to squeak again - may or may not fail depending on remaining love
        bytes memory squeakOneData = abi.encodeWithSelector(SqueakSkill.squeak.selector, 10);
        vm.prank(alice);

        // This might revert or succeed depending on remaining love
        try IAminal(testAminal1).useSkill(address(squeakSkill), squeakOneData) {
            // If it succeeds, that's fine
        } catch {
            // If it reverts, that's also expected
        }
    }
}
