// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/**
 * @title RedAnimatedGenesMinter
 * @dev Contract to mint initial genes for Red Animated Aminal (8 genes)
 * This contract is deployed temporarily just to mint these specific genes, then discarded
 */
contract RedAnimatedGenesMinter {
    /**
     * @notice Allow contract to receive ETH for gene creator payouts
     */
    receive() external payable {}

    /**
     * @notice Mint genes for Red Animated Aminal (8 genes)
     * @param registry The GeneRegistry contract to create genes through
     * @dev Mints all genes to msg.sender (the account running the script)
     */
    function mintGenes(GeneRegistry registry) external {
        // ORDER MUST BE RESPECTED AT ALL COSTS:
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId

        registry.createGeneFor(
            msg.sender,
            '<g><rect fill="#00a79d" x="0" y="0" width="1000px" height="1000px"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        registry.createGeneFor(
            msg.sender,
            ' <g id="arms" opacity="0.9">  <path fill="#e01f26" d="M293 378c-31 37-68 71-112 93 22 1 42-2 64-2-10 1-21 4-31 9l42-5-35 28 33-16-26 21c5-1 9-4 14-7l-24 17c-6 4-19 12-27 13 20-1 41-5 60-13-12 8-23 19-33 30l30-20c-10 8-19 19-26 31l26-24c-14 13-22 35-32 51l47-47c-16 25-26 53-33 83 8-18 18-35 33-49-15 58-13 114 2 172-1-19 0-39 5-58 6 62 27 119 61 172-22-62-35-125-38-192 6 21 12 42 20 63l-4-99c4 16 9 28 19 42-9-32-14-64-12-98 4 14 8 28 20 38-13-30-19-60-18-94 4 18 10 36 16 53 0-40 2-79 8-119l12 42c1-19 3-38 7-56M707 378c31 37 68 71 112 93-22 1-42-2-64-2 10 1 21 4 31 9l-42-5 35 28-33-16 26 21c-5-1-9-4-14-7l24 17c6 4 19 12 27 13-20-1-41-5-60-13 12 8 23 19 33 30l-30-20c10 8 19 19 26 31l-26-24c14 13 22 35 32 51l-47-47c16 25 26 53 33 83-8-18-18-35-33-49 15 58 13 114-2 172 1-19 0-39-5-58-6 62-27 119-61 172 22-62 35-125 38-192-6 21-12 42-20 63l4-99c-4 16-9 28-19 42 9-32 14-64 12-98-4 14-8 28-20 38 13-30 19-60 18-94-4 18-10 36-16 53 0-40-2-79-8-119l-12 42c-1-19-3-38-7-56"/> <animateTransform attributeName="transform" type="rotate" values="0 500 400; 5 500 400; 0 500 400; -5 500 400; 0 500 400" dur="4s" repeatCount="indefinite"/> </g>',
            IAminalStructs.VisualsCat.ARM
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="tail" opacity="0.9"> <path fill="#f15a29" d="M514 544c22 50 22 108 1 159-14 38-38 85-10 121 5 7 13 11 23 13 10 1 21-1 28-8 5-5 8-15 3-22-2-3-7-4-11-3-8 3-4 14 1 19 6 4 13 4 21 2 17-5 28-20 43-30 10-6 24-9 35-2-5-2-11-2-17-1-5 1-11 3-15 7-14 10-25 27-42 35-9 4-21 5-30-1-11-7-16-26-5-37 8-7 21-7 30-1 14 9 15 30 7 44-13 24-47 30-71 18-33-16-46-56-42-91 1-25 10-50 17-74 6-21 9-42 6-63-2-20-8-41-18-59l47-23Z"/>  <animateTransform attributeName="transform" type="rotate" values="0 500 700; 8 500 700; 0 500 700; -8 500 700; 0 500 700" dur="3s" repeatCount="indefinite"/> </g>',
            IAminalStructs.VisualsCat.TAIL
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="ears" opacity="0.95"> <path fill="#e01f26" d="M335 346c-19-63-24-132-12-198 33 43 71 83 114 117"/> <path fill="#b22024" d="M340 287c-5-16-8-33-7-50l4 8v-39c12 16 28 31 46 41"/> <path fill="#e01f26" d="M665 342c19-63 24-132 12-198-33 43-71 83-114 117"/> <path fill="#b22024" d="M660 283c5-16 8-33 7-50l-4 8v-39c-12 16-28 31-46 41"/> <animateTransform attributeName="transform" type="rotate" values="0 500 300; 6 500 300; 0 500 300; -4 500 300; 0 500 300" dur="2.5s" repeatCount="indefinite"/> </g>',
            IAminalStructs.VisualsCat.EARS
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="body"> <path fill="#e01f26" d="M710 398c0 116-94 281-210 281S290 514 290 398s94-218 210-218 210 102 210 218Z"/>  <circle cx="500" cy="375" r="188" fill="#e01f26"/> <path fill="#e01f26" d="m312 518 52 185v-44c10 24 28 46 50 63l-15-38c15 16 27 35 37 54-2-15 1-31 8-45 2 10 7 20 14 29l-2-22 29 19c-2-6-3-13-1-20l11 23 12-25v56l35-64 2 34c5-14 13-28 24-40l-1 37 57-83-3 33c31-57 52-118 63-181l-5 4"/> <animateTransform attributeName="transform" type="scale" values="1; 1.02; 1; 0.99; 1" dur="5s" repeatCount="indefinite"/> </g>',
            IAminalStructs.VisualsCat.BODY
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="face" opacity="0.95"> <rect width="323" height="126" x="338" y="289" fill="#f5a035" rx="63" ry="63"/> </g>   <g id="eyes"> <circle cx="388" cy="352" r="41" fill="#f5d235"/>  <circle cx="388" cy="352" r="38" fill="#0a3035"/>  <circle cx="367" cy="331" r="3" fill="#fff"/>   <circle cx="374" cy="325" r="1" fill="#fff"/>  <circle cx="612" cy="352" r="41" fill="#e01f26"/>  <circle cx="612" cy="352" r="38" fill="#0a3035"/> <circle cx="590" cy="331" r="3" fill="#fff"/> <circle cx="597" cy="325" r="1" fill="#fff"/> </g> <g id="nose" fill="#923018"> <circle cx="495" cy="307" r="3"/> <circle cx="505" cy="307" r="3"/> </g>',
            IAminalStructs.VisualsCat.FACE
        );

        registry.createGeneFor(
            msg.sender,
            '<g id="mouth"> <rect width="77" height="45" x="461" y="335" fill="#0a3035" rx="22" ry="22"/> <path fill="#fffbd0" d="M492 336c0 2-2 5-5 5s-5-2-5-5M518 336c0 2-2 5-5 5s-5-2-5-5"/>  <circle cx="499" cy="364" r="13" fill="#001a2a"/> <path fill="#7c0506" d="M485 380c0-8 7-12 14-12s14 4 14 12"/> </g>',
            IAminalStructs.VisualsCat.MOUTH
        );

        registry.createGeneFor(
            msg.sender,
            ' <g id="misc" opacity="0.85"> <path fill="#1c4349" d="m474 350-4 8 1 9M481 351l-4 8c0 3 0 6 2 8M523 350l4 8-1 9M516 351l4 8c0 3 0 6-2 8"/>  <path fill="#eba220" d="m530 17-51 83-8-20 81 9-67 78-9-20 66 5 17 1-77 60 54-59 4 11-96 8 71-83 8 20-84-9 89-84Z"/> </g>',
            IAminalStructs.VisualsCat.MISC
        );
    }
}
