// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC165} from "lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";

/**
 * @title ISkill
 * @notice Interface for Aminal skills that can be executed with love costs
 * @dev Implements EIP-165 for standard interface detection
 * @dev To implement this interface with proper ERC165 support, extend the abstract Skill contract
 */
interface ISkill is IERC165 {
    /**
     * @notice Get the cost for executing a skill with the given calldata
     * @dev This function should be view/pure and return the cost without side effects
     * @dev The cost is deducted from the user's individual love balance for that Aminal
     * @dev Love is tracked per user per Aminal and gained through feeding
     * @param data The encoded function call that will be executed
     * @return cost The percentage of user's love required (e.g., 10 = 10% of user's love)
     */
    function skillCost(bytes calldata data) external view returns (uint256 cost);
}
