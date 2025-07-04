// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";
import {IProposals} from "src/proposals/IProposals.sol";
import {GeneAuction} from "src/utils/GeneAuction.sol";
import {GenesNFT} from "src/nft/GenesNFT.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";

contract AminalFactory is IAminalStructs, Initializable, Ownable {
    uint256 public totalAminals;
    GeneAuction public geneAuction;
    bool public initialAminalSpawned;

    mapping(address => bool) public isAminal;
    mapping(uint256 => address) public aminalsByIndex;

    AminalProposals public proposals;
    GenesNFT public genesNFT;

    /// @notice Body parts (SVG strings)
    VisualTrait[] public backgrounds;
    VisualTrait[] public arms;
    VisualTrait[] public tails;
    VisualTrait[] public ears;
    VisualTrait[] public bodies;
    VisualTrait[] public faces;
    VisualTrait[] public mouths;
    VisualTrait[] public miscs;

    struct VisualTrait {
        string svg;
        address creator;
    }

    event TraitAdded(
        uint256 indexed id,
        VisualsCat indexed category,
        string svg,
        address indexed creator
    );

    event AminalSpawned(
        address indexed aminalAddress,
        uint256 indexed aminalIndex,
        uint256 indexed mom,
        uint256 dad,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    );

    event BreedAminal(
        address indexed aminalOne,
        address indexed aminalTwo,
        uint256 auctionId
    );

    modifier onlyAminal() {
        require(isAminal[msg.sender], "Only Aminal contracts can call this");
        _;
    }

    modifier onlyAuction() {
        require(
            msg.sender == address(geneAuction),
            "Only auction contract can call this"
        );
        _;
    }

    modifier onlyProposal() {
        require(
            msg.sender == address(proposals),
            "Only proposal contract can call this"
        );
        _;
    }

    constructor() {
        _transferOwnership(msg.sender);
    }

    function initialize(
        address _geneAuction,
        address _aminalProposals,
        address _genesNFT
    ) external initializer onlyOwner {
        geneAuction = GeneAuction(_geneAuction);
        genesNFT = GenesNFT(_genesNFT);
        proposals = AminalProposals(_aminalProposals);
    }

    function setup() external {
        string memory emptySVG = "";
        addBackground(emptySVG);
        addArm(emptySVG);
        addTail(emptySVG);
        addEar(emptySVG);
        addBody(emptySVG);
        addFace(emptySVG);
        addMouth(emptySVG);
        addMisc(emptySVG);
    }

    function spawnInitialAminals(
        Visuals[] calldata _visuals
    ) external onlyOwner {
        require(!initialAminalSpawned, "Initial Aminals already spawned");
        initialAminalSpawned = true;
        for (uint256 i = 0; i < _visuals.length; i++) {
            _spawnAminal(
                address(0),
                address(0),
                _visuals[i].backId,
                _visuals[i].armId,
                _visuals[i].tailId,
                _visuals[i].earsId,
                _visuals[i].bodyId,
                _visuals[i].faceId,
                _visuals[i].mouthId,
                _visuals[i].miscId
            );
        }
    }

    function spawnAminal(
        address momAddress,
        address dadAddress,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    ) external onlyAuction returns (address) {
        return
            _spawnAminal(
                momAddress,
                dadAddress,
                backId,
                armId,
                tailId,
                earsId,
                bodyId,
                faceId,
                mouthId,
                miscId
            );
    }

    // TODO remove this, use prank instead to spawn Aminals in tests
    // For testing purposes - allows owner to spawn additional Aminals
    function spawnAminalForTesting(
        address momAddress,
        address dadAddress,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    ) external onlyOwner returns (address) {
        return
            _spawnAminal(
                momAddress,
                dadAddress,
                backId,
                armId,
                tailId,
                earsId,
                bodyId,
                faceId,
                mouthId,
                miscId
            );
    }

    function spawnAminalFromAuction(
        address momAddress,
        address dadAddress,
        uint256[8] calldata winningGeneIds
    ) external onlyAuction returns (address) {
        // Map winning gene IDs to trait IDs
        // For now, use gene IDs directly as trait IDs
        // TODO: Implement proper gene-to-trait mapping when Gene NFT system is complete
        return
            _spawnAminal(
                momAddress,
                dadAddress,
                winningGeneIds[0], // BACK
                winningGeneIds[1], // ARM
                winningGeneIds[2], // TAIL
                winningGeneIds[3], // EARS
                winningGeneIds[4], // BODY
                winningGeneIds[5], // FACE
                winningGeneIds[6], // MOUTH
                winningGeneIds[7] // MISC
            );
    }

    function _spawnAminal(
        address momAddress,
        address dadAddress,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    ) internal returns (address) {
        Visuals memory visuals = Visuals({
            backId: backId,
            armId: armId,
            tailId: tailId,
            earsId: earsId,
            bodyId: bodyId,
            faceId: faceId,
            mouthId: mouthId,
            miscId: miscId
        });

        AminalContract newAminal = new AminalContract(
            address(this),
            momAddress,
            dadAddress,
            visuals,
            totalAminals
        );

        address aminalAddress = address(newAminal);
        isAminal[aminalAddress] = true;
        aminalsByIndex[totalAminals] = aminalAddress;
        totalAminals++;

        emit AminalSpawned(
            aminalAddress,
            totalAminals - 1,
            momAddress == address(0)
                ? 0
                : AminalContract(payable(momAddress)).aminalIndex(),
            dadAddress == address(0)
                ? 0
                : AminalContract(payable(dadAddress)).aminalIndex(),
            backId,
            armId,
            tailId,
            earsId,
            bodyId,
            faceId,
            mouthId,
            miscId
        );

        return aminalAddress;
    }

    function getAminalByIndex(uint256 index) external view returns (address) {
        require(index < totalAminals, "Index out of bounds");
        return aminalsByIndex[index];
    }

    function getAminalVisualsByAddress(
        address aminalAddress
    ) external view returns (Visuals memory) {
        require(isAminal[aminalAddress], "Not an Aminal contract");
        return AminalContract(payable(aminalAddress)).getVisuals();
    }

    // TODO rename to breedAminals
    function breedWith(
        address aminalOne,
        address aminalTwo
    ) external payable returns (uint256 auctionId) {
        require(msg.value >= 0.001 ether, "Not enough ether");
        require(
            isAminal[aminalOne] && isAminal[aminalTwo],
            "Invalid Aminal addresses"
        );

        AminalContract aminal1 = AminalContract(payable(aminalOne));
        AminalContract aminal2 = AminalContract(payable(aminalTwo));

        require(aminal1.getLoveByUser(msg.sender) >= 10, "Not enough love");
        require(!aminal1.isBreedableWith(aminalTwo), "Already breedable");

        if (aminal2.isBreedableWith(aminalOne)) {
            require(
                aminal1.getEnergy() >= 10 && aminal2.getEnergy() >= 10,
                "Not enough energy"
            );

            // TODO this seems weird.
            // Calculate total love for auction
            uint256 totalLove = aminal1.getLoveByUser(msg.sender) +
                aminal2.getLoveByUser(msg.sender);

            auctionId = geneAuction.createAuction(
                aminal1.aminalIndex(),
                aminal2.aminalIndex(),
                totalLove
            );
            emit BreedAminal(aminalOne, aminalTwo, auctionId);

            return auctionId;
        } else {
            aminal1.setBreedableWith(aminalTwo, true);
            emit BreedAminal(aminalOne, aminalTwo, 0);
            return 0;
        }
    }

    // SVG Parts - delegated to AminalsDescriptor parent contract
    function addBackground(
        string memory background
    ) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(background, msg.sender);
        backgrounds.push(trait);
        emit TraitAdded(
            backgrounds.length - 1,
            VisualsCat.BACK,
            background,
            msg.sender
        );
        return backgrounds.length - 1;
    }

    function addArm(string memory arm) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(arm, msg.sender);
        arms.push(trait);
        emit TraitAdded(arms.length - 1, VisualsCat.ARM, arm, msg.sender);
        return arms.length - 1;
    }

    function addTail(string memory tail) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(tail, msg.sender);
        tails.push(trait);
        emit TraitAdded(tails.length - 1, VisualsCat.TAIL, tail, msg.sender);
        return tails.length - 1;
    }

    function addEar(string memory ear) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(ear, msg.sender);
        ears.push(trait);
        emit TraitAdded(ears.length - 1, VisualsCat.EARS, ear, msg.sender);
        return ears.length - 1;
    }

    function addBody(string memory body) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(body, msg.sender);
        bodies.push(trait);
        emit TraitAdded(bodies.length - 1, VisualsCat.BODY, body, msg.sender);
        return bodies.length - 1;
    }

    function addFace(string memory face) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(face, msg.sender);
        faces.push(trait);
        emit TraitAdded(faces.length - 1, VisualsCat.FACE, face, msg.sender);
        return faces.length - 1;
    }

    function addMouth(string memory mouth) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(mouth, msg.sender);
        mouths.push(trait);
        emit TraitAdded(mouths.length - 1, VisualsCat.MOUTH, mouth, msg.sender);
        return mouths.length - 1;
    }

    function addMisc(string memory misc) public returns (uint256 id) {
        VisualTrait memory trait = VisualTrait(misc, msg.sender);
        miscs.push(trait);
        emit TraitAdded(miscs.length - 1, VisualsCat.MISC, misc, msg.sender);
        return miscs.length - 1;
    }

    // Getter functions for trait counts
    function getBackgroundsLength() public view returns (uint256) {
        return backgrounds.length;
    }

    function getArmsLength() public view returns (uint256) {
        return arms.length;
    }

    function getTailsLength() public view returns (uint256) {
        return tails.length;
    }

    function getEarsLength() public view returns (uint256) {
        return ears.length;
    }

    function getBodiesLength() public view returns (uint256) {
        return bodies.length;
    }

    function getFacesLength() public view returns (uint256) {
        return faces.length;
    }

    function getMouthsLength() public view returns (uint256) {
        return mouths.length;
    }

    function getMiscsLength() public view returns (uint256) {
        return miscs.length;
    }

    // TODO breedAminals should replace breedWith, we don't need keep both
    // Alias for breedWith for backwards compatibility
    function breedAminals(
        address aminalOne,
        address aminalTwo
    ) external payable returns (uint256 auctionId) {
        return this.breedWith{value: msg.value}(aminalOne, aminalTwo);
    }
}
