// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {IAminalStructs} from "src/IAminalStructs.sol";

interface IAminal is IAminalStructs {
    function callSkill(address skillAddress, bytes calldata data) external payable;
    function feed() external payable returns (uint256);
    function squeak(uint256 amount) external payable;
    function setBreedableWith(address partner, bool status) external;
    function getVisuals() external view returns (Visuals memory);
    function getLoveByUser(address user) external view returns (uint256);
    function getTotalLove() external view returns (uint256);
    function getEnergy() external view returns (uint256);
    function isBreedableWith(address partner) external view returns (bool);
    function tokenURI() external view returns (string memory);

    error NotEnoughEther();
    error NotEnoughLove();
    error NotEnoughEnergy();
    error NotRegisteredSkill();
    error OnlyFactory();
    error AminalDoesNotExist();
}
