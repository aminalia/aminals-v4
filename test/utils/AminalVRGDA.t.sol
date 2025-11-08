// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {AminalVRGDA} from "src/utils/AminalVRGDA.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

contract AminalVRGDATest is Test, IAminalStructs {
    AminalFactory public factory;
    AminalContract public aminal;
    AminalVRGDA public vrgda;
    GeneAuction public geneAuction;
    Genes public genes;
    GeneRegistry public geneRegistry;

    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");

    function setUp() public {
        // Deploy real dependencies
        genes = new Genes();
        geneRegistry = new GeneRegistry(address(genes));
        geneAuction = new GeneAuction(address(genes), address(geneRegistry));

        // Deploy factory
        factory = new AminalFactory();
        factory.initialize(address(geneAuction), address(genes));

        // Setup contracts properly
        genes.setup(address(factory), address(geneRegistry));
        geneAuction.setup(address(factory));
        factory.setup(); // This deploys the VRGDA

        // Get the VRGDA instance from factory
        vrgda = factory.loveVRGDA();

        // Spawn a test Aminal
        GeneInstance[9][] memory genesisGenes = new GeneInstance[9][](1);
        for (uint256 i = 0; i < 9; i++) {
            genesisGenes[0][i] = GeneInstance({
                geneId: 1,
                offsetX: 0,
                offsetY: 0,
                scale: 100,
                rotation: 0
            });
        }

        factory.spawnInitialAminals(genesisGenes);
        address aminalAddress = factory.getAminalByIndex(0);
        aminal = AminalContract(payable(aminalAddress));

        // Fund test users
        deal(user1, 20 ether);
        deal(user2, 2000 ether);
    }

    function test_InitialLoveIsZero() public {
        // Initial love should be 0
        assertEq(aminal.getTotalLove(), 0);
    }

    function test_OnScheduleFeeding() public {
        // Feed exactly on schedule: 0.1 ETH per day
        uint256 feedAmount = 0.1 ether;

        // At time = 0 (just born), feeding should give good love
        vm.prank(user1);
        aminal.feed{value: feedAmount}();

        uint256 love1 = aminal.getLoveByUser(user1);
        console.log("Love at t=0 for 0.1 ETH:", love1);
        assertTrue(love1 > 0, "Should get some love");

        // Warp 1 day forward
        vm.warp(block.timestamp + 1 days);

        // Feed exactly 0.1 ETH again (staying on schedule)
        vm.prank(user2);
        aminal.feed{value: feedAmount}();

        uint256 love2 = aminal.getLoveByUser(user2);
        console.log("Love at t=1day for 0.1 ETH (on schedule):", love2);

        // Should get similar love since we're on schedule
        assertApproxEqRel(love2, love1, 0.5e18); // Within 50% (VRGDA curve affects this)
    }

    function test_AheadOfSchedule() public {
        // Feed way more than target (0.5 ETH instead of 0.1 ETH)
        uint256 feedAmount = 0.5 ether;

        vm.prank(user1);
        aminal.feed{value: feedAmount}();

        uint256 love1 = aminal.getLoveByUser(user1);
        console.log("Love for feeding 5x target at t=0:", love1);

        // Now we're way ahead of schedule
        // Warp 1 day forward
        vm.warp(block.timestamp + 1 days);

        // Try to feed more - should get LESS love per ETH since we're ahead
        vm.prank(user2);
        aminal.feed{value: 0.1 ether}();

        uint256 love2 = aminal.getLoveByUser(user2);
        console.log("Love for 0.1 ETH when ahead of schedule:", love2);

        // Love per ETH should be lower when ahead of schedule
        uint256 lovePerEth1 = (love1 * 1e18) / feedAmount;
        uint256 lovePerEth2 = (love2 * 1e18) / 0.1 ether;

        assertTrue(lovePerEth2 < lovePerEth1, "Should get less love per ETH when ahead");
    }

    function test_BehindSchedule() public {
        // Don't feed for 10 days
        vm.warp(block.timestamp + 10 days);

        // Now we're way behind schedule (should have fed 1 ETH total by now)
        // Feeding should give MORE love per ETH
        uint256 feedAmount = 0.1 ether;

        vm.prank(user1);
        aminal.feed{value: feedAmount}();

        uint256 love1 = aminal.getLoveByUser(user1);
        console.log("Love for 0.1 ETH when 10 days behind schedule:", love1);

        // Compare to feeding at t=0
        // Reset and test t=0 feeding
        GeneInstance[9][] memory genesisGenes2 = new GeneInstance[9][](1);
        vm.store(address(factory), bytes32(uint256(2)), bytes32(uint256(0))); // Reset spawn flag
        factory.spawnInitialAminals(genesisGenes2);
        address aminal2Address = factory.getAminalByIndex(1);
        AminalContract aminal2 = AminalContract(payable(aminal2Address));

        vm.prank(user2);
        aminal2.feed{value: feedAmount}();
        uint256 love2 = aminal2.getLoveByUser(user2);

        console.log("Love for 0.1 ETH at t=0:", love2);

        // When behind schedule, should get more love
        assertTrue(love1 > love2, "Should get more love when behind schedule");
    }

    function test_VRGDAConstants() public {
        // Verify VRGDA constants are set correctly
        assertEq(vrgda.ENERGY_PER_ETH(), 10_000);
        assertEq(vrgda.TARGET_FEED_RATE(), 0.1 ether);
        assertEq(vrgda.MAX_LOVE_MULTIPLIER(), 10 ether);
        assertEq(vrgda.MIN_LOVE_MULTIPLIER(), 0.1 ether);
    }

    function test_LoveTrackingPerUser() public {
        uint256 feedAmount1 = 0.1 ether;
        uint256 feedAmount2 = 0.2 ether;

        // First user feeds
        vm.prank(user1);
        aminal.feed{value: feedAmount1}();
        uint256 love1 = aminal.getLoveByUser(user1);

        // Second user feeds
        vm.prank(user2);
        aminal.feed{value: feedAmount2}();
        uint256 love2 = aminal.getLoveByUser(user2);

        // Check individual love tracking
        assertTrue(love1 > 0, "User1 should have love");
        assertTrue(love2 > 0, "User2 should have love");
        assertEq(aminal.getTotalLove(), love1 + love2, "Total should equal sum");
    }

    function test_TotalEthFedTracking() public {
        assertEq(aminal.totalEthFed(), 0, "Should start at 0");

        uint256 feed1 = 0.05 ether;
        vm.prank(user1);
        aminal.feed{value: feed1}();
        assertEq(aminal.totalEthFed(), feed1, "Should track first feed");

        uint256 feed2 = 0.03 ether;
        vm.prank(user2);
        aminal.feed{value: feed2}();
        assertEq(aminal.totalEthFed(), feed1 + feed2, "Should track cumulative");
    }

    function testFuzz_FeedingAtVariousTimes(uint32 timeWarp, uint96 feedAmount) public {
        // Bound inputs
        timeWarp = uint32(bound(uint256(timeWarp), 0, 30 days));
        feedAmount = uint96(bound(uint256(feedAmount), 0.001 ether, 1 ether));

        // Warp time
        vm.warp(block.timestamp + timeWarp);

        // Feed
        vm.prank(user1);
        aminal.feed{value: feedAmount}();

        // Should always get some love
        assertTrue(aminal.getLoveByUser(user1) > 0, "Should get love");
        assertEq(aminal.totalEthFed(), feedAmount, "Should track ETH");
    }
}
