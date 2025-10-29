pragma solidity ^0.8.20;

/**
 * @title SettleAuction Script
 * @notice Script to settle a gene auction by ID
 *
 * Usage:
 *   forge script script/test/SettleAuction.s.sol:SettleAuction --rpc-url $RPC_URL --broadcast --sig "run(uint256)" <AUCTION_ID>
 *
 * Examples:
 *   # Settle auction ID 3
 *   forge script script/test/SettleAuction.s.sol:SettleAuction --rpc-url $RPC_URL --broadcast --sig "run(uint256)" 3
 *
 *   # Settle auction ID 5 on testnet
 *   forge script script/test/SettleAuction.s.sol:SettleAuction --rpc-url $TESTNET_RPC_URL --broadcast --sig "run(uint256)" 5
 *
 * Environment Variables Required:
 *   - PRIVATE_KEY: Deployer private key
 *   - AMINAL_FACTORY_CONTRACT: Address of the AminalFactory contract
 *   - RPC_URL: RPC endpoint URL
 */
import "forge-std/Script.sol";
import {AminalFactory} from "src/AminalFactory.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {Aminal} from "src/Aminal.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

contract SettleAuction is Script {
    function run(uint256 auctionId) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AminalFactory factory = AminalFactory(address(vm.envAddress("AMINAL_FACTORY_CONTRACT")));
        GeneAuction geneAuction = GeneAuction(factory.geneAuction());

        console.log("=== Settling Gene Auction ===");
        console.log("Factory Address:", address(factory));
        console.log("Gene Auction Address:", address(geneAuction));
        console.log("Auction ID:", auctionId);
        console.log("");

        // Display auction information before settlement
        console.log("--- Auction Information (Before Settlement) ---");
        try geneAuction.getAuctionInfo(auctionId) returns (
            uint256 aminalOne, uint256 aminalTwo, uint256 totalLove, uint64 startTime, uint64 endTime, bool settled
        ) {
            console.log("Aminal One ID:", aminalOne);
            console.log("Aminal Two ID:", aminalTwo);
            console.log("Total Love:", totalLove);
            console.log("Start Time:", startTime);
            console.log("End Time:", endTime);
            console.log("Already Settled:", settled);
            console.log("Current Time:", block.timestamp);

            // Check if voting is still active
            bool isActive = geneAuction.isVotingActive(auctionId);
            console.log("Voting Active:", isActive);

            if (settled) {
                console.log("ERROR: Auction is already settled!");
                vm.stopBroadcast();
                return;
            }

            if (block.timestamp < endTime) {
                console.log("WARNING: Auction has not ended yet!");
                console.log("Time remaining:", endTime - block.timestamp, "seconds");
            }

            // Display parent Aminal information
            console.log("");
            console.log("--- Parent Aminal Information ---");

            if (aminalOne < factory.totalAminals()) {
                address aminalOneAddress = factory.aminalsByIndex(aminalOne);
                Aminal aminal1 = Aminal(payable(aminalOneAddress));
                console.log("Aminal One Address:", aminalOneAddress);
                console.log("Aminal One Treasury:", aminal1.getTreasuryBalance());
                console.log("Aminal One Total Love:", aminal1.getTotalLove());
            }

            if (aminalTwo < factory.totalAminals()) {
                address aminalTwoAddress = factory.aminalsByIndex(aminalTwo);
                Aminal aminal2 = Aminal(payable(aminalTwoAddress));
                console.log("Aminal Two Address:", aminalTwoAddress);
                console.log("Aminal Two Treasury:", aminal2.getTreasuryBalance());
                console.log("Aminal Two Total Love:", aminal2.getTotalLove());
            }
        } catch {
            console.log("ERROR: Could not retrieve auction information. Auction may not exist.");
            vm.stopBroadcast();
            return;
        }

        console.log("");
        console.log("--- Pre-Settlement Gene Debugging ---");

        // Check winning genes and their creators before settlement
        for (uint256 category = 0; category < 8; category++) {
            try geneAuction.getCategoryVoting(auctionId, IAminalStructs.VisualsCat(category)) returns (
                GeneAuction.CategoryVoteInfo memory categoryInfo
            ) {
                console.log("Category", category, "- Highest votes:", categoryInfo.highestVotes);
                if (categoryInfo.proposedGenes.length > 0) {
                    uint256 leadingGeneId = categoryInfo.winningGeneId;
                    uint256 maxVotes = categoryInfo.highestVotes;

                    console.log("  Proposed genes count:", categoryInfo.proposedGenes.length);
                    console.log("  Leading gene ID:", leadingGeneId);
                    console.log("  Max votes:", maxVotes);

                    if (leadingGeneId != 0) {
                        // Check gene creator
                        try factory.genes().ownerOf(leadingGeneId) returns (address creator) {
                            console.log("  Gene creator:", creator);
                            // Check if creator is contract or EOA
                            uint256 codeSize;
                            assembly {
                                codeSize := extcodesize(creator)
                            }
                            console.log("  Creator code size:", codeSize, codeSize == 0 ? "(EOA)" : "(Contract)");
                        } catch {
                            console.log("  Could not get gene creator");
                        }
                    }
                }
            } catch {
                console.log("Category", category, "- Could not get voting info");
            }
        }

        console.log("");
        console.log("--- Settling Auction ---");

        // Attempt to settle the auction
        try geneAuction.settleAuction(auctionId) {
            console.log("SUCCESS: Auction settled successfully!");

            // Display final information
            console.log("");
            console.log("--- Post-Settlement Information ---");

            (,,,,, bool nowSettled) = geneAuction.getAuctionInfo(auctionId);
            console.log("Auction Now Settled:", nowSettled);
            console.log("Total Aminals After Settlement:", factory.totalAminals());

            // Check if a new Aminal was created
            if (factory.totalAminals() > 0) {
                uint256 lastAminalIndex = factory.totalAminals() - 1;
                address newestAminalAddress = factory.aminalsByIndex(lastAminalIndex);
                console.log("Newest Aminal Address:", newestAminalAddress);
                console.log("Newest Aminal Index:", lastAminalIndex);
            }
        } catch Error(string memory reason) {
            console.log("ERROR: Failed to settle auction!");
            console.log("Reason:", reason);

            // Additional debugging for treasury transfer failures
            if (keccak256(abi.encodePacked(reason)) == keccak256(abi.encodePacked("TreasuryTransferFailed()"))) {
                console.log("");
                console.log("--- Treasury Transfer Failure Debug ---");
                console.log("This error occurs when ETH transfer to gene creator fails.");
                console.log("Possible causes:");
                console.log("1. Gene creator is a contract that doesn't accept ETH");
                console.log("2. Gene creator contract reverts on receive()");
                console.log("3. Gas limit exceeded during transfer");
                console.log("Check the gene creator addresses above for contracts.");
            }
        } catch (bytes memory lowLevelData) {
            console.log("ERROR: Failed to settle auction with low-level error!");
            console.logBytes(lowLevelData);
        }

        console.log("");
        console.log("=== Settlement Complete ===");

        vm.stopBroadcast();
    }
}
