pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Aminal} from "src/Aminal.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";

contract BreedAminal is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));

        // Get the first two Aminal contract addresses
        require(factory.totalAminals() >= 2, "Need at least 2 Aminals to breed");

        address aminal1Address = factory.aminalsByIndex(0);
        address aminal2Address = factory.aminalsByIndex(1);

        Aminal aminal1 = Aminal(payable(aminal1Address));
        Aminal aminal2 = Aminal(payable(aminal2Address));

        // Display info for both Aminals
        for (uint256 i = 0; i < 2; i++) {
            address aminalAddress = factory.aminalsByIndex(i);
            Aminal aminal = Aminal(payable(aminalAddress));

            console.log("~~~~~~~~~~~~~~~");
            console.log("Aminal Address:", aminalAddress);
            console.log("Aminal love by user:", aminal.getLoveByUser(address(vm.envAddress("ADDRESS"))));
            console.log("Aminal total love:", aminal.getTotalLove());
            console.log("Aminal energy:", aminal.getEnergy());
            console.log("~~~~~~~~~~~~~~~");
        }

        // First call to breedAminals - this will set initial consent
        console.log("Making first breedAminals call to set initial consent...");
        uint256 totalBefore = factory.totalAminals();
        factory.breedAminals{value: 0.001 ether}(aminal1Address, aminal2Address);
        
        console.log("Initial consent set");
        console.log("Aminal1 can breed with Aminal2:", aminal1.isBreedableWith(aminal2Address));
        console.log("Aminal2 can breed with Aminal1:", aminal2.isBreedableWith(aminal1Address));

        // Second call to breedAminals - this will set mutual consent and create auction
        console.log("Making second breedAminals call to establish mutual consent...");
        uint256 auctionId = factory.breedAminals{value: 0.001 ether}(aminal2Address, aminal1Address);

        console.log("Breeding flow completed");
        console.log("Total Aminals before:", totalBefore);
        console.log("Total Aminals after:", factory.totalAminals());
        console.log("Auction ID:", auctionId);

        vm.stopBroadcast();
    }
}
