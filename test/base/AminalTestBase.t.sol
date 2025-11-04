// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {AminalFactory} from "src/AminalFactory.sol";
import {Aminal as AminalContract} from "src/Aminal.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";
import {GeneAuction} from "src/genes/GeneAuction.sol";
import {AminalProposals} from "src/proposals/AminalProposals.sol";
import {Genes} from "src/genes/Genes.sol";
import {GeneRegistry} from "src/genes/GeneRegistry.sol";

/**
 * @title AminalTestBase
 * @notice Base contract for Aminal-related tests
 */
abstract contract AminalTestBase is Test, IAminalStructs {
    AminalFactory public factory;
    GeneAuction public geneAuction;
    AminalProposals public proposals;
    Genes public genes;
    GeneRegistry public geneRegistry;

    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);
    address public david = address(0x4);
    address public eve = address(0x5);

    function setUp() public virtual {
        // Deploy all contracts - NO MOCKS
        genes = new Genes();
        geneRegistry = new GeneRegistry(address(genes));
        geneAuction = new GeneAuction(address(genes), address(geneRegistry));
        proposals = new AminalProposals();

        // Deploy AminalFactory
        factory = new AminalFactory();
        factory.initialize(address(geneAuction), address(proposals), address(genes));

        // Setup contracts
        genes.setup(address(factory), address(geneRegistry));
        geneAuction.setup(address(factory)); // AminalFactory is the aminalsContract
        proposals.setup(address(factory));
        factory.setup();

        // Give test accounts ETH
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
        vm.deal(david, 10 ether);
        vm.deal(eve, 10 ether);
    }

    /**
     * @dev Helper function to spawn test Aminals
     */
    function spawnTestAminal() internal returns (address) {
        Visuals[] memory initialVisuals = new Visuals[](1);
        for (uint256 i = 0; i < 8; i++) {
            initialVisuals[0].genes[i] = 1;
        }

        factory.spawnInitialAminals(initialVisuals);
        return factory.getAminalByIndex(factory.totalAminals() - 1);
    }

    /**
     * @dev Helper function to create initial Aminals for testing
     */
    function createParentAminals() internal returns (address, address) {
        Visuals[] memory initialVisuals = new Visuals[](2);
        // Both aminals have all genes set to 0 (empty/default)
        // The gene arrays are already initialized to 0 by default

        factory.spawnInitialAminals(initialVisuals);
        address aminal1 = factory.getAminalByIndex(0);
        address aminal2 = factory.getAminalByIndex(1);
        return (aminal1, aminal2);
    }

    /**
     * @dev Helper function to create a gene with metadata for testing
     */
    function createTestGene(string memory svg, string memory name, string memory category)
        internal
        returns (uint256)
    {
        return geneRegistry.createGene(svg, name, "", category);
    }
}
