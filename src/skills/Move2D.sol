// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
// import {Aminal} from "src/Aminal.sol"; // Deprecated
import {ISkill} from "src/skills/ISkills.sol";

contract Move2D is ISkill {
    AminalFactory public factory;

    mapping(address aminalContract => Coordinates2D coords) public Coords2D;

    struct Coordinates2D {
        uint256 x;
        uint256 y;
    }

    constructor(address _factory) {
        factory = AminalFactory(_factory);
    }

    function useSkill(address sender, address aminalContract, bytes calldata data)
        public
        payable
        returns (uint256 squeak)
    {
        require(factory.isAminal(msg.sender), "Only Aminal contracts can call this");
        require(msg.sender == aminalContract, "Aminal contract mismatch");
        (uint256 x, uint256 y) = abi.decode(data, (uint256, uint256));
        console.log("request to move to x = ", x, " & y = ", y);
        return _move2D(aminalContract, x, y);
    }

    // Getters
    function getSkillData(uint256 x, uint256 y) public pure returns (bytes memory data) {
        return abi.encode(x, y);
    }

    function getCoords(address aminalContract) public view returns (uint256, uint256) {
        return (Coords2D[aminalContract].x, Coords2D[aminalContract].y);
    }

    // Internal functions
    function _move2D(address aminalContract, uint256 x, uint256 y) internal returns (uint256 squeak) {
        // replace with squeak calc based on distance
        squeak = 2;

        Coords2D[aminalContract].x = x;
        Coords2D[aminalContract].y = y;
        console.log("still alive!");
        return squeak;
    }
}
