// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LinearVRGDA} from "lib/VRGDAs/src/LinearVRGDA.sol";
import {toWadUnsafe, wadDiv} from "lib/VRGDAs/lib/solmate/src/utils/SignedWadMath.sol";
import {FixedPointMathLib} from "lib/VRGDAs/lib/solmate/src/utils/FixedPointMathLib.sol";

/**
 * @title AminalVRGDA
 * @notice Schedule-based love calculation with natural scaling incentives
 * @dev Target rate: 0.1 ETH worth of feeding per day on average
 * @dev Uses inverse relationship: multiplier = targetEthByNow / totalEthFed
 *
 * @dev Mechanics:
 * - Target: 0.1 ETH fed per day (cumulative average)
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
contract AminalVRGDA is LinearVRGDA {
    /// @notice Fixed rate of love units per ETH (for love calculation)
    uint256 public constant LOVE_PER_ETH = 10_000; // 1 ETH = 10,000 love units

    /// @notice Target feeding rate: 0.1 ETH per day
    uint256 public constant TARGET_FEED_RATE = 0.1 ether; // per day

    /// @notice Constructor to set up the VRGDA parameters for love calculation
    /// @dev Uses Linear VRGDA for unlimited feeding over time
    /// @param _targetPrice The base ETH amount for pricing (in wei) - typically 1 ETH
    /// @param _priceDecayPercent Price decay when below target (scaled by 1e18) - affects curve steepness
    /// @param _perTimeUnit Target units to be sold per unit of time (scaled by 1e18)
    constructor(int256 _targetPrice, int256 _priceDecayPercent, int256 _perTimeUnit)
        LinearVRGDA(_targetPrice, _priceDecayPercent, _perTimeUnit)
    {}

    /**
     * @notice Calculate how much love is gained for a given ETH amount
     * @dev Love scales based on feeding schedule: more when behind, less when ahead
     * @dev Returns love in standard units (10,000 per ETH base rate)
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

        // Calculate target ETH that should have been fed by now based on 0.1 ETH/day average
        uint256 targetEthByNow = (timeSinceStart * TARGET_FEED_RATE) / 1 days;

        // Base love: 1 ETH = 10,000 units
        uint256 baseLove = (ethAmount * LOVE_PER_ETH) / 1 ether;

        // Apply schedule-based scaling
        if (timeSinceStart == 0 || targetEthByNow == 0) {
            // At t=0 or very early, no scaling (1x)
            loveGained = baseLove;
        } else if (totalEthFed == 0) {
            // Never been fed but time has passed -> scale based on first feeding
            // Treat this first feeding as if totalEthFed will be ethAmount after this tx
            // So multiplier = targetEthByNow / ethAmount
            // Example: 10 days unfed (target = 1 ETH), feed 0.1 ETH -> 10x scaling
            loveGained = (baseLove * targetEthByNow) / ethAmount;
        } else {
            // Natural inverse scaling: loveGained = baseLove * (targetEthByNow / totalEthFed)
            // Example: targetEthByNow = 1 ETH, totalEthFed = 0.1 ETH -> 10x scaling
            // Example: targetEthByNow = 1 ETH, totalEthFed = 1 ETH -> 1x scaling
            // Example: targetEthByNow = 1 ETH, totalEthFed = 10 ETH -> 0.1x scaling
            loveGained = (baseLove * targetEthByNow) / totalEthFed;
        }

        // Ensure minimum love of 1 if feeding any amount (prevents rounding to zero in edge cases)
        if (loveGained == 0 && baseLove > 0) {
            loveGained = 1;
        }
    }

    /**
     * @notice Calculate base love units for a given ETH amount (without schedule scaling)
     * @return loveAmount Amount of love units for the ETH amount (base rate only)
     */
    function getBaseLoveForETH(uint256 ethAmount) public pure returns (uint256 loveAmount) {
        if (ethAmount == 0) return 0;

        return ethAmount * LOVE_PER_ETH / 1 ether;
    }

    /**
     * @notice Get the current love multiplier based on feeding schedule
     * @dev Returns how much love is gained per 1 ETH given current state
     * @param timeSinceStart Time since Aminal creation (in seconds)
     * @param totalEthFed Total ETH fed so far (in wei)
     * @return The love amount gained per 1 ETH (in love units, where 10,000 = 1x multiplier)
     */
    function getLoveMultiplier(uint256 timeSinceStart, uint256 totalEthFed) public pure returns (uint256) {
        return getLoveForETH(timeSinceStart, totalEthFed, 1 ether);
    }
}
