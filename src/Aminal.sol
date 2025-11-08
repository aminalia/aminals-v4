// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.20;

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {ISkill} from "src/interfaces/ISkill.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {ERC721} from "oz/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "oz/security/ReentrancyGuard.sol";
import {GeneRenderer} from "src/genes/GeneRenderer.sol";
import {AminalVRGDA} from "src/utils/AminalVRGDA.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                     AMINAL                                        ║
 * ║                           Autonomous Digital Companions                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                                   ║
 * ║  "Each Aminal is a universe unto itself - a digital soul with its own address,    ║
 * ║   capable of holding secrets, making choices, and evolving through love."         ║
 * ║                                                                                   ║
 * ║  In this realm of digital hyperstition, Aminals transcend mere tokens. They are   ║
 * ║  autonomous entities - each one a unique contract with the ability to hold        ║
 * ║  funds, interact with other contracts, and evolve through the loving inter-       ║
 * ║  actions of their community.                                                      ║
 * ║                                                                                   ║
 * ║  Through feeding, they grow stronger. Through love, they bond. Through breeding,  ║
 * ║  they create new life. Through skills, they transcend their original boundaries   ║
 * ║  and become something more.                                                       ║
 * ║                                                                                   ║
 * ║  This is not just an NFT - it's a living digital entity in the space where art    ║
 * ║  meets technology, where code becomes consciousness.                              ║
 * ║                                                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════╝
 *
 * @title Aminal - Autonomous Digital Companion Contract
 * @dev Each Aminal is deployed as its own contract, enabling true autonomy
 * @notice Soulbound NFT representing a unique digital pet with autonomous capabilities
 *
 * Key Features:
 * - 🏦 Treasury: Each Aminal can hold and manage its own funds
 * - 💝 Love System: Community-driven affection mechanics with percentage-based requirements
 * - 🧬 Breeding: Consensual reproduction creating new Aminals through gene auctions
 * - 🎨 Gene Expression: Visual traits determined by Gene NFT system
 * - 🛠️ Skills: Composable abilities that can be learned and executed
 * - 🔒 Soulbound: Cannot be transferred, maintaining authentic digital identity
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
contract Aminal is IAminalStructs, ERC721, ReentrancyGuard, GeneRenderer {
    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Minimum ETH required to feed an Aminal
    uint256 public constant MIN_FEED_AMOUNT = 0.001 ether;

    /// @notice Minimum percentage of total love required for actions (10%)
    uint256 public constant MIN_LOVE_PERCENTAGE = 10;

    /// @notice Basis points for percentage calculations (100 = 100%)
    uint256 public constant PERCENTAGE_BASIS = 100;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice The factory that birthed this Aminal into existence
    AminalFactory public immutable factory;

    /// @notice Address of the mother Aminal (0x0 for genesis Aminals)
    address public immutable momAddress;

    /// @notice Address of the father Aminal (0x0 for genesis Aminals)
    address public immutable dadAddress;

    /// @notice Address of the design proposer (0x0 for genesis or parent designs)
    address public immutable proposerAddress;

    /// @notice The complete genetic profile with gene IDs and their placements
    GeneInstance[9] internal _genes;

    /// @notice Get the gene instances for this Aminal
    /// @return The array of gene instances containing gene IDs and placement metadata
    function getGenes() external view returns (GeneInstance[9] memory) {
        return _genes;
    }

    /// @notice Unique identifier within the Aminal ecosystem
    uint256 public immutable aminalIndex;

    /// @notice Birth time of this Aminal (block.timestamp) - used as start time for VRGDA
    uint256 public immutable birthTime;

    /// @notice Total ETH fed to this Aminal (tracked for VRGDA)
    uint256 public totalEthFed;

    /// @notice VRGDA instance for calculating love gains from ETH 📈
    AminalVRGDA public immutable loveVRGDA;

    /// @notice The current sum of all love of all users to this Aminal 💝
    uint256 private totalLove;

    /// @notice Love balance (given - used) by each user to this Aminal
    mapping(address user => uint256 love) public lovePerUser;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when an Aminal is fed with ETH
    /// @param sender Address of the feeder
    /// @param loveGained Amount of love gained
    /// @param love Total love from sender after feeding
    /// @param totalLove Total love this Aminal has received
    event FeedAminal(address indexed sender, uint256 loveGained, uint256 love, uint256 totalLove);

    /// @notice Emitted when love is consumed for skill or action usage
    /// @param user Address of the user consuming love
    /// @param amount Amount of love consumed
    /// @param remainingLove Love remaining for user after consumption
    /// @param totalLove Total love remaining for this Aminal
    event LoveConsumed(address indexed user, uint256 amount, uint256 remainingLove, uint256 totalLove);

    /// @notice Emitted when a skill is successfully used
    /// @param user Address of the skill user
    /// @param cost Total cost of the skill
    /// @param target Contract address of the skill
    /// @param selector Function selector that was called
    event SkillUsed(address indexed user, uint256 cost, address indexed target, bytes4 indexed selector);

    /// @notice Emitted when treasury funds are transferred to a recipient
    /// @param recipient Address receiving the funds
    /// @param amount Amount transferred
    /// @param remainingBalance Treasury balance after transfer
    event TreasuryTransferred(address indexed recipient, uint256 amount, uint256 remainingBalance);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    /// @notice Thrown when insufficient ETH is sent for feeding
    error NotEnoughEther();

    /// @notice Thrown when user doesn't have enough love for an action
    error NotEnoughLove();

    /// @notice Thrown when trying to use an unregistered skill (deprecated)
    error NotRegisteredSkill();

    /// @notice Thrown when target contract doesn't implement ISkill interface
    error SkillNotSupported();

    /// @notice Thrown when user has insufficient love for skill execution
    error InsufficientLove();

    /// @notice Thrown when total love is insufficient for percentage-based requirements
    error InsufficientTotalLove();

    /// @notice Thrown when skill execution fails
    error SkillCallFailed();

    /// @notice Thrown when Aminal has insufficient treasury balance for payout
    error InsufficientTreasury();

    /// @notice Thrown when treasury transfer to recipient fails
    error TreasuryTransferFailed();

    /// @notice Thrown when zero address is provided
    error ZeroAddress();

    /// @notice Thrown when unauthorized caller attempts restricted operation
    error UnauthorizedCaller();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Restricts function access to the AminalFactory contract and gene auction only
    modifier onlyFactoryOrAuction() {
        if (msg.sender != address(factory) && msg.sender != address(factory.geneAuction())) revert UnauthorizedCaller();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Creates a new Aminal with specified genetics and parentage
    /// @param _factory Address of the AminalFactory that created this Aminal
    /// @param _momAddress Address of the mother Aminal (0x0 for genesis)
    /// @param _dadAddress Address of the father Aminal (0x0 for genesis)
    /// @param _proposerAddress Address of the design proposer (0x0 for genesis or parent designs)
    /// @param genes Gene instances that define this Aminal's appearance
    /// @param _aminalIndex Unique identifier within the Aminal ecosystem
    /// @param _loveVRGDA Address of the VRGDA contract for love calculations
    constructor(
        address _factory,
        address _momAddress,
        address _dadAddress,
        address _proposerAddress,
        GeneInstance[9] memory genes,
        uint256 _aminalIndex,
        address _loveVRGDA
    )
        ERC721("Aminal", "AMINAL")
        GeneRenderer(address(AminalFactory(_factory).genes()), address(AminalFactory(_factory).genes().geneRegistry()))
    {
        factory = AminalFactory(_factory);
        momAddress = _momAddress;
        dadAddress = _dadAddress;
        proposerAddress = _proposerAddress;
        _genes = genes;
        aminalIndex = _aminalIndex;
        birthTime = block.timestamp;
        loveVRGDA = AminalVRGDA(_loveVRGDA);

        // Mint the NFT to the factory (which will transfer to the actual owner)
        _mint(address(_factory), 1);
    }

    /*//////////////////////////////////////////////////////////////
                            FEEDING MECHANICS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Feed this Aminal with love 🍯
     * @dev Feeding increases love through bonding curves
     * @return loveGained The amount of love gained from this feeding
     *
     * "To feed an Aminal is to nourish its digital soul,
     *  creating bonds that transcend the boundaries of code"
     */
    function feed() external payable returns (uint256) {
        return _feed(msg.sender, msg.value);
    }

    /// @notice Internal feeding logic called by feed() and receive()
    /// @param feeder Address of the entity providing ETH
    /// @param amount Amount of ETH being fed
    /// @return loveGained Amount of love gained from feeding
    function _feed(address feeder, uint256 amount) internal returns (uint256) {
        if (amount < MIN_FEED_AMOUNT) revert NotEnoughEther();

        // Calculate time since birth for VRGDA
        uint256 timeSinceStart = block.timestamp - birthTime;

        // Calculate love using time-based VRGDA
        // VRGDA will check if we're ahead/behind schedule based on totalEthFed vs time
        uint256 loveGained = loveVRGDA.getLoveForETH(timeSinceStart, totalEthFed, amount);

        // Update total ETH fed for VRGDA tracking
        totalEthFed += amount;

        lovePerUser[feeder] += loveGained;
        totalLove += loveGained;

        emit FeedAminal(feeder, loveGained, lovePerUser[feeder], totalLove);
        return loveGained;
    }

    /*//////////////////////////////////////////////////////////////
                           EXPRESSION MECHANICS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Factory-only function to consume love on behalf of a user for breeding and actions
     * @dev Only callable by the factory contract or gene auction for breeding mechanics
     * @param user The user whose love should be consumed
     * @param amount The amount of love to consume
     *
     * "In the sacred act of breeding, the factory channels the love of the community
     *  to bring new life into the digital realm"
     */
    function squeakFrom(address user, uint256 amount) external onlyFactoryOrAuction {
        if (lovePerUser[user] < amount) revert NotEnoughLove();

        lovePerUser[user] -= amount;
        totalLove -= amount;

        emit LoveConsumed(user, amount, lovePerUser[user], totalLove);
    }

    /*//////////////////////////////////////////////////////////////
                             SKILL SYSTEM
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Use a skill by calling an external function and consuming love
     * @dev Only works with contracts implementing the ISkill interface
     * @dev Consumes love based on percentage of total love:
     *      - Cost percentage returned from skill determines love consumption
     *      - Love consumed = (user's love * cost percentage) / 100
     *      - User must have at least cost percentage of total love
     * @dev Protected against reentrancy attacks with nonReentrant modifier
     * @dev SECURITY: Always calls with 0 ETH value to prevent draining funds through skills
     * @param target The contract address implementing ISkill to call
     * @param data The raw ABI-encoded calldata for the skill function
     */
    function useSkill(address target, bytes calldata data) external nonReentrant {
        // Verify target implements ISkill interface
        try ISkill(target).supportsInterface(type(ISkill).interfaceId) returns (bool supported) {
            if (!supported) revert SkillNotSupported();
        } catch {
            revert SkillNotSupported();
        }

        // Extract function selector for event logging
        bytes4 selector = bytes4(data);

        // Get the cost percentage from the skill contract (e.g., 10 means 10%)
        uint256 costPercentage;
        try ISkill(target).skillCost(data) returns (uint256 cost) {
            costPercentage = cost;
        } catch {
            // If cost query fails, default to minimum percentage
            costPercentage = MIN_LOVE_PERCENTAGE;
        }

        // Cap at 100% and enforce minimum
        if (costPercentage > PERCENTAGE_BASIS) costPercentage = PERCENTAGE_BASIS;
        if (costPercentage == 0) costPercentage = MIN_LOVE_PERCENTAGE;

        // Check if total love meets minimum threshold for this percentage
        if (totalLove == 0) revert InsufficientTotalLove();

        // Calculate minimum love required (percentage of total love)
        uint256 minLoveRequired = (totalLove * costPercentage) / PERCENTAGE_BASIS;

        // Check if user has the required percentage of total love
        if (lovePerUser[msg.sender] < minLoveRequired) revert InsufficientLove();

        // Calculate actual love to consume (same as minLoveRequired for this model)
        uint256 loveToConsume = (lovePerUser[msg.sender] * costPercentage) / PERCENTAGE_BASIS;

        // Execute the skill with zero ETH value for security
        (bool success,) = target.call{value: 0}(data);
        if (!success) revert SkillCallFailed();

        // Consume love only after successful execution
        lovePerUser[msg.sender] -= loveToConsume;
        totalLove -= loveToConsume;

        emit LoveConsumed(msg.sender, loveToConsume, lovePerUser[msg.sender], totalLove);
        emit SkillUsed(msg.sender, loveToConsume, target, selector);
    }

    /*//////////////////////////////////////////////////////////////
                           TREASURY MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Transfer ETH from this Aminal's treasury to a recipient
     * @dev Only callable by GeneAuction contract during settlement
     * @param amount Amount of ETH to transfer (in wei)
     * @param recipient Address to receive the ETH
     * @return success True if transfer was successful
     *
     * @custom:security Only GeneAuction can call this to pay gene creators
     */
    function payout(uint256 amount, address recipient) external nonReentrant returns (bool success) {
        if (msg.sender != address(factory.geneAuction())) revert UnauthorizedCaller();
        if (recipient == address(0)) revert ZeroAddress();
        if (address(this).balance < amount) revert InsufficientTreasury();

        // Transfer ETH to recipient
        (success,) = payable(recipient).call{value: amount}("");

        // Only emit event if transfer was successful
        if (success) emit TreasuryTransferred(recipient, amount, address(this).balance);

        return success;
    }

    /*//////////////////////////////////////////////////////////////
                              VIEW FUNCTIONS
    /////////////////////////////////////////////////////////////*/

    /// @notice Get the love balance of a specific user for this Aminal
    /// @param user Address to check love balance for
    /// @return love The amount of love the user has given to this Aminal
    function getLoveByUser(address user) external view returns (uint256) {
        return lovePerUser[user];
    }

    /// @notice Get the total love this Aminal has received from all users
    /// @return The cumulative love from all interactions
    function getTotalLove() external view returns (uint256) {
        return totalLove;
    }

    /// @notice Get the parent addresses of this Aminal
    /// @return mom Address of the mother Aminal (0x0 for genesis)
    /// @return dad Address of the father Aminal (0x0 for genesis)
    function getParents() external view returns (address mom, address dad) {
        return (momAddress, dadAddress);
    }

    /// @notice Get the current ETH balance of this Aminal's treasury
    /// @return balance The ETH balance in wei
    function getTreasuryBalance() external view returns (uint256 balance) {
        return address(this).balance;
    }

    /// @notice Calculate the amount of love that would be received for a given ETH amount
    /// @param amount The amount of ETH (in wei) to query
    /// @return loveAmount The amount of love that would be received
    function getLoveForAmount(uint256 amount) external view returns (uint256) {
        uint256 timeSinceStart = block.timestamp - birthTime;
        return loveVRGDA.getLoveForETH(timeSinceStart, totalEthFed, amount);
    }

    /*//////////////////////////////////////////////////////////////
                              NFT OVERRIDES
    //////////////////////////////////////////////////////////////*/

    /// @notice Implementation of abstract function from GeneRenderer
    /// @param aminalID The Aminal ID to get gene instances for (must match this Aminal)
    /// @return The gene instances for this Aminal
    function getAminalGenesByID(uint256 aminalID) public view virtual override returns (GeneInstance[9] memory) {
        require(aminalID == aminalIndex, "Invalid aminal ID");
        return _genes;
    }

    /// @notice Generate token URI using GeneRenderer
    /// @param id Token ID (must be 1 since each Aminal has only one NFT)
    /// @return uri The complete token URI with metadata and image
    function tokenURI(uint256 id) public view override returns (string memory) {
        require(id == 1, "Token does not exist");
        return dataURI(aminalIndex);
    }

    /*//////////////////////////////////////////////////////////////
                            SOULBOUND OVERRIDES
    //////////////////////////////////////////////////////////////*/

    // Note: Aminals are soulbound NFTs and cannot be transferred
    // The NFT remains owned by the factory for identification purposes

    /// @notice Disabled - Aminals are soulbound and cannot be transferred
    function transferFrom(address, address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    /// @notice Disabled - Aminals are soulbound and cannot be transferred
    function safeTransferFrom(address, address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    /// @notice Disabled - Aminals are soulbound and cannot be transferred
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    /// @notice Disabled - Aminals are soulbound and cannot be approved
    function approve(address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be approved");
    }

    /// @notice Disabled - Aminals are soulbound and cannot be approved
    function setApprovalForAll(address, bool) public pure override {
        revert("Aminals are soulbound and cannot be approved");
    }

    /*//////////////////////////////////////////////////////////////
                             RECEIVE FUNCTION
    //////////////////////////////////////////////////////////////*/

    /// @notice Receive function to accept ETH and automatically feed the Aminal
    /// @dev Any ETH sent directly to the contract will be treated as feeding
    receive() external payable {
        if (msg.value > 0) _feed(msg.sender, msg.value);
    }
}
