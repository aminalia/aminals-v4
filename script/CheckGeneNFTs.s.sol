// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/nft/GenesNFT.sol";

contract CheckGeneNFTsScript is Script {
    function run() external view {
        // Contract addresses from deployment
        address genesNFT = 0x63424282b4374caCE9610a1413B0dD5b8090cf35;
        
        GenesNFT genes = GenesNFT(genesNFT);
        
        console.log("GenesNFT Contract:", genesNFT);
        
        try genes.currentId() returns (uint256 currentId) {
            console.log("Current ID:", currentId);
            
            // Check first few token IDs
            for (uint256 i = 1; i <= currentId && i <= 10; i++) {
                try genes.ownerOf(i) returns (address owner) {
                    console.log("Token", i, "owned by:", owner);
                    
                    try genes.getGeneInfo(i) returns (string memory svg, IAminalStructs.VisualsCat category) {
                        console.log("  - SVG length:", bytes(svg).length);
                        console.log("  - Category:", uint8(category));
                    } catch {
                        console.log("  - Failed to get gene info");
                    }
                } catch {
                    console.log("Token", i, "does not exist");
                }
            }
        } catch {
            console.log("Failed to get current ID");
        }
    }
}