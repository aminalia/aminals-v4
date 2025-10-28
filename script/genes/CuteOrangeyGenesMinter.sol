// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {GeneRegistry} from "src/genes/GeneRegistry.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/**
 * @title CuteOrangeyGenesMinter
 * @dev Contract to mint initial genes for Cute Orangey Aminal (8 genes)
 * This contract is deployed temporarily just to mint these specific genes, then discarded
 */
contract CuteOrangeyGenesMinter {
    /**
     * @notice Mint genes for Cute Orangey Aminal (8 genes)
     * @param registry The GeneRegistry contract to create genes through
     */
    function mintGenes(GeneRegistry registry) external {
        // ORDER MUST BE RESPECTED AT ALL COSTS:
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId

        registry.createGene(
            ' <g id="BACK"><style>.st2{fill:#8b0}.st12{fill:#fff}.st13{fill:#281c28}.st14{fill:#848484}</style><path fill="#c1e0b6" d="M7 0H1007V1000H7z"/> <ellipse cx="498" cy="976" fill="#a4bf99" rx="164" ry="12"/><circle cx="146" cy="907" r="44" class="st2"/><circle cx="281" cy="874" r="10" class="st2"/> <circle cx="390" cy="828" r="6" class="st2"/><circle cx="463" cy="907" r="14" class="st2"/> <circle cx="572" cy="841" r="6" class="st2"/><circle cx="644" cy="824" r="16" class="st2"/><circle cx="719" cy="936" r="6" class="st2"/><circle cx="762" cy="821" r="7" class="st2"/><circle cx="825" cy="782" r="15" class="st2"/><circle cx="205" cy="549" r="28" class="st2"/> <circle cx="892" cy="600" r="40" class="st2"/> <circle cx="908" cy="726" r="6" class="st2"/><circle cx="933" cy="833" r="18" class="st2"/><circle cx="180" cy="664" r="19" class="st2"/><circle cx="808" cy="269" r="13" class="st2"/><circle cx="929" cy="916" r="35" class="st2"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        registry.createGene(
            '<g id="ARMS"><path fill="#f58531" d="m321 735 10-29 6-14 5-14-38-31-14 30-7 13-9 21-4 17c-1 8 0 17 4 24 5 7 14 12 22 12 8-1 14-6 17-11l8-18z"/><path fill="#e57125" d="M384 500c-8 15-73 131-80 147l38 31c11-26 64-154 65-170l-23-8z"/><path fill="#f58531" d="m685 716-13-31-7-16-6-14c14-11 27-23 39-36l17 32 8 13 11 23c3 6 4 12 5 18 2 9 1 18-3 26s-14 14-23 14c-8 0-15-5-19-11l-9-18z"/> <path fill="#e57125" d="M602 470c9 16 88 133 96 149-12 13-25 25-39 36C646 628 575 506 572 489l30-19z"/> </g>',
            IAminalStructs.VisualsCat.ARM
        );

        registry.createGene(
            ' <g id="TAIL"><path fill="#e58440" d="M509 809c0 4-5 8-11 8s-11-4-11-8 5-8 11-8 11 4 11 8z"/> <path fill="#ad5026" d="M515 797c0 6-8 12-17 12s-17-6-17-12c0-7 8-13 17-13s17 6 17 13z"/> <path fill="#e67428" d="M532 769c0 14-15 25-34 25s-33-11-33-25 15-24 33-24 34 11 34 24z"/><path fill="#e58440" d="M543 739c0 18-20 33-45 33s-45-15-45-33 20-33 45-33 45 15 45 33z"/> <path fill="#e67428" d="M543 706c0 18-20 33-45 33s-45-15-45-33 20-33 45-33 45 15 45 33z"/></g>',
            IAminalStructs.VisualsCat.TAIL
        );

        registry.createGene(
            '<g id="EARS"><circle cx="355" cy="237" r="54" fill="#ed8741"/> <circle cx="355" cy="237" r="31" fill="#e57125"/><circle cx="643" cy="245" r="54" fill="#ed8741"/><circle cx="643" cy="245" r="31" fill="#e57125"/></g>',
            IAminalStructs.VisualsCat.EARS
        );

        registry.createGene(
            '<path id="BODY" fill="#ed8741" d="M708 403c0 157-94 351-210 351S288 593 288 403c0-116 94-218 210-218S708 287 708 403z"/>',
            IAminalStructs.VisualsCat.BODY
        );

        registry.createGene(
            '<g id="FACE"> <path fill="#f9a369" d="M671 351C671 426 645 462 496 466c-133 4-171-44-171-120S410 191 499 191s172 85 172 160z"/> <path fill="#944" d="M657 344c0 52-23 60-163 63-123 2-158-14-158-66s76-89 158-89 163 41 163 92z"/> <circle cx="371" cy="345" r="29" class="st12"/> <path d="M371 321a24 24 0 1 0 0 48 24 24 0 0 0 0-48zm-1 26c-10 0-18-5-18-12s8-12 18-12 18 6 18 12-8 12-18 12z" class="st13"/><ellipse cx="370" cy="335" class="st14" rx="18" ry="12"/><circle cx="357" cy="332" r="2" class="st12"/> <circle cx="362" cy="329" r="1" class="st12"/> <circle cx="624" cy="345" r="29" class="st12"/> <path d="M624 321a24 24 0 1 0 0 48 24 24 0 0 0 0-48zm-1 26c-10 0-18-5-18-12s8-12 18-12 18 6 18 12-8 12-18 12z" class="st13"/> <ellipse cx="623" cy="335" class="st14" rx="18" ry="12"/> <circle cx="610" cy="332" r="2" class="st12"/> <circle cx="615" cy="329" r="1" class="st12"/> </g>',
            IAminalStructs.VisualsCat.FACE
        );

        registry.createGene(
            ' <g id="MOUTH"> <path fill="#412111" d="M527 353a33 33 0 0 1-66 0c0-18 15-16 33-16s33-2 33 16z"/> <path fill="#c96dab" d="M484 376a8 8 0 1 1 16 0c0 4-4 4-8 4s-8 0-8-4z"/></g>',
            IAminalStructs.VisualsCat.MOUTH
        );

        registry.createGene(
            '<g id="MISC"> <path fill="#ffce07" d="m510 205 4 7c1 4 4 6 8 6l8 2c9 1 13 12 6 19l-6 5a11 11 0 0 0-3 10l1 8c2 9-8 16-16 12l-7-4a11 11 0 0 0-10 0l-7 4c-8 4-18-3-16-12l1-8c1-4-1-7-3-10l-6-5c-7-7-3-18 6-19l8-2a11 11 0 0 0 8-6l4-7c4-8 16-8 20 0z"/><path fill="#fff" d="m506 220 2 4c1 2 3 4 5 4l5 1c6 1 8 8 4 12l-3 3a7 7 0 0 0-2 6v5c1 5-4 10-10 7l-4-2h-6l-4 2c-6 3-11-2-10-7v-5c1-2 0-5-2-6l-3-3c-4-4-2-11 4-12l5-1a7 7 0 0 0 5-4l2-4c2-5 10-5 12 0z"/><path fill="#ffce07" d="m453 240 2 4a6 6 0 0 0 4 3h4c4 1 6 7 3 10l-3 3a6 6 0 0 0-2 4l1 4c1 5-4 8-8 6l-4-2a6 6 0 0 0-5 0l-3 2c-4 2-9-1-8-6v-4a6 6 0 0 0-1-4l-3-3c-3-3-2-9 3-10h4a6 6 0 0 0 4-3l2-4c2-4 8-4 10 0zm104 0 2 4a6 6 0 0 0 4 3h4c4 1 6 7 3 10l-3 3a6 6 0 0 0-2 4l1 4c1 5-4 8-8 6l-3-2a6 6 0 0 0-6 0l-3 2c-4 2-9-1-8-6v-4a6 6 0 0 0-1-4l-3-3c-3-3-2-9 3-10h4a6 6 0 0 0 4-3l2-4c2-4 8-4 10 0z"/></g>',
            IAminalStructs.VisualsCat.MISC
        );
    }
}
