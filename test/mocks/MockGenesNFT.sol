// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {IAminalStructs} from "src/IAminalStructs.sol";

contract MockGenesNFT is IAminalStructs {
    function mint(address to, string memory svg, VisualsCat category) external {
        // Mock implementation
    }
}