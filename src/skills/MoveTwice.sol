// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "forge-std/Test.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {ISkill} from "src/skills/ISkills.sol";
import {Move2D} from "src/skills/Move2D.sol";

contract MoveTwice is ISkill {
    AminalFactory public factory;
    address public mover;

    constructor(address _factory, address _mover) {
        factory = AminalFactory(_factory);
        mover = _mover;
    }

    function useSkill(address sender, address aminalContract, bytes calldata data) public payable returns (uint256 squeak) {
        require(factory.isAminal(msg.sender), "Only Aminal contracts can call this");
        require(msg.sender == aminalContract, "Aminal contract mismatch");
        (bytes memory data1, bytes memory data2) = abi.decode(data, (bytes, bytes));
        console.log("About to call the moveTwice function -- with msg.value = ", msg.value);
        return moveTwice(aminalContract, sender, data1, data2);
    }

    // Note: In the new architecture, skills call other skills directly
    // through the Aminal contract's callSkill function
    function moveTwice(address aminalContract, address sender, bytes memory data1, bytes memory data2)
        public
        payable
        returns (uint256)
    {
        console.log("first movement ----");
        AminalContract(payable(msg.sender)).callSkill{value: msg.value / 2}(mover, data1);

        console.log("second movement ----");
        AminalContract(payable(msg.sender)).callSkill{value: msg.value / 2}(mover, data2);
        return 0;
    }

    // Getters
    function getSkillData(uint256 x1, uint256 y1, uint256 x2, uint256 y2) public pure returns (bytes memory data) {
        return abi.encode(abi.encode(x1, y1), abi.encode(x2, y2));
    }
}
