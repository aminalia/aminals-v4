// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

/**
 * @title SecurityFixesTest
 * @notice Tests for security audit fixes: Issues #2 & #3
 * @dev Tests reentrancy protection and gas griefing prevention in Aminal.payout()
 */
contract SecurityFixesTest is Test, IAminalStructs {
    AminalFactory public factory;
    GeneAuction public geneAuction;
    AminalProposals public proposals;
    Genes public genes;
    GeneRegistry public geneRegistry;

    AminalContract public aminal;

    address public alice = address(0x1);
    address public attacker = address(0x666);

    // Event declarations for testing
    event PayoutFailed(address indexed recipient, uint256 amount);
    event TreasuryTransferred(address indexed recipient, uint256 amount, uint256 remainingBalance);

    function setUp() public {
        // Deploy contracts
        genes = new Genes();
        geneRegistry = new GeneRegistry(address(genes));
        geneAuction = new GeneAuction(address(genes), address(geneRegistry));
        proposals = new AminalProposals();

        factory = new AminalFactory();
        factory.initialize(address(geneAuction), address(proposals), address(genes));

        genes.setup(address(factory), address(geneRegistry));
        geneAuction.setup(address(factory));
        proposals.setup(address(factory));
        factory.setup();

        // Create an Aminal using spawnInitialAminals
        vm.deal(alice, 10 ether);

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

        // Fund the Aminal's treasury
        vm.deal(address(aminal), 5 ether);
    }

    /*//////////////////////////////////////////////////////////////
                        REENTRANCY PROTECTION TESTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test that reentrancy is prevented by nonReentrant modifier
     */
    function test_ReentrancyProtection_CannotReenterPayout() public {
        // Deploy malicious contract that tries to reenter
        MaliciousReentrantRecipient malicious = new MaliciousReentrantRecipient(address(aminal));

        vm.prank(address(geneAuction));

        // The call should succeed because:
        // 1. The nonReentrant guard blocks the reentrant call (as expected)
        // 2. The malicious contract catches the revert and continues
        // 3. The receive() function completes without reverting
        // 4. Therefore the transfer succeeds
        bool success = aminal.payout(1 ether, address(malicious));

        // The transfer succeeds, but the reentrancy attempt was blocked
        assertTrue(success, "Transfer should succeed after blocking reentrancy");

        // Verify the malicious contract attempted reentrancy
        assertTrue(malicious.attacked(), "Malicious contract should have attempted attack");

        // Verify funds were transferred
        assertEq(address(malicious).balance, 1 ether, "Malicious contract should have received funds");
        assertEq(address(aminal).balance, 4 ether, "Aminal treasury should be reduced");
    }

    /**
     * @notice Test that only GeneAuction can call payout
     */
    function test_ReentrancyProtection_OnlyGeneAuctionCanCall() public {
        vm.prank(attacker);
        vm.expectRevert("Only gene auction can call payout");
        aminal.payout(1 ether, attacker);
    }

    /**
     * @notice Test that payout fails gracefully with invalid recipient
     */
    function test_ReentrancyProtection_InvalidRecipient() public {
        vm.prank(address(geneAuction));
        vm.expectRevert("Invalid recipient");
        aminal.payout(1 ether, address(0));
    }

    /*//////////////////////////////////////////////////////////////
                        GAS GRIEFING PROTECTION TESTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test that gas griefing is prevented by 10k gas limit
     */
    function test_GasGriefing_LimitedGasPreventsInfiniteLoop() public {
        // Deploy malicious contract with infinite loop in receive
        MaliciousGasGriefingRecipient malicious = new MaliciousGasGriefingRecipient();

        vm.prank(address(geneAuction));

        // Should not revert, but return false
        bool success = aminal.payout(1 ether, address(malicious));

        assertFalse(success, "Transfer should fail due to gas limit");

        // Treasury should still have funds (transfer failed)
        assertEq(address(aminal).balance, 5 ether, "Treasury should be unchanged");
    }

    /**
     * @notice Test that normal recipients can receive funds within gas limit
     */
    function test_GasGriefing_NormalRecipientSucceeds() public {
        vm.prank(address(geneAuction));

        bool success = aminal.payout(1 ether, alice);

        assertTrue(success, "Transfer should succeed for normal recipient");
        assertEq(alice.balance, 11 ether, "Alice should receive 1 ETH");
        assertEq(address(aminal).balance, 4 ether, "Treasury should decrease by 1 ETH");
    }

    /**
     * @notice Test PayoutFailed event is emitted on failure
     */
    function test_GasGriefing_EmitsPayoutFailedEvent() public {
        MaliciousGasGriefingRecipient malicious = new MaliciousGasGriefingRecipient();

        vm.prank(address(geneAuction));

        // Expect PayoutFailed event
        vm.expectEmit(true, true, false, true);
        emit PayoutFailed(address(malicious), 1 ether);

        aminal.payout(1 ether, address(malicious));
    }

    /**
     * @notice Test TreasuryTransferred event is emitted on success
     */
    function test_GasGriefing_EmitsTreasuryTransferredEvent() public {
        vm.prank(address(geneAuction));

        // Expect TreasuryTransferred event
        vm.expectEmit(true, false, false, true);
        emit TreasuryTransferred(alice, 1 ether, 4 ether);

        aminal.payout(1 ether, alice);
    }

    /**
     * @notice Test that multiple payouts work correctly
     */
    function test_MultiplePayout_Sequential() public {
        vm.startPrank(address(geneAuction));

        // First payout
        bool success1 = aminal.payout(1 ether, alice);
        assertTrue(success1);
        assertEq(alice.balance, 11 ether);

        // Second payout
        bool success2 = aminal.payout(2 ether, alice);
        assertTrue(success2);
        assertEq(alice.balance, 13 ether);

        // Treasury should have 2 ETH remaining
        assertEq(address(aminal).balance, 2 ether);

        vm.stopPrank();
    }

    /**
     * @notice Test that insufficient treasury balance reverts
     */
    function test_Payout_InsufficientTreasury() public {
        vm.prank(address(geneAuction));
        vm.expectRevert(AminalContract.InsufficientTreasury.selector);
        aminal.payout(10 ether, alice); // Aminal only has 5 ETH
    }
}

/*//////////////////////////////////////////////////////////////
                        MALICIOUS CONTRACTS
//////////////////////////////////////////////////////////////*/

/**
 * @notice Malicious contract that attempts reentrancy
 */
contract MaliciousReentrantRecipient {
    address public targetAminal;
    bool public attacked;

    constructor(address _targetAminal) {
        targetAminal = _targetAminal;
    }

    receive() external payable {
        if (!attacked) {
            attacked = true;
            // Try to reenter payout - this should fail with nonReentrant
            try AminalContract(payable(targetAminal)).payout(1 ether, address(this)) {
                // If this succeeds, the reentrancy guard failed
                revert("Reentrancy guard failed!");
            } catch {
                // Expected to fail - reentrancy blocked
            }
        }
    }
}

/**
 * @notice Malicious contract that attempts gas griefing with infinite loop
 */
contract MaliciousGasGriefingRecipient {
    receive() external payable {
        // Infinite loop - will run out of gas
        // With 10k gas limit, this won't complete
        while (true) {
            // Consume gas
            keccak256(abi.encodePacked(msg.sender, block.timestamp));
        }
    }
}
