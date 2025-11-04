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
    /// @notice Maximum number of genes that can be assigned to an Aminal
    uint256 constant MAX_GENES = 10;

    /**
     * @notice Visual trait configuration for an Aminal
     * @dev Contains the complete genetic visual profile of an Aminal
     * @dev Supports 1-10 genes with flexible ordering determined by placement metadata
     * @dev A value of 0 for a geneId indicates an unused slot
     * @param genes Array of up to MAX_GENES gene NFT IDs (0 = unused slot)
     */
    struct Visuals {
        uint256[MAX_GENES] genes;
    }

    /**
     * @notice Placement metadata for visual gene positioning per Aminal
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
