// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {IAminalStructs} from "src/IAminalStructs.sol";

// TODO: This is a deprecated contract, replaced by GeneAuction.sol
// Kept as minimal stub to avoid breaking existing imports
contract VisualsAuction is IAminalStructs {
    
    struct Auction {
        uint256 aminalIdOne;
        uint256 aminalIdTwo;
        uint256 totalLove;
        uint256[8][10] visualIds;
        uint256[8][10] visualIdVotes;
        uint256[8][10] visualNoVotes;
        uint256 childAminalId;
        uint256[8] winnerId;
        bool ended;
    }

    mapping(uint256 auctionId => Auction auction) public auctions;
    uint256 public auctionCnt = 2;

    event StartAuction(
        uint256 indexed auctionId,
        uint256 indexed aminalIdOne,
        uint256 indexed aminalIdTwo,
        uint256 totalLove,
        uint256[8][10] visualIds
    );

    event EndAuction(
        uint256 indexed auctionId,
        uint256 aminalIdOne,
        uint256 aminalIdTwo,
        uint256 childAminalId,
        uint256[8] winningIds
    );

    event ProposeVisual(uint256 indexed auctionId, address sender, uint256 visualId, VisualsCat catEnum);
    event RemoveVisual(uint256 indexed auctionId, address sender, uint256 visualId, VisualsCat catEnum);
    event VisualsVote(
        uint256 indexed auctionId,
        uint256 visualId,
        address sender,
        VisualsCat catEnum,
        uint256 userLoveVote,
        uint256 totalLove
    );

    constructor(address, address) {
        // Deprecated constructor - kept for compatibility
    }

    function setup(address) external {
        // Deprecated setup - kept for compatibility  
    }

    function getAuctionByID(uint256 auctionID) public view returns (Auction memory) {
        return auctions[auctionID];
    }

    function startAuction(uint256 aminalIdOne, uint256 aminalIdTwo) public returns (uint256) {
        // TODO: Replace with GeneAuction integration
        return 1; // Placeholder return
    }

    function proposeVisual(uint256, VisualsCat, uint256) public payable {
        // TODO: Replace with GeneAuction integration
        revert("Use GeneAuction instead");
    }

    function voteVisual(uint256, VisualsCat, uint256) public payable {
        // TODO: Replace with GeneAuction integration
        revert("Use GeneAuction instead");
    }

    function endAuction(uint256) public {
        // TODO: Replace with GeneAuction integration
        revert("Use GeneAuction instead");
    }
}