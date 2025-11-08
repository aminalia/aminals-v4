// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LogisticVRGDA} from "lib/VRGDAs/src/LogisticVRGDA.sol";
import {toWadUnsafe, wadDiv} from "lib/VRGDAs/lib/solmate/src/utils/SignedWadMath.sol";
import {FixedPointMathLib} from "lib/VRGDAs/lib/solmate/src/utils/FixedPointMathLib.sol";

/**
 * @title AminalVRGDA
 * @notice Logistic VRGDA implementation that modulates love based on feeding schedule
 * @dev Target rate: 0.1 ETH worth of feeding per day
 * @dev Feeds more love when behind schedule (not fed enough), less when ahead of schedule (overfed)
 *
 * @dev VRGDA Mechanics:
 * - Target: 0.1 ETH fed per day (linear schedule)
 * - If fed more than target → price increases → less love per ETH
 * - If fed less than target → price decreases → more love per ETH
 * - Encourages consistent daily feeding rather than binge feeding
 *
 * @dev Example:
 * - Day 1: Feed exactly 0.1 ETH → get base love rate
 * - Day 2: Feed 0.2 ETH total (0.1 ETH extra) → price UP → less love per ETH
 * - Day 3: Don't feed at all → price DOWN → when you do feed, get more love per ETH
 */
contract AminalVRGDA is LogisticVRGDA {
    /// @notice Fixed rate of energy gained per ETH (for love unit calculation)
    uint256 public constant ENERGY_PER_ETH = 10_000; // 1 ETH = 10,000 energy units

    /// @notice Target feeding rate: 0.1 ETH per day
    uint256 public constant TARGET_FEED_RATE = 0.1 ether; // per day

    /// @notice Maximum love multiplier (when very behind schedule)
    uint256 public constant MAX_LOVE_MULTIPLIER = 10 ether;

    /// @notice Minimum love multiplier (when very ahead of schedule)
    uint256 public constant MIN_LOVE_MULTIPLIER = 0.1 ether;

    /// @notice Constructor to set up the VRGDA parameters for love calculation
    /// @dev Repurposes Logistic VRGDA where energy acts as both time and units sold
    /// @param _targetPrice The base ETH amount for pricing (in wei) - typically 1 ETH
    /// @param _priceDecayPercent Price decay when below target (scaled by 1e18) - affects curve steepness
    /// @param _logisticAsymptote Maximum units for S-curve (scaled by 1e18) - controls curve shape
    /// @param _timeScale Controls S-curve transition speed (scaled by 1e18) - affects smoothness
    constructor(int256 _targetPrice, int256 _priceDecayPercent, int256 _logisticAsymptote, int256 _timeScale)
        LogisticVRGDA(_targetPrice, _priceDecayPercent, _logisticAsymptote, _timeScale)
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

        // Calculate target ETH that should have been fed by now
        // Target: 0.1 ETH per day = (timeSinceStart / 1 day) * 0.1 ETH
        uint256 targetEthByNow = (timeSinceStart * TARGET_FEED_RATE) / 1 days;

        // Convert ETH amounts to "units" for VRGDA (using ENERGY_PER_ETH as scaling factor)
        // This gives us integer units to work with
        uint256 targetUnitsByNow = (targetEthByNow * ENERGY_PER_ETH) / 1 ether;
        uint256 unitsFedSoFar = (totalEthFed * ENERGY_PER_ETH) / 1 ether;
        uint256 unitsToFeed = (ethAmount * ENERGY_PER_ETH) / 1 ether;

        // For linear VRGDA, the target time for selling unit n is: f⁻¹(n) = n / rate
        // We invert this: given current time t, we should have sold f(t) = rate * t units
        // We've sold unitsFedSoFar, so we're (unitsFedSoFar - targetUnitsByNow) ahead/behind

        // Get VRGDA price for the NEXT unit to be fed
        // Use toWadUnsafe to convert time to WAD format safely
        // unitsFedSoFar is the current count sold
        uint256 vrgdaPrice = getVRGDAPrice(toWadUnsafe(timeSinceStart), unitsFedSoFar);

        // Map VRGDA price to love multiplier
        // Higher price (behind schedule) = more love per unit
        // Lower price (ahead of schedule) = less love per unit
        uint256 loveMultiplier;

        if (vrgdaPrice == 0) {
            loveMultiplier = MIN_LOVE_MULTIPLIER; // Far ahead of schedule
        } else if (vrgdaPrice >= uint256(targetPrice) * 10) {
            // Far behind schedule
            loveMultiplier = MAX_LOVE_MULTIPLIER;
        } else {
            // Map price range to multiplier range
            // vrgdaPrice varies around targetPrice
            // When price = targetPrice, we're on schedule → use middle multiplier
            // When price > targetPrice, we're behind → increase multiplier
            // When price < targetPrice, we're ahead → decrease multiplier

            uint256 priceRatio = (vrgdaPrice * 1 ether) / uint256(targetPrice);

            if (priceRatio >= 5 ether) {
                // 5x or more above target = max multiplier
                loveMultiplier = MAX_LOVE_MULTIPLIER;
            } else if (priceRatio <= 0.2 ether) {
                // 0.2x or less of target = min multiplier
                loveMultiplier = MIN_LOVE_MULTIPLIER;
            } else {
                // Linear interpolation between min and max based on price ratio
                // priceRatio of 1.0 (on schedule) should give middle value
                // Map [0.2, 5.0] to [MIN, MAX]
                uint256 normalizedRatio = ((priceRatio - 0.2 ether) * 1 ether) / 4.8 ether; // 0-1 range
                uint256 range = MAX_LOVE_MULTIPLIER - MIN_LOVE_MULTIPLIER;
                loveMultiplier = MIN_LOVE_MULTIPLIER + ((range * normalizedRatio) / 1 ether);
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
