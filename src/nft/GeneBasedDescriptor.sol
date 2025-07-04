/// @title Gene NFT-based descriptor for Aminals
/// @dev Replaces trait arrays with Gene NFT-based trait system

pragma solidity ^0.8.20;

import {Base64} from "src/utils/Base64.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {GenesNFT} from "src/nft/GenesNFT.sol";
import {GeneNFTFactory} from "src/nft/GeneNFTFactory.sol";

abstract contract GeneBasedDescriptor is IAminalStructs {
    uint8 private constant _ADDRESS_LENGTH = 20;
    bytes16 private constant _SYMBOLS = "0123456789abcdef";

    /// @notice Token URI construction parameters
    struct TokenURIParams {
        string name;
        string description;
        string image;
        string attributes;
    }

    /// @notice Gene NFT contracts
    GenesNFT public genesNFT;
    GeneNFTFactory public geneFactory;

    /// @notice Mapping from Aminal to Gene NFT IDs for each trait category
    /// aminalId => category => geneId
    mapping(uint256 => mapping(VisualsCat => uint256)) public aminalGenes;

    /// @notice Default Gene NFT IDs for each category (fallback traits)
    mapping(VisualsCat => uint256) public defaultGenes;

    event TraitAdded(
        uint256 indexed aminalId,
        VisualsCat indexed category,
        uint256 indexed geneId
    );
    event DefaultGeneSet(VisualsCat indexed category, uint256 indexed geneId);

    error InvalidGene();
    error OnlyFactory();

    modifier onlyFactory() virtual {
        require(msg.sender == address(geneFactory), "Only factory can call");
        _;
    }

    constructor(address _genesNFT, address _geneFactory) {
        genesNFT = GenesNFT(_genesNFT);
        geneFactory = GeneNFTFactory(_geneFactory);
    }

    /**
     * @notice Construct an ERC721 token URI
     * @dev Merged from NFTDescriptor contract
     */
    function constructTokenURI(
        TokenURIParams memory params
    ) public pure returns (string memory) {
        return
            string(
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

    /**
     * @notice Set genes for an Aminal
     * @dev Called when spawning new Aminals with specific traits
     */
    function setAminalGenes(
        uint256 aminalId,
        uint256[8] calldata geneIds
    ) external onlyFactory {
        for (uint256 i = 0; i < 8; i++) {
            VisualsCat category = VisualsCat(i);
            if (geneIds[i] != 0) {
                // Verify gene exists and is in correct category
                if (!geneFactory.isValidGene(geneIds[i])) revert InvalidGene();
                (, VisualsCat geneCategory, ) = geneFactory.getGeneInfo(
                    geneIds[i]
                );
                if (geneCategory != category) revert InvalidGene();

                aminalGenes[aminalId][category] = geneIds[i];
                emit TraitAdded(aminalId, category, geneIds[i]);
            }
        }
    }

    /**
     * @notice Set default Gene NFT for a category
     * @dev Used as fallback when Aminals don't have specific genes set
     */
    function setDefaultGene(
        VisualsCat category,
        uint256 geneId
    ) external onlyFactory {
        if (!geneFactory.isValidGene(geneId)) revert InvalidGene();
        (, VisualsCat geneCategory, ) = geneFactory.getGeneInfo(geneId);
        if (geneCategory != category) revert InvalidGene();

        defaultGenes[category] = geneId;
        emit DefaultGeneSet(category, geneId);
    }

    /**
     * @notice Get Gene NFT ID for an Aminal's trait category
     */
    function getAminalGene(
        uint256 aminalId,
        VisualsCat category
    ) public view returns (uint256) {
        uint256 geneId = aminalGenes[aminalId][category];
        if (geneId == 0) {
            return defaultGenes[category];
        }
        return geneId;
    }

    /**
     * @notice Get SVG for a specific trait category
     */
    function getTraitSVG(
        uint256 aminalId,
        VisualsCat category
    ) public view returns (string memory) {
        uint256 geneId = getAminalGene(aminalId, category);
        if (geneId == 0) {
            return ""; // No trait set
        }

        (string memory svg, ) = genesNFT.getGeneInfo(geneId);
        return svg;
    }

    /**
     * @notice Given a token ID and seed, construct a base64 encoded data URI for an NFT.
     */
    function dataURI(uint256 tokenId) public view returns (string memory) {
        string memory name = string(
            abi.encodePacked("Aminal #", _toString(tokenId))
        );

        string memory image = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(bytes(_aminalImage(tokenId)))
            )
        );
        string memory description = string(
            abi.encodePacked(
                "This NFT represents a digital pet. This NFT cannot be transfered."
            )
        );
        string memory attributes = generateAttributesList(tokenId);

        return
            constructTokenURI(
                TokenURIParams({
                    name: name,
                    description: description,
                    image: image,
                    attributes: attributes
                })
            );
    }

    /**
     * @notice Given a token ID, construct a base64 encoded SVG.
     */
    function _aminalImage(
        uint256 _tokenId
    ) internal view returns (string memory output) {
        // Aminal Base - for all Aminals
        output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 1000 1000">';

        // Add background
        output = string(
            abi.encodePacked(output, getTraitSVG(_tokenId, VisualsCat.BACK))
        );

        // Add shadow
        output = string(
            abi.encodePacked(
                output,
                '<g id="shadow"><ellipse fill="#3c3d55" opacity="0.5"  cx="505" cy="971" rx="163" ry="12"/></g>'
            )
        );

        // Add traits in rendering order
        output = string(
            abi.encodePacked(output, getTraitSVG(_tokenId, VisualsCat.TAIL))
        );
        output = string(
            abi.encodePacked(output, getTraitSVG(_tokenId, VisualsCat.ARM))
        );
        output = string(
            abi.encodePacked(output, getTraitSVG(_tokenId, VisualsCat.EARS))
        );
        output = string(
            abi.encodePacked(output, getTraitSVG(_tokenId, VisualsCat.BODY))
        );
        output = string(
            abi.encodePacked(output, getTraitSVG(_tokenId, VisualsCat.FACE))
        );
        output = string(
            abi.encodePacked(output, getTraitSVG(_tokenId, VisualsCat.MOUTH))
        );
        output = string(
            abi.encodePacked(output, getTraitSVG(_tokenId, VisualsCat.MISC))
        );

        // end of svg
        output = string(abi.encodePacked(output, "</svg>"));
    }

    function getAminalVisualsByID(
        uint256 aminalID
    ) public view virtual returns (Visuals memory);

    /**
     * @notice Generate attributes list for NFT metadata
     */
    function generateAttributesList(
        uint256 tokenId
    ) public view returns (string memory) {
        string memory attributes = "[";

        for (uint256 i = 0; i < 8; i++) {
            VisualsCat category = VisualsCat(i);
            uint256 geneId = getAminalGene(tokenId, category);

            if (geneId != 0) {
                address creator = genesNFT.ownerOf(geneId);

                string memory categoryName = _getCategoryName(category);

                if (i > 0) {
                    attributes = string(abi.encodePacked(attributes, ","));
                }

                attributes = string(
                    abi.encodePacked(
                        attributes,
                        '{"trait_type":"',
                        categoryName,
                        '","value":"Gene #',
                        _toString(geneId),
                        '"}',
                        ',{"trait_type":"',
                        categoryName,
                        ' Creator","value":"',
                        _toHexString(uint160(creator), 20),
                        '"}'
                    )
                );
            }
        }

        attributes = string(abi.encodePacked(attributes, "]"));
        return attributes;
    }

    function _getCategoryName(
        VisualsCat category
    ) internal pure returns (string memory) {
        if (category == VisualsCat.BACK) return "Background";
        if (category == VisualsCat.ARM) return "Arms";
        if (category == VisualsCat.TAIL) return "Tail";
        if (category == VisualsCat.EARS) return "Ears";
        if (category == VisualsCat.BODY) return "Body";
        if (category == VisualsCat.FACE) return "Face";
        if (category == VisualsCat.MOUTH) return "Mouth";
        if (category == VisualsCat.MISC) return "Miscellaneous";
        return "Unknown";
    }

    /**
     * @notice Converts a uint256 to its ASCII string decimal representation.
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /**
     * @notice Converts a `uint160` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function _toHexString(
        uint160 value,
        uint256 length
    ) internal pure returns (string memory) {
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
}
