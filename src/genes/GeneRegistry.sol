// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.20;

import {Genes} from "src/genes/Genes.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {Ownable} from "oz/access/Ownable.sol";

/**
 * @title GeneRegistry
 * @dev Factory for creating Gene NFTs representing traits for Aminals, also serves as a registry for Gene NFTs
 * @notice Anyone can create Gene NFTs from this factory for permissionless trait creation
 */
contract GeneRegistry is IAminalStructs, Ownable {
    /// @notice The main Gene NFT contract
    Genes public immutable geneNFT;

    /// @notice Registry mapping to verify Gene NFTs came from this factory
    mapping(uint256 geneId => bool isFromFactory) public geneRegistry;

    /// @notice Mapping from gene ID to creator address
    mapping(uint256 geneId => address creator) public geneCreators;

    /// @notice Mapping from creator address to array of their gene IDs
    mapping(address creator => uint256[] geneIds) private creatorGenes;

    /// @notice Mapping from gene ID to SVG content
    // mapping(uint256 geneId => string svg) public geneSVGs;

    /// @notice Counter for tracking total genes created
    uint256 public totalGenesCreated;

    /// @notice Maximum SVG length to prevent bloated storage
    uint256 public constant MAX_SVG_LENGTH = 50_000; // 50KB limit

    error SVGTooLarge();
    error EmptySVG();
    error InvalidSVG();
    error EmptyName();

    event GeneCreated(
        uint256 indexed geneId,
        address indexed creator,
        address indexed recipient,
        string svg,
        string name,
        string description,
        string category
    );

    constructor(address _geneNFT) {
        geneNFT = Genes(_geneNFT);
    }

    /**
     * @notice Create a new Gene NFT with trait data
     * @dev Anyone can call this function to create permissionless traits
     * @param svg The SVG content for the trait
     * @param name Human-readable name for the gene (e.g., "Rainbow Wings")
     * @param description Optional description of the gene
     * @param category Category/tag for filtering (e.g., "eyes", "hat", "background")
     * @return geneId The ID of the created Gene NFT
     */
    function createGene(string calldata svg, string calldata name, string calldata description, string calldata category)
        external
        returns (uint256 geneId)
    {
        return createGeneFor(msg.sender, svg, name, description, category);
    }

    /**
     * @notice Create a new Gene NFT with trait data on behalf of another account
     * @dev Anyone can call this function to create permissionless traits for others
     * @dev Useful for minting scripts that want to specify the recipient
     * @param recipient The address that will receive the Gene NFT and be marked as creator
     * @param svg The SVG content for the trait
     * @param name Human-readable name for the gene
     * @param description Optional description of the gene
     * @param category Category/tag for filtering
     * @return geneId The ID of the created Gene NFT
     */
    function createGeneFor(
        address recipient,
        string calldata svg,
        string calldata name,
        string calldata description,
        string calldata category
    ) public returns (uint256 geneId) {
        if (bytes(svg).length == 0) revert EmptySVG();
        if (bytes(svg).length > MAX_SVG_LENGTH) revert SVGTooLarge();
        if (bytes(name).length == 0) revert EmptyName();

        // Basic SVG validation - check for opening and closing tags
        if (!_isValidSVG(svg)) revert InvalidSVG();

        // Get the gene ID that will be minted (current counter value)
        geneId = geneNFT.currentId();

        // Mint the Gene NFT to the recipient with metadata
        geneNFT.mint(recipient, svg, name, description, category);

        // Register the gene as coming from this factory
        geneRegistry[geneId] = true;
        geneCreators[geneId] = recipient;
        creatorGenes[recipient].push(geneId);

        totalGenesCreated++;

        emit GeneCreated(geneId, recipient, recipient, svg, name, description, category);

        return geneId;
    }

    /**
     * @notice Check if a Gene NFT was created from this factory
     * @param geneId The ID of the Gene NFT to check
     * @return bool True if the gene was created from this factory
     */
    function isValidGene(uint256 geneId) external view returns (bool) {
        return geneRegistry[geneId];
    }

    /**
     * @notice Get Gene NFT information
     * @param geneId The ID of the Gene NFT
     * @return creator The creator address
     * @return svg The SVG content
     */
    function getGeneInfo(uint256 geneId) external view returns (address creator, string memory svg) {
        svg = geneNFT.getGeneSVG(geneId);
        return (geneCreators[geneId], svg);
    }

    /**
     * @notice Get number of genes created by an address
     * @param creator The creator address
     * @return count Number of genes created
     */
    function getGeneCountByCreator(address creator) external view returns (uint256) {
        return creatorGenes[creator].length;
    }

    /**
     * @notice Get paginated Gene NFTs by creator
     * @dev Uses O(1) lookup with pagination to handle large arrays
     * @param creator The creator address
     * @param offset Starting index
     * @param limit Maximum number of results to return
     * @return geneIds Array of Gene NFT IDs created by the address
     * @return total Total number of genes created by this address
     */
    function getGenesByCreator(address creator, uint256 offset, uint256 limit)
        external
        view
        returns (uint256[] memory geneIds, uint256 total)
    {
        uint256[] storage allGenes = creatorGenes[creator];
        total = allGenes.length;

        if (offset >= total) {
            return (new uint256[](0), total);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256 resultLength = end - offset;
        geneIds = new uint256[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            geneIds[i] = allGenes[offset + i];
        }

        return (geneIds, total);
    }

    /**
     * @notice Basic SVG validation
     * @dev Checks for basic SVG structure - not comprehensive security validation
     * @param svg The SVG string to validate
     * @return bool True if SVG appears valid
     */
    function _isValidSVG(string calldata svg) internal pure returns (bool) {
        bytes memory svgBytes = bytes(svg);

        // Check for basic SVG structure
        // Must contain opening tag (could be <svg, <g, <path, etc.)
        bool hasOpeningTag = false;
        for (uint256 i = 0; i < svgBytes.length - 1; i++) {
            if (svgBytes[i] == "<" && svgBytes[i + 1] != "/") {
                hasOpeningTag = true;
                break;
            }
        }

        return hasOpeningTag;
    }
}
