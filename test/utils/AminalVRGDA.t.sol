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

    function test_LoveGainFromFeeding() public {
        uint256 feedAmount = 0.5 ether;

        // Calculate expected love using VRGDA directly (energy parameter is now ignored)
        uint256 expectedLove = vrgda.getLoveForETH(0, feedAmount);

        vm.prank(user1);
        aminal.feed{value: feedAmount}();

        assertEq(aminal.getLoveByUser(user1), expectedLove);
        assertEq(aminal.getTotalLove(), expectedLove);
    }

    function test_ConsistentLoveGain() public {
        // Since we no longer track energy, love gain should be consistent for same ETH amount
        uint256 feedAmount1 = 0.1 ether;

        uint256 expectedLove1 = vrgda.getLoveForETH(0, feedAmount1);

        vm.prank(user1);
        aminal.feed{value: feedAmount1}();

        assertEq(aminal.getLoveByUser(user1), expectedLove1);
        assertEq(aminal.getTotalLove(), expectedLove1);

        // Second user feeds same amount - should get same love
        uint256 feedAmount2 = 0.1 ether;
        uint256 expectedLove2 = vrgda.getLoveForETH(0, feedAmount2);

        vm.prank(user2);
        aminal.feed{value: feedAmount2}();

        assertEq(aminal.getLoveByUser(user2), expectedLove2);

        // Love amounts should be equal for equal ETH
        assertEq(expectedLove1, expectedLove2);
    }

    function test_LoveTrackingPerUser() public {
        uint256 feedAmount1 = 0.1 ether;
        uint256 feedAmount2 = 0.2 ether;

        // Calculate expected love for each feeding
        uint256 expectedLove1 = vrgda.getLoveForETH(0, feedAmount1);
        uint256 expectedLove2 = vrgda.getLoveForETH(0, feedAmount2);

        // First user feeds
        vm.prank(user1);
        aminal.feed{value: feedAmount1}();

        // Second user feeds
        vm.prank(user2);
        aminal.feed{value: feedAmount2}();

        // Check individual love tracking
        assertEq(aminal.getLoveByUser(user1), expectedLove1);
        assertEq(aminal.getLoveByUser(user2), expectedLove2);
        assertEq(aminal.getTotalLove(), expectedLove1 + expectedLove2);
    }

    function test_MinimumFeedingAmount() public {
        uint256 minFeedAmount = 0.001 ether;

        // Should be able to feed minimum amount
        vm.prank(user1);
        aminal.feed{value: minFeedAmount}();

        assertGt(aminal.getTotalLove(), 0);
        assertGt(aminal.getLoveByUser(user1), 0);
    }

    function testFuzz_ConsistentLoveGain(uint96 ethAmount) public {
        // Use bound instead of assume to avoid CI rejection issues
        ethAmount = uint96(bound(uint256(ethAmount), 0.001 ether, 10 ether));

        uint256 expectedLove = vrgda.getLoveForETH(0, ethAmount);

        vm.prank(user1);
        aminal.feed{value: ethAmount}();

        assertEq(aminal.getTotalLove(), expectedLove);
        assertEq(aminal.getLoveByUser(user1), expectedLove);
    }

    function test_MultipleFeedingAccumulation() public {
        uint256 feedAmount = 0.1 ether;
        uint256 expectedLovePerFeed = vrgda.getLoveForETH(0, feedAmount);

        // Feed multiple times
        vm.startPrank(user1);
        aminal.feed{value: feedAmount}();
        aminal.feed{value: feedAmount}();
        aminal.feed{value: feedAmount}();
        vm.stopPrank();

        // Should have 3x the love
        assertEq(aminal.getLoveByUser(user1), expectedLovePerFeed * 3);
        assertEq(aminal.getTotalLove(), expectedLovePerFeed * 3);
    }

    function test_LargeFeedingAmount() public {
        uint256 largeFeedAmount = 100 ether;

        vm.prank(user2); // user2 has more ETH
        aminal.feed{value: largeFeedAmount}();

        // Should gain substantial love
        assertGt(aminal.getTotalLove(), 0);
        assertGt(aminal.getLoveByUser(user2), 0);
    }

    function test_VRGDAConstants() public {
        // Verify VRGDA constants are set correctly
        assertEq(vrgda.ENERGY_PER_ETH(), 10_000);
        assertEq(vrgda.MAX_LOVE_MULTIPLIER(), 10 ether);
        assertEq(vrgda.MIN_LOVE_MULTIPLIER(), 0.1 ether);
    }
}
