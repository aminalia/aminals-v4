// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {IAminalStructs} from "src/IAminalStructs.sol";
import {ISkill} from "src/skills/ISkills.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {ERC721} from "oz/token/ERC721/ERC721.sol";
import {GeneBasedDescriptor} from "src/genes/GeneBasedDescriptor.sol";
import {AminalVRGDA} from "src/utils/AminalVRGDA.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                 🎭   AMINAL   🎭                                  ║
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
 * - 💝 Love System: Community-driven affection mechanics with bonding curves
 * - ⚡ Energy System: Resource management for skills and breeding
 * - 🧬 Breeding: Consensual reproduction creating new Aminals through gene auctions
 * - 🎨 Gene Expression: Visual traits determined by Gene NFT system
 * - 🛠️ Skills: Composable abilities that can be learned and executed
 * - 🔒 Soulbound: Cannot be transferred, maintaining authentic digital identity
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
contract Aminal is IAminalStructs, ERC721, GeneBasedDescriptor {
    /// @notice The factory that birthed this Aminal into existence
    AminalFactory public immutable factory;

    /// @notice Address of the mother Aminal (0x0 for genesis Aminals)
    address public immutable momAddress;

    /// @notice Address of the father Aminal (0x0 for genesis Aminals)
    address public immutable dadAddress;

    /// @notice The visual DNA that defines this Aminal's appearance
    Visuals public visuals;

    /// @notice Unique identifier within the Aminal ecosystem
    uint256 public immutable aminalIndex;

    /// @notice VRGDA instance for calculating love based on energy levels 📈
    AminalVRGDA public immutable loveVRGDA;

    /// @notice The current sum of all love of all users to this Aminal 💝
    uint256 private totalLove;

    /// @notice Current energy level - the life force for actions ⚡
    uint256 private energy;

    /// @notice Whether this Aminal is currently in breeding mode 🧬
    bool public breeding;

    /// @notice Addresses this Aminal has consented to breed with
    mapping(address => bool) public breedableWith;

    /// @notice Love saldo (given - used) by each user to this Aminal
    mapping(address user => uint256 love) public lovePerUser;

    /// @notice Skill-specific storage for each Aminal's learned abilities
    mapping(address skill => mapping(string key => bytes32 value)) public skillProperties;

    // TODO indexes
    event FeedAminal(
        address sender, uint256 loveGained, uint256 love, uint256 totalLove, uint256 energyGained, uint256 energy
    );
    event Squeak(address sender, uint256 amount, uint256 love, uint256 totalLove, uint256 energy);
    event SkillCall(address skillAddress, bytes data, uint256 squeakCost);
    event BreedableSet(address partner, bool status);

    error NotEnoughEther();
    error NotEnoughLove();
    error NotEnoughEnergy();
    error NotRegisteredSkill();

    modifier onlyFactory() {
        require(msg.sender == address(factory), "Only factory can call this");
        _;
    }

    constructor(
        address _factory,
        address _momAddress,
        address _dadAddress,
        Visuals memory _visuals,
        uint256 _aminalIndex,
        address _loveVRGDA
    )
        ERC721("Aminal", "AMINAL")
        GeneBasedDescriptor(
            address(AminalFactory(_factory).genesNFT()),
            address(0) // TODO GeneNFTFactory to be added when implemented
        )
    {
        factory = AminalFactory(_factory);
        momAddress = _momAddress;
        dadAddress = _dadAddress;
        visuals = _visuals;
        aminalIndex = _aminalIndex;
        loveVRGDA = AminalVRGDA(_loveVRGDA);

        // Initial energy for new Aminal (equivalent to 0.005 ETH worth of energy)
        energy = 50;

        // Mint the NFT to the factory (which will transfer to the actual owner)
        _mint(address(_factory), 1);
    }

    /**
     * @notice Feed this Aminal with love and energy 🍯
     * @dev Feeding increases both love and energy through bonding curves
     * @return energyGained The amount of energy gained from this feeding
     *
     * "To feed an Aminal is to nourish its digital soul,
     *  creating bonds that transcend the boundaries of code"
     */
    function feed() external payable returns (uint256) {
        return _feed(msg.sender, msg.value);
    }

    function _feed(address feeder, uint256 amount) internal returns (uint256) {
        // NOTE moved here to catch also on receive()
        if (amount < 0.001 ether) revert NotEnoughEther();

        // Calculate love using VRGDA based on current energy level
        uint256 loveGained = loveVRGDA.getLoveForETH(energy, amount);
        _addLove(feeder, loveGained);
        // Calculate energy increase using fixed rate (10,000 per ETH)
        uint256 energyGained = (amount * 10_000) / 1 ether;

        // Cap energy at maximum to prevent overflow
        uint256 maxEnergy = 1_000_000; // 100 ETH worth of energy max (100 * 10,000)
        if (energy + energyGained > maxEnergy) energyGained = maxEnergy - energy;
        energy += energyGained;

        emit FeedAminal(feeder, loveGained, lovePerUser[feeder], totalLove, energyGained, energy);
        return energyGained;
    }

    /**
     * @notice Express yourself through this Aminal's voice 🗣️
     * @dev Uses love and energy to create a squeak - a digital cry of expression
     * @param amount The intensity of the squeak (love and energy required)
     *
     * "When an Aminal squeaks, it speaks with the voice of its community,
     *  channeling love into sound, energy into expression"
     */
    function squeak(uint256 amount) external payable {
        // Users need sufficient love to squeak
        if (lovePerUser[msg.sender] < amount) revert NotEnoughLove();
        if (energy < amount) revert NotEnoughEnergy();

        energy -= amount;
        _subtractLove(msg.sender, amount);

        emit Squeak(msg.sender, amount, lovePerUser[msg.sender], totalLove, energy);
    }

    /**
     * @notice Execute a skill through this Aminal's abilities 🛠️
     * @dev Calls external skill contracts that can modify this Aminal's state
     * @param skillAddress The address of the skill contract to execute
     * @param data Encoded parameters for the skill execution
     *
     * "Skills are the magic that transforms static digital beings
     *  into dynamic entities capable of growth and evolution"
     */
    function callSkill(address skillAddress, bytes calldata data) external payable {
        // Skills are globally accessible - no registration check needed

        uint256 squeakCost = ISkill(skillAddress).useSkill{value: msg.value}(msg.sender, address(this), data);

        if (squeakCost > 0) if (energy >= squeakCost) energy -= squeakCost;

        emit SkillCall(skillAddress, data, squeakCost);
    }

    /**
     * @notice Set breeding consent with another Aminal 💕
     * @dev Requires sufficient love to establish breeding consent
     * @param user The user address requesting breeding
     * @param partner The Aminal address to set breeding consent with
     * @param status True to allow breeding, false to revoke consent
     *
     * "Love is the foundation of creation - only through mutual affection
     *  can new digital life be brought into existence"
     */
    function setBreedableWith(address user, address partner, bool status) public onlyFactory {
        require(lovePerUser[user] >= 10, "Not enough love");
        breedableWith[partner] = status;
        emit BreedableSet(partner, status);
    }

    function setBreeding(bool _breeding) external onlyFactory {
        breeding = _breeding;
    }

    function disableBreedableWith(address partner) external onlyFactory {
        breedableWith[partner] = false;
    }


    // Note: Aminals are soulbound NFTs and cannot be transferred
    // The NFT remains owned by the factory for identification purposes

    // Override transfer functions to disable transfers (soulbound)
    function transferFrom(address, address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    function safeTransferFrom(address, address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    function approve(address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be approved");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Aminals are soulbound and cannot be approved");
    }

    function _addLove(address user, uint256 love) internal {
        lovePerUser[user] += love;
        totalLove += love;
    }

    function _subtractLove(address user, uint256 love) internal {
        lovePerUser[user] -= love;
        totalLove -= love;
    }

    function loveDrivenPrice(address user) external view returns (uint128) {
        uint256 love = lovePerUser[user];
        uint256 totlove = totalLove;

        if (totlove == 0) return 100 * 10 ** 15;

        uint256 ratio = (love * 100) / totlove;
        uint128 price = ratio == 0 ? 100 : uint128(100 / ratio);

        price = price / 10;
        if (price < 1) price = 1;

        return price * 10 ** 15;
    }

    function setSkillProperty(string calldata key, bytes32 value) external {
        // Skills are globally accessible - any address can set properties
        // This allows for flexible skill system without registration
        skillProperties[msg.sender][key] = value;
    }

    function getSkillProperty(address skill, string calldata key) external view returns (bytes32) {
        return skillProperties[skill][key];
    }

    // View functions
    function getVisuals() external view returns (Visuals memory) {
        return visuals;
    }

    function getLoveByUser(address user) external view returns (uint256) {
        return lovePerUser[user];
    }

    function getTotalLove() external view returns (uint256) {
        return totalLove;
    }

    function getEnergy() external view returns (uint256) {
        return energy;
    }

    function isBreedableWith(address partner) external view returns (bool) {
        return breedableWith[partner];
    }

    function getParents() external view returns (address mom, address dad) {
        return (momAddress, dadAddress);
    }

    function transferEnergyToOwner(uint256 amount, address recipient) external {
        // Only factory or gene auction can call this function
        require(
            msg.sender == address(factory) || msg.sender == address(factory.geneAuction()),
            "Only factory or gene auction can transfer energy"
        );
        if (energy < amount) revert NotEnoughEnergy();

        energy -= amount;

        // In this simplified implementation, we just reduce the Aminal's energy
        // In a more complex system, you might want to:
        // 1. Create an energy token that can be transferred
        // 2. Track energy balances per user
        // 3. Allow users to deposit energy back to Aminals

        emit EnergyTransferred(recipient, amount, energy);
    }

    event EnergyTransferred(address indexed recipient, uint256 amount, uint256 remainingEnergy);

    // Implementation of abstract function from GeneBasedDescriptor
    function getAminalVisualsByID(uint256 aminalID) public view virtual override returns (Visuals memory) {
        require(aminalID == aminalIndex, "Invalid aminal ID");
        return visuals;
    }

    // Generate token URI using Gene-based descriptor
    function tokenURI(uint256 id) public view override returns (string memory) {
        require(id == 1, "Token does not exist");
        return dataURI(aminalIndex);
    }

    // Receive function to accept ETH
    receive() external payable {
        if (msg.value > 0) _feed(msg.sender, msg.value);
    }
}
