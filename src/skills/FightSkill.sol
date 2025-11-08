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
        bool fighting;
        uint256 health;
        uint256 mastery;
    }

    event AminalFightWin(address indexed winner, address indexed looser);

    constructor(address _factory) {
        factory = AminalFactory(_factory);
    }

    /**
     * @dev Attack an opponent with a specific attack type
     * @param victim The address of the Aminal to attack
     * @param attackType The type of attack (1 = hit, others not implemented)
     */
    function attack(address victim, uint256 attackType) external {
        require(factory.isAminal(msg.sender), "Only Aminal contracts can call this");
        // require(Fighters[victim].fighting == 0, "Cannot attack an Aminal that is already enrolled in a fight");

        if (!Fighters[msg.sender].fighting) {
            // Health based on total love
            uint256 attackerLove = IAminal(msg.sender).getTotalLove();
            Fighters[msg.sender].health = attackerLove + (attackerLove * Fighters[msg.sender].mastery) / 100;
            Fighters[msg.sender].fighting = true;
        }
        if (!Fighters[victim].fighting) {
            // Health based on total love
            uint256 victimLove = IAminal(victim).getTotalLove();
            Fighters[victim].health = victimLove + (victimLove * Fighters[victim].mastery) / 100;
            Fighters[victim].fighting = true;
        }

        require(Fighters[victim].health > 0, "Cannot attack a weak or defeated Aminal, feed it to restore its health");

        console.log("Aminal attacked: ", victim);
        console.log("with attack-mode = ", uint16(attackType));

        if (attackType == 1) _hit(msg.sender, victim);
        else revert("Requested attack modes not implemented yet");
    }

    /**
     * @dev Calculate cost percentage based on the attack type
     * @param data The calldata being sent to this skill
     * @return The percentage of love required (e.g., 10 = 10%)
     */
    function skillCost(bytes calldata data) external pure override returns (uint256) {
        bytes4 selector = bytes4(data);

        if (selector == this.attack.selector) {
            (, uint256 attackType) = abi.decode(data[4:], (address, uint256));

            if (attackType == 1) {
                // Hit attack costs 10% of user's love
                return 10;
            }
            // Other attack types could have different costs (5%)
            return 5;
        }

        // Default cost percentage for unknown actions (10%)
        return 10;
    }

    // Getters
    function getSkillData(address opponent, uint256 attackType) public pure returns (bytes memory data) {
        return abi.encodeWithSelector(this.attack.selector, opponent, attackType);
    }

    function getStats(address aminalContract) public view returns (uint256, uint256) {
        return (Fighters[aminalContract].health, Fighters[aminalContract].mastery);
    }

    // Internal functions
    function _hit(address attacker, address victim) internal {
        require(IAminal(attacker).getTotalLove() >= 10, "Not enough love to hit !");

        bool win = _success(Fighters[attacker].mastery, Fighters[victim].mastery);

        if (win) {
            console.log("successful hit");

            // check if victim is still alive
            if (Fighters[victim].health >= 10) {
                Fighters[victim].health -= 10;
            } else {
                // declare victory and end the fight for both Aminals
                emit AminalFightWin(attacker, victim);
                Fighters[victim].fighting = false;
                Fighters[victim].mastery -= 1;
                Fighters[attacker].fighting = false;
                Fighters[attacker].mastery += 1;
            }
        } else {
            console.log("unsuccessful hit");
        }
    }

    function _success(uint256 attackerMastery, uint256 victimMastery) internal view returns (bool) {
        // Calculate the weighted probability
        uint256 totalMastery = attackerMastery + victimMastery;
        uint256 attackerProbability = (attackerMastery * 100) / totalMastery;

        // Simple pseudo-randomness using block properties - number between 0 and 99
        uint256 randomV = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 100;

        return randomV < attackerProbability;
    }
}
