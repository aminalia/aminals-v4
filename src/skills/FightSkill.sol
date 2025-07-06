// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Skill} from "./Skill.sol";

contract FightSkill is Skill {
    AminalFactory public factory;

    mapping(address aminalContract => FightProperties props) public Fighters;

    struct FightProperties {
        address fighting;
        uint256 health;
        uint256 mastery;
    }

    event FightEnded(address indexed winner, address indexed looser);

    constructor(address _factory) {
        factory = AminalFactory(_factory);
    }

    /**
     * @dev Attack an opponent with a specific attack type
     * @param opponent The address of the Aminal to attack
     * @param attackType The type of attack (1 = hit, others not implemented)
     */
    function attack(address opponent, uint256 attackType) external {
        require(factory.isAminal(msg.sender), "Only Aminal contracts can call this");
        
        console.log("aminal fighting: ", address(opponent), " with attack-mode = ", uint256(attackType));

        if (attackType == 1) {
            _hit(msg.sender, opponent);
        } else {
            revert("Requested attack modes not implemented yet");
        }
    }

    /**
     * @dev Calculate cost based on the attack type
     * @param data The calldata being sent to this skill
     * @return The amount of energy and love required
     */
    function skillCost(bytes calldata data) external pure override returns (uint256) {
        bytes4 selector = bytes4(data);
        
        if (selector == this.attack.selector) {
            (, uint256 attackType) = abi.decode(data[4:], (address, uint256));
            
            if (attackType == 1) {
                // Hit attack costs 10 energy
                return 10;
            }
            // Other attack types could have different costs
            return 5;
        }
        
        // Default cost for unknown actions
        return 1;
    }

    // Getters
    function getSkillData(address opponent, uint256 attackType) public pure returns (bytes memory data) {
        return abi.encodeWithSelector(this.attack.selector, opponent, attackType);
    }

    function getStats(address aminalContract) public view returns (uint256, uint256) {
        return (Fighters[aminalContract].health, Fighters[aminalContract].mastery);
    }

    // Internal functions
    function _hit(address aminalAttacker, address aminalVictim) internal {
        require(IAminal(aminalAttacker).getEnergy() >= 10, "Not enough energy");

        require(
            Fighters[aminalAttacker].fighting == address(0) || Fighters[aminalAttacker].fighting == aminalVictim,
            "already fighting with someone else"
        );

        if (Fighters[aminalVictim].fighting == address(0)) {
            Fighters[aminalVictim].fighting = aminalAttacker;
            Fighters[aminalAttacker].fighting = aminalVictim;
            Fighters[aminalVictim].health = 15;
            Fighters[aminalAttacker].health = 15;
        }

        bool win = _successfulHit();
        if (win) {
            if (Fighters[aminalVictim].health > 2) {
                Fighters[aminalVictim].health -= 1;
            } else {
                emit FightEnded(aminalAttacker, aminalVictim);
                Fighters[aminalVictim].fighting = address(0);
                Fighters[aminalAttacker].fighting = address(0);
            }

            console.log("successful hit");
        } else {
            if (Fighters[aminalAttacker].health > 2) {
                Fighters[aminalAttacker].health -= 1;
            } else {
                emit FightEnded(aminalVictim, aminalAttacker);
                Fighters[aminalVictim].fighting = address(0);
                Fighters[aminalAttacker].fighting = address(0);

                console.log("unsuccessful hit");
            }
        }
    }

    function _successfulHit() internal view returns (bool) {
        // Simple pseudo-randomness using block properties
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 2 == 0;
    }
}
