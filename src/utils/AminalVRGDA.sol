// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LinearVRGDA} from "lib/VRGDAs/src/LinearVRGDA.sol";
import {toWadUnsafe, wadDiv} from "lib/VRGDAs/lib/solmate/src/utils/SignedWadMath.sol";
import {FixedPointMathLib} from "lib/VRGDAs/lib/solmate/src/utils/FixedPointMathLib.sol";

/**
 * @title AminalVRGDA
 * @notice Schedule-based love calculation that rewards consistent feeding
 * @dev Target rate: 0.1 ETH worth of feeding per day on average
 * @dev Gives more love when behind schedule (underfed), less when ahead of schedule (overfed)
 *
 * @dev Mechanics:
 * - Target: 0.1 ETH fed per day (cumulative average)
 * - Compares total ETH fed vs. expected ETH based on time elapsed
 * - Behind schedule (fed < target) → higher love multiplier (up to 10x)
 * - On schedule (fed ≈ target) → base love multiplier (1.75x)
 * - Ahead of schedule (fed > target) → lower love multiplier (down to 0.1x)
 * - Encourages consistent daily feeding rather than binge feeding
 *
 * @dev Example:
 * - Day 1: Feed exactly 0.1 ETH (on schedule) → get 1.75x multiplier → 1750 love
 * - Day 2: Have fed 0.2 ETH total (on schedule) → still get 1.75x multiplier
 * - Day 2 alternate: Have fed 0.5 ETH total (2.5x ahead) → get ~0.72x multiplier → less love
 * - Day 10: Haven't fed at all (10x behind) → get 10x multiplier → catch up with bonus love
 */
