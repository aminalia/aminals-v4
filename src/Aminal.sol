// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {IAminalStructs} from "src/IAminalStructs.sol";
import {ISkill} from "src/skills/ISkills.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {ERC721S} from "src/nft/ERC721S.sol";

contract Aminal is IAminalStructs, ERC721S {
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
    mapping(address skill => mapping(string key => bytes32 value)) public skillProperties;
    
    event FeedAminal(address sender, uint256 amount, uint256 love, uint256 totalLove, uint256 energy);
    event Squeak(uint256 amount, uint256 energy, uint256 love, address sender);
    event SkillCall(address skillAddress, bytes data, uint256 squeakCost);
    event BreedableSet(address partner, bool status);
    
    error NotEnoughEther();
    error NotEnoughLove();
    error NotEnoughEnergy();
    error NotRegisteredSkill();
    error OnlyFactory();
    
    modifier onlyFactory() {
        require(msg.sender == address(factory), "Only factory can call this");
        _;
    }
    
    constructor(
        address _factory,
        address _momAddress,
        address _dadAddress,
        Visuals memory _visuals,
        uint256 _aminalIndex
    ) ERC721S("Aminal", "AMINAL") {
        factory = AminalFactory(_factory);
        momAddress = _momAddress;
        dadAddress = _dadAddress;
        visuals = _visuals;
        aminalIndex = _aminalIndex;
        
        // Initial energy for new Aminal
        energy = 50 * 10**18;
        
        // Mint the NFT to the factory (which will transfer to the actual owner)
        _mint(address(_factory), 1);
    }
    
    function feed() external payable returns (uint256) {
        if (msg.value < 0.001 ether) revert NotEnoughEther();
        return _feed(msg.sender, msg.value);
    }
    
    function _feed(address feeder, uint256 amount) internal returns (uint256) {
        _adjustLove(amount, feeder, true);
        
        uint256 gap = 10**18 - energy;
        uint256 delta = (amount * gap) / 10**18;
        energy += delta;
        
        emit FeedAminal(feeder, amount, lovePerUser[feeder], totalLove, energy);
        return delta;
    }
    
    function squeak(uint256 amount) external payable {
        if (msg.value < 0.001 ether) revert NotEnoughEther();
        
        bool isSkill = factory.isSkillRegistered(msg.sender);
        
        if (!isSkill && lovePerUser[msg.sender] < amount) {
            revert NotEnoughLove();
        }
        
        if (isSkill) {
            // Skills don't adjust love or energy directly
            return;
        }
        
        if (energy >= amount) {
            energy -= amount;
        }
        
        _adjustLove(amount, msg.sender, false);
        
        emit Squeak(amount, energy, lovePerUser[msg.sender], msg.sender);
    }
    
    function callSkill(address skillAddress, bytes calldata data) external payable {
        if (!factory.isSkillRegistered(skillAddress)) {
            revert NotRegisteredSkill();
        }
        
        uint256 squeakCost = ISkill(skillAddress).useSkill{value: msg.value}(msg.sender, aminalIndex, data);
        
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
    
    function transferToOwner(address to) external onlyFactory {
        require(to != address(0), "Invalid recipient");
        transferFrom(address(factory), to, 1);
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
        
        if (totlove == 0) return 100 * 10**15;
        
        uint256 ratio = love * 100 / totlove;
        uint128 price = ratio == 0 ? 100 : uint128(100 / ratio);
        
        price = price / 10;
        if (price < 1) price = 1;
        
        return price * 10**15;
    }
    
    function setSkillProperty(string calldata key, bytes32 value) external {
        require(factory.isSkillRegistered(msg.sender), "Only registered skills can set properties");
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
    
    // Generate token URI using factory's descriptor
    function tokenURI(uint256 id) public view override returns (string memory) {
        require(id == 1, "Token does not exist");
        return factory.dataURI(aminalIndex);
    }
    
    // Receive function to accept ETH
    receive() external payable {
        if (msg.value > 0) {
            _feed(msg.sender, msg.value);
        }
    }
}