// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/IAminal.sol";
import {ISkill} from "src/skills/ISkills.sol";

contract FightSkill is ISkill {
    AminalFactory public factory;

    mapping(address aminalContract => FightProperties props) public Fighters;

    struct FightProperties {
        address fighting;
        uint256 health;
        uint256 mastery;
    }

    event FightEnded(address indexed winner, address indexed looser);

    // constructor(address _factory) {
    //     factory = AminalFactory(_factory);
    // }

    function useSkill(address sender, address aminalContract, bytes calldata data)
        public
        payable
        returns (uint256 squeak)
    {
        require(factory.isAminal(msg.sender), "Only Aminal contracts can call this");
        require(msg.sender == aminalContract, "Aminal contract mismatch");
        (address opponent, uint256 attack) = abi.decode(data, (address, uint256));

        console.log("aminal fighting: ", address(opponent), " with attack-mode = ", uint256(attack));

        if (attack == 1) return _hit(aminalContract);
        else revert("Requested attack modes not implemented yet");
    }

    // Getters
    function getSkillData(address opponent, uint256 attack) public pure returns (bytes memory data) {
        return abi.encode(opponent, attack);
    }

    function getStats(address aminalContract) public view returns (uint256, uint256) {
        return (Fighters[aminalContract].health, Fighters[aminalContract].mastery);
    }

    // Internal functions
    function _hit(address aminalVictim) internal returns (uint256 squeak) {
        require(IAminal(msg.sender).getEnergy() >= 10, "Not enough energy");

        require(
            Fighters[msg.sender].fighting == address(0) || Fighters[msg.sender].fighting == aminalVictim,
            "already fighting with someone else"
        );

        if (Fighters[aminalVictim].fighting == address(0)) {
            Fighters[aminalVictim].fighting = msg.sender;
            Fighters[msg.sender].fighting = aminalVictim;
            Fighters[aminalVictim].health = 15;
            Fighters[msg.sender].health = 15;
        }

        bool win = _successfulHit();
        if (win) {
            if (Fighters[aminalVictim].health > 2) {
                Fighters[aminalVictim].health -= 1;
            } else {
                emit FightEnded(msg.sender, aminalVictim);
                Fighters[aminalVictim].fighting = address(0);
                Fighters[msg.sender].fighting = address(0);
            }

            squeak = 1;
            console.log("successfull hit");
        } else {
            if (Fighters[msg.sender].health > 2) {
                Fighters[msg.sender].health -= 1;
            } else {
                emit FightEnded(aminalVictim, msg.sender);
                Fighters[aminalVictim].fighting = address(0);
                Fighters[msg.sender].fighting = address(0);

                squeak = 2;
                console.log("unsuccessful hit");
            }
        }

        return squeak;
    }

    function _successfulHit() internal view returns (bool) {
        // Simple pseudo-randomness using block properties
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 2 == 0;
    }
}
