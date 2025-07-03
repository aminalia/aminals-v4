// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

contract MockVisualsAuction {
    uint256 private _auctionCounter;
    
    function startAuction(address aminalOne, address aminalTwo) external returns (uint256) {
        return ++_auctionCounter;
    }
}