// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Skill} from "./Skill.sol";

/**
 * @title SqueakSkill
 * @notice Core skill that allows Aminals to squeak, consuming love based on percentage
 * @dev This replaces the native squeak() function with a skill-based approach
 */
contract SqueakSkill is Skill {
    event Squeaked(address indexed aminal, uint256 percentage);

    /**
     * @notice Make the Aminal squeak
     * @param percentage The percentage of love to consume (e.g., 10 = 10%)
     */
    function squeak(uint256 percentage) external {
        emit Squeaked(msg.sender, percentage);
    }

    /**
     * @notice Calculate the cost for squeaking
     * @dev Simply returns the percentage parameter as the cost (capped at 100%)
     * @param data The encoded function call
     * @return The percentage of love required (equal to the percentage parameter, max 100)
     */
    function skillCost(bytes calldata data) external pure override returns (uint256) {
        bytes4 selector = bytes4(data);

        if (selector == this.squeak.selector) {
            uint256 percentage = abi.decode(data[4:], (uint256));
            return percentage > 100 ? 100 : percentage;
        }

        // Default cost percentage if not squeak function (10%)
        return 10;
    }
}
