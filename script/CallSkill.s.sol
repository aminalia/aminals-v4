pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal} from "src/Aminal.sol";
import {Move2D} from "src/skills/Move2D.sol";

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
