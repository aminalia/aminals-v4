// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {GenesNFT} from "src/genes/GenesNFT.sol";
import {IAminalStructs} from "src/IAminalStructs.sol";

/**
 * @title InitialGenesMinter
 * @dev Temporary contract to mint initial genes for the Aminals ecosystem
 * This contract is deployed temporarily just to mint initial genes, then discarded
 */
contract InitialGenesMinter {
    /**
     * @notice Mint all initial Gene NFTs to seed the ecosystem 🧬
     * @param genesNFT The GenesNFT contract to mint to
     * @param recipient The address to mint genes to
     */
    function mintInitialGenesAnimated(GenesNFT genesNFT, address recipient) external {
        // ORDER MUST BE RESPECTED AT ALL COSTS:
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId

        // CUTE ORANGEY

        genesNFT.mint(
            recipient,
            ' <g id="BACK"><style>.st2{fill:#8b0}.st12{fill:#fff}.st13{fill:#281c28}.st14{fill:#848484}</style><path fill="#c1e0b6" d="M7 0H1007V1000H7z"/> <ellipse cx="498" cy="976" fill="#a4bf99" rx="164" ry="12"/><circle cx="146" cy="907" r="44" class="st2"/><circle cx="281" cy="874" r="10" class="st2"/> <circle cx="390" cy="828" r="6" class="st2"/><circle cx="463" cy="907" r="14" class="st2"/> <circle cx="572" cy="841" r="6" class="st2"/><circle cx="644" cy="824" r="16" class="st2"/><circle cx="719" cy="936" r="6" class="st2"/><circle cx="762" cy="821" r="7" class="st2"/><circle cx="825" cy="782" r="15" class="st2"/><circle cx="205" cy="549" r="28" class="st2"/> <circle cx="892" cy="600" r="40" class="st2"/> <circle cx="908" cy="726" r="6" class="st2"/><circle cx="933" cy="833" r="18" class="st2"/><circle cx="180" cy="664" r="19" class="st2"/><circle cx="808" cy="269" r="13" class="st2"/><circle cx="929" cy="916" r="35" class="st2"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        genesNFT.mint(
            recipient,
            '<g id="ARMS"><path fill="#f58531" d="m321 735 10-29 6-14 5-14-38-31-14 30-7 13-9 21-4 17c-1 8 0 17 4 24 5 7 14 12 22 12 8-1 14-6 17-11l8-18z"/><path fill="#e57125" d="M384 500c-8 15-73 131-80 147l38 31c11-26 64-154 65-170l-23-8z"/><path fill="#f58531" d="m685 716-13-31-7-16-6-14c14-11 27-23 39-36l17 32 8 13 11 23c3 6 4 12 5 18 2 9 1 18-3 26s-14 14-23 14c-8 0-15-5-19-11l-9-18z"/> <path fill="#e57125" d="M602 470c9 16 88 133 96 149-12 13-25 25-39 36C646 628 575 506 572 489l30-19z"/> </g>',
            IAminalStructs.VisualsCat.ARM
        );

        genesNFT.mint(
            recipient,
            ' <g id="TAIL"><path fill="#e58440" d="M509 809c0 4-5 8-11 8s-11-4-11-8 5-8 11-8 11 4 11 8z"/> <path fill="#ad5026" d="M515 797c0 6-8 12-17 12s-17-6-17-12c0-7 8-13 17-13s17 6 17 13z"/> <path fill="#e67428" d="M532 769c0 14-15 25-34 25s-33-11-33-25 15-24 33-24 34 11 34 24z"/><path fill="#e58440" d="M543 739c0 18-20 33-45 33s-45-15-45-33 20-33 45-33 45 15 45 33z"/> <path fill="#e67428" d="M543 706c0 18-20 33-45 33s-45-15-45-33 20-33 45-33 45 15 45 33z"/></g>',
            IAminalStructs.VisualsCat.TAIL
        );

        genesNFT.mint(
            recipient,
            '<g id="EARS"><circle cx="355" cy="237" r="54" fill="#ed8741"/> <circle cx="355" cy="237" r="31" fill="#e57125"/><circle cx="643" cy="245" r="54" fill="#ed8741"/><circle cx="643" cy="245" r="31" fill="#e57125"/></g>',
            IAminalStructs.VisualsCat.EARS
        );

        genesNFT.mint(
            recipient,
            '<path id="BODY" fill="#ed8741" d="M708 403c0 157-94 351-210 351S288 593 288 403c0-116 94-218 210-218S708 287 708 403z"/>',
            IAminalStructs.VisualsCat.BODY
        );

        genesNFT.mint(
            recipient,
            '<g id="FACE"> <path fill="#f9a369" d="M671 351C671 426 645 462 496 466c-133 4-171-44-171-120S410 191 499 191s172 85 172 160z"/> <path fill="#944" d="M657 344c0 52-23 60-163 63-123 2-158-14-158-66s76-89 158-89 163 41 163 92z"/> <circle cx="371" cy="345" r="29" class="st12"/> <path d="M371 321a24 24 0 1 0 0 48 24 24 0 0 0 0-48zm-1 26c-10 0-18-5-18-12s8-12 18-12 18 6 18 12-8 12-18 12z" class="st13"/><ellipse cx="370" cy="335" class="st14" rx="18" ry="12"/><circle cx="357" cy="332" r="2" class="st12"/> <circle cx="362" cy="329" r="1" class="st12"/> <circle cx="624" cy="345" r="29" class="st12"/> <path d="M624 321a24 24 0 1 0 0 48 24 24 0 0 0 0-48zm-1 26c-10 0-18-5-18-12s8-12 18-12 18 6 18 12-8 12-18 12z" class="st13"/> <ellipse cx="623" cy="335" class="st14" rx="18" ry="12"/> <circle cx="610" cy="332" r="2" class="st12"/> <circle cx="615" cy="329" r="1" class="st12"/> </g>',
            IAminalStructs.VisualsCat.FACE
        );

        genesNFT.mint(
            recipient,
            ' <g id="MOUTH"> <path fill="#412111" d="M527 353a33 33 0 0 1-66 0c0-18 15-16 33-16s33-2 33 16z"/> <path fill="#c96dab" d="M484 376a8 8 0 1 1 16 0c0 4-4 4-8 4s-8 0-8-4z"/></g>',
            IAminalStructs.VisualsCat.MOUTH
        );

        genesNFT.mint(
            recipient,
            '<g id="MISC"> <path fill="#ffce07" d="m510 205 4 7c1 4 4 6 8 6l8 2c9 1 13 12 6 19l-6 5a11 11 0 0 0-3 10l1 8c2 9-8 16-16 12l-7-4a11 11 0 0 0-10 0l-7 4c-8 4-18-3-16-12l1-8c1-4-1-7-3-10l-6-5c-7-7-3-18 6-19l8-2a11 11 0 0 0 8-6l4-7c4-8 16-8 20 0z"/><path fill="#fff" d="m506 220 2 4c1 2 3 4 5 4l5 1c6 1 8 8 4 12l-3 3a7 7 0 0 0-2 6v5c1 5-4 10-10 7l-4-2h-6l-4 2c-6 3-11-2-10-7v-5c1-2 0-5-2-6l-3-3c-4-4-2-11 4-12l5-1a7 7 0 0 0 5-4l2-4c2-5 10-5 12 0z"/><path fill="#ffce07" d="m453 240 2 4a6 6 0 0 0 4 3h4c4 1 6 7 3 10l-3 3a6 6 0 0 0-2 4l1 4c1 5-4 8-8 6l-4-2a6 6 0 0 0-5 0l-3 2c-4 2-9-1-8-6v-4a6 6 0 0 0-1-4l-3-3c-3-3-2-9 3-10h4a6 6 0 0 0 4-3l2-4c2-4 8-4 10 0zm104 0 2 4a6 6 0 0 0 4 3h4c4 1 6 7 3 10l-3 3a6 6 0 0 0-2 4l1 4c1 5-4 8-8 6l-3-2a6 6 0 0 0-6 0l-3 2c-4 2-9-1-8-6v-4a6 6 0 0 0-1-4l-3-3c-3-3-2-9 3-10h4a6 6 0 0 0 4-3l2-4c2-4 8-4 10 0z"/></g>',
            IAminalStructs.VisualsCat.MISC
        );

        // ORDER MUST BE RESPECTED AT ALL COSTS:
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId

        // THREE-EYED AMINAL

        genesNFT.mint(
            recipient,
            '<g id="BACK"><style>.st2{fill:#d3b36d}</style><path d="M0 0h1000v1000H0z" style="fill:#e9d6a2"/><ellipse cx="500" cy="976" rx="164" ry="12" style="fill:#d7af65"/><circle cx="147" cy="907" r="44" class="st2"/><circle cx="283" cy="874" r="11" class="st2"/><circle cx="464" cy="907" r="15" class="st2"/><circle cx="331" cy="906" r="5" class="st2"/><circle cx="574" cy="841" r="6" class="st2"/><circle cx="646" cy="824" r="17" class="st2"/><circle cx="764" cy="821" r="7" class="st2"/><circle cx="827" cy="782" r="16" class="st2"/><circle cx="207" cy="549" r="29" class="st2"/><circle cx="894" cy="600" r="40" class="st2"/><circle cx="935" cy="833" r="19" class="st2"/><circle cx="182" cy="664" r="19" class="st2"/><circle cx="810" cy="269" r="13" class="st2"/><circle cx="77" cy="261" r="6" class="st2"/><circle cx="245" cy="719" r="5" class="st2"/><circle cx="931" cy="916" r="36" class="st2"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        genesNFT.mint(
            recipient,
            '<g id="ARMS"><path d="m445 742-4-31-2-16-2-14c-16-3-32-5-48-10l1 33 1 14 1 24 4 17c3 7 8 15 15 19 8 4 18 5 25 0 6-4 9-11 10-18l-1-18z" fill="#a1786e"/><path d="M568 741a2259 2259 0 0 1 8-66c18-3 36-6 53-11l-2 36v16l-2 25c-1 6-2 12-5 18-3 8-8 16-16 21s-19 5-27 0c-6-4-10-12-10-19l1-20z" fill="#a1786e"/><path d="m505 760-3-33a495 495 0 0 1-3-34c-15-2-29-5-43-11l1 37a844 844 0 0 0 6 60c2 8 6 16 13 21 6 4 15 5 22 0 5-4 8-12 8-19l-1-21zM557 732l-1-16-1-36c-13 7-27 11-42 15v16l-1 17-2 34v20c1 7 4 15 10 19 7 4 16 3 22-2s9-14 12-22l2-19 1-26z" fill="#a1786e"/></g>',
            IAminalStructs.VisualsCat.ARM
        );

        genesNFT.mint(
            recipient,
            '<g id="TAIL"><path d="M462 674c-19 0-39 3-54 15l-7 8c-10 13-17 27-26 42-8 17-17 33-32 45-6 4-13 7-20 8-31 5-83-9-83-47 0-8 1-16 5-23 7-15 26-20 40-11 4 4 8 10 8 16 0 4-3 8-8 8-4 0-7-4-8-8 0-2-2-4-4-4-5-2-10 0-13 5-2 4-3 10-3 15v3c1 5 4 10 8 13 10 8 23 11 35 11 6 0 13 0 19-2l9-4c6-5 10-11 14-18 12-21 21-44 37-63l14-14c21-14 48-17 72-12 10 2 8 17-3 17z" fill="#99726a"/></g>',
            IAminalStructs.VisualsCat.TAIL
        );

        genesNFT.mint(
            recipient,
            '<g id="EARS"><path d="M335 357c-11-23-34-144-30-163 4-17 30 24 65 63 12 13 38 37 48 55" fill="#99726a"/><path d="M346 361c-8-17-25-107-22-121 3-13 23 18 49 46 9 10 28 28 35 41" fill="#896862"/><path d="M663 366c10-24 33-145 29-163s-31 24-66 62c-12 13-38 38-47 56" fill="#99726a"/><path d="M652 370c7-18 24-108 21-122-3-13-23 18-49 47-9 9-28 28-35 41" fill="#896862"/></g>',
            IAminalStructs.VisualsCat.EARS
        );

        genesNFT.mint(
            recipient,
            '<g id="BODY"><path d="M710 404c0 362-94 350-210 350s-210 23-210-350c0-116 94-219 210-219s210 103 210 219z" fill="#99726a"/><path d="M504 523c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM504 542c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM504 563c-2 3-6 3-8 0l-2-4-2-3c-2-4 0-8 4-8h8c4 0 6 4 5 8l-2 3-3 4zM504 504c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM482 523c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM482 542c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM482 504c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM461 504c-2 3-6 3-8 0l-2-4-3-4c-1-3 1-7 5-7h8c4 0 6 4 4 7l-2 4-2 4zM527 523c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM527 542c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM527 504c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM547 504c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4z" fill="#6c5655"/></g>',
            IAminalStructs.VisualsCat.BODY
        );

        genesNFT.mint(
            recipient,
            '<g id="FACE"><style>.st10{fill:#265a5d}.st11{fill:#271b27}.st12{fill:#2b565b}.st13{fill:#fff</style><path d="M673 351c0 75-26 111-175 115-133 4-171-44-171-119s85-156 174-156 172 85 172 160z" style="fill:#70968c"/><path d="M659 345c0 51-24 59-163 62-123 2-159-14-159-66s76-90 159-90 163 42 163 94z" style="fill:#438786"/><circle cx="389" cy="343" r="43" class="st10"/><path d="M389 308a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18z" class="st11"/><ellipse cx="388" cy="329" class="st12" rx="27" ry="18"/><circle cx="369" cy="324" r="3" class="st13"/><circle cx="376" cy="319" r="2" class="st13"/><circle cx="500" cy="300" r="43" class="st10"/><path d="M500 265a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18z" class="st11"/><ellipse cx="499" cy="286" class="st12" rx="27" ry="18"/><circle cx="480" cy="281" r="3" class="st13"/><circle cx="486" cy="276" r="2" class="st13"/><circle cx="604" cy="343" r="43" class="st10"/><path d="M604 308a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm0 39c-15 0-27-8-27-18s12-18 27-18 26 8 26 18-12 18-26 18z" class="st11"/><ellipse cx="604" cy="329" class="st12" rx="27" ry="18"/><circle cx="584" cy="324" r="3" class="st13"/><circle cx="591" cy="319" r="2" class="st13"/></g>',
            IAminalStructs.VisualsCat.FACE
        );

        genesNFT.mint(recipient, '<g id="MOUTH"></g>', IAminalStructs.VisualsCat.MOUTH);

        genesNFT.mint(
            recipient,
            '<g id="MISC"><path d="m502 109 16 33 36 5-26 26 6 36-32-17-32 17 6-36-26-26 36-5z" fill="#fff"/></g>',
            IAminalStructs.VisualsCat.MISC
        );
    }

    function mintInitialGenes(GenesNFT genesNFT, address recipient) external {
        // Deploy initial gene set 1 (Blue/Purple theme)
        genesNFT.mint(
            recipient,
            '<g id="BACK"><rect fill="#4e2f91" x="0" y="0" width="1000px" height="1000px"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        genesNFT.mint(
            recipient,
            '<path fill="#77a9da" d="m460 695-2-13c-14-2-29-5-42-9l1 29c14 4 29 5 44 6l-2-13Z"/><path fill="#77a9da" d="m465 735-4-27c-15-1-30-2-44-6v13l2 20h45Z"/><path fill="#82abdb" d="m419 735 3 15c3 7 7 13 13 17 7 4 16 4 22 0 5-3 8-9 9-15l-2-17h-45Z"/><path fill="#71a0ce" d="m414 628 2 45 42 9c-2-25-5-43-10-56l-34 2Z"/><path fill="#77a9da" d="m542 692 1-13 42-12v29c-14 5-29 7-44 10l1-14Z"/><path fill="#77a9da" d="m540 733 1-27c15-3 30-5 44-10l1 13v21l-46 3Z"/><path fill="#82abdb" d="m586 730-3 15c-2 7-6 13-12 18-6 4-15 5-22 1-5-3-9-9-10-15l1-16 46-3Z"/><path fill="#71a0ce" d="m583 622 2 45-42 12c0-24 2-43 6-56l34-1Z"/>',
            IAminalStructs.VisualsCat.TAIL
        );

        genesNFT.mint(
            recipient,
            '<path fill="#496cb4" d="M743 620c5 5 7 11 6 18l-2 6c-1 2-3 3-5 2-3-1-4-4-5-7-2-5-4-11-3-17M729 634c4 9 7 19 6 29 0 3-2 7-5 8l-5-2-3-6c-2-7-3-15-3-22M714 643c2 5 2 10 1 15-1 2-2 5-4 6l-5-2-2-5c-2-5-1-11 0-17M692 623c-4 7-6 15-6 23l1 5c1 1 3 3 5 3l4-5 5-15"/><path fill="#82abdb" d="m742 549-6-27-52 40v39c0 10 0 20 3 29 4 9 10 17 19 20 12 4 24-1 32-10 7-9 10-21 11-33 2-19-3-39-7-58Z"/><path fill="#6f9dcb" d="m709 410-20 60-2 34 35-38-13-56Z"/><path fill="#77a9da" d="m687 504-3 58 52-40-14-57-35 39Z"/><path fill="#496cb4" d="M257 623c-5 5-7 11-6 18 0 2 0 4 2 6s3 3 5 2c3-1 4-4 5-7 2-5 4-11 3-17M271 637c-4 9-7 19-6 29 0 3 2 7 5 8l5-2 3-6c2-7 3-15 3-22M286 646c-2 5-2 10-1 15 1 2 2 5 4 6l5-2 2-5c2-5 1-11 0-17M308 626c4 7 6 15 6 23l-1 5c-1 1-3 3-5 3l-4-5-5-15"/><path fill="#82abdb" d="m258 552 6-27 52 40v39c0 10 0 20-3 29-4 9-10 17-19 20-12 4-24-1-32-10-7-9-10-21-11-33-2-19 3-39 7-58Z"/><path fill="#6f9dcb" d="m291 413 20 60 2 34-35-39 13-55Z"/><path fill="#77a9da" d="m313 507 3 58-52-40 14-57 35 39Z"/>',
            IAminalStructs.VisualsCat.ARM
        );

        genesNFT.mint(
            recipient,
            '<path fill="#e4f5fd" d="M425 234c-2-9-12-14-20-11-23 7-48 15-67 0 9-9 11-22 9-35l-4-14c-1-3-4-2-4 0 1 13 2 29-9 38l-1 1c-17-23-15-53-14-81l1-23c5 1 10 0 15-2 21-9 21-30 17-49-1-5-7-4-7 1 1 10 2 21-3 30-5 7-14 10-22 8l2-28c0-7-10-8-11-1l-8 63-2 11c-10 3-22 7-30-1-9-10-8-25-6-38l-2-3-4 2c-2 7-4 15-4 22-1 12 5 27 16 34 9 4 19 4 29 3-1 13-1 26 2 39-5 6-11 11-18 12-8 1-16-6-17-13 0-3-4-3-4 0 0 11 10 21 21 22 8 0 15-4 22-8 2 6 6 12 10 18 25 36 64 33 101 24 9-2 15-12 12-21ZM575 234c2-9 12-14 20-11 23 7 48 15 66 0-8-9-10-22-8-35l4-14c0-3 4-2 4 0-1 13-2 29 8 38l2 1c17-23 15-53 14-81l-1-23c-5 1-10 0-15-2-21-9-21-30-17-49 1-5 7-4 7 1-1 10-2 21 3 30 5 7 14 10 22 8l-2-28c0-7 10-8 11-1a136601 136601 0 0 0 10 74c10 3 22 7 30-1 9-10 8-25 6-38l2-3 4 2c2 7 4 15 4 22 1 12-5 27-16 34-9 4-19 4-29 3 1 13 1 26-2 39 5 6 11 11 18 12 8 1 16-6 17-13 0-3 4-3 4 0 0 11-10 21-21 22-8 0-15-4-22-8-2 6-6 12-10 18-25 36-64 33-101 24-9-2-15-12-12-21Z"/><path fill="#77a9da" d="M310 335c-20-17-40-45-44-63-3-18 15-46 35-44 17 1 50 18 67 31"/><path fill="#5f53a3" d="M322 329a98 98 0 0 1-32-43c-3-13 11-33 26-32 13 1 37 13 50 21"/><path fill="#77a9da" d="M683 337c21-14 44-39 50-57 6-17-9-47-29-48-18 0-52 13-70 23"/><path fill="#5f53a3" d="M672 331c15-10 32-27 36-40 4-12-7-33-22-34-14-1-39 8-52 15"/>',
            IAminalStructs.VisualsCat.EARS
        );

        genesNFT.mint(
            recipient,
            '<path fill="#77a9da" d="M710 397c0 116-94 282-210 282S290 513 290 397s94-218 210-218 210 102 210 218Z"/><path fill="#93b0dc" d="M673 345c0 75-26 111-175 115-133 4-171-45-171-120s82-152 171-152 175 81 175 157Z"/>',
            IAminalStructs.VisualsCat.BODY
        );

        genesNFT.mint(
            recipient,
            '<path fill="#89cfcb" d="M598 415H402c-35 0-64-29-64-64s22-139 162-69c127-70 162 34 162 69s-29 64-64 64Z"/><circle cx="611" cy="351" r="42" fill="#586b7f"/><circle cx="611" cy="351" r="24" fill="#0a3035"/><circle cx="598" cy="338" r="2" fill="#fff"/><circle cx="602" cy="335" r="1" fill="#fff"/><circle cx="389" cy="351" r="42" fill="#586b7f"/><circle cx="389" cy="351" r="24" fill="#0a3035"/><circle cx="375" cy="338" r="2" fill="#fff"/><circle cx="380" cy="335" r="1" fill="#fff"/><path fill="#ac95b8" d="M515 302c-7 12-23 12-30 0l-4-8-5-8c-6-11 1-25 14-25h19c13 0 21 14 15 25l-5 8-5 8Z"/><circle cx="495" cy="285" r="4" fill="#923018"/><circle cx="505" cy="285" r="4" fill="#923018"/>',
            IAminalStructs.VisualsCat.FACE
        );

        genesNFT.mint(recipient, '<circle cx="500" cy="354" r="10" fill="#385e5d"/>', IAminalStructs.VisualsCat.MOUTH);

        genesNFT.mint(
            recipient,
            '<path fill="#fff" d="M526 205c-24 0-44-19-44-44 0-12 4-23 12-31a44 44 0 1 0 44 73l-12 2Z"/><path fill="#fcfcfc" d="m500 549-19-34-20-34h78l-20 34-19 34z"/>',
            IAminalStructs.VisualsCat.MISC
        );

        // Deploy initial gene set 2 (Red/Orange theme)
        genesNFT.mint(
            recipient,
            '<g><rect fill="#00a79d" x="0" y="0" width="1000px" height="1000px"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        genesNFT.mint(
            recipient,
            '<path fill="#f15a29" d="M514 544c22 50 22 108 1 159-14 38-38 85-10 121 5 7 13 11 23 13 10 1 21-1 28-8 5-5 8-15 3-22-2-3-7-4-11-3-8 3-4 14 1 19 6 4 13 4 21 2 17-5 28-20 43-30 10-6 24-9 35-2-5-2-11-2-17-1-5 1-11 3-15 7-14 10-25 27-42 35-9 4-21 5-30-1-11-7-16-26-5-37 8-7 21-7 30-1 14 9 15 30 7 44-13 24-47 30-71 18-33-16-46-56-42-91 1-25 10-50 17-74 6-21 9-42 6-63-2-20-8-41-18-59l47-23Z"/>',
            IAminalStructs.VisualsCat.TAIL
        );

        genesNFT.mint(
            recipient,
            '<path fill="#e01f26" d="M293 378c-31 37-68 71-112 93 22 1 42-2 64-2-10 1-21 4-31 9l42-5-35 28 33-16-26 21c5-1 9-4 14-7l-24 17c-6 4-19 12-27 13 20-1 41-5 60-13-12 8-23 19-33 30l30-20c-10 8-19 19-26 31l26-24c-14 13-22 35-32 51l47-47c-16 25-26 53-33 83 8-18 18-35 33-49-15 58-13 114 2 172-1-19 0-39 5-58 6 62 27 119 61 172-22-62-35-125-38-192 6 21 12 42 20 63l-4-99c4 16 9 28 19 42-9-32-14-64-12-98 4 14 8 28 20 38-13-30-19-60-18-94 4 18 10 36 16 53 0-40 2-79 8-119l12 42c1-19 3-38 7-56M707 378c31 37 68 71 112 93-22 1-42-2-64-2 10 1 21 4 31 9l-42-5 35 28-33-16 26 21c-5-1-9-4-14-7l24 17c6 4 19 12 27 13-20-1-41-5-60-13 12 8 23 19 33 30l-30-20c10 8 19 19 26 31l-26-24c14 13 22 35 32 51l-47-47c16 25 26 53 33 83-8-18-18-35-33-49 15 58 13 114-2 172 1-19 0-39-5-58-6 62-27 119-61 172 22-62 35-125 38-192-6 21-12 42-20 63l4-99c-4 16-9 28-19 42 9-32 14-64 12-98-4 14-8 28-20 38 13-30 19-60 18-94-4 18-10 36-16 53 0-40-2-79-8-119l-12 42c-1-19-3-38-7-56"/>',
            IAminalStructs.VisualsCat.ARM
        );

        genesNFT.mint(
            recipient,
            '<path fill="#e01f26" d="M335 346c-19-63-24-132-12-198 33 43 71 83 114 117"/><path fill="#b22024" d="M340 287c-5-16-8-33-7-50l4 8v-39c12 16 28 31 46 41"/><path fill="#e01f26" d="M665 342c19-63 24-132 12-198-33 43-71 83-114 117"/><path fill="#b22024" d="M660 283c5-16 8-33 7-50l-4 8v-39c-12 16-28 31-46 41"/>',
            IAminalStructs.VisualsCat.EARS
        );

        genesNFT.mint(
            recipient,
            '<path fill="#e01f26" d="M710 398c0 116-94 281-210 281S290 514 290 398s94-218 210-218 210 102 210 218Z"/><circle cx="500" cy="375" r="188" fill="#e01f26"/><path fill="#e01f26" d="m312 518 52 185v-44c10 24 28 46 50 63l-15-38c15 16 27 35 37 54-2-15 1-31 8-45 2 10 7 20 14 29l-2-22 29 19c-2-6-3-13-1-20l11 23 12-25v56l35-64 2 34c5-14 13-28 24-40l-1 37 57-83-3 33c31-57 52-118 63-181l-5 4"/>',
            IAminalStructs.VisualsCat.BODY
        );

        genesNFT.mint(
            recipient,
            '<rect width="323" height="126" x="338" y="289" fill="#eba220" rx="63" ry="63"/><circle cx="388" cy="352" r="41" fill="#f5d235"/><circle cx="388" cy="352" r="38" fill="#0a3035"/><circle cx="367" cy="331" r="3" fill="#fff"/><circle cx="374" cy="325" r="1" fill="#fff"/><circle cx="612" cy="352" r="41" fill="#e01f26"/><circle cx="612" cy="352" r="38" fill="#0a3035"/><circle cx="590" cy="331" r="3" fill="#fff"/><circle cx="597" cy="325" r="1" fill="#fff"/><g fill="#923018"><circle cx="495" cy="307" r="3"/><circle cx="505" cy="307" r="3"/></g>',
            IAminalStructs.VisualsCat.FACE
        );

        genesNFT.mint(
            recipient,
            '<g id="MOUTH"><rect width="77" height="45" x="461" y="335" fill="#0a3035" rx="22" ry="22"/><path fill="#fffbd0" d="M492 336c0 2-2 5-5 5s-5-2-5-5M518 336c0 2-2 5-5 5s-5-2-5-5"/><circle cx="499" cy="364" r="13" fill="#001a2a"/><path fill="#7c0506" d="M485 380c0-8 7-12 14-12s14 4 14 12"/></g>',
            IAminalStructs.VisualsCat.MOUTH
        );

        genesNFT.mint(
            recipient,
            '<g id="MISC"><path fill="#1c4349" d="m474 350-4 8 1 9M481 351l-4 8c0 3 0 6 2 8M523 350l4 8-1 9M516 351l4 8c0 3 0 6-2 8"/><path fill="#eba220" d="m530 17-51 83-8-20 81 9-67 78-9-20 66 5 17 1-77 60 54-59 4 11-96 8 71-83 8 20-84-9 89-84Z"/></g>',
            IAminalStructs.VisualsCat.MISC
        );
    }
}
