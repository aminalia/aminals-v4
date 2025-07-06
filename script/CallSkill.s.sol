pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal} from "src/Aminal.sol";
import {Move2D} from "src/skills/Move2D.sol";
import {FightSkill} from "src/skills/FightSkill.sol";

/*
Call a skill from an Aminal contract

Usage:
forge script script/CallSkill.s.sol:CallSkill --rpc-url $RPC_URL --broadcast
*/

contract CallSkill is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        // Get the first Aminal
        require(factory.totalAminals() > 0, "No Aminals exist");
        address aminalAddress = factory.aminalsByIndex(0);
        Aminal aminal = Aminal(payable(aminalAddress));

        console.log("Using Aminal at address:", aminalAddress);
        console.log("Aminal energy before:", aminal.getEnergy());

        // Get skill address (assuming Move2D skill exists)
        address skillAddress = address(vm.envAddress("MOVE2D_SKILL_CONTRACT"));
        console.log("Using skill at address:", skillAddress);

        // Prepare skill data (x, y coordinates for Move2D)
        bytes memory skillData = abi.encode(int256(5), int256(10));

        // Call the skill
        aminal.callSkill(skillAddress, skillData);

        console.log("Skill called successfully");
        console.log("Aminal energy after:", aminal.getEnergy());

        // Check if position was updated (this would require reading skill properties)
        console.log("Check Aminal's position properties for movement changes");

        vm.stopBroadcast();
    }
}

contract CallFight is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        // Get the first Aminal
        require(factory.totalAminals() > 0, "No Aminals exist");

        address aminalAddress = factory.aminalsByIndex(0);
        Aminal aminal = Aminal(payable(aminalAddress));

        address victimAddress = factory.aminalsByIndex(1);
        Aminal victim = Aminal(payable(aminalAddress));

        // Get skill address (assuming FightSkill skill exists)
        FightSkill skillContract = FightSkill(address(vm.envAddress("FIGHT_SKILL_CONTRACT")));
        console.log("Using FIGHT skill at address:", address(skillContract));

        (uint256 health1,) = skillContract.getStats(aminalAddress);
        console.log("Using Aminal at address:", aminalAddress);
        console.log("Aminal energy before:", aminal.getEnergy());
        console.log("Aminal health before:", health1);

        (uint256 health2,) = skillContract.getStats(victimAddress);
        console.log("Using Victim at address:", aminalAddress);
        console.log("Victim energy before:", aminal.getEnergy());
        console.log("Aminal health before:", health2);

        // Prepare skill data (x, y coordinates for Move2D)
        bytes memory skillData = abi.encode(victim, int256(1));

        // Call the skill
        aminal.callSkill(address(skillContract), skillData);

        console.log("Skill called successfully");

        (uint256 health3,) = skillContract.getStats(aminalAddress);
        console.log("Using Aminal at address:", aminalAddress);
        console.log("Aminal energy after:", aminal.getEnergy());
        console.log("Aminal health after:", health3);

        (uint256 health4,) = skillContract.getStats(victimAddress);
        console.log("Using Victim at address:", aminalAddress);
        console.log("Victim energy after:", aminal.getEnergy());
        console.log("Aminal health after:", health4);

        vm.stopBroadcast();
    }
}
