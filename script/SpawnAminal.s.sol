pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/IAminal.sol";
import {GeneAuction} from "src/utils/GeneAuction.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";

/*
forge script script/SpawnAminal.s.sol:SpawnAminal -vvvv --rpc-url https://rpc.ankr.com/eth_goerli --broadcast
*/

contract SpawnAminal is Script {
    IAminalStructs.Visuals[] newVisuals;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        // Create new Aminal with specified visuals
        newVisuals.push(IAminalStructs.Visuals(1, 2, 1, 2, 1, 2, 1, 2));
        
        // Spawn the new Aminal through factory
        factory.spawnInitialAminals(newVisuals);
        
        console.log("New Aminal spawned through factory");
        console.log("Total Aminals:", factory.totalAminals());

        vm.stopBroadcast();
    }
}