contract AminalVRGDA is LinearVRGDA {
    /// @notice Fixed rate of energy gained per ETH (for love unit calculation)
    uint256 public constant ENERGY_PER_ETH = 10_000; // 1 ETH = 10,000 energy units

    /// @notice Target feeding rate: 0.1 ETH per day
    uint256 public constant TARGET_FEED_RATE = 0.1 ether; // per day

    /// @notice Maximum love multiplier (when very behind schedule)
    uint256 public constant MAX_LOVE_MULTIPLIER = 10 ether;

    /// @notice Minimum love multiplier (when very ahead of schedule)
    uint256 public constant MIN_LOVE_MULTIPLIER = 0.1 ether;

    /// @notice Constructor to set up the VRGDA parameters for love calculation
    /// @dev Uses Linear VRGDA for unlimited feeding over time
    /// @param _targetPrice The base ETH amount for pricing (in wei) - typically 1 ETH
    /// @param _priceDecayPercent Price decay when below target (scaled by 1e18) - affects curve steepness
    /// @param _perTimeUnit Target units to be sold per unit of time (scaled by 1e18)
    constructor(int256 _targetPrice, int256 _priceDecayPercent, int256 _perTimeUnit)
        LinearVRGDA(_targetPrice, _priceDecayPercent, _perTimeUnit)
    {}

    /**
     * @notice Calculate how much love is gained for a given ETH amount using VRGDA
     * @dev Love increases when behind feeding schedule, decreases when ahead
     * @dev Returns love in the same units as energy (10,000 per ETH)
     * @param timeSinceStart Time elapsed since Aminal creation (in seconds)
     * @param totalEthFed Total ETH fed to this Aminal so far (in wei)
     * @param ethAmount Amount of ETH being fed now (in wei)
     * @return loveGained Amount of love that will be gained (in energy units)
     */
    function getLoveForETH(uint256 timeSinceStart, uint256 totalEthFed, uint256 ethAmount)
        public
        view
        returns (uint256 loveGained)
    {
        if (ethAmount == 0) return 0;

        // Calculate target ETH that should have been fed by now based on 0.1 ETH/day average
        uint256 targetEthByNow = (timeSinceStart * TARGET_FEED_RATE) / 1 days;

        // Convert to units for easier calculation
        uint256 unitsToFeed = (ethAmount * ENERGY_PER_ETH) / 1 ether;

        // Calculate love multiplier based on how far ahead/behind schedule we are
        // Compare CUMULATIVE feeding to CUMULATIVE target (not individual unit timing)
        uint256 loveMultiplier;

        if (timeSinceStart == 0) {
            // At t=0, we're on schedule by definition
            loveMultiplier = 1.75 ether; // Base multiplier for on-schedule feeding
        } else {
            // Calculate how far ahead or behind we are on the AVERAGE schedule
            // If totalEthFed > targetEthByNow: we're ahead (overfed) -> lower multiplier
            // If totalEthFed < targetEthByNow: we're behind (underfed) -> higher multiplier
            // If totalEthFed ≈ targetEthByNow: on schedule -> base multiplier

            if (totalEthFed >= targetEthByNow) {
                // Ahead of schedule or on schedule
                if (targetEthByNow == 0) {
                    // Very early and already feeding -> slightly reduce
                    loveMultiplier = MIN_LOVE_MULTIPLIER;
                } else {
                    // Calculate ratio: how much have we fed vs target?
                    // ratio > 1 means ahead, ratio = 1 means on schedule, ratio < 1 means behind
                    uint256 ratio = (totalEthFed * 1 ether) / targetEthByNow;

                    if (ratio >= 5 ether) {
                        // 5x or more ahead of schedule -> minimum multiplier
                        loveMultiplier = MIN_LOVE_MULTIPLIER;
                    } else if (ratio > 1 ether) {
                        // Between 1x and 5x ahead -> scale from 1.75 down to 0.1
                        // Map [1.0, 5.0] to [1.75, 0.1]
                        uint256 normalized = ((ratio - 1 ether) * 1 ether) / 4 ether;
                        loveMultiplier = 1.75 ether - ((1.65 ether * normalized) / 1 ether);
                    } else {
                        // ratio ≈ 1.0: on schedule
                        loveMultiplier = 1.75 ether;
                    }
                }
            } else {
                // Behind schedule (totalEthFed < targetEthByNow)
                // Calculate how far behind: ratio < 1 means behind
                uint256 ratio = (totalEthFed * 1 ether) / targetEthByNow;

                if (ratio <= 0.2 ether) {
                    // 5x or more behind (fed less than 20% of target) -> maximum multiplier
                    loveMultiplier = MAX_LOVE_MULTIPLIER;
                } else {
                    // Between 0.2x and 1.0x -> scale from 10 down to 1.75
                    // Map [0.2, 1.0] to [10, 1.75]
                    uint256 normalized = ((ratio - 0.2 ether) * 1 ether) / 0.8 ether;
                    loveMultiplier = MAX_LOVE_MULTIPLIER - ((8.25 ether * normalized) / 1 ether);
                }
            }
        }

        // Calculate love gained: base units * multiplier
        loveGained = (unitsToFeed * loveMultiplier) / 1 ether;
    }

    /**
     * @notice Calculate how much energy is gained for a given ETH amount
     * @return energyGained Amount of energy that will be gained (in energy units)
     */
    function getEnergyForETH(uint256 ethAmount) public view returns (uint256 energyGained) {
        if (ethAmount == 0) return 0;

        return ethAmount * ENERGY_PER_ETH / 1 ether;
    }

    /**
     * @notice Get the current love multiplier based on feeding schedule
     * @dev Returns how much love is gained per 1 ETH given current state
     * @param timeSinceStart Time since Aminal creation (in seconds)
     * @param totalEthFed Total ETH fed so far (in wei)
     * @return The love amount gained per 1 ETH (in energy units, where 10,000 = 1 ETH)
     */
    function getLoveMultiplier(uint256 timeSinceStart, uint256 totalEthFed) public view returns (uint256) {
        return getLoveForETH(timeSinceStart, totalEthFed, 1 ether);
    }
}
