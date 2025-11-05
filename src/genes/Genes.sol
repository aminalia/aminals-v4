// SPDX-License-Identifier: GPL-3.0-only

/// @title Aminal Gene NFTs
/// @notice ERC721 contract for managing individual gene traits used in Aminal composition
/// @dev Each Gene NFT contains SVG data and category information for visual trait rendering
/// @dev Genes are minted through the GeneRegistry and can be burned by their owners
/// @author Aminals Team
/// @custom:version 2.0

pragma solidity ^0.8.20;

import {ERC721} from "oz/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "oz/token/ERC721/extensions/ERC721Enumerable.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";
import {Strings} from "oz/utils/Strings.sol";

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Base64} from "src/utils/Base64.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";

/// @notice Gene NFT contract implementing ERC721 with enumerable extension
/// @dev Genes represent individual visual traits that can be composed into Aminals
/// @dev Each gene contains SVG data and belongs to a specific visual category
/// @dev Only the GeneRegistry can mint new genes, but owners can burn their genes
contract Genes is ERC721Enumerable, Initializable, Ownable {
    // ============ STATE VARIABLES ============

    /// @notice Address of the Aminal Factory contract
    /// @dev Used for access control on certain functions
    address public aminalFactory;

    /// @notice Address of the Gene Registry contract
    /// @dev Only the registry can mint new Gene NFTs
    address public geneRegistry;

    /// @notice Current token ID counter for minting
    /// @dev Incremented with each new gene minted
    /// @dev Starts at 1 to avoid collision with 0 (which indicates "empty slot" in Visuals)
    uint256 public currentId = 1;

    /// @notice Mapping from gene ID to its SVG content **storage pointer**
    /// @dev Contains **SSTORE2 pointer** to the actual visual representation of the gene
    mapping(uint256 id => address) public geneSVGPointers;

    // ============ MODIFIERS ============

    /// @notice Restricts function access to the Aminal Factory only
    modifier onlyAminalsFactory() {
        if (msg.sender != aminalFactory) revert OnlyAminalsFactory();
        _;
    }

    /// @notice Restricts function access to the Gene Registry only
    modifier onlyRegistry() {
        if (msg.sender != geneRegistry) revert OnlyRegistry();
        _;
    }

    // ============ ERRORS ============

    /// @notice Thrown when a function can only be called by the Aminal Factory
    error OnlyAminalsFactory();

    /// @notice Thrown when a function can only be called by the Aminal Factory or Gene Registry
    error OnlyAminalsFactoryOrRegistry();

    /// @notice Thrown when a function can only be called by the NFT owner
    error OnlyNFTOwner();

    /// @notice Thrown when a function can only be called by the Gene Registry
    error OnlyRegistry();

    /// @notice Thrown when attempting to setup an already initialized contract
    error AlreadySetup();

    // ============ EVENTS ============

    /// @notice Emitted when the contract is initialized with Aminal Factory / Registry
    /// @param aminalFactory Address of the Aminal Factory contract
    /// @param geneRegistry Address of the new Gene Registry contract
    event Setup(address aminalFactory, address geneRegistry);

    /// @notice Emitted when a new gene is minted with metadata
    /// @param tokenId The ID of the newly minted gene
    /// @param to Address receiving the gene NFT
    /// @param name Human-readable name for the gene
    /// @param description Description of the gene
    /// @param category Category/tag for filtering
    event GeneMetadata(
        uint256 indexed tokenId, address indexed to, string name, string description, string category
    );

    // ============ CONSTRUCTOR ============

    /// @notice Initialize the Genes contract
    /// @dev Sets up ERC721 with name "Aminal Genes" and symbol "GENES"
    constructor() ERC721("Aminal Genes", "GENES") {}

    // ============ EXTERNAL FUNCTIONS ============

    /// @notice Initialize the contract with the Aminal Factory address
    /// @dev Can only be called once due to initializer modifier
    /// @param aminalFactory_ Address of the Aminal Factory contract
    /// @param geneRegistry_ Address of the Gene Registry contract
    function setup(address aminalFactory_, address geneRegistry_) external initializer onlyOwner {
        aminalFactory = aminalFactory_;
        geneRegistry = geneRegistry_;
        emit Setup(aminalFactory_, geneRegistry_);
    }

    /// @notice Mint a new Gene NFT
    /// @dev Can only be called by the Gene Registry contract
    /// @param to Address to mint the gene to
    /// @param geneSVG SVG content for the visual representation
    /// @param name Human-readable name for the gene
    /// @param description Optional description of the gene
    /// @param category Category/tag for filtering (e.g., "eyes", "hat", "background")
    function mint(
        address to,
        string calldata geneSVG,
        string calldata name,
        string calldata description,
        string calldata category
    ) external onlyRegistry {
        uint256 tokenId = currentId;
        geneSVGPointers[tokenId] = SSTORE2.write(bytes(geneSVG));

        ++currentId;
        _mint(to, tokenId);

        // Emit metadata as event for indexers to pick up
        emit GeneMetadata(tokenId, to, name, description, category);
    }

    /// @notice Burn a Gene NFT
    /// @dev Can only be called by the current owner of the gene
    /// @param id Token ID of the gene to burn
    function burn(uint256 id) external {
        if (msg.sender != ownerOf(id)) revert OnlyNFTOwner();
        _burn(id);
    }

    /// @notice Get SVG content for a gene
    /// @dev Reads SVG from SSTORE2 storage
    /// @param id Token ID of the gene to query
    /// @return SVG content string
    function getGeneSVG(uint256 id) public view returns (string memory) {
        address pointer = geneSVGPointers[id];
        if (pointer == address(0)) return "";
        return string(SSTORE2.read(pointer));
    }

    /// @notice Get Gene NFT SVG information
    /// @dev Returns SVG content for a gene
    /// @param id Token ID of the gene to query
    /// @return svg SVG content string
    function getGeneInfo(uint256 id) external view returns (string memory svg) {
        return getGeneSVG(id);
    }

    // ============ PUBLIC FUNCTIONS ============

    /// @notice Generate token URI for a Gene NFT
    /// @dev Creates a base64 encoded JSON metadata following ERC721 standards
    /// @param tokenId Token ID to generate URI for
    /// @return Complete data URI string
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        string memory svg = getGeneSVG(tokenId);

        // Create JSON metadata with the SVG embedded as base64 image
        string memory json = string(
            abi.encodePacked(
                '{"name": "Aminal Gene #',
                Strings.toString(tokenId),
                '", "description": "A permissionless gene NFT that can be used in Aminal compositions", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(svg)),
                '"}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }
}
