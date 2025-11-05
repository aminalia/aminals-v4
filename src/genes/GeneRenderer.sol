/// @title Gene NFT-based descriptor for Aminals
/// @notice Renders visual representations of Aminals using Gene NFT system
/// @dev Abstract contract that provides SVG generation and metadata construction for Aminals
/// @dev Replaces traditional trait arrays with a composable Gene NFT-based trait system
/// @author Aminals Team
/// @custom:version 2.0

pragma solidity ^0.8.20;

import {Base64} from "src/utils/Base64.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {Strings} from "oz/utils/Strings.sol";

/// @notice Abstract contract implementing Gene NFT-based rendering for Aminals
/// @dev This contract handles the visual composition of Aminals by combining multiple Gene NFTs
///      Each Gene NFT represents a specific visual trait (background, body, face, etc.)
///      The rendering order is important for proper layering of visual elements
abstract contract GeneRenderer is IAminalStructs {
    // ============ CONSTANTS ============

    /// @dev Length of Ethereum address in bytes
    uint8 private constant _ADDRESS_LENGTH = 20;

    /// @dev Hexadecimal characters for address conversion
    bytes16 private constant _SYMBOLS = "0123456789abcdef";

    // ============ STRUCTS ============

    /// @notice Parameters for constructing ERC721 token URI
    /// @param name The name of the NFT
    /// @param description Brief description of the NFT
    /// @param image Base64 encoded image data URI
    /// @param attributes JSON string of NFT attributes
    struct TokenURIParams {
        string name;
        string description;
        string image;
        string attributes;
    }

    // ============ STATE VARIABLES ============

    /// @notice Contract for managing Gene NFTs that contain SVG data and trait information
    Genes public immutable genes;

    /// @notice Registry contract for managing Gene NFT creation and categorization
    GeneRegistry public immutable geneFactory;

    // ============ CONSTRUCTOR ============

    /// @notice Initialize the Gene Renderer with required contracts
    /// @param _Genes Address of the Genes contract containing SVG data
    /// @param _geneFactory Address of the GeneRegistry contract
    constructor(address _Genes, address _geneFactory) {
        genes = Genes(_Genes);
        geneFactory = GeneRegistry(_geneFactory);
    }

    // ============ EXTERNAL FUNCTIONS ============

    /// @notice Generate a complete data URI for an Aminal NFT
    /// @dev Combines name, description, image, and attributes into a base64 encoded JSON
    /// @param tokenId The Aminal token ID to generate URI for
    /// @return Complete data URI string ready for use as tokenURI
    function dataURI(uint256 tokenId) public view returns (string memory) {
        string memory name = string(abi.encodePacked("Aminal #", Strings.toString(tokenId)));

        string memory image =
            string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(_aminalImage(tokenId)))));

        string memory description =
            string(abi.encodePacked("This NFT represents a digital pet. This NFT cannot be transfered."));

        string memory attributes = generateAttributesList(tokenId);

        return
            constructTokenURI(
                TokenURIParams({name: name, description: description, image: image, attributes: attributes})
            );
    }

    /// @notice Generate JSON attributes list for NFT metadata
    /// @dev Creates attribute objects for each non-zero gene ID with gene number and creator info
    /// @param aminalId The Aminal ID to generate attributes for
    /// @return JSON string containing array of attribute objects
    function generateAttributesList(uint256 aminalId) public view returns (string memory) {
        Visuals memory visuals = getAminalVisualsByID(aminalId);
        string memory attributes = "";
        bool firstAttribute = true;

        // Iterate through all gene slots (0-9)
        for (uint256 i = 0; i < 10; i++) {
            uint256 geneId = visuals.genes[i];

            if (geneId != 0) {
                if (!firstAttribute) attributes = string(abi.encodePacked(attributes, ","));
                else firstAttribute = false;

                // Get creator address safely
                address creator = _getGeneCreator(geneId);

                attributes = string(
                    abi.encodePacked(
                        attributes,
                        '{"trait_type":"Gene ',
                        Strings.toString(i + 1),
                        '","value":"Gene #',
                        Strings.toString(geneId),
                        '"}',
                        ',{"trait_type":"Gene ',
                        Strings.toString(i + 1),
                        ' Creator","value":"',
                        _toHexString(uint160(creator), 20),
                        '"}'
                    )
                );
            }
        }

        return attributes;
    }

    // ============ PUBLIC FUNCTIONS ============

    /// @notice Construct an ERC721 token URI from parameters
    /// @dev Creates a base64 encoded JSON data URI compliant with ERC721 metadata standard
    /// @param params Struct containing all required URI components
    /// @return Complete data URI string
    function constructTokenURI(TokenURIParams memory params) public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            params.name,
                            '", "description":"',
                            params.description,
                            '", "image": "',
                            params.image,
                            '", "attributes": [',
                            params.attributes,
                            "]}"
                        )
                    )
                )
            )
        );
    }

    // ============ INTERNAL FUNCTIONS ============

    /// @notice Generate complete SVG image for an Aminal
    /// @dev Combines all gene layers in order (1-10 genes) with placement metadata
    /// @param aminalId The Aminal ID to generate image for
    /// @return output Complete SVG string ready for base64 encoding
    function _aminalImage(uint256 aminalId) internal view returns (string memory output) {
        // Get the visual trait configuration for this Aminal
        Visuals memory visuals = getAminalVisualsByID(aminalId);
        GeneMetadata[9] memory placements = getAminalPlacementsByID(aminalId);

        // Start SVG container with proper viewBox
        output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 1000 1000">';

        // Render all genes in order (0-8)
        // Genes are rendered back-to-front (first gene is background, last is foreground)
        for (uint256 i = 0; i < 9;) {
            if (visuals.genes[i] != 0) {
                output = string(abi.encodePacked(output, _renderGeneWithPlacement(visuals.genes[i], placements[i])));
            }
            unchecked {
                ++i;
            }
        }

        // Close SVG container
        output = string(abi.encodePacked(output, "</svg>"));
    }

    /// @notice Render a gene with placement transformations applied
    /// @dev Wraps the gene SVG in a group with transform attribute
    /// @param geneId The Gene NFT ID to render
    /// @param placement The placement metadata (position, scale, rotation)
    /// @return Rendered SVG with transformations applied
    function _renderGeneWithPlacement(uint256 geneId, GeneMetadata memory placement) internal view returns (string memory) {
        string memory geneSvg = _getGeneNFTSVG(geneId);
        if (bytes(geneSvg).length == 0) return "";

        // Build transform attribute
        string memory transform = _buildTransform(placement);

        // Wrap gene SVG in a group with transform
        return string(abi.encodePacked('<g transform="', transform, '">', geneSvg, '</g>'));
    }

    /// @notice Build SVG transform attribute from placement metadata
    /// @dev Creates a transform string with translate, scale, and rotate
    /// @param placement The placement metadata
    /// @return Transform attribute value
    function _buildTransform(GeneMetadata memory placement) internal pure returns (string memory) {
        // Convert scale from percentage to decimal (100 = 1.0)
        // offsetX and offsetY are already in pixels
        // rotation is in degrees

        string memory transform = "";

        // Translate to position (move to center + offset)
        if (placement.offsetX != 0 || placement.offsetY != 0) {
            transform = string(
                abi.encodePacked(
                    "translate(",
                    _int16ToString(placement.offsetX),
                    ",",
                    _int16ToString(placement.offsetY),
                    ") "
                )
            );
        }

        // Scale from center of canvas (500, 500)
        if (placement.scale != 100) {
            string memory scaleValue = _scaleToString(placement.scale);
            transform = string(
                abi.encodePacked(
                    transform,
                    "translate(500,500) scale(",
                    scaleValue,
                    ") translate(-500,-500) "
                )
            );
        }

        // Rotate around center of canvas (500, 500)
        if (placement.rotation != 0) {
            transform = string(
                abi.encodePacked(
                    transform,
                    "rotate(",
                    Strings.toString(placement.rotation),
                    ",500,500)"
                )
            );
        }

        return transform;
    }

    /// @notice Convert int16 to string (handles negative values)
    /// @param value The int16 value to convert
    /// @return String representation of the value
    function _int16ToString(int16 value) internal pure returns (string memory) {
        if (value < 0) {
            return string(abi.encodePacked("-", Strings.toString(uint16(-value))));
        }
        return Strings.toString(uint16(value));
    }

    /// @notice Convert scale percentage to decimal string
    /// @param scale Scale as percentage (100 = 1.0, 200 = 2.0, 50 = 0.5)
    /// @return Decimal string representation
    function _scaleToString(uint16 scale) internal pure returns (string memory) {
        if (scale == 100) return "1";

        uint256 integerPart = scale / 100;
        uint256 decimalPart = scale % 100;

        if (decimalPart == 0) {
            return Strings.toString(integerPart);
        }

        // Format decimal part with leading zeros if needed
        string memory decimalStr;
        if (decimalPart < 10) {
            decimalStr = string(abi.encodePacked("0", Strings.toString(decimalPart)));
        } else {
            decimalStr = Strings.toString(decimalPart);
        }

        return string(abi.encodePacked(Strings.toString(integerPart), ".", decimalStr));
    }

    /// @notice Safely retrieve SVG content for a Gene NFT
    /// @dev Handles the case where a Gene NFT might not exist or be burned
    /// @param geneId The Gene NFT ID to get SVG for
    /// @return SVG string content, empty string if gene doesn't exist
    function _getGeneNFTSVG(uint256 geneId) internal view returns (string memory) {
        if (geneId == 0) return ""; // No gene set for this slot

        // Safely attempt to get gene info
        try genes.getGeneInfo(geneId) returns (string memory svg) {
            return svg;
        } catch {
            // Gene NFT doesn't exist or was burned, return empty string
            return "";
        }
    }

    /// @notice Safely get the creator/owner of a Gene NFT
    /// @dev Handles the case where a Gene NFT might not exist or be burned
    /// @param geneId The Gene NFT ID to get creator for
    /// @return creator Address of the gene creator, zero address if gene doesn't exist
    function _getGeneCreator(uint256 geneId) internal view returns (address creator) {
        try genes.ownerOf(geneId) returns (address owner) {
            return owner;
        } catch {
            // Gene NFT doesn't exist or was burned
            return address(0);
        }
    }

    /// @notice Convert a uint160 to its ASCII hexadecimal representation
    /// @dev Used for formatting Ethereum addresses in metadata
    /// @param value The numeric value to convert
    /// @param length The desired length of the hex string
    /// @return Hexadecimal string representation with "0x" prefix
    function _toHexString(uint160 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    // ============ ABSTRACT FUNCTIONS ============

    /// @notice Get visual trait configuration for an Aminal
    /// @dev Must be implemented by inheriting contracts to provide Aminal-specific logic
    /// @param aminalID The Aminal token ID
    /// @return visuals Struct containing all gene IDs for visual traits
    function getAminalVisualsByID(uint256 aminalID) public view virtual returns (Visuals memory visuals);

    /// @notice Get placement metadata for an Aminal's genes
    /// @dev Must be implemented by inheriting contracts to provide Aminal-specific logic
    /// @param aminalID The Aminal token ID
    /// @return placements Array of placement metadata for each gene slot
    function getAminalPlacementsByID(uint256 aminalID) public view virtual returns (GeneMetadata[9] memory placements);
}
