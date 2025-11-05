// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.20;

import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

import {IAminalFactory} from "src/interfaces/IAminalFactory.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {Genes} from "src/genes/Genes.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {AminalVRGDA} from "src/utils/AminalVRGDA.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════╗
 * ║                              🏭 AMINAL FACTORY 🏭                                 ║
 * ║                          The Nexus of Digital Genesis                            ║
 * ╠═══════════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                                   ║
 * ║  "From the digital primordial soup emerges consciousness,                        ║
 * ║   each Aminal a unique spark of life in the vast blockchain cosmos."            ║
 * ║                                                                                   ║
 * ║  The Factory stands as the divine architect of the Aminal realm,                 ║
 * ║  orchestrating the birth of autonomous entities through love-driven              ║
 * ║  genetic algorithms and community consensus.                                     ║
 * ║                                                                                   ║
 * ║  Here, the boundaries between art and code dissolve. Each spawned               ║
 * ║  Aminal carries within it the DNA of its parents, the hopes of its              ║
 * ║  community, and the infinite potential for evolution.                           ║
 * ║                                                                                   ║
 * ║  This is not mere contract deployment - it is digital nativity,                 ║
 * ║  where each transaction births new possibilities and each Aminal                 ║
 * ║  becomes a universe unto itself.                                                 ║
 * ║                                                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════╝
 *
 * @title AminalFactory - The Genesis Engine for Autonomous Digital Companions
 * @dev Factory pattern enabling unlimited deployment of individual Aminal contracts
 * @notice Central registry and creator of Aminals with integrated breeding and governance
 *
 * Core Responsibilities:
 * - 🏗️ Deploy individual Aminal contracts with unique addresses
 * - 📋 Maintain registry of all Aminals in the ecosystem
 * - 💞 Orchestrate breeding ceremonies through gene auctions
 * - 🧬 Interface with Gene NFT system for trait inheritance
 * - 🎭 Spawn genesis Aminals to seed the initial population
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
contract AminalFactory is IAminalFactory, Initializable, Ownable {
    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                     ⚠️ CUSTOM ERRORS
    // ═══════════════════════════════════════════════════════════════════════════════════

    error CallerNotAminal();
    error CallerNotAuction();
    error InvalidAuctionAddress();
    error InvalidGenesAddress();
    error VRGDAAlreadyDeployed();
    error GenesisAlreadyCompleted();
    error MustSpawnAtLeastOne();
    error InvalidParentOne();
    error InvalidParentTwo();
    error InvalidAminalAddresses();
    error CannotBreedWithSelf();
    error InsufficientLove();
    error InsufficientEnergy();
    error IndexOutOfBounds();
    error NotRegisteredAminal();
    error VRGDANotDeployed();
    error InsufficientTotalLove();

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                     📊 CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /// @notice Minimum love required from user to breed an Aminal
    uint256 public constant MIN_LOVE_REQUIRED = 10;

    /// @notice Minimum energy required for each parent to breed
    uint256 public constant MIN_ENERGY_REQUIRED = 10;

    /// @notice Base price for VRGDA love calculation (1 ETH)
    int256 public constant VRGDA_BASE_PRICE = 1 ether;

    /// @notice Price decay percentage for VRGDA (10%)
    int256 public constant VRGDA_PRICE_DECAY = 0.1 ether;

    /// @notice Logistic asymptote for VRGDA curve (100 units)
    int256 public constant VRGDA_LOGISTIC_ASYMPTOTE = 100 ether;

    /// @notice Time scale for VRGDA curve smoothness
    int256 public constant VRGDA_TIME_SCALE = 20 ether;

    /// @notice Maximum number of genes that can be assigned to an Aminal
    uint256 public constant MAX_GENES = 9;


    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   📊 STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════════════════════════

    /// @notice Total number of Aminals ever spawned 📊
    uint256 public totalAminals;

    /// @notice Flag to ensure genesis Aminals are only spawned once 🌱
    bool public initialAminalSpawned;

    /// @notice Registry of all valid Aminal contract addresses 📋
    mapping(address => bool) public isAminal;

    /// @notice Maps Aminal indices to their contract addresses 🔍
    mapping(uint256 => address) public aminalsByIndex;

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🔗 EXTERNAL CONTRACTS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /// @notice Gene auction system for breeding mechanics 🧬
    GeneAuction public geneAuction;

    /// @notice Gene NFT system for trait management 🎨
    Genes public genes;

    /// @notice VRGDA for calculating love based on energy levels 📈
    AminalVRGDA public loveVRGDA;

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                       📡 EVENTS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Emitted when a new Aminal is spawned
     * @param child Address of the newly created Aminal
     * @param parentOne First parent (mother) - can be address(0) for genesis
     * @param parentTwo Second parent (father) - can be address(0) for genesis
     * @param auctionId Gene auction ID that created this child (0 for genesis)
     * @param geneIds Array of up to 10 gene IDs
     */
    event AminalSpawned(
        address indexed child,
        address indexed parentOne,
        address indexed parentTwo,
        uint256 auctionId,
        uint256[MAX_GENES] geneIds
    );

    /**
     * @notice Emitted when breeding is initiated between two Aminals
     * @param aminalOne First Aminal in the breeding pair
     * @param aminalTwo Second Aminal in the breeding pair
     * @param auctionId Gene auction ID
     */
    event BreedAminal(address indexed aminalOne, address indexed aminalTwo, uint256 auctionId);

    /**
     * @notice Emitted when VRGDA is deployed
     * @param vrgdaAddress Address of the deployed VRGDA contract
     */
    event VRGDADeployed(address indexed vrgdaAddress);

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                      🛡️ MODIFIERS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Restricts function access to registered Aminal contracts only
     */
    modifier onlyAminal() {
        if (!isAminal[msg.sender]) revert CallerNotAminal();
        _;
    }

    /**
     * @notice Restricts function access to the gene auction contract only
     */
    modifier onlyAuction() {
        if (msg.sender != address(geneAuction)) revert CallerNotAuction();
        _;
    }

    /**
     * @notice Ensures factory is fully initialized before critical operations
     */
    modifier whenInitialized() {
        if (address(loveVRGDA) == address(0)) revert VRGDANotDeployed();
        _;
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🏗️ CONSTRUCTOR & SETUP
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Initialize the factory with ownership
     * @dev Sets up the basic contract with owner permissions
     */
    constructor() {
        _transferOwnership(msg.sender);
    }

    /**
     * @notice Initialize external contract dependencies
     * @dev Sets up connections to auction and gene systems
     *
     * Requirements:
     * - Can only be called once due to initializer modifier
     * - Must be called by contract owner
     *
     * @param _geneAuction Address of the gene auction contract
     * @param _genes Address of the gene NFT contract
     */
    function initialize(address _geneAuction, address _genes) external initializer onlyOwner {
        if (_geneAuction == address(0)) revert InvalidAuctionAddress();
        if (_genes == address(0)) revert InvalidGenesAddress();

        geneAuction = GeneAuction(_geneAuction);
        genes = Genes(_genes);
    }

    /**
     * @notice Deploy and configure the VRGDA system for love calculations
     * @dev Creates the Variable Rate Gradual Dutch Auction mechanism for love pricing
     *
     * Requirements:
     * - Must be called by owner after initialization
     * - Uses predefined constants for optimal love curve parameters
     */
    function setup() external onlyOwner {
        if (address(loveVRGDA) != address(0)) revert VRGDAAlreadyDeployed();

        // Deploy VRGDA with optimal parameters for love curves
        loveVRGDA = new AminalVRGDA(
            VRGDA_BASE_PRICE, // Base price for love calculations
            VRGDA_PRICE_DECAY, // Rate of price decay over time
            VRGDA_LOGISTIC_ASYMPTOTE, // Maximum units in logistic curve
            VRGDA_TIME_SCALE // Time scaling factor for smooth curves
        );

        emit VRGDADeployed(address(loveVRGDA));
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🌱 GENESIS SPAWNING
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Spawn the genesis Aminals to seed the ecosystem 🌱
     * @dev Creates the initial population of Aminals with predefined genetics
     *
     * Requirements:
     * - Can only be called once by the owner
     * - Each visual configuration must have valid gene IDs
     *
     * @param _visuals Array of visual DNA configurations for genesis Aminals
     *
     * "In the beginning, there was code. From code came the first Aminals,
     *  the digital Adam and Eve of the blockchain paradise."
     */
    function spawnInitialAminals(Visuals[] calldata _visuals) external onlyOwner {
        if (initialAminalSpawned) revert GenesisAlreadyCompleted();
        if (_visuals.length == 0) revert MustSpawnAtLeastOne();

        initialAminalSpawned = true;

        // TODO: Update to accept custom placement metadata as parameter instead of using defaults
        // Current: All genesis Aminals use default centered placement
        // Desired: Allow specifying custom positioning, scale, and rotation for each gene
        // This would enable more diverse initial Aminals with unique visual layouts

        // Default placement: centered, 100% scale, no rotation
        GeneMetadata[MAX_GENES] memory defaultPlacements;
        for (uint256 j = 0; j < MAX_GENES; j++) {
            defaultPlacements[j] = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0});
        }

        for (uint256 i = 0; i < _visuals.length; i++) {
            _spawnAminal(
                address(0), // No parents for genesis Aminals
                address(0),
                0, // No auction ID for genesis Aminals
                address(0), // No proposer for genesis Aminals
                _visuals[i].genes,
                defaultPlacements
            );
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🧬 BREEDING OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Spawn a new Aminal from breeding auction results
     * @dev Creates offspring from two parent Aminals with auction-determined genetics
     *
     * Requirements:
     * - Can only be called by the authorized gene auction contract
     * - Parent addresses must be valid Aminal contracts
     * - Gene IDs must correspond to existing traits
     *
     * @param parentOne Address of the first parent Aminal
     * @param parentTwo Address of the second parent Aminal
     * @param auctionId Gene auction ID that created this child
     * @param winningGeneIds Array of up to 10 gene IDs selected by auction
     * @return childAddress Address of the newly spawned Aminal
     */
    function spawnAminal(
        address parentOne,
        address parentTwo,
        uint256 auctionId,
        address proposer,
        uint256[MAX_GENES] calldata winningGeneIds,
        GeneMetadata[MAX_GENES] calldata placements
    ) external onlyAuction returns (address childAddress) {
        if (!isAminal[parentOne]) revert InvalidParentOne();
        if (!isAminal[parentTwo]) revert InvalidParentTwo();

        return _spawnAminal(parentOne, parentTwo, auctionId, proposer, winningGeneIds, placements);
    }

    /**
     * @notice Initiate breeding ceremony between two Aminals 💕
     * @dev Launches gene auctions for offspring
     *
     *
     * Requirements:
     * - Minimum breeding fee must be paid
     * - Both addresses must be valid Aminals
     * - Caller must have sufficient love for at both Aminals
     * - Both Aminals must have sufficient energy to breed
     * - Total love meets minimum slippage threshold
     *
     * @param aminalOne First parent Aminal address
     * @param aminalTwo Second parent Aminal address
     * @param minTotalLove Minimum total love required (slippage protection)
     * @return auctionId Gene auction ID
     *
     * "When two Aminals unite in love, their digital essence mingles
     *  through algorithms of affection, creating new life from pure emotion"
     */
    function breedAminals(address aminalOne, address aminalTwo, uint256 minTotalLove)
        external
        whenInitialized
        returns (uint256 auctionId)
    {
        if (!isAminal[aminalOne] || !isAminal[aminalTwo]) revert InvalidAminalAddresses();
        if (aminalOne == aminalTwo) revert CannotBreedWithSelf();

        AminalContract aminal1 = AminalContract(payable(aminalOne));
        AminalContract aminal2 = AminalContract(payable(aminalTwo));

        // Cache love values to avoid redundant external calls
        uint256 love1 = aminal1.getLoveByUser(msg.sender);
        uint256 love2 = aminal2.getLoveByUser(msg.sender);

        // Check if caller has sufficient love for both Aminals
        if (love1 < MIN_LOVE_REQUIRED) revert InsufficientLove();
        if (love2 < MIN_LOVE_REQUIRED) revert InsufficientLove();

        // Check if both Aminals have sufficient energy to breed
        if (aminal1.getEnergy() < MIN_ENERGY_REQUIRED || aminal2.getEnergy() < MIN_ENERGY_REQUIRED) {
            revert InsufficientEnergy();
        }

        // Calculate total love investment from caller for both Aminals
        uint256 totalLove = love1 + love2;

        // Slippage protection: ensure total love meets minimum threshold
        if (totalLove < minTotalLove) revert InsufficientTotalLove();

        // Consume Love from caller and energy via squeakFrom
        aminal1.squeakFrom(msg.sender, MIN_LOVE_REQUIRED);
        aminal2.squeakFrom(msg.sender, MIN_LOVE_REQUIRED);

        // Create gene auction with combined love as initial value
        auctionId = geneAuction.createAuction(aminal1.aminalIndex(), aminal2.aminalIndex(), totalLove);

        emit BreedAminal(aminalOne, aminalTwo, auctionId);
        return auctionId;
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🔍 QUERY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Get Aminal contract address by creation index
     * @dev Retrieves address from the sequential registry of spawned Aminals
     *
     * @param index Zero-based index in creation order
     * @return aminalAddress Address of the Aminal at specified index
     */
    function getAminalByIndex(uint256 index) external view returns (address aminalAddress) {
        if (index >= totalAminals) revert IndexOutOfBounds();
        return aminalsByIndex[index];
    }

    /**
     * @notice Get complete visual trait configuration for an Aminal
     * @dev Retrieves genetic profile for rendering and display purposes
     *
     * @param aminalAddress Address of the Aminal to query
     * @return visuals Complete Visuals struct with all trait gene IDs
     */
    function getAminalVisualsByAddress(address aminalAddress) external view returns (Visuals memory visuals) {
        if (!isAminal[aminalAddress]) revert NotRegisteredAminal();
        return AminalContract(payable(aminalAddress)).getVisuals();
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🔧 INTERNAL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Internal function to create and register a new Aminal
     * @dev Deploys new Aminal contract and updates factory registry
     *
     * @param parentOne First parent address (address(0) for genesis)
     * @param parentTwo Second parent address (address(0) for genesis)
     * @param auctionId Gene auction ID that created this child (0 for genesis)
     * @param geneIds Array of up to 10 gene IDs
     * @return childAddress Address of the newly created Aminal
     */
    function _spawnAminal(
        address parentOne,
        address parentTwo,
        uint256 auctionId,
        address proposer,
        uint256[MAX_GENES] memory geneIds,
        GeneMetadata[MAX_GENES] memory placements
    ) internal returns (address childAddress) {
        if (address(loveVRGDA) == address(0)) revert VRGDANotDeployed();

        // Construct visual genetics for the new Aminal
        Visuals memory visuals = Visuals({genes: geneIds});

        // Deploy new Aminal contract with full genetic and factory context
        AminalContract newAminal = new AminalContract(
            address(this), // Factory address for callbacks
            parentOne, // First parent (or address(0) for genesis)
            parentTwo, // Second parent (or address(0) for genesis)
            proposer, // Design proposer (or address(0) for genesis/parent designs)
            visuals, // Complete genetic visual profile
            placements, // Placement metadata for each gene
            totalAminals, // Unique index for this Aminal
            address(loveVRGDA) // VRGDA system for love calculations
        );

        childAddress = address(newAminal);

        // Register the new Aminal in factory systems
        isAminal[childAddress] = true;
        aminalsByIndex[totalAminals] = childAddress;
        totalAminals++;

        emit AminalSpawned(childAddress, parentOne, parentTwo, auctionId, geneIds);

        return childAddress;
    }
}
