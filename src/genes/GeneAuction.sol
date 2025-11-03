// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
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

    /*//////////////////////////////////////////////////////////////
                               STRUCTURES
    //////////////////////////////////////////////////////////////*/

    /// @notice Complete Aminal design proposal (all 8 traits with placement info)
    struct AminalDesign {
        uint256 backId; // Gene ID for background trait
        uint256 armId; // Gene ID for arm trait
        uint256 tailId; // Gene ID for tail trait
        uint256 earsId; // Gene ID for ears trait
        uint256 bodyId; // Gene ID for body trait
        uint256 faceId; // Gene ID for face trait
        uint256 mouthId; // Gene ID for mouth trait
        uint256 miscId; // Gene ID for misc trait
        address proposer; // Address that proposed this design
        uint256 votes; // Total voting power for this design
        bool removed; // Whether this design has been removed
        GeneMetadata[8] placements; // Placement metadata for each trait
    }

    /// @notice Core auction data structure
    struct Auction {
        uint256 aminalOne; // Index of first parent Aminal
        uint256 aminalTwo; // Index of second parent Aminal
        uint256 totalLove; // Total love used for voting power calculation
        uint64 startTime; // Auction start timestamp - packed to save gas
        uint64 endTime; // Auction end timestamp - packed to save gas
        bool settled; // Whether auction has been settled - packed with timestamps
        uint256[8] parentOneTraits; // Parent 1 traits by category
        uint256[8] parentTwoTraits; // Parent 2 traits by category
        uint256[] proposedDesignIds; // Array of proposed design IDs
        mapping(uint256 => AminalDesign) designs; // designId => AminalDesign
        mapping(address => uint256) userVotedDesign; // user => designId they voted for
        mapping(address => uint256) userVoteWeight; // user => vote weight they cast
        mapping(address => bool) userHasVoted; // user => whether they have voted
        mapping(uint256 => uint256) designRemovalVotes; // designId => removal vote weight
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
    /// @param winningGeneIds Array of winning gene IDs by category
    /// @param totalTreasuryTransferred Total ETH paid to gene creators
    event VotingSettled(
        uint256 indexed auctionId, uint256 winningDesignId, uint256[8] winningGeneIds, uint256 totalTreasuryTransferred
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
    /// @param geneIds Array of 8 gene IDs comprising the design
    /// @param placements Array of 8 placement metadata for the genes
    event DesignProposed(
        uint256 indexed auctionId,
        uint256 indexed designId,
        address indexed proposer,
        uint256[8] geneIds,
        GeneMetadata[8] placements
    );

    /// @notice Emitted when someone votes to remove a design from consideration
    /// @param auctionId The auction containing the design
    /// @param designId The design being voted for removal
    /// @param voter Address voting for removal
    /// @param voteWeight Weight of the removal vote
    event DesignRemovalVote(uint256 indexed auctionId, uint256 indexed designId, address voter, uint256 voteWeight);

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

    /// @notice Thrown when providing an invalid trait category
    error InvalidCategory();

    /// @notice Thrown when user lacks sufficient love for an action
    error InsufficientLove();

    /// @notice Thrown when a design has already been removed
    error DesignAlreadyRemoved();

    /// @notice Thrown when user has no voting power in an auction
    error NoVotingPower();

    /// @notice Thrown when referencing an invalid or non-existent design
    error InvalidDesign();

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
    function settleAuction(uint256 auctionId) external validVoting(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp < uint256(auction.endTime)) revert VotingNotEnded();
        if (auction.settled) revert VotingAlreadySettled();

        auction.settled = true;

        uint256[8] memory winningGeneIds;
        uint256 totalTreasuryTransferred = 0;

        // Select winning design
        uint256 winningDesignId = _selectWinningDesign(auction);

        // Get the winning design's traits
        if (winningDesignId != 0) {
            AminalDesign storage winningDesign = auction.designs[winningDesignId];
            winningGeneIds[0] = winningDesign.backId;
            winningGeneIds[1] = winningDesign.armId;
            winningGeneIds[2] = winningDesign.tailId;
            winningGeneIds[3] = winningDesign.earsId;
            winningGeneIds[4] = winningDesign.bodyId;
            winningGeneIds[5] = winningDesign.faceId;
            winningGeneIds[6] = winningDesign.mouthId;
            winningGeneIds[7] = winningDesign.miscId;
        } else {
            // Fallback to random parent design if no votes
            winningGeneIds = _selectRandomParentDesign(auction);
        }

        // Process treasury payouts to gene creators
        address aminalOneAddress = aminalFactory.getAminalByIndex(auction.aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(auction.aminalTwo);

        uint256 aminalOneTreasury = IAminal(aminalOneAddress).getTreasuryBalance();
        uint256 aminalTwoTreasury = IAminal(aminalTwoAddress).getTreasuryBalance();
        uint256 treasuryFromAminalOne = (aminalOneTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100;
        uint256 treasuryFromAminalTwo = (aminalTwoTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100;

        // Pre-calculate treasury per gene to avoid repeated division
        uint256 treasuryPerGene = (treasuryFromAminalOne + treasuryFromAminalTwo) / 8;
        uint256 treasuryPerGeneHalf = treasuryPerGene / 2;

        // Transfer treasury to each gene creator
        for (uint256 i = 0; i < 8;) {
            uint256 selectedGeneId = winningGeneIds[i];

            if (selectedGeneId != 0 && geneRegistry.isValidGene(selectedGeneId)) {
                totalTreasuryTransferred += _payoutGeneCreator(
                    auctionId, selectedGeneId, treasuryPerGeneHalf, aminalOneAddress, aminalTwoAddress
                );
            }
            unchecked {
                ++i;
            }
        }

        emit VotingSettled(auctionId, winningDesignId, winningGeneIds, totalTreasuryTransferred);

        // Spawn the child Aminal with winning traits
        aminalFactory.spawnAminal(aminalOneAddress, aminalTwoAddress, auctionId, winningGeneIds);
    }

    /**
     * @notice Propose a complete Aminal design (all 8 traits) for voting
     * @dev Anyone can propose designs. Each trait must be valid for its category.
     * @param auctionId The auction to propose the design for
     * @param geneIds Array of 8 gene IDs (one per trait category)
     * @param placements Array of 8 placement metadata for positioning each gene
     */
    function proposeDesign(uint256 auctionId, uint256[8] calldata geneIds, GeneMetadata[8] calldata placements)
        external
        validVoting(auctionId)
    {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= uint256(auction.endTime)) revert VotingNotActive();
        if (auction.settled) revert VotingAlreadySettled();

        // Validate all genes upfront
        for (uint256 i = 0; i < 8;) {
            if (geneIds[i] != 0) {
                // Verify gene exists and is from the registry
                if (!geneRegistry.isValidGene(geneIds[i])) revert InvalidGene();

                // Verify gene is in the correct category
                VisualsCat geneCategory = geneRegistry.getGeneCategory(geneIds[i]);
                if (uint256(geneCategory) != i) revert InvalidCategory();
            }
            unchecked {
                ++i;
            }
        }

        // Consume love from user and energy via squeakFrom
        IAminal(aminalFactory.getAminalByIndex(auction.aminalOne)).squeakFrom(msg.sender, PROPOSE_DESIGN_COST);
        IAminal(aminalFactory.getAminalByIndex(auction.aminalTwo)).squeakFrom(msg.sender, PROPOSE_DESIGN_COST);

        // Create the new design
        uint256 designId = ++designCounter;
        AminalDesign storage newDesign = auction.designs[designId];
        newDesign.backId = geneIds[0];
        newDesign.armId = geneIds[1];
        newDesign.tailId = geneIds[2];
        newDesign.earsId = geneIds[3];
        newDesign.bodyId = geneIds[4];
        newDesign.faceId = geneIds[5];
        newDesign.mouthId = geneIds[6];
        newDesign.miscId = geneIds[7];
        newDesign.proposer = msg.sender;
        newDesign.votes = 0;
        newDesign.removed = false;

        // Store placement metadata for each trait
        for (uint256 i = 0; i < 8;) {
            newDesign.placements[i] = placements[i];
            unchecked {
                ++i;
            }
        }

        auction.proposedDesignIds.push(designId);

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
        if (voteWeight > userVotingPower) revert InsufficientLove();

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
     * @notice Get parent traits for an auction
     */
    function getParentTraits(uint256 auctionId)
        external
        view
        validVoting(auctionId)
        returns (uint256[8] memory parentOneTraits, uint256[8] memory parentTwoTraits)
    {
        Auction storage auction = auctions[auctionId];
        return (auction.parentOneTraits, auction.parentTwoTraits);
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
     * @notice Get placement metadata for a design's traits
     * @param auctionId The auction containing the design
     * @param designId The design ID to get placements for
     * @return placements Array of 8 placement metadata for the design
     */
    function getDesignPlacements(uint256 auctionId, uint256 designId)
        external
        view
        validVoting(auctionId)
        returns (GeneMetadata[8] memory placements)
    {
        return auctions[auctionId].designs[designId].placements;
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Add parent designs as automatic proposals
     */
    function _addParentDesigns(Auction storage auction) internal {
        // Default placement: centered, 100% scale, no rotation
        GeneMetadata memory defaultPlacement = GeneMetadata({offsetX: 0, offsetY: 0, scale: 100, rotation: 0});

        // Add parent one's design
        uint256 parentOneDesignId = ++designCounter;
        AminalDesign storage parentOneDesign = auction.designs[parentOneDesignId];
        parentOneDesign.backId = auction.parentOneTraits[0];
        parentOneDesign.armId = auction.parentOneTraits[1];
        parentOneDesign.tailId = auction.parentOneTraits[2];
        parentOneDesign.earsId = auction.parentOneTraits[3];
        parentOneDesign.bodyId = auction.parentOneTraits[4];
        parentOneDesign.faceId = auction.parentOneTraits[5];
        parentOneDesign.mouthId = auction.parentOneTraits[6];
        parentOneDesign.miscId = auction.parentOneTraits[7];
        parentOneDesign.proposer = address(0); // System proposed
        parentOneDesign.votes = 0;
        parentOneDesign.removed = false;

        // Set default placement for all traits
        for (uint256 i = 0; i < 8;) {
            parentOneDesign.placements[i] = defaultPlacement;
            unchecked {
                ++i;
            }
        }

        auction.proposedDesignIds.push(parentOneDesignId);

        // Add parent two's design if different
        bool isDifferent = false;
        for (uint256 i = 0; i < 8; i++) {
            if (auction.parentOneTraits[i] != auction.parentTwoTraits[i]) {
                isDifferent = true;
                break;
            }
        }

        if (isDifferent) {
            uint256 parentTwoDesignId = ++designCounter;
            AminalDesign storage parentTwoDesign = auction.designs[parentTwoDesignId];
            parentTwoDesign.backId = auction.parentTwoTraits[0];
            parentTwoDesign.armId = auction.parentTwoTraits[1];
            parentTwoDesign.tailId = auction.parentTwoTraits[2];
            parentTwoDesign.earsId = auction.parentTwoTraits[3];
            parentTwoDesign.bodyId = auction.parentTwoTraits[4];
            parentTwoDesign.faceId = auction.parentTwoTraits[5];
            parentTwoDesign.mouthId = auction.parentTwoTraits[6];
            parentTwoDesign.miscId = auction.parentTwoTraits[7];
            parentTwoDesign.proposer = address(0); // System proposed
            parentTwoDesign.votes = 0;
            parentTwoDesign.removed = false;

            // Set default placement for all traits
            for (uint256 i = 0; i < 8;) {
                parentTwoDesign.placements[i] = defaultPlacement;
                unchecked {
                    ++i;
                }
            }

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
     * @notice Select a random parent design when no votes are cast
     */
    function _selectRandomParentDesign(Auction storage auction) internal view returns (uint256[8] memory) {
        // Randomly choose between parent designs
        uint256 random = _generateRandomness(1, 2);
        if (random == 0) return auction.parentOneTraits;
        else return auction.parentTwoTraits;
    }

    /**
     * @notice Capture parent traits for inheritance fallback
     */
    function _captureParentTraits(Auction storage auction, uint256 aminalOne, uint256 aminalTwo) internal {
        address aminalOneAddress = aminalFactory.getAminalByIndex(aminalOne);
        address aminalTwoAddress = aminalFactory.getAminalByIndex(aminalTwo);

        Visuals memory parentOneVisuals = IAminal(aminalOneAddress).getVisuals();
        Visuals memory parentTwoVisuals = IAminal(aminalTwoAddress).getVisuals();

        // Store parent traits in order of VisualsCat enum
        auction.parentOneTraits[0] = parentOneVisuals.backId;
        auction.parentOneTraits[1] = parentOneVisuals.armId;
        auction.parentOneTraits[2] = parentOneVisuals.tailId;
        auction.parentOneTraits[3] = parentOneVisuals.earsId;
        auction.parentOneTraits[4] = parentOneVisuals.bodyId;
        auction.parentOneTraits[5] = parentOneVisuals.faceId;
        auction.parentOneTraits[6] = parentOneVisuals.mouthId;
        auction.parentOneTraits[7] = parentOneVisuals.miscId;

        auction.parentTwoTraits[0] = parentTwoVisuals.backId;
        auction.parentTwoTraits[1] = parentTwoVisuals.armId;
        auction.parentTwoTraits[2] = parentTwoVisuals.tailId;
        auction.parentTwoTraits[3] = parentTwoVisuals.earsId;
        auction.parentTwoTraits[4] = parentTwoVisuals.bodyId;
        auction.parentTwoTraits[5] = parentTwoVisuals.faceId;
        auction.parentTwoTraits[6] = parentTwoVisuals.mouthId;
        auction.parentTwoTraits[7] = parentTwoVisuals.miscId;
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
     *      For high-value randomness, consider using Chainlink VRF
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
        uint256 treasuryPerGeneHalf,
        address aminalOneAddress,
        address aminalTwoAddress
    ) internal returns (uint256 totalTransferred) {
        if (treasuryPerGeneHalf > 0) {
            // Get current owner of the gene NFT
            address geneOwner = genes.ownerOf(selectedGeneId);

            // Transfer treasury from parents to gene owner (split equally)
            bool successOne = IAminal(aminalOneAddress).payout(treasuryPerGeneHalf, geneOwner);
            bool successTwo = IAminal(aminalTwoAddress).payout(treasuryPerGeneHalf, geneOwner);

            if (successOne) totalTransferred += treasuryPerGeneHalf;
            if (successTwo) totalTransferred += treasuryPerGeneHalf;

            // Store failed payouts for later claiming
            if (!successOne || !successTwo) {
                FailedPayout storage failed = failedPayouts[selectedGeneId];
                if (!successOne) {
                    failed.amountFromParentOne += treasuryPerGeneHalf;
                    failed.parentOneAddress = aminalOneAddress;
                    emit PayoutFailed(auctionId, selectedGeneId, geneOwner, treasuryPerGeneHalf);
                }
                if (!successTwo) {
                    failed.amountFromParentTwo += treasuryPerGeneHalf;
                    failed.parentTwoAddress = aminalTwoAddress;
                    emit PayoutFailed(auctionId, selectedGeneId, geneOwner, treasuryPerGeneHalf);
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
