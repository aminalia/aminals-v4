// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AminalFeedingSchedule
 * @notice Schedule-based love calculation for continuous feeding
 * @dev Target rate: 0.1 ETH worth of feeding per day on average (1000 love units/day)
 *
 * @dev Mechanics:
 * - Target: 0.1 ETH fed per day = 1000 love units per day
 * - Multiplier scales naturally with schedule deviation (no artificial caps)
 * - Behind schedule → higher multiplier (incentivizes rescue of neglected Aminals)
 * - On schedule → 1x multiplier
 * - Ahead of schedule → lower multiplier (diminishing returns for overfeeding)
 *
 * @dev Examples:
 * - Day 1: Feed 0.1 ETH when target is 0.1 ETH → 1x multiplier → 1000 love
 * - Day 10: Feed 0.1 ETH when target is 1 ETH (unfed for 10 days) → 10x multiplier → 10,000 love
 * - Day 365: Feed 0.1 ETH when target is 36.5 ETH (unfed for year) → 365x multiplier → 365,000 love!
 * - Day 1: Feed 1 ETH when target is 0.1 ETH → 0.1x multiplier → 100 love (binge feeding penalty)
 */
contract AminalFeedingSchedule {
    /// @notice Fixed rate of love units per ETH (for love calculation)
    uint256 public constant LOVE_PER_ETH = 10_000; // 1 ETH = 10,000 love units

    /// @notice Target feeding rate: 0.1 ETH per day = 1000 love units per day
    uint256 public constant TARGET_FEED_RATE = 0.1 ether; // per day

    /**
     * @notice Calculate how much love is gained for a given ETH amount based on feeding schedule
     * @dev Compares cumulative feeding against target schedule to determine love multiplier
     * @dev Behind schedule = higher multiplier (rescue bonus)
     * @dev On schedule = 1x multiplier
     * @dev Ahead of schedule = lower multiplier (diminishing returns)
     * @param timeSinceStart Time elapsed since Aminal creation (in seconds)
     * @param totalEthFed Total ETH fed to this Aminal so far (in wei)
     * @param ethAmount Amount of ETH being fed now (in wei)
     * @return loveGained Amount of love that will be gained (in love units)
     */
    function getLoveForETH(uint256 timeSinceStart, uint256 totalEthFed, uint256 ethAmount)
        public
        pure
        returns (uint256 loveGained)
    {
        if (ethAmount == 0) return 0;

        // Calculate target ETH that should have been fed by now based on 0.1 ETH/day schedule
        uint256 targetEthByNow = (timeSinceStart * TARGET_FEED_RATE) / 1 days;

        // Base love: 1 ETH = 10,000 units
        uint256 baseLove = (ethAmount * LOVE_PER_ETH) / 1 ether;

        // Apply schedule-based scaling
        if (timeSinceStart == 0 || targetEthByNow == 0) {
            // At t=0 or very early, no scaling (1x)
            loveGained = baseLove;
        } else if (totalEthFed == 0) {
            // Never been fed but time has passed → scale based on first feeding
            // Treat this first feeding as establishing the baseline
            // multiplier = targetEthByNow / ethAmount
            // Example: 10 days unfed (target = 1 ETH), feed 0.1 ETH → 10x scaling
            loveGained = (baseLove * targetEthByNow) / ethAmount;
        } else {
            // Natural inverse scaling: loveGained = baseLove * (targetEthByNow / totalEthFed)
            // Example: targetEthByNow = 1 ETH, totalEthFed = 0.1 ETH → 10x scaling (behind)
            // Example: targetEthByNow = 1 ETH, totalEthFed = 1 ETH → 1x scaling (on schedule)
            // Example: targetEthByNow = 1 ETH, totalEthFed = 10 ETH → 0.1x scaling (ahead)
            loveGained = (baseLove * targetEthByNow) / totalEthFed;
        }

        // Ensure minimum love of 1 if feeding any amount (prevents rounding to zero in edge cases)
        if (loveGained == 0 && baseLove > 0) loveGained = 1;
    }
}
