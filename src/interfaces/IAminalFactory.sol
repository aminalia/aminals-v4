// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/**
 * @title IAminalFactory - Factory Interface for Aminal Creation and Management
 * @notice Core interface for the Aminal ecosystem's factory contract
 * @dev Defines functions for spawning, breeding, and querying Aminals
 *
 * This interface provides the essential operations for:
 * - Creating new Aminal contracts from breeding auctions
 * - Validating Aminal contract addresses
 * - Retrieving Aminal information and metadata
 * - Managing the global Aminal registry
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
interface IAminalFactory is IAminalStructs {
    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🏭 FACTORY OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Spawn a new Aminal from auction results
     * @dev Creates a new Aminal contract with specified parents and genetic traits
     *
     * Requirements:
     * - Can only be called by the authorized auction contract
     * - Parent addresses must be valid (can be address(0) for genesis Aminals)
     * - Gene IDs must correspond to valid traits in the gene system
     *
     * @param momAddress Address of the mother Aminal (address(0) for genesis)
     * @param dadAddress Address of the father Aminal (address(0) for genesis)
     * @param auctionId Gene auction ID that created this child
     * @param winningGeneIds Array of 1-10 gene IDs (0 means no gene in that slot)
     *
     * @return newAminalAddress Address of the newly spawned Aminal contract
     *
     * @custom:emits AminalSpawned
     */
    function spawnAminal(address momAddress, address dadAddress, uint256 auctionId, uint256[10] calldata winningGeneIds)
        external
        returns (address newAminalAddress);

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🔍 QUERY OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Check if an address is a valid Aminal contract
     * @dev Verifies if the given address was created by this factory
     *
     * @param aminalAddress Address to validate
     * @return isValid True if address is a registered Aminal contract, false otherwise
     */
    function isAminal(address aminalAddress) external view returns (bool isValid);

    /**
     * @notice Get Aminal contract address by its creation index
     * @dev Retrieves Aminal address from the factory's sequential registry
     *
     * Requirements:
     * - Index must be less than totalAminals()
     *
     * @param index Zero-based index of the Aminal in creation order
     * @return aminalAddress Address of the Aminal at the specified index
     *
     * @custom:throws Index out of bounds if index >= totalAminals()
     */
    function getAminalByIndex(uint256 index) external view returns (address aminalAddress);

    /**
     * @notice Get visual trait configuration of an Aminal
     * @dev Retrieves the complete genetic visual profile for display/rendering
     *
     * Requirements:
     * - aminalAddress must be a valid Aminal contract (verified via isAminal)
     *
     * @param aminalAddress Address of the Aminal to query
     * @return visuals Complete Visuals struct containing 1-10 gene IDs
     *
     * @custom:throws Invalid address if not a registered Aminal contract
     */
    function getAminalVisualsByAddress(address aminalAddress) external view returns (Visuals memory visuals);

    /**
     * @notice Get total number of Aminals ever created
     * @dev Returns the count of all Aminals spawned by this factory
     *
     * @return totalCount Total number of Aminals in existence
     */
    function totalAminals() external view returns (uint256 totalCount);
}
