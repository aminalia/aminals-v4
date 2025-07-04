// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";
import {ReentrancyGuard} from "oz/security/ReentrancyGuard.sol";

import {IAminalStructs} from "src/IAminalStructs.sol";
import {IAminalFactory} from "src/IAminalFactory.sol";
import {GenesNFT} from "src/nft/GenesNFT.sol";
import {GeneNFTFactory} from "src/nft/GeneNFTFactory.sol";

/**
 * @title GeneAuction
 * @dev Nouns-style auction for Gene NFT-based traits with direct payment to Gene NFT owners
 */
contract GeneAuction is
    IAminalStructs,
    Initializable,
    Ownable,
    ReentrancyGuard
{
    GenesNFT public genesNFT;
    GeneNFTFactory public geneFactory;
    address public aminalsContract;
    IAminalFactory public aminalFactory;

    /// @notice Minimum bid increment percentage (e.g., 5%)
    uint256 public constant MIN_BID_INCREMENT = 5;

    /// @notice Reserve price for auctions
    uint256 public constant RESERVE_PRICE = 0.01 ether;

    /// @notice Duration of auction in seconds
    uint256 public constant AUCTION_DURATION = 7 days;

    /// @notice Time extension when bid is placed near auction end
    uint256 public constant TIME_EXTENSION = 10 minutes;

    /// @notice Buffer time before auction end to trigger extension
    uint256 public constant TIME_BUFFER = 5 minutes;

    struct Auction {
        uint256 aminalOne;
        uint256 aminalTwo;
        uint256 totalLove;
        uint256 startTime;
        uint256 endTime;
        bool settled;
        uint256 childAminalId;
        // Bids for each trait category
        mapping(VisualsCat => CategoryBidding) categoryBids;
    }

    struct CategoryBidding {
        uint256 highestBid;
        address highestBidder;
        uint256 winningGeneId;
        mapping(uint256 => uint256) geneBids; // geneId => bid amount
        mapping(uint256 => address) geneBidders; // geneId => bidder address
        uint256[] proposedGenes; // Array of gene IDs proposed for this category
    }

    struct CategoryBidInfo {
        uint256 highestBid;
        address highestBidder;
        uint256 winningGeneId;
        uint256[] proposedGenes;
    }

    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCounter;

    event AuctionCreated(
        uint256 indexed auctionId,
        uint256 indexed aminalOne,
        uint256 indexed aminalTwo,
        uint256 totalLove,
        uint256 startTime,
        uint256 endTime
    );

    event GeneBidPlaced(
        uint256 indexed auctionId,
        VisualsCat indexed category,
        uint256 indexed geneId,
        address bidder,
        uint256 amount
    );

    event AuctionExtended(uint256 indexed auctionId, uint256 newEndTime);

    event AuctionSettled(
        uint256 indexed auctionId,
        uint256 indexed childAminalId,
        uint256[8] winningGeneIds,
        uint256 totalPayouts
    );

    event GeneProposed(
        uint256 indexed auctionId,
        VisualsCat indexed category,
        uint256 indexed geneId,
        address proposer
    );

    error AuctionNotActive();
    error AuctionAlreadySettled();
    error BidTooLow();
    error InvalidGene();
    error AuctionNotEnded();
    error OnlyAminals();
    error PaymentFailed();
    error InvalidCategory();

    modifier onlyAminals() {
        if (msg.sender != aminalsContract) revert OnlyAminals();
        _;
    }

    modifier validAuction(uint256 auctionId) {
        require(auctionId <= auctionCounter, "Auction does not exist");
        _;
    }

    constructor(address _genesNFT, address _geneFactory) {
        genesNFT = GenesNFT(_genesNFT);
        geneFactory = GeneNFTFactory(_geneFactory);
    }

    function setup(
        address _aminalsContract,
        address _aminalFactory
    ) external initializer onlyOwner {
        aminalsContract = _aminalsContract;
        aminalFactory = IAminalFactory(_aminalFactory);
    }

    /**
     * @notice Create a new auction for breeding
     * @dev Called by the Aminals contract when breeding is initiated
     */
    function createAuction(
        uint256 aminalOne,
        uint256 aminalTwo,
        uint256 totalLove
    ) external onlyAminals returns (uint256 auctionId) {
        auctionId = ++auctionCounter;

        Auction storage auction = auctions[auctionId];
        auction.aminalOne = aminalOne;
        auction.aminalTwo = aminalTwo;
        auction.totalLove = totalLove;
        auction.startTime = block.timestamp;
        auction.endTime = block.timestamp + AUCTION_DURATION;
        auction.childAminalId = auctionId; // Use auction ID as child Aminal ID

        emit AuctionCreated(
            auctionId,
            aminalOne,
            aminalTwo,
            totalLove,
            auction.startTime,
            auction.endTime
        );

        return auctionId;
    }

    /**
     * @notice Propose a Gene NFT for a specific trait category in an auction
     * @dev Anyone can propose genes they own or any valid gene
     */
    function proposeGene(
        uint256 auctionId,
        VisualsCat category,
        uint256 geneId
    ) external validAuction(auctionId) {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= auction.endTime) revert AuctionNotActive();
        if (auction.settled) revert AuctionAlreadySettled();
        if (uint256(category) >= 8) revert InvalidCategory();

        // Verify gene exists and is from the factory
        if (!geneFactory.isValidGene(geneId)) revert InvalidGene();

        // Verify gene is in the correct category
        (, VisualsCat geneCategory, ) = geneFactory.getGeneInfo(geneId);
        if (geneCategory != category) revert InvalidCategory();

        CategoryBidding storage categoryBidding = auction.categoryBids[
            category
        ];

        // Check if gene is already proposed
        bool alreadyProposed = false;
        for (uint256 i = 0; i < categoryBidding.proposedGenes.length; i++) {
            if (categoryBidding.proposedGenes[i] == geneId) {
                alreadyProposed = true;
                break;
            }
        }

        if (!alreadyProposed) {
            categoryBidding.proposedGenes.push(geneId);
            emit GeneProposed(auctionId, category, geneId, msg.sender);
        }
    }

    /**
     * @notice Place a bid on a specific Gene NFT in an auction
     * @dev Implements Nouns-style bidding with refunds
     */
    function bidOnGene(
        uint256 auctionId,
        VisualsCat category,
        uint256 geneId
    ) external payable validAuction(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp >= auction.endTime) revert AuctionNotActive();
        if (auction.settled) revert AuctionAlreadySettled();
        if (uint256(category) >= 8) revert InvalidCategory();

        CategoryBidding storage categoryBidding = auction.categoryBids[
            category
        ];

        // Verify gene is proposed for this category
        bool isProposed = false;
        for (uint256 i = 0; i < categoryBidding.proposedGenes.length; i++) {
            if (categoryBidding.proposedGenes[i] == geneId) {
                isProposed = true;
                break;
            }
        }
        if (!isProposed) revert InvalidGene();

        uint256 currentBid = categoryBidding.geneBids[geneId];
        uint256 minBid = currentBid == 0
            ? RESERVE_PRICE
            : (currentBid * (100 + MIN_BID_INCREMENT)) / 100;

        if (msg.value < minBid) revert BidTooLow();

        // Refund previous bidder
        address previousBidder = categoryBidding.geneBidders[geneId];
        if (previousBidder != address(0) && currentBid > 0) {
            (bool success, ) = previousBidder.call{value: currentBid}("");
            if (!success) revert PaymentFailed();
        }

        // Update bid info
        categoryBidding.geneBids[geneId] = msg.value;
        categoryBidding.geneBidders[geneId] = msg.sender;

        // Update highest bid for category if this is the highest
        if (msg.value > categoryBidding.highestBid) {
            categoryBidding.highestBid = msg.value;
            categoryBidding.highestBidder = msg.sender;
            categoryBidding.winningGeneId = geneId;
        }

        // Extend auction if bid is placed near the end
        if (auction.endTime - block.timestamp < TIME_BUFFER) {
            auction.endTime = block.timestamp + TIME_EXTENSION;
            emit AuctionExtended(auctionId, auction.endTime);
        }

        emit GeneBidPlaced(auctionId, category, geneId, msg.sender, msg.value);
    }

    /**
     * @notice Settle an auction and distribute payments to Gene NFT owners
     * @dev Can be called by anyone after auction ends
     */
    function settleAuction(
        uint256 auctionId
    ) external validAuction(auctionId) nonReentrant {
        Auction storage auction = auctions[auctionId];

        if (block.timestamp < auction.endTime) revert AuctionNotEnded();
        if (auction.settled) revert AuctionAlreadySettled();

        auction.settled = true;

        uint256[8] memory winningGeneIds;
        uint256 totalPayouts = 0;

        // Process each trait category
        for (uint256 i = 0; i < 8; i++) {
            VisualsCat category = VisualsCat(i);
            CategoryBidding storage categoryBidding = auction.categoryBids[
                category
            ];

            if (categoryBidding.highestBid > 0) {
                winningGeneIds[i] = categoryBidding.winningGeneId;
                uint256 winningBid = categoryBidding.geneBids[
                    categoryBidding.winningGeneId
                ];

                if (winningBid > 0) {
                    // Pay the Gene NFT owner
                    address geneOwner = genesNFT.ownerOf(
                        categoryBidding.winningGeneId
                    );
                    (bool success, ) = geneOwner.call{value: winningBid}("");
                    if (!success) revert PaymentFailed();

                    totalPayouts += winningBid;
                }
            }
        }

        emit AuctionSettled(
            auctionId,
            auction.childAminalId,
            winningGeneIds,
            totalPayouts
        );

        // Spawn the child Aminal with winning traits
        address momAddress = aminalFactory.getAminalByIndex(auction.aminalOne);
        address dadAddress = aminalFactory.getAminalByIndex(auction.aminalTwo);

        aminalFactory.spawnAminalFromAuction(
            momAddress,
            dadAddress,
            winningGeneIds
        );

        // Update the child Aminal ID to the actual spawned Aminal index
        auction.childAminalId = aminalFactory.totalAminals() - 1;
    }

    /**
     * @notice Get auction information
     */
    function getAuctionInfo(
        uint256 auctionId
    )
        external
        view
        validAuction(auctionId)
        returns (
            uint256 aminalOne,
            uint256 aminalTwo,
            uint256 totalLove,
            uint256 startTime,
            uint256 endTime,
            bool settled,
            uint256 childAminalId
        )
    {
        Auction storage auction = auctions[auctionId];
        return (
            auction.aminalOne,
            auction.aminalTwo,
            auction.totalLove,
            auction.startTime,
            auction.endTime,
            auction.settled,
            auction.childAminalId
        );
    }

    /**
     * @notice Get category bidding information
     */
    function getCategoryBidding(
        uint256 auctionId,
        VisualsCat category
    ) external view validAuction(auctionId) returns (CategoryBidInfo memory) {
        CategoryBidding storage categoryBidding = auctions[auctionId]
            .categoryBids[category];
        return
            CategoryBidInfo({
                highestBid: categoryBidding.highestBid,
                highestBidder: categoryBidding.highestBidder,
                winningGeneId: categoryBidding.winningGeneId,
                proposedGenes: categoryBidding.proposedGenes
            });
    }

    /**
     * @notice Get bid information for a specific gene
     */
    function getGeneBid(
        uint256 auctionId,
        VisualsCat category,
        uint256 geneId
    )
        external
        view
        validAuction(auctionId)
        returns (uint256 bidAmount, address bidder)
    {
        CategoryBidding storage categoryBidding = auctions[auctionId]
            .categoryBids[category];
        return (
            categoryBidding.geneBids[geneId],
            categoryBidding.geneBidders[geneId]
        );
    }

    /**
     * @notice Check if auction is active
     */
    function isAuctionActive(
        uint256 auctionId
    ) external view validAuction(auctionId) returns (bool) {
        Auction storage auction = auctions[auctionId];
        return block.timestamp < auction.endTime && !auction.settled;
    }

    /**
     * @notice Emergency withdrawal for owner (only if contract is broken)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }
}
