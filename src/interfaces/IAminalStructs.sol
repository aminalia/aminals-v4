// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

/**
 * @title IAminalStructs - Core Data Structures for Aminal System
 * @notice Defines fundamental data types used throughout the Aminal ecosystem
 * @dev Shared interface containing structs and enums for visual traits and genetics
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
interface IAminalStructs {
    /**
     * @notice Complete gene instance data for an Aminal
     * @dev Combines gene ID with its placement metadata for cleaner state management
     * @dev Each Aminal has up to 9 gene instances that define its visual appearance
     * @dev A value of 0 for geneId indicates an unused slot
     * @param geneId Gene NFT ID (0 = unused slot)
     * @param offsetX Horizontal offset from canvas center in pixels (-500 to 500)
     * @param offsetY Vertical offset from canvas center in pixels (-500 to 500)
     * @param scale Scale factor as percentage (100 = 100%, range 0-500)
     * @param rotation Rotation angle in degrees (0-359)
     */
    struct GeneInstance {
        uint256 geneId;
        int16 offsetX;
        int16 offsetY;
        uint16 scale;
        uint16 rotation;
    }

    /**
     * @notice Placement metadata for gene positioning (used in events for backward compatibility)
     * @dev Controls how a gene trait is positioned, scaled, and rotated during rendering
     * @param offsetX Horizontal offset from canvas center in pixels (-500 to 500)
     * @param offsetY Vertical offset from canvas center in pixels (-500 to 500)
     * @param scale Scale factor as percentage (100 = 100%, range 0-500)
     * @param rotation Rotation angle in degrees (0-359)
     */
    struct GeneMetadata {
        int16 offsetX;
        int16 offsetY;
        uint16 scale;
        uint16 rotation;
    }
}
