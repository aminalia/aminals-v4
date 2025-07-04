// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {ERC721} from "oz/token/ERC721/ERC721.sol";
import {Initializable} from "oz/proxy/utils/Initializable.sol";
import {Ownable} from "oz/access/Ownable.sol";

import {IAminalStructs} from "src/IAminalStructs.sol";

error OnlyAminalsNFT();
error OnlyNFTOwner();
error OnlyFactory();
error AlreadySetup();

contract GenesNFT is ERC721("GenesNFT", "GENES"), Initializable, Ownable {
    address public aminalsNFT;
    address public geneFactory;
    uint256 public currentId;
    mapping(uint256 id => string) public geneSVGs;
    mapping(uint256 id => IAminalStructs.VisualsCat) public geneVisualsCat;

    modifier onlyAminalsNFT() {
        if (msg.sender != aminalsNFT) revert OnlyAminalsNFT();
        _;
    }

    modifier onlyFactory() {
        if (msg.sender != geneFactory) revert OnlyFactory();
        _;
    }

    modifier onlyAminalsNFTOrFactory() {
        if (msg.sender != aminalsNFT && msg.sender != geneFactory)
            revert OnlyFactory();
        _;
    }

    event Setup(address aminalsNFT);
    event FactorySet(address geneFactory);

    constructor() Initializable() Ownable() {}

    function setup(address aminalsNFT_) external initializer onlyOwner {
        aminalsNFT = aminalsNFT_;

        emit Setup(aminalsNFT_);
    }

    function setFactory(address geneFactory_) external onlyOwner {
        geneFactory = geneFactory_;
        emit FactorySet(geneFactory_);
    }

    function mint(
        address to,
        string calldata geneSVG,
        IAminalStructs.VisualsCat visualsCategory
    ) external onlyAminalsNFTOrFactory {
        uint256 tokenId = currentId;
        geneSVGs[tokenId] = geneSVG;
        geneVisualsCat[tokenId] = visualsCategory;

        ++currentId;
        _mint(to, tokenId);
    }

    // Can only be burnt by the holder
    function burn(uint256 id) external {
        if (msg.sender != ownerOf(id)) revert OnlyNFTOwner();
        _burn(id);
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "https://aminals.io/gene-metadata/";
    }

    /**
     * @notice Get Gene NFT information
     */
    function getGeneInfo(
        uint256 id
    )
        external
        view
        returns (string memory svg, IAminalStructs.VisualsCat category)
    {
        return (geneSVGs[id], geneVisualsCat[id]);
    }
}
