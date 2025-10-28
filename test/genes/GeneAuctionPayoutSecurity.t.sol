// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

/**
 * @title GeneAuctionPayoutSecurityTest
 * @notice Simplified test demonstrating the payout griefing vulnerability in gene auctions
 * @dev This test shows how attackers can prevent gene creator payouts by using contracts
 *      that cannot receive ETH, and how the failed payout mechanism mitigates this
 */
contract GeneAuctionPayoutSecurityTest is Test {
    // Mock contracts for testing
    MockGenes public genes;
    MockAminal public aminal1;
    MockAminal public aminal2;
    MockGeneAuction public geneAuction;

    address public attacker = makeAddr("attacker");
    address public victim = makeAddr("victim");

    uint256 public constant PAYOUT_AMOUNT = 1 ether;

    function setUp() public {
        // Deploy mock contracts
        genes = new MockGenes();
        aminal1 = new MockAminal();
        aminal2 = new MockAminal();
        geneAuction = new MockGeneAuction(address(genes));

        // Give aminals some ETH to pay out
        vm.deal(address(aminal1), 10 ether);
        vm.deal(address(aminal2), 10 ether);

        // Fund the gene auction contract so it can pay out failed payouts
        vm.deal(address(geneAuction), 20 ether);
    }

    /**
     * @notice Test demonstrating the griefing attack where gene owner prevents payouts
     */
    function testPayoutGriefingAttack() public {
        // 1. Attacker creates a gene NFT
        uint256 geneId = genes.mint(attacker);
        assertEq(genes.ownerOf(geneId), attacker);

        // 2. Attacker transfers gene to contract that cannot receive ETH
        vm.startPrank(attacker);
        NoReceiveContract maliciousContract = new NoReceiveContract();
        genes.transferFrom(attacker, address(maliciousContract), geneId);
        vm.stopPrank();

        assertEq(genes.ownerOf(geneId), address(maliciousContract));

        // 3. Simulate auction settlement attempting to pay gene creator
        // This should fail but not revert the entire settlement
        bool success =
            geneAuction.attemptPayout(geneId, payable(address(aminal1)), payable(address(aminal2)), PAYOUT_AMOUNT);

        // Settlement continues despite failed payout
        assertFalse(success, "Payout should fail due to griefing");

        // 4. Verify failed payout was recorded
        (uint256 failedAmount, bool claimed) = geneAuction.getFailedPayout(geneId);
        assertEq(failedAmount, PAYOUT_AMOUNT * 2, "Failed payout should be recorded");
        assertFalse(claimed, "Failed payout should not be claimed yet");
    }

    /**
     * @notice Test that failed payouts can be claimed after transferring to valid address
     */
    function testClaimFailedPayout() public {
        // Setup griefing scenario first
        testPayoutGriefingAttack();

        uint256 geneId = 1;
        NoReceiveContract maliciousContract = NoReceiveContract(genes.ownerOf(geneId));

        // Attacker realizes they need to transfer to EOA to claim
        vm.startPrank(address(maliciousContract));
        genes.transferFrom(address(maliciousContract), victim, geneId);
        vm.stopPrank();

        uint256 victimBalanceBefore = victim.balance;

        // Now victim can claim the failed payout
        vm.prank(victim);
        bool claimSuccess = geneAuction.claimFailedPayout(geneId);

        assertTrue(claimSuccess, "Claim should succeed");

        // Verify victim received the ETH
        assertEq(victim.balance, victimBalanceBefore + (PAYOUT_AMOUNT * 2), "Victim should receive failed payout");

        // Verify payout is marked as claimed
        (, bool claimed) = geneAuction.getFailedPayout(geneId);
        assertTrue(claimed, "Failed payout should be marked as claimed");
    }

    /**
     * @notice Test that normal payouts work correctly (no griefing)
     */
    function testNormalPayoutSuccess() public {
        // Create gene owned by normal address
        uint256 geneId = genes.mint(victim);

        uint256 victimBalanceBefore = victim.balance;

        // Normal payout should succeed
        bool success =
            geneAuction.attemptPayout(geneId, payable(address(aminal1)), payable(address(aminal2)), PAYOUT_AMOUNT);

        assertTrue(success, "Normal payout should succeed");
        assertEq(victim.balance, victimBalanceBefore + (PAYOUT_AMOUNT * 2), "Victim should receive payout");

        // No failed payout should be recorded
        (uint256 failedAmount,) = geneAuction.getFailedPayout(geneId);
        assertEq(failedAmount, 0, "No failed payout should be recorded");
    }
}

/**
 * @notice Mock Genes NFT contract for testing
 */
contract MockGenes {
    mapping(uint256 => address) public owners;
    mapping(address => mapping(address => bool)) public approved;
    uint256 public nextTokenId = 1;

    function mint(address to) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        owners[tokenId] = to;
        return tokenId;
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        return owners[tokenId];
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        require(owners[tokenId] == from, "Not owner");
        owners[tokenId] = to;
    }

    function approve(address to, uint256 tokenId) external {
        approved[msg.sender][to] = true;
    }
}

/**
 * @notice Mock Aminal contract for testing payouts
 */
contract MockAminal {
    function payout(uint256 amount, address recipient) external returns (bool) {
        (bool success,) = payable(recipient).call{value: amount}("");
        return success;
    }

    receive() external payable {}
}

/**
 * @notice Mock GeneAuction contract demonstrating the security fix
 */
contract MockGeneAuction {
    MockGenes public genes;

    struct FailedPayout {
        uint256 amount;
        bool claimed;
    }

    mapping(uint256 => FailedPayout) public failedPayouts;

    constructor(address _genes) {
        genes = MockGenes(_genes);
    }

    /**
     * @notice Attempt to pay gene creator, handling failures gracefully
     */
    function attemptPayout(uint256 geneId, address payable aminal1, address payable aminal2, uint256 amount)
        external
        returns (bool success)
    {
        address geneOwner = genes.ownerOf(geneId);

        // Attempt payouts from both parent aminals
        bool success1 = MockAminal(aminal1).payout(amount, geneOwner);
        bool success2 = MockAminal(aminal2).payout(amount, geneOwner);

        // If either failed, record for later claiming
        if (!success1 || !success2) {
            failedPayouts[geneId].amount += (success1 ? 0 : amount) + (success2 ? 0 : amount);
            failedPayouts[geneId].claimed = false;
        }

        return success1 && success2;
    }

    /**
     * @notice Allow gene owners to claim failed payouts
     */
    function claimFailedPayout(uint256 geneId) external returns (bool) {
        require(failedPayouts[geneId].amount > 0, "No failed payout");
        require(!failedPayouts[geneId].claimed, "Already claimed");

        address geneOwner = genes.ownerOf(geneId);
        require(msg.sender == geneOwner, "Only gene owner");

        uint256 amount = failedPayouts[geneId].amount;

        // Try to send the failed payout directly
        (bool success,) = payable(geneOwner).call{value: amount}("");
        require(success, "Still cannot receive ETH");

        failedPayouts[geneId].claimed = true;

        return true;
    }

    /**
     * @notice Get failed payout information
     */
    function getFailedPayout(uint256 geneId) external view returns (uint256 amount, bool claimed) {
        return (failedPayouts[geneId].amount, failedPayouts[geneId].claimed);
    }

    receive() external payable {}
}

/**
 * @notice Contract that cannot receive ETH - used for griefing attack demonstration
 */
contract NoReceiveContract {
    // Deliberately no receive() or fallback() functions

    // Can still handle NFTs
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
