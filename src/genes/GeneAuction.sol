// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.20;

import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";
import {ReentrancyGuard} from "oz/security/ReentrancyGuard.sol";

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {IAminalFactory} from "src/interfaces/IAminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

/**
 * @title GeneAuction - Community-Driven Full Aminal Design Selection for Breeding
 * @notice Love-based voting system for complete Aminal trait set selection with treasury payouts to gene creators
 * @dev Manages breeding auctions where community votes determine complete child Aminal designs
 *
 * When two Aminals breed, a gene auction is created where:
 * - Community members propose complete 8-trait Aminal designs
 * - Voters select entire Aminal configurations, ensuring visual consistency
 * - 10% of each parent's treasury is distributed to winning gene creators
 * - Child Aminal is spawned with the winning design
 *
 * Key Features:
 * - 🎨 Full Aminal design voting (all 8 traits as a set)
 * - 🗳️ Love-weighted voting system
 * - 💰 Treasury payouts to gene creators (10% from each parent)
 * - 🎲 Tie-breaking with deterministic randomness
 * - 🔄 Parent design inheritance as fallback
 * - ⏱️ Time-limited voting periods
 * - 🛡️ Design removal voting for quality control
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
contract GeneAuction is IAminalStructs, Initializable, Ownable, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Duration of voting in seconds (1 hour for testing, will be 7 days in production)
    uint256 public constant VOTING_DURATION = 1 hours;

    /// @notice Percentage of parent treasury transferred to gene creators (10%)
    uint256 public constant TREASURY_TRANSFER_PERCENTAGE = 10;

    /// @notice Cost in love and energy to propose a design
    uint256 public constant PROPOSE_DESIGN_COST = 10;

    /// @notice Minimum fraction of total love required to remove a design (1/3)
    uint256 public constant DESIGN_REMOVAL_THRESHOLD = 3;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice Gene NFT contract for trait ownership
    Genes public genes;

    /// @notice Gene registry for validating and retrieving gene information
    GeneRegistry public geneRegistry;

    /// @notice Factory contract for Aminal management (also acts as Aminals contract)
    IAminalFactory public aminalFactory;

    /// @notice Counter for unique auction IDs
    uint256 public auctionCounter;

    /// @notice Counter for unique design proposal IDs
    uint256 public designCounter;

    /// @notice Mapping from auction ID to auction data
    mapping(uint256 => Auction) public auctions;

    /// @notice Mapping from gene ID to failed payout information
    mapping(uint256 => FailedPayout) public failedPayouts;

    /// @notice Mapping from auction ID to pause status
    mapping(uint256 => bool) public pausedAuctions;

    /*//////////////////////////////////////////////////////////////
                               STRUCTURES
    //////////////////////////////////////////////////////////////*/

    /// @notice Complete Aminal design proposal (1-9 genes with placement info)
    struct AminalDesign {
        GeneInstance[9] genes; // Up to 9 gene instances (geneId = 0 means unused slot)
        address proposer; // Address that proposed this design
        uint256 votes; // Total voting power for this design
        bool removed; // Whether this design has been removed
    }

    /// @notice Core auction data structure
    /// @dev Struct optimized for storage packing: uint64s and bool packed in first slot
    struct Auction {
        uint64 startTime; // Auction start timestamp - packed together
        uint64 endTime; // Auction end timestamp - packed together
        bool settled; // Whether auction has been settled - packed together (17/32 bytes used)
        uint256 aminalOne; // Index of first parent Aminal
        uint256 aminalTwo; // Index of second parent Aminal
        uint256 totalLove; // Total love used for voting power calculation
        GeneInstance[9] parentOneGenes; // Parent 1 gene instances
        GeneInstance[9] parentTwoGenes; // Parent 2 gene instances
        uint256[] proposedDesignIds; // Array of proposed design IDs
        mapping(uint256 => AminalDesign) designs; // designId => AminalDesign
        mapping(address => uint256) userVotedDesign; // user => designId they voted for
        mapping(address => uint256) userVoteWeight; // user => vote weight they cast
        mapping(address => bool) userHasVoted; // user => whether they have voted
        mapping(uint256 => uint256) designRemovalVotes; // designId => removal vote weight
        mapping(address => mapping(uint256 => uint256)) userRemovalVotes; // user => designId => removal votes cast
        uint256 winningDesignId; // Current winning design ID
        uint256 highestVotes; // Highest vote count achieved
        uint256[] tiedDesignIds; // Array of designs tied for highest votes
    }

    /// @notice View structure for auction voting information
    struct AuctionVoteInfo {
        uint256 highestVotes; // Highest vote count
        uint256 winningDesignId; // Current winner
        uint256[] proposedDesignIds; // All proposed design IDs
        uint256[] tiedDesignIds; // Designs tied for highest votes
    }

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a new breeding auction is created
    /// @param auctionId Unique identifier for the auction
    /// @param aminalOne Index of the first parent Aminal
    /// @param aminalTwo Index of the second parent Aminal
    /// @param totalLove Total love available for voting power
    /// @param startTime When voting begins
    /// @param endTime When voting ends
    event VotingCreated(
        uint256 indexed auctionId,
        uint256 indexed aminalOne,
        uint256 indexed aminalTwo,
        uint256 totalLove,
        uint64 startTime,
        uint64 endTime
    );

    /// @notice Emitted when a user votes for a complete Aminal design
    /// @param auctionId The auction being voted in
    /// @param designId The design being voted for
    /// @param voter Address of the voter
    /// @param userVotingPower The voting power used
    event DesignVoteCast(
        uint256 indexed auctionId, uint256 indexed designId, address indexed voter, uint256 userVotingPower
    );

    /// @notice Emitted when an auction is settled and child is spawned
    /// @param auctionId The settled auction
    /// @param winningDesignId The winning design ID
    /// @param winningGeneIds Array of winning gene IDs (up to 10)
    /// @param totalTreasuryTransferred Total ETH paid to gene creators
    event VotingSettled(
        uint256 indexed auctionId, uint256 winningDesignId, uint256[9] winningGeneIds, uint256 totalTreasuryTransferred
    );

    /// @notice Emitted when a gene creator receives payment for their winning gene
    /// @param auctionId The auction that generated the payout
    /// @param geneId The winning gene that earned the payout
    /// @param creator Address of the gene creator receiving payment
    /// @param amount Amount of ETH transferred to the creator
    event GeneCreatorPayout(uint256 indexed auctionId, uint256 indexed geneId, address indexed creator, uint256 amount);

    /// @notice Emitted when a complete Aminal design is proposed for voting
    /// @param auctionId The auction the design is proposed for
    /// @param designId The unique design ID
    /// @param proposer Address of the proposer
    /// @param geneIds Array of up to 10 gene IDs comprising the design
    /// @param placements Array of up to 10 placement metadata for the genes
    event DesignProposed(
        uint256 indexed auctionId,
        uint256 indexed designId,
        address indexed proposer,
        uint256[9] geneIds,
        GeneMetadata[9] placements
    );

    /// @notice Emitted when someone votes to remove a design from consideration
    /// @param auctionId The auction containing the design
    /// @param designId The design being voted for removal
    /// @param voter Address voting for removal
    /// @param voteWeight Weight of the removal vote
    event DesignRemovalVote(uint256 indexed auctionId, uint256 indexed designId, address voter, uint256 voteWeight);

    /// @notice Emitted when an auction is paused
    /// @param auctionId The auction that was paused
    event AuctionPausedEvent(uint256 indexed auctionId);

    /// @notice Emitted when an auction is unpaused
    /// @param auctionId The auction that was unpaused
    event AuctionUnpaused(uint256 indexed auctionId);

    /// @notice Emitted when a design is successfully removed from an auction
    /// @param auctionId The auction the design was removed from
    /// @param designId The removed design ID
    event DesignRemoved(uint256 indexed auctionId, uint256 indexed designId);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    /// @notice Thrown when trying to interact with an inactive auction
    error VotingNotActive();

    /// @notice Thrown when trying to modify an already settled auction
    error VotingAlreadySettled();

    /// @notice Thrown when referencing an invalid or non-existent gene
    error InvalidGene();

    /// @notice Thrown when trying to settle an auction before it ends
    error VotingNotEnded();

    /// @notice Thrown when non-Factory contract tries to call restricted functions
    error OnlyFactory();

    /// @notice Thrown when providing too many or too few genes in a design
    error InvalidGeneCount();

    /// @notice Thrown when user lacks sufficient love for an action
    error InsufficientLove();

    /// @notice Thrown when a design has already been removed
    error DesignAlreadyRemoved();

    /// @notice Thrown when user has no voting power in an auction
    error NoVotingPower();

    /// @notice Thrown when referencing an invalid or non-existent design
    error InvalidDesign();

    /// @notice Thrown when trying to interact with a paused auction
    error AuctionPaused();

    /// @notice Failed payout information
    struct FailedPayout {
        uint256 amountFromParentOne;
        uint256 amountFromParentTwo;
        address parentOneAddress;
        address parentTwoAddress;
        uint256 auctionId;
        bool claimed;
    }

    /// @notice Emitted when a payout fails and is stored for later claiming
    event PayoutFailed(uint256 indexed auctionId, uint256 indexed geneId, address indexed recipient, uint256 amount);

    /// @notice Emitted when a failed payout is successfully claimed
    event FailedPayoutClaimed(uint256 indexed geneId, address indexed recipient, uint256 totalAmount);

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Restricts function access to the Factory contract only
    modifier onlyFactory() {
        if (msg.sender != address(aminalFactory)) revert OnlyFactory();
        _;
    }

    /// @notice Validates that an auction exists
    /// @param auctionId The auction ID to validate
    modifier validVoting(uint256 auctionId) {
        require(auctionId <= auctionCounter, "Voting does not exist");
        _;
    }

    /// @notice Ensures auction is not paused
    /// @param auctionId The auction ID to check
    modifier whenNotPaused(uint256 auctionId) {
        if (pausedAuctions[auctionId]) revert AuctionPaused();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Initialize the GeneAuction with required contracts
    /// @param _Genes Address of the Genes NFT contract
    /// @param _geneRegistry Address of the GeneRegistry contract
    constructor(address _Genes, address _geneRegistry) {
        genes = Genes(_Genes);
        geneRegistry = GeneRegistry(_geneRegistry);
    }

    /// @notice Setup function to initialize the aminal factory contract address
    /// @param _aminalFactory Address of the AminalFactory contract (also acts as Aminals contract)
    /// @custom:access Only owner can call during initialization
    function setup(address _aminalFactory) external initializer onlyOwner {
        aminalFactory = IAminalFactory(_aminalFactory);
    }

    /**
     * @notice Pause an auction in case of emergency
     * @dev Only owner can pause auctions
     * @param auctionId The auction to pause
     */
    function pauseAuction(uint256 auctionId) external onlyOwner validVoting(auctionId) {
        if (pausedAuctions[auctionId]) revert AuctionPaused();
        pausedAuctions[auctionId] = true;
        emit AuctionPausedEvent(auctionId);
    }

    /**
     * @notice Unpause an auction
     * @dev Only owner can unpause auctions
     * @param auctionId The auction to unpause
     */
    function unpauseAuction(uint256 auctionId) external onlyOwner validVoting(auctionId) {
        if (!pausedAuctions[auctionId]) revert InvalidDesign(); // Using existing error for "not paused"
        pausedAuctions[auctionId] = false;
        emit AuctionUnpaused(auctionId);
    }

    /*//////////////////////////////////////////////////////////////
                           AUCTION LIFECYCLE
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Create a new breeding auction for two parent Aminals
     * @dev Called by the AminalFactory when breeding is initiated
     * @param aminalOne Index of the first parent Aminal
     * @param aminalTwo Index of the second parent Aminal
     * @param totalLove Total love used for voting power calculations
     * @return auctionId The unique identifier for the created auction
     */
    function createAuction(uint256 aminalOne, uint256 aminalTwo, uint256 totalLove)
        external
        onlyFactory
        returns (uint256 auctionId)
    {
        auctionId = ++auctionCounter;

        Auction storage auction = auctions[auctionId];
        auction.aminalOne = aminalOne;
        auction.aminalTwo = aminalTwo;
        auction.totalLove = totalLove;
        auction.startTime = uint64(block.timestamp);
        auction.endTime = uint64(block.timestamp + VOTING_DURATION);

        // Store parent traits for inheritance fallback
        _captureParentTraits(auction, aminalOne, aminalTwo);

        // Automatically add both parent designs as proposals
        _addParentDesigns(auction);

        emit VotingCreated(auctionId, aminalOne, aminalTwo, totalLove, auction.startTime, auction.endTime);
        return auctionId;
    }

    /**
     * @notice Settle a completed auction and spawn the child Aminal
     * @dev Can be called by anyone after voting ends. Distributes treasury to gene creators.
     * @param auctionId The auction to settle
     */
    function settleAuction(uint256 auctionId) external validVoting(auctionId) whenNotPaused(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp < uint256(auction.endTime)) revert VotingNotEnded();
        if (auction.settled) revert VotingAlreadySettled();

        auction.settled = true;

        GeneInstance[9] memory winningGenes;
        address proposer;
        uint256 totalTreasuryTransferred = 0;

        // Select winning design
        uint256 winningDesignId = _selectWinningDesign(auction);

        // Get the winning design's genes and proposer
        if (winningDesignId != 0) {
            AminalDesign storage winningDesign = auction.designs[winningDesignId];
            winningGenes = winningDesign.genes;
            proposer = winningDesign.proposer;
        } else {
            // Fallback to random parent design if no votes
            winningGenes = _selectRandomParentDesign(auction);
            proposer = address(0); // No proposer for parent designs
        }

        // Process treasury payouts to gene creators
        // Cache Aminal addresses to avoid redundant external calls
        address aminalOneAddress = aminalFactory.getAminalByIndex(auction.aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(auction.aminalTwo);

        // Cache Aminal interfaces
        IAminal aminal1 = IAminal(aminalOneAddress);
        IAminal aminal2 = IAminal(aminalTwoAddress);

        // Cache treasury balances
        uint256 aminalOneTreasury = aminal1.getTreasuryBalance();
        uint256 aminalTwoTreasury = aminal2.getTreasuryBalance();
        uint256 treasuryFromAminalOne = (aminalOneTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100;
        uint256 treasuryFromAminalTwo = (aminalTwoTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100;
        uint256 totalTreasury = treasuryFromAminalOne + treasuryFromAminalTwo;

        // Calculate per-recipient share: 1/10th for proposer + 1/10th for each of 9 gene creators
        uint256 perRecipientShareFromOne = treasuryFromAminalOne / 10;
        uint256 perRecipientShareFromTwo = treasuryFromAminalTwo / 10;

        // Pay the proposer (1/10th of total treasury)
        if (proposer != address(0)) {
            bool successOne = aminal1.payout(perRecipientShareFromOne, proposer);
            bool successTwo = aminal2.payout(perRecipientShareFromTwo, proposer);

            if (successOne) totalTreasuryTransferred += perRecipientShareFromOne;
            if (successTwo) totalTreasuryTransferred += perRecipientShareFromTwo;

            emit GeneCreatorPayout(auctionId, 0, proposer, perRecipientShareFromOne + perRecipientShareFromTwo);
        }

        // Transfer treasury to each gene creator (1/10th each for up to 9 genes)
        // Extract gene IDs for event emission
        uint256[9] memory winningGeneIds;
        for (uint256 i = 0; i < 9;) {
            uint256 selectedGeneId = winningGenes[i].geneId;
            winningGeneIds[i] = selectedGeneId;

            if (selectedGeneId != 0 && geneRegistry.isValidGene(selectedGeneId)) {
                totalTreasuryTransferred += _payoutGeneCreator(
                    auctionId, selectedGeneId, perRecipientShareFromOne, perRecipientShareFromTwo, aminalOneAddress, aminalTwoAddress
                );
            }
            unchecked {
                ++i;
            }
        }

        emit VotingSettled(auctionId, winningDesignId, winningGeneIds, totalTreasuryTransferred);

        // Spawn the child Aminal with winning genes and proposer
        aminalFactory.spawnAminal(aminalOneAddress, aminalTwoAddress, auctionId, proposer, winningGenes);
    }

    /**
     * @notice Propose a complete Aminal design (1-9 genes) for voting
     * @dev Anyone can propose designs. Must have at least 1 gene and at most 9.
     * @param auctionId The auction to propose the design for
     * @param genes Array of gene instances (gene IDs with placements)
     */
    function proposeDesign(uint256 auctionId, GeneInstance[9] calldata genes)
        external
        validVoting(auctionId)
    {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= uint256(auction.endTime)) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();

        // Count and validate genes
        uint256 geneCount = 0;
        for (uint256 i = 0; i < 9;) {
            if (genes[i].geneId != 0) {
                // Verify gene exists and is from the registry
                if (!geneRegistry.isValidGene(genes[i].geneId)) revert InvalidGene();
                geneCount++;
            }
            unchecked {
                ++i;
            }
        }

        // Ensure at least 1 gene and at most 9
        if (geneCount == 0 || geneCount > 9) revert InvalidGeneCount();

        // Consume love from user and energy via squeakFrom
        IAminal(aminalFactory.getAminalByIndex(auction.aminalOne)).squeakFrom(msg.sender, PROPOSE_DESIGN_COST);
        IAminal(aminalFactory.getAminalByIndex(auction.aminalTwo)).squeakFrom(msg.sender, PROPOSE_DESIGN_COST);

        // Create the new design
        uint256 designId = ++designCounter;
        AminalDesign storage newDesign = auction.designs[designId];
        newDesign.genes = genes;
        newDesign.proposer = msg.sender;
        newDesign.votes = 0;
        newDesign.removed = false;

        auction.proposedDesignIds.push(designId);

        // Extract gene IDs and placements for event
        uint256[9] memory geneIds;
        GeneMetadata[9] memory placements;
        for (uint256 i = 0; i < 9;) {
            geneIds[i] = genes[i].geneId;
            placements[i] = GeneMetadata({
                offsetX: genes[i].offsetX,
                offsetY: genes[i].offsetY,
                scale: genes[i].scale,
                rotation: genes[i].rotation
            });
            unchecked {
                ++i;
            }
        }

        emit DesignProposed(auctionId, designId, msg.sender, geneIds, placements);
    }

    /**
     * @notice Vote on a complete Aminal design with full voting power
     * @dev Users vote with their full voting power based on love given to parent Aminals
     * @param auctionId The auction to vote in
     * @param designId The design ID to vote for
     */
    function voteOnDesign(uint256 auctionId, uint256 designId) external validVoting(auctionId) {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= uint256(auction.endTime)) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();

        // Verify design exists and isn't removed
        AminalDesign storage design = auction.designs[designId];
        if (design.proposer == address(0)) revert InvalidDesign();
        if (design.removed) revert DesignAlreadyRemoved();

        // Calculate user's voting power
        uint256 userVotingPower = _calculateVotingPower(auction, msg.sender);
        if (userVotingPower == 0) revert NoVotingPower();

        // Remove previous vote if exists
        if (auction.userHasVoted[msg.sender]) {
            uint256 previousDesignId = auction.userVotedDesign[msg.sender];
            uint256 previousVoteWeight = auction.userVoteWeight[msg.sender];
            auction.designs[previousDesignId].votes -= previousVoteWeight;
        }

        // Add new vote with full voting power
        auction.userVotedDesign[msg.sender] = designId;
        auction.userVoteWeight[msg.sender] = userVotingPower;
        auction.userHasVoted[msg.sender] = true;
        design.votes += userVotingPower;

        // Update highest vote and handle ties
        _updateAuctionWinner(auction, designId);

        emit DesignVoteCast(auctionId, designId, msg.sender, userVotingPower);
    }

    /**
     * @notice Vote to remove a design from the auction
     * @dev Requires 1/3 of total love to remove a design
     * @param auctionId The auction containing the design
     * @param designId The design to vote for removal
     * @param voteWeight The voting weight to apply
     */
    function voteToRemoveDesign(uint256 auctionId, uint256 designId, uint256 voteWeight)
        external
        validVoting(auctionId)
    {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= uint256(auction.endTime)) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();

        // Verify design exists and isn't already removed
        AminalDesign storage design = auction.designs[designId];
        if (design.proposer == address(0)) revert InvalidDesign();
        if (design.removed) revert DesignAlreadyRemoved();

        // Calculate user's voting power
        uint256 userVotingPower = _calculateVotingPower(auction, msg.sender);

        // Check if user has already voted for removal and prevent exceeding voting power
        uint256 alreadyVoted = auction.userRemovalVotes[msg.sender][designId];
        if (alreadyVoted + voteWeight > userVotingPower) revert InsufficientLove();

        // Track user's removal votes for this design
        auction.userRemovalVotes[msg.sender][designId] += voteWeight;

        // Add removal vote
        auction.designRemovalVotes[designId] += voteWeight;

        emit DesignRemovalVote(auctionId, designId, msg.sender, voteWeight);

        // Check if design should be removed (1/3 of total love threshold)
        if (auction.designRemovalVotes[designId] >= auction.totalLove / DESIGN_REMOVAL_THRESHOLD) {
            _removeDesignFromAuction(auctionId, designId);
        }
    }

    /*//////////////////////////////////////////////////////////////
                           VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get auction information
     */
    function getAuctionInfo(uint256 auctionId)
        external
        view
        validVoting(auctionId)
        returns (
            uint256 aminalOne,
            uint256 aminalTwo,
            uint256 totalLove,
            uint64 startTime,
            uint64 endTime,
            bool settled
        )
    {
        Auction storage auction = auctions[auctionId];
        return
            (
                auction.aminalOne,
                auction.aminalTwo,
                auction.totalLove,
                auction.startTime,
                auction.endTime,
                auction.settled
            );
    }

    /**
     * @notice Get voting information for an auction
     */
    function getAuctionVoting(uint256 auctionId) external view validVoting(auctionId) returns (AuctionVoteInfo memory) {
        Auction storage auction = auctions[auctionId];
        return AuctionVoteInfo({
            highestVotes: auction.highestVotes,
            winningDesignId: auction.winningDesignId,
            proposedDesignIds: auction.proposedDesignIds,
            tiedDesignIds: auction.tiedDesignIds
        });
    }

    /**
     * @notice Get a specific design's details
     */
    function getDesign(uint256 auctionId, uint256 designId)
        external
        view
        validVoting(auctionId)
        returns (AminalDesign memory)
    {
        return auctions[auctionId].designs[designId];
    }

    /**
     * @notice Get which design a user voted for
     */
    function getUserVotedDesign(uint256 auctionId, address user)
        external
        view
        validVoting(auctionId)
        returns (uint256 designId)
    {
        return auctions[auctionId].userVotedDesign[user];
    }

    /**
     * @notice Get user's total voting power for an auction
     */
    function getUserVotingPower(uint256 auctionId, address user)
        external
        view
        validVoting(auctionId)
        returns (uint256)
    {
        Auction storage auction = auctions[auctionId];
        return _calculateVotingPower(auction, user);
    }

    /**
     * @notice Check if voting is active
     */
    function isVotingActive(uint256 auctionId) external view validVoting(auctionId) returns (bool) {
        Auction storage auction = auctions[auctionId];
        return block.timestamp < uint256(auction.endTime) && !auction.settled;
    }

    /**
     * @notice Get parent gene instances for an auction
     */
    function getParentGenes(uint256 auctionId)
        external
        view
        validVoting(auctionId)
        returns (GeneInstance[9] memory parentOneGenes, GeneInstance[9] memory parentTwoGenes)
    {
        Auction storage auction = auctions[auctionId];
        return (auction.parentOneGenes, auction.parentTwoGenes);
    }

    /**
     * @notice Get design removal votes
     */
    function getDesignRemovalVotes(uint256 auctionId, uint256 designId)
        external
        view
        validVoting(auctionId)
        returns (uint256 removalVotes)
    {
        return auctions[auctionId].designRemovalVotes[designId];
    }

    /**
     * @notice Get information about failed payouts for a gene
     * @param geneId The gene ID to check
     * @return payout The failed payout information
     */
    function getFailedPayout(uint256 geneId) external view returns (FailedPayout memory payout) {
        return failedPayouts[geneId];
    }

    /**
     * @notice Get gene instances for a design
     * @param auctionId The auction containing the design
     * @param designId The design ID to get genes for
     * @return genes Array of gene instances with placements
     */
    function getDesignGenes(uint256 auctionId, uint256 designId)
        external
        view
        validVoting(auctionId)
        returns (GeneInstance[9] memory genes)
    {
        return auctions[auctionId].designs[designId].genes;
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Add parent designs as automatic proposals
     */
    function _addParentDesigns(Auction storage auction) internal {
        // Add parent one's design
        uint256 parentOneDesignId = ++designCounter;
        AminalDesign storage parentOneDesign = auction.designs[parentOneDesignId];
        parentOneDesign.genes = auction.parentOneGenes;
        parentOneDesign.proposer = address(0); // System proposed
        parentOneDesign.votes = 0;
        parentOneDesign.removed = false;

        auction.proposedDesignIds.push(parentOneDesignId);

        // Add parent two's design if different
        bool isDifferent = false;
        for (uint256 i = 0; i < 9; i++) {
            if (auction.parentOneGenes[i].geneId != auction.parentTwoGenes[i].geneId) {
                isDifferent = true;
                break;
            }
        }

        if (isDifferent) {
            uint256 parentTwoDesignId = ++designCounter;
            AminalDesign storage parentTwoDesign = auction.designs[parentTwoDesignId];
            parentTwoDesign.genes = auction.parentTwoGenes;
            parentTwoDesign.proposer = address(0); // System proposed
            parentTwoDesign.votes = 0;
            parentTwoDesign.removed = false;

            auction.proposedDesignIds.push(parentTwoDesignId);
        }
    }

    /**
     * @notice Update auction winner and handle ties
     */
    function _updateAuctionWinner(Auction storage auction, uint256 designId) internal {
        uint256 currentVotes = auction.designs[designId].votes;
        uint256 cachedHighestVotes = auction.highestVotes;

        if (currentVotes > cachedHighestVotes) {
            // New highest votes - update winner and clear ties
            auction.highestVotes = currentVotes;
            auction.winningDesignId = designId;
            delete auction.tiedDesignIds;
            auction.tiedDesignIds.push(designId);
        } else if (currentVotes == cachedHighestVotes && currentVotes > 0) {
            // Tie situation - add to tied array
            auction.tiedDesignIds.push(designId);
            // Keep existing winner for now (tie resolution happens at settlement)
            if (auction.winningDesignId == 0) auction.winningDesignId = designId;
        }
    }

    /**
     * @notice Remove a design from an auction
     */
    function _removeDesignFromAuction(uint256 auctionId, uint256 designId) internal {
        Auction storage auction = auctions[auctionId];
        AminalDesign storage design = auction.designs[designId];

        design.removed = true;

        // Reset votes for this design
        design.votes = 0;
        auction.designRemovalVotes[designId] = 0;

        // If this was the winning design, recalculate winner
        if (auction.winningDesignId == designId) {
            auction.winningDesignId = 0;
            auction.highestVotes = 0;
            delete auction.tiedDesignIds;

            // Recalculate winner from remaining designs
            for (uint256 i = 0; i < auction.proposedDesignIds.length;) {
                uint256 currentDesignId = auction.proposedDesignIds[i];
                AminalDesign storage currentDesign = auction.designs[currentDesignId];

                if (!currentDesign.removed && currentDesign.votes > auction.highestVotes) {
                    auction.highestVotes = currentDesign.votes;
                    auction.winningDesignId = currentDesignId;
                    delete auction.tiedDesignIds;
                    auction.tiedDesignIds.push(currentDesignId);
                } else if (
                    !currentDesign.removed && currentDesign.votes == auction.highestVotes && currentDesign.votes > 0
                ) {
                    auction.tiedDesignIds.push(currentDesignId);
                }
                unchecked {
                    ++i;
                }
            }
        }

        emit DesignRemoved(auctionId, designId);
    }

    /**
     * @notice Select the winning design for an auction
     * @dev Handles ties using deterministic randomness based on auction ID
     * @param auction The auction to select winner from
     * @return winningDesignId The ID of the winning design, or 0 if no votes were cast
     */
    function _selectWinningDesign(Auction storage auction) internal view returns (uint256 winningDesignId) {
        // Check if there were any votes cast (tiedDesignIds is populated during voting)
        if (auction.tiedDesignIds.length > 0) {
            if (auction.tiedDesignIds.length > 1) {
                // Multiple designs tied - use randomness to break the tie
                // Using auction-specific data as seed to ensure unique randomness per auction
                uint256 randomIndex = _generateRandomness(
                    uint256(keccak256(abi.encode(auction.aminalOne, auction.aminalTwo))), auction.tiedDesignIds.length
                );
                winningDesignId = auction.tiedDesignIds[randomIndex];
            } else {
                // Single clear winner
                winningDesignId = auction.tiedDesignIds[0];
            }
        }
        // Implicitly returns 0 if no votes were cast (default value)
    }

    /**
     * @notice Select random genes from parents when no votes are cast
     * @dev Each gene slot is randomly inherited from either parent (like genetic inheritance)
     */
    function _selectRandomParentDesign(Auction storage auction) internal view returns (GeneInstance[9] memory) {
        GeneInstance[9] memory childGenes;

        // For each gene slot, randomly choose from parent one or parent two
        for (uint256 i = 0; i < 9; i++) {
            uint256 random = _generateRandomness(i, 2); // Use slot index as seed for variety
            if (random == 0) {
                childGenes[i] = auction.parentOneGenes[i];
            } else {
                childGenes[i] = auction.parentTwoGenes[i];
            }
        }

        return childGenes;
    }

    /**
     * @notice Capture parent genes for inheritance fallback
     */
    function _captureParentTraits(Auction storage auction, uint256 aminalOne, uint256 aminalTwo) internal {
        address aminalOneAddress = aminalFactory.getAminalByIndex(aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(aminalTwo);

        GeneInstance[9] memory parentOneGenes = IAminal(aminalOneAddress).getGenes();
        GeneInstance[9] memory parentTwoGenes = IAminal(aminalTwoAddress).getGenes();

        // Store parent genes
        auction.parentOneGenes = parentOneGenes;
        auction.parentTwoGenes = parentTwoGenes;
    }

    /**
     * @notice Calculate a user's voting power based on love given to parent Aminals
     */
    function _calculateVotingPower(Auction storage auction, address user) internal view returns (uint256) {
        address aminalOneAddress = aminalFactory.getAminalByIndex(auction.aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(auction.aminalTwo);

        uint256 loveToAminalOne = IAminal(aminalOneAddress).getLoveByUser(user);
        uint256 loveToAminalTwo = IAminal(aminalTwoAddress).getLoveByUser(user);

        return loveToAminalOne + loveToAminalTwo;
    }

    /**
     * @notice Generate pseudo-random number for tie-breaking
     * @dev Uses block.prevrandao (post-merge randomness) combined with auction-specific data
     *      This provides good randomness for non-critical decisions like tie-breaking
     *
     * ⚠️ SECURITY NOTICE - Manipulatable Randomness:
     * - Block proposers CAN manipulate prevrandao and timestamp values
     * - In high-value auctions, this creates economic incentive for manipulation
     * - Gene creators receiving payouts could be influenced by proposer bias
     * - Acceptable for community voting ties but NOT for high-stakes financial outcomes
     *
     * Production recommendations for high-value breeding:
     * - Integrate Chainlink VRF for verifiable randomness
     * - Or implement commit-reveal scheme
     * - Or use time-weighted selection to reduce manipulation window
     *
     * @param seed Additional entropy (e.g., auctionId or specific use case)
     * @param max Upper bound (exclusive) for the random number
     * @return Random number in range [0, max)
     */
    function _generateRandomness(uint256 seed, uint256 max) internal view returns (uint256) {
        if (max == 0) return 0;

        // Use auction-specific data to prevent manipulation across auctions
        uint256 auctionId = auctionCounter; // Current auction context

        // Combine multiple sources of entropy:
        // - block.prevrandao: Post-merge beacon randomness (harder to manipulate than difficulty)
        // - block.timestamp: Adds time-based entropy
        // - auctionId: Makes randomness unique per auction
        // - seed: Additional entropy for different randomness needs within same block
        // - msg.sender: Who triggered the settlement (adds sender-specific entropy)
        uint256 randomValue = uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp,
                    auctionId,
                    seed,
                    msg.sender,
                    blockhash(block.number - 1) // Previous block hash for additional entropy
                )
            )
        );

        return randomValue % max;
    }

    /**
     * @notice Transfer treasury to gene creator with pre-calculated amounts
     */
    function _payoutGeneCreator(
        uint256 auctionId,
        uint256 selectedGeneId,
        uint256 amountFromOne,
        uint256 amountFromTwo,
        address aminalOneAddress,
        address aminalTwoAddress
    ) internal returns (uint256 totalTransferred) {
        if (amountFromOne > 0 || amountFromTwo > 0) {
            // Get current owner of the gene NFT
            address geneOwner = genes.ownerOf(selectedGeneId);

            // Transfer treasury from parents to gene owner
            bool successOne = IAminal(aminalOneAddress).payout(amountFromOne, geneOwner);
            bool successTwo = IAminal(aminalTwoAddress).payout(amountFromTwo, geneOwner);

            if (successOne) totalTransferred += amountFromOne;
            if (successTwo) totalTransferred += amountFromTwo;

            // Store failed payouts for later claiming
            if (!successOne || !successTwo) {
                FailedPayout storage failed = failedPayouts[selectedGeneId];
                if (!successOne) {
                    failed.amountFromParentOne += amountFromOne;
                    failed.parentOneAddress = aminalOneAddress;
                    emit PayoutFailed(auctionId, selectedGeneId, geneOwner, amountFromOne);
                }
                if (!successTwo) {
                    failed.amountFromParentTwo += amountFromTwo;
                    failed.parentTwoAddress = aminalTwoAddress;
                    emit PayoutFailed(auctionId, selectedGeneId, geneOwner, amountFromTwo);
                }
                failed.auctionId = auctionId;
                failed.claimed = false;
            }

            // Emit payout event if any transfers succeeded
            if (successOne || successTwo) {
                emit GeneCreatorPayout(auctionId, selectedGeneId, geneOwner, totalTransferred);
            }
        }

        return totalTransferred;
    }

    /**
     * @notice Allows gene owners to claim failed payouts
     * @param geneId The gene ID for which to claim failed payouts
     * @dev Only the current owner of the gene NFT can claim failed payouts
     */
    function claimFailedPayout(uint256 geneId) external nonReentrant {
        FailedPayout storage failed = failedPayouts[geneId];

        // Verify there's a failed payout to claim
        require(failed.amountFromParentOne > 0 || failed.amountFromParentTwo > 0, "No failed payout to claim");
        require(!failed.claimed, "Payout already claimed");

        // Verify caller is the current gene owner
        address geneOwner = genes.ownerOf(geneId);
        require(msg.sender == geneOwner, "Only gene owner can claim");

        uint256 totalClaimed = 0;

        // Attempt to claim from parent one if there's a failed payout
        if (failed.amountFromParentOne > 0) {
            bool successOne = IAminal(failed.parentOneAddress).payout(failed.amountFromParentOne, geneOwner);
            if (successOne) {
                totalClaimed += failed.amountFromParentOne;
                failed.amountFromParentOne = 0;
            }
        }

        // Attempt to claim from parent two if there's a failed payout
        if (failed.amountFromParentTwo > 0) {
            bool successTwo = IAminal(failed.parentTwoAddress).payout(failed.amountFromParentTwo, geneOwner);
            if (successTwo) {
                totalClaimed += failed.amountFromParentTwo;
                failed.amountFromParentTwo = 0;
            }
        }

        // Mark as claimed if all amounts were successfully transferred
        if (failed.amountFromParentOne == 0 && failed.amountFromParentTwo == 0) failed.claimed = true;

        // Require at least some amount was claimed
        require(totalClaimed > 0, "Payout still failing - recipient cannot receive ETH");

        emit FailedPayoutClaimed(geneId, geneOwner, totalClaimed);
    }
}
