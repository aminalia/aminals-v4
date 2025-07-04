// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {IAminalStructs} from "src/IAminalStructs.sol";

interface IAminal is IAminalStructs {
    function callSkill(address skillAddress, bytes calldata data) external payable;
    function feed() external payable returns (uint256);
    function squeak(uint256 amount) external payable;
    // TODO rename to something cuter
    function setBreedableWith(address partner, bool status) external;
    // TODO rename to get genes
    function getVisuals() external view returns (Visuals memory);
    function getLoveByUser(address user) external view returns (uint256);
    function getTotalLove() external view returns (uint256);
    function getEnergy() external view returns (uint256);
    function isBreedableWith(address partner) external view returns (bool);
    function tokenURI() external view returns (string memory);
    function transferEnergyToOwner(uint256 amount, address recipient) external;

    error NotEnoughEther();
    error NotEnoughLove();
    error NotEnoughEnergy();
    error NotRegisteredSkill();
    error OnlyFactory();
    error AminalDoesNotExist();
    error EnergyTransferFailed();
}
