// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {IAminalStructs} from "src/IAminalStructs.sol";
import {ISkill} from "src/skills/ISkills.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {ERC721} from "oz/token/ERC721/ERC721.sol";
import {GeneBasedDescriptor} from "src/genes/GeneBasedDescriptor.sol";

contract Aminal is IAminalStructs, ERC721, GeneBasedDescriptor {
    AminalFactory public immutable factory;

    address public immutable momAddress;
    address public immutable dadAddress;
    Visuals public visuals;
    uint256 public immutable aminalIndex;

    uint256 public totalLove;
    uint256 public energy;
    bool public breeding;

    mapping(address => bool) public breedableWith;
    mapping(address user => uint256 love) public lovePerUser;
    mapping(address skill => mapping(string key => bytes32 value))
        public skillProperties;

    event FeedAminal(
        address sender,
        uint256 amount,
        uint256 love,
        uint256 totalLove,
        uint256 energy
    );
    event Squeak(uint256 amount, uint256 energy, uint256 love, address sender);
    event SkillCall(address skillAddress, bytes data, uint256 squeakCost);
    event BreedableSet(address partner, bool status);

    error NotEnoughEther();
    error NotEnoughLove();
    error NotEnoughEnergy();
    error NotRegisteredSkill();

    modifier onlyFactory() override {
        require(msg.sender == address(factory), "Only factory can call this");
        _;
    }

    constructor(
        address _factory,
        address _momAddress,
        address _dadAddress,
        Visuals memory _visuals,
        uint256 _aminalIndex
    ) ERC721("Aminal", "AMINAL") GeneBasedDescriptor(address(0), address(0)) {
        // TODO: Pass correct GenesNFT and GeneFactory addresses
        factory = AminalFactory(_factory);
        momAddress = _momAddress;
        dadAddress = _dadAddress;
        visuals = _visuals;
        aminalIndex = _aminalIndex;

        // Initial energy for new Aminal
        energy = 50 * 10 ** 18;

        // Mint the NFT to the factory (which will transfer to the actual owner)
        _mint(address(_factory), 1);
    }

    function feed() external payable returns (uint256) {
        // TODO maybe we make this a parameter instead of hardcoding?
        if (msg.value < 0.001 ether) revert NotEnoughEther();
        return _feed(msg.sender, msg.value);
    }

    function _feed(address feeder, uint256 amount) internal returns (uint256) {
        _adjustLove(amount, feeder, true);

        // Calculate energy increase, capping at maximum energy
        uint256 maxEnergy = 100 * 10 ** 18; // Set max energy to 100
        uint256 delta = 0;

        if (energy < maxEnergy) {
            uint256 gap = maxEnergy - energy;
            delta = (amount * gap) / 10 ** 18;
            if (delta > gap) delta = gap; // Don't exceed max energy
            energy += delta;
        }

        emit FeedAminal(feeder, amount, lovePerUser[feeder], totalLove, energy);
        return delta;
    }

    function squeak(uint256 amount) external payable {
        if (msg.value < 0.001 ether) revert NotEnoughEther();

        // Users need sufficient love to squeak
        if (lovePerUser[msg.sender] < amount) {
            revert NotEnoughLove();
        }

        if (energy >= amount) {
            energy -= amount;
        }

        _adjustLove(amount, msg.sender, false);

        emit Squeak(amount, energy, lovePerUser[msg.sender], msg.sender);
    }

    function callSkill(
        address skillAddress,
        bytes calldata data
    ) external payable {
        // Skills are globally accessible - no registration check needed

        uint256 squeakCost = ISkill(skillAddress).useSkill{value: msg.value}(
            msg.sender,
            address(this),
            data
        );

        if (squeakCost > 0) {
            if (energy >= squeakCost) {
                energy -= squeakCost;
            }
        }

        emit SkillCall(skillAddress, data, squeakCost);
    }

    function setBreedableWith(address partner, bool status) external {
        require(lovePerUser[msg.sender] >= 10, "Not enough love");
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

    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override {
        revert("Aminals are soulbound and cannot be transferred");
    }

    function approve(address, uint256) public pure override {
        revert("Aminals are soulbound and cannot be approved");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Aminals are soulbound and cannot be approved");
    }

    function _adjustLove(uint256 love, address user, bool increment) internal {
        if (increment) {
            lovePerUser[user] += love;
            totalLove += love;
        } else {
            lovePerUser[user] -= love;
            totalLove -= love;
        }
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

    function getSkillProperty(
        address skill,
        string calldata key
    ) external view returns (bytes32) {
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

    // Implementation of abstract function from GeneBasedDescriptor
    function getAminalVisualsByID(
        uint256 aminalID
    ) public view virtual override returns (Visuals memory) {
        require(aminalID == aminalIndex, "Invalid aminal ID");
        return visuals;
    }

    // Generate token URI using Gene-based descriptor
    function tokenURI(uint256 id) public view override returns (string memory) {
        require(id == 1, "Token does not exist");
        // TODO: Implement proper Gene NFT-based URI generation
        return dataURI(aminalIndex);
    }

    // Receive function to accept ETH
    receive() external payable {
        if (msg.value > 0) {
            _feed(msg.sender, msg.value);
        }
    }
}
