// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/**
 * @title BlueAnimatedGenesMinter
 * @dev Contract to mint initial genes for Blue Animated Aminal (8 genes)
 * This contract is deployed temporarily just to mint these specific genes, then discarded
 */
contract BlueAnimatedGenesMinter {
    /**
     * @notice Allow contract to receive ETH for gene creator payouts
     */
    receive() external payable {}

    /**
     * @notice Mint genes for Blue Animated Aminal (8 genes)
     * @param registry The GeneRegistry contract to create genes through
     * @dev Mints all genes to msg.sender (the account running the script)
     */
    function mintGenes(GeneRegistry registry) external {
        // ORDER MUST BE RESPECTED AT ALL COSTS:
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId

        registry.createGeneFor(
            msg.sender,
            '<g id="BACK"><rect fill="#4e2f91" x="0" y="0" width="1000px" height="1000px"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        registry.createGeneFor(
            msg.sender,
            ' <g id="arms" opacity="0.9"> <path fill="#496cb4" d="M743 620c5 5 7 11 6 18l-2 6c-1 2-3 3-5 2-3-1-4-4-5-7-2-5-4-11-3-17M729 634c4 9 7 19 6 29 0 3-2 7-5 8l-5-2-3-6c-2-7-3-15-3-22M714 643c2 5 2 10 1 15-1 2-2 5-4 6l-5-2-2-5c-2-5-1-11 0-17M692 623c-4 7-6 15-6 23l1 5c1 1 3 3 5 3l4-5 5-15"/>  <path fill="#82abdb" d="m742 549-6-27-52 40v39c0 10 0 20 3 29 4 9 10 17 19 20 12 4 24-1 32-10 7-9 10-21 11-33 2-19-3-39-7-58Z"/> <path fill="#6f9dcb" d="m709 410-20 60-2 34 35-38-13-56Z"/>  <path fill="#77a9da" d="m687 504-3 58 52-40-14-57-35 39Z"/>   <path fill="#496cb4" d="M257 623c-5 5-7 11-6 18 0 2 0 4 2 6s3 3 5 2c3-1 4-4 5-7 2-5 4-11 3-17M271 637c-4 9-7 19-6 29 0 3 2 7 5 8l5-2 3-6c2-7 3-15 3-22M286 646c-2 5-2 10-1 15 1 2 2 5 4 6l5-2 2-5c2-5 1-11 0-17M308 626c4 7 6 15 6 23l-1 5c-1 1-3 3-5 3l-4-5-5-15"/>  <path fill="#82abdb" d="m258 552 6-27 52 40v39c0 10 0 20-3 29-4 9-10 17-19 20-12 4-24-1-32-10-7-9-10-21-11-33-2-19 3-39 7-58Z"/> <path fill="#6f9dcb" d="m291 413 20 60 2 34-35-39 13-55Z"/> <path fill="#77a9da" d="m313 507 3 58-52-40 14-57 35 39Z"/>  <animateTransform attributeName="transform" type="rotate"  values="0 500 500; 2 500 500; 0 500 500; -2 500 500; 0 500 500"    dur="5s" repeatCount="indefinite"/>  </g>',
            IAminalStructs.VisualsCat.ARM
        );

        registry.createGeneFor(
            msg.sender,
            '  <g id="tail" opacity="0.9"><path fill="#77a9da" d="m460 695-2-13c-14-2-29-5-42-9l1 29c14 4 29 5 44 6l-2-13Z"/><path fill="#77a9da" d="m465 735-4-27c-15-1-30-2-44-6v13l2 20h45Z"/> <path fill="#82abdb" d="m419 735 3 15c3 7 7 13 13 17 7 4 16 4 22 0 5-3 8-9 9-15l-2-17h-45Z"/> <path fill="#71a0ce" d="m414 628 2 45 42 9c-2-25-5-43-10-56l-34 2Z"/>  <path fill="#77a9da" d="m542 692 1-13 42-12v29c-14 5-29 7-44 10l1-14Z"/> <path fill="#77a9da" d="m540 733 1-27c15-3 30-5 44-10l1 13v21l-46 3Z"/>  <path fill="#82abdb" d="m586 730-3 15c-2 7-6 13-12 18-6 4-15 5-22 1-5-3-9-9-10-15l1-16 46-3Z"/>  <path fill="#71a0ce" d="m583 622 2 45-42 12c0-24 2-43 6-56l34-1Z"/>  <animateTransform attributeName="transform" type="rotate"   values="0 500 650; 5 500 650; 0 500 650; -5 500 650; 0 500 650"   dur="2s" repeatCount="indefinite"/> </g>',
            IAminalStructs.VisualsCat.TAIL
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="ears" opacity="0.95"> <path fill="#e4f5fd" d="M425 234c-2-9-12-14-20-11-23 7-48 15-67 0 9-9 11-22 9-35l-4-14c-1-3-4-2-4 0 1 13 2 29-9 38l-1 1c-17-23-15-53-14-81l1-23c5 1 10 0 15-2 21-9 21-30 17-49-1-5-7-4-7 1 1 10 2 21-3 30-5 7-14 10-22 8l2-28c0-7-10-8-11-1l-8 63-2 11c-10 3-22 7-30-1-9-10-8-25-6-38l-2-3-4 2c-2 7-4 15-4 22-1 12 5 27 16 34 9 4 19 4 29 3-1 13-1 26 2 39-5 6-11 11-18 12-8 1-16-6-17-13 0-3-4-3-4 0 0 11 10 21 21 22 8 0 15-4 22-8 2 6 6 12 10 18 25 36 64 33 101 24 9-2 15-12 12-21ZM575 234c2-9 12-14 20-11 23 7 48 15 66 0-8-9-10-22-8-35l4-14c0-3 4-2 4 0-1 13-2 29 8 38l2 1c17-23 15-53 14-81l-1-23c-5 1-10 0-15-2-21-9-21-30-17-49 1-5 7-4 7 1-1 10-2 21 3 30 5 7 14 10 22 8l-2-28c0-7 10-8 11-1a136601 136601 0 0 0 10 74c10 3 22 7 30-1 9-10 8-25 6-38l2-3 4 2c2 7 4 15 4 22 1 12-5 27-16 34-9 4-19 4-29 3 1 13 1 26-2 39 5 6 11 11 18 12 8 1 16-6 17-13 0-3 4-3 4 0 0 11-10 21-21 22-8 0-15-4-22-8-2 6-6 12-10 18-25 36-64 33-101 24-9-2-15-12-12-21Z"/>  <path fill="#77a9da" d="M310 335c-20-17-40-45-44-63-3-18 15-46 35-44 17 1 50 18 67 31"/>  <path fill="#5f53a3" d="M322 329a98 98 0 0 1-32-43c-3-13 11-33 26-32 13 1 37 13 50 21"/> <path fill="#77a9da" d="M683 337c21-14 44-39 50-57 6-17-9-47-29-48-18 0-52 13-70 23"/>  <path fill="#5f53a3" d="M672 331c15-10 32-27 36-40 4-12-7-33-22-34-14-1-39 8-52 15"/>  <animateTransform attributeName="transform" type="rotate"   values="0 500 300; 3 500 300; 0 500 300; -2 500 300; 0 500 300"   dur="3s" repeatCount="indefinite"/> </g>',
            IAminalStructs.VisualsCat.EARS
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="body"> <path fill="#77a9da" d="M710 397c0 116-94 282-210 282S290 513 290 397s94-218 210-218 210 102 210 218Z"/>  <path fill="#93b0dc" d="M673 345c0 75-26 111-175 115-133 4-171-45-171-120s82-152 171-152 175 81 175 157Z"/>  </g>',
            IAminalStructs.VisualsCat.BODY
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="face" opacity="0.95"> <path fill="#89cfcb" d="M598 415H402c-35 0-64-29-64-64s22-139 162-69c127-70 162 34 162 69s-29 64-64 64Z"/> </g>   <g id="eyes"> <circle cx="611" cy="351" r="42" fill="#586b7f"/> <circle cx="611" cy="351" r="24" fill="#0a3035"/> <circle cx="598" cy="338" r="2" fill="#fff"/> <circle cx="602" cy="335" r="1" fill="#fff"/> <circle cx="389" cy="351" r="42" fill="#586b7f"/> <circle cx="389" cy="351" r="24" fill="#0a3035"/> <circle cx="375" cy="338" r="2" fill="#fff"/> <circle cx="380" cy="335" r="1" fill="#fff"/>  </g> <g id="nose">   <path fill="#ac95b8" d="M515 302c-7 12-23 12-30 0l-4-8-5-8c-6-11 1-25 14-25h19c13 0 21 14 15 25l-5 8-5 8Z"/>  <circle cx="495" cy="285" r="4" fill="#923018"/>  <circle cx="505" cy="285" r="4" fill="#923018"/>  </g>',
            IAminalStructs.VisualsCat.FACE
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="mouth"> <circle cx="500" cy="354" r="10" fill="#385e5d"/> </g>',
            IAminalStructs.VisualsCat.MOUTH
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="misc" opacity="0.8">  <path fill="#fff" d="M526 205c-24 0-44-19-44-44 0-12 4-23 12-31a44 44 0 1 0 44 73l-12 2Z"/>  <path fill="#fcfcfc" d="m500 549-19-34-20-34h78l-20 34-19 34z"/>  <animate attributeName="opacity" values="0.8; 1; 0.8" dur="2s" repeatCount="indefinite"/> </g>',
            IAminalStructs.VisualsCat.MISC
        );
    }
}
