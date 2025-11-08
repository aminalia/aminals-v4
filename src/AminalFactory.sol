// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.20;

import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

import {IAminalFactory} from "src/interfaces/IAminalFactory.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {Genes} from "src/genes/Genes.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {AminalFeedingSchedule} from "src/utils/AminalFeedingSchedule.sol";

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
    error FeedingScheduleAlreadyDeployed();
    error GenesisLimitExceeded();
    error MustSpawnAtLeastOne();
    error InvalidParentOne();
    error InvalidParentTwo();
    error InvalidAminalAddresses();
    error CannotBreedWithSelf();
    error InsufficientLove();
    error IndexOutOfBounds();
    error NotRegisteredAminal();
    error FeedingScheduleNotDeployed();
    error InsufficientTotalLove();
    error InsufficientLovePercentage();

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                     📊 CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════════════════

    /// @notice Minimum percentage of total love required from user to breed (10%)
    uint256 public constant MIN_LOVE_PERCENTAGE = 10;

    /// @notice Basis points for percentage calculations (100 = 100%)
    uint256 public constant PERCENTAGE_BASIS = 100;

    /// @notice Maximum number of genes that can be assigned to an Aminal
    uint256 public constant MAX_GENES = 9;

    /// @notice Maximum number of genesis Aminals that can be spawned
    uint256 public constant MAX_GENESIS_AMINALS = 10;

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   📊 STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════════════════════════

    /// @notice Total number of Aminals ever spawned 📊
    uint256 public totalAminals;

    /// @notice Number of genesis Aminals spawned so far 🌱
    uint256 public genesisAminalsSpawned;

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

    /// @notice Feeding schedule for calculating love based on time and cumulative feeding 📈
    AminalFeedingSchedule public feedingSchedule;

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
     * @notice Emitted when feeding schedule is deployed
     * @param feedingScheduleAddress Address of the deployed feeding schedule contract
     */
    event FeedingScheduleDeployed(address indexed feedingScheduleAddress);

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
        if (address(feedingSchedule) == address(0)) revert FeedingScheduleNotDeployed();
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
     * @notice Deploy and configure the feeding schedule for love calculations
     * @dev Creates the schedule-based love calculation system
     *
     * Requirements:
     * - Must be called by owner after initialization
     */
    function setup() external onlyOwner {
        if (address(feedingSchedule) != address(0)) revert FeedingScheduleAlreadyDeployed();

        // Deploy feeding schedule calculator
        feedingSchedule = new AminalFeedingSchedule();

        emit FeedingScheduleDeployed(address(feedingSchedule));
    }

    // ═══════════════════════════════════════════════════════════════════════════════════
    //                                   🌱 GENESIS SPAWNING
    // ═══════════════════════════════════════════════════════════════════════════════════

    /**
     * @notice Spawn the genesis Aminals to seed the ecosystem 🌱
     * @dev Creates the initial population of Aminals with predefined genetics
     *
     * Requirements:
     * - Can only be called by the owner
     * - Can be called multiple times in batches until MAX_GENESIS_AMINALS (10) is reached
     * - Each batch size + already spawned must not exceed MAX_GENESIS_AMINALS
     * - Each gene instance array must have valid gene IDs and placements
     *
     * @param genesisGenes Array of gene instance arrays for genesis Aminals in this batch
     *
     * "In the beginning, there was code. From code came the first Aminals,
     *  the digital Adam and Eve of the blockchain paradise."
     */
    function spawnInitialAminals(GeneInstance[MAX_GENES][] calldata genesisGenes) external onlyOwner {
        if (genesisGenes.length == 0) revert MustSpawnAtLeastOne();
        if (genesisAminalsSpawned + genesisGenes.length > MAX_GENESIS_AMINALS) revert GenesisLimitExceeded();

        genesisAminalsSpawned += genesisGenes.length;

        for (uint256 i = 0; i < genesisGenes.length; i++) {
            _spawnAminal(
                address(0), // No parents for genesis Aminals
                address(0),
                0, // No auction ID for genesis Aminals
                address(0), // No proposer for genesis Aminals
                genesisGenes[i]
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
     * @param proposer Address of the design proposer
     * @param genes Array of gene instances (gene IDs with placements)
     * @return childAddress Address of the newly spawned Aminal
     */
    function spawnAminal(
        address parentOne,
        address parentTwo,
        uint256 auctionId,
        address proposer,
        GeneInstance[MAX_GENES] calldata genes
    ) external onlyAuction returns (address childAddress) {
        if (!isAminal[parentOne]) revert InvalidParentOne();
        if (!isAminal[parentTwo]) revert InvalidParentTwo();

        return _spawnAminal(parentOne, parentTwo, auctionId, proposer, genes);
    }

    /**
     * @notice Initiate breeding ceremony between two Aminals 💕
     * @dev Launches gene auctions for offspring
     *
     * Requirements:
     * - Both addresses must be valid Aminals
     * - Caller must have at least MIN_LOVE_PERCENTAGE (10%) of total love for both Aminals
     * - Love consumption is percentage-based: if you have X% of total love, you pay X% * 10% of your love
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
        uint256 userLove1 = aminal1.getLoveByUser(msg.sender);
        uint256 userLove2 = aminal2.getLoveByUser(msg.sender);
        uint256 totalLove1 = aminal1.getTotalLove();
        uint256 totalLove2 = aminal2.getTotalLove();

        // Check if total love is sufficient (can't breed if no love exists)
        if (totalLove1 == 0 || totalLove2 == 0) revert InsufficientTotalLove();

        // Check if caller has at least MIN_LOVE_PERCENTAGE (10%) of total love for each Aminal
        uint256 minRequired1 = (totalLove1 * MIN_LOVE_PERCENTAGE) / PERCENTAGE_BASIS;
        uint256 minRequired2 = (totalLove2 * MIN_LOVE_PERCENTAGE) / PERCENTAGE_BASIS;

        if (userLove1 < minRequired1 || userLove2 < minRequired2) revert InsufficientLovePercentage();

        // Calculate love to consume: MIN_LOVE_PERCENTAGE of user's love
        uint256 loveToConsume1 = (userLove1 * MIN_LOVE_PERCENTAGE) / PERCENTAGE_BASIS;
        uint256 loveToConsume2 = (userLove2 * MIN_LOVE_PERCENTAGE) / PERCENTAGE_BASIS;

        // Calculate total love investment from caller for both Aminals
        uint256 totalLove = userLove1 + userLove2;

        // Slippage protection: ensure total love meets minimum threshold
        if (totalLove < minTotalLove) revert InsufficientTotalLove();

        // Consume love from caller via squeakFrom
        aminal1.squeakFrom(msg.sender, loveToConsume1);
        aminal2.squeakFrom(msg.sender, loveToConsume2);

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
     * @notice Get complete genetic profile for an Aminal
     * @dev Retrieves gene instances with placements for rendering and display purposes
     *
     * @param aminalAddress Address of the Aminal to query
     * @return genes Complete array of gene instances with placements
     */
    function getAminalGenesByAddress(address aminalAddress)
        external
        view
        returns (GeneInstance[MAX_GENES] memory genes)
    {
        if (!isAminal[aminalAddress]) revert NotRegisteredAminal();
        return AminalContract(payable(aminalAddress)).getGenes();
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
     * @param proposer Address of the design proposer (address(0) for genesis/parent designs)
     * @param genes Array of gene instances with placements
     * @return childAddress Address of the newly created Aminal
     */
    function _spawnAminal(
        address parentOne,
        address parentTwo,
        uint256 auctionId,
        address proposer,
        GeneInstance[MAX_GENES] memory genes
    ) internal returns (address childAddress) {
        if (address(feedingSchedule) == address(0)) revert FeedingScheduleNotDeployed();

        // Deploy new Aminal contract with full genetic and factory context
        AminalContract newAminal = new AminalContract(
            address(this), // Factory address for callbacks
            parentOne, // First parent (or address(0) for genesis)
            parentTwo, // Second parent (or address(0) for genesis)
            proposer, // Design proposer (or address(0) for genesis/parent designs)
            genes, // Complete genetic profile with placements
            totalAminals, // Unique index for this Aminal
            address(feedingSchedule) // Feeding schedule for love calculations
        );

        childAddress = address(newAminal);

        // Register the new Aminal in factory systems
        isAminal[childAddress] = true;
        aminalsByIndex[totalAminals] = childAddress;
        totalAminals++;

        // Extract gene IDs for event
        uint256[MAX_GENES] memory geneIds;
        for (uint256 i = 0; i < MAX_GENES; i++) {
            geneIds[i] = genes[i].geneId;
        }

        emit AminalSpawned(childAddress, parentOne, parentTwo, auctionId, geneIds);

        return childAddress;
    }
}
