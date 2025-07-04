pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/IAminal.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {GeneAuction} from "src/utils/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {GenesNFT} from "src/nft/GenesNFT.sol";

/*
forge script script/AminalScript.s.sol:AminalScript --broadcast --verify -vvvv
 
forge script script/AminalScript.s.sol:AminalScript --chain-id 5  --rpc-url "https://goerli.blockpi.network/v1/rpc/public" --broadcast  --verify -vvvv

forge script  script/AddTrait.s.sol:AminalScript --chain-id 11155111 --rpc-url "https://ethereum-sepolia.publicnode.com" --broadcast --verify -vvv

*/

contract AddTraitScript is Script {
    AminalFactory factory;
    IAminalStructs.Visuals[] initialVisuals;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));
        GeneAuction geneAuction = GeneAuction(factory.geneAuction());

        // Add a new face trait
        uint256 faceTraitId = factory.addFace(
            '<g id="FACE"><path d="M673 351c0 75-26 111-175 115-133 4-171-44-171-119s85-156 174-156 172 85 172 160z" fill="#70968c"/><path d="M659 345c0 51-24 59-163 62-123 2-159-14-159-66s76-90 159-90 163 42 163 94z" fill="#438786"/><circle cx="389" cy="343" r="43" fill="#265a5d"/><path d="M393 308a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18z" fill="#271b27"/><ellipse cx="388" cy="329" fill="#2b565b" rx="27" ry="18"/><circle cx="369" cy="324" r="3" fill="#fff"/><circle cx="376" cy="319" r="2" fill="#fff"/><circle cx="500" cy="300" r="43" fill="#265a5d"/><path d="M504 265a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18z" fill="#271b27"/><ellipse cx="499" cy="286" fill="#2b565b" rx="27" ry="18"/><circle cx="480" cy="281" r="3" fill="#fff"/><circle cx="486" cy="276" r="2" fill="#fff"/><circle cx="604" cy="343" r="43" fill="#265a5d"/><path d="M608 308a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm0 39c-15 0-27-8-27-18s12-18 27-18 26 8 26 18-12 18-26 18z" fill="#271b27"/><ellipse cx="604" cy="329" fill="#2b565b" rx="27" ry="18"/><circle cx="584" cy="324" r="3" fill="#fff"/><circle cx="591" cy="319" r="2" fill="#fff"/></g>'
        );
        
        console.log("Added new face trait with ID:", faceTraitId);

        // Optional: Add other trait types (uncomment to use)
        // uint256 bodyTraitId = factory.addBody(
        //     '<g id="BODY"><path d="M710 404c0 362-94 350-210 350s-210 23-210-350c0-116 94-219 210-219s210 103 210 219z" fill="#99726a"/></g>'
        // );

        // Note: The new architecture uses Gene NFTs instead of direct trait voting
        // Traits are now managed through the Gene NFT system where anyone can create traits
        // and they're used through the gene auction process during breeding

        vm.stopBroadcast();
    }
}
