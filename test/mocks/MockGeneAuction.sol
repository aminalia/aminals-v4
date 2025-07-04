// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {IAminalStructs} from "src/IAminalStructs.sol";

contract MockGeneAuction is IAminalStructs {
    uint256 public auctionCounter;

    struct MockAuction {
        uint256 aminalOne;
        uint256 aminalTwo;
        uint256 totalLove;
        bool exists;
    }

    mapping(uint256 => MockAuction) public auctions;

    event AuctionCreated(
        uint256 indexed auctionId,
        uint256 indexed aminalOne,
        uint256 indexed aminalTwo,
        uint256 totalLove
    );

    function createAuction(
        uint256 aminalOne,
        uint256 aminalTwo,
        uint256 totalLove
    ) external returns (uint256 auctionId) {
        auctionId = ++auctionCounter;

        auctions[auctionId] = MockAuction({
            aminalOne: aminalOne,
            aminalTwo: aminalTwo,
            totalLove: totalLove,
            exists: true
        });

        emit AuctionCreated(auctionId, aminalOne, aminalTwo, totalLove);

        return auctionId;
    }

    function getAuctionInfo(
        uint256 auctionId
    )
        external
        view
        returns (
            uint256 aminalOne,
            uint256 aminalTwo,
            uint256 totalLove,
            bool exists
        )
    {
        MockAuction storage auction = auctions[auctionId];
        return (
            auction.aminalOne,
            auction.aminalTwo,
            auction.totalLove,
            auction.exists
        );
    }

    function isAuctionActive(uint256 auctionId) external view returns (bool) {
        return auctions[auctionId].exists;
    }
}
