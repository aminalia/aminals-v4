/**
 * TypeScript types for breeding system (design-based voting)
 * Matches GeneAuction.sol contract and Ponder schema
 */

/**
 * GeneMetadata - Placement information for a single gene in a design
 * Stored per-gene in each design proposal
 */
export interface GeneMetadata {
  offsetX: number; // -500 to 500 (centered at 0)
  offsetY: number; // -500 to 500 (centered at 0)
  scale: number; // 10 to 200 (100 = 100% = default)
  rotation: number; // -180 to 180 (degrees, UI display format - stored as 0-359 in contract)
}

/**
 * Default placement for genes (centered, 100% scale, no rotation)
 */
export const DEFAULT_PLACEMENT: GeneMetadata = {
  offsetX: 0,
  offsetY: 0,
  scale: 100,
  rotation: 0,
};

/**
 * AminalDesign - Complete Aminal design proposal
 * Matches AminalDesign struct from GeneAuction.sol
 */
export interface AminalDesign {
  geneIds: bigint[]; // Array of 9, 0n = empty slot
  proposer: string; // Address (0x0 = parent design)
  votes: bigint; // Total voting power for this design
  removed: boolean; // Whether removed by community
  placements: GeneMetadata[]; // Array of 9 placement metadata
}

/**
 * DesignProposal - Design with additional metadata from indexer
 * Includes fetched gene data and UI-friendly fields
 */
export interface DesignProposal {
  id: string; // auctionId-designId
  auctionId: string;
  designIndex: number; // Index in auction (designId)
  proposer: {
    id: string;
    address: string;
  };
  geneIds: bigint[];
  placements: GeneMetadata[]; // Parsed from JSON
  votes: bigint;
  removeVotes: bigint;
  removed: boolean;
  blockNumber: bigint;
  blockTimestamp: bigint;
  transactionHash: string;

  // Populated by frontend
  genes?: Gene[]; // Fetched gene data
  isParentDesign?: boolean;
  parentIndex?: number; // 1 or 2 if parent design
}

/**
 * Gene - Gene NFT data from indexer
 */
export interface Gene {
  id: string;
  tokenId: string;
  owner: {
    id: string;
    address: string;
  };
  creator: {
    id: string;
    address: string;
  };
  svg: string;
  name?: string;
  description?: string;
  totalEarnings: bigint;
}

/**
 * DesignVote - Individual vote on a design
 */
export interface DesignVote {
  id: string;
  auction: {
    id: string;
    auctionId: bigint;
  };
  proposal: {
    id: string;
    designIndex: number;
  };
  voter: {
    id: string;
    address: string;
  };
  isRemoveVote: boolean;
  votingPower: bigint;
  blockNumber: bigint;
  blockTimestamp: bigint;
  transactionHash: string;
}

/**
 * AuctionVoteInfo - Voting information for an auction
 * Matches AuctionVoteInfo struct from GeneAuction.sol
 */
export interface AuctionVoteInfo {
  highestVotes: bigint;
  winningDesignId: bigint;
  proposedDesignIds: bigint[];
  tiedDesignIds: bigint[];
}

/**
 * HistoryState - Single state in history for undo/redo
 */
export interface HistoryState {
  geneIds: bigint[];
  placements: GeneMetadata[];
  timestamp: number;
}

/**
 * DesignBuilderState - State for the design builder component
 */
export interface DesignBuilderState {
  geneIds: bigint[]; // 0n = empty slot
  placements: GeneMetadata[];
  selectedGeneIndex: number | null; // Which gene is selected for editing
  isDirty: boolean; // Has the design been modified
  history: HistoryState[]; // History stack for undo/redo
  historyIndex: number; // Current position in history (-1 = no history)
}

/**
 * Helper to create empty design
 */
export function createEmptyDesign(): DesignBuilderState {
  return {
    geneIds: Array(9).fill(0n),
    placements: Array(9).fill(DEFAULT_PLACEMENT),
    selectedGeneIndex: null,
    isDirty: false,
    history: [],
    historyIndex: -1,
  };
}

/**
 * Helper to create design from parent genes
 */
export function createDesignFromGenes(
  geneIds: bigint[],
  placements?: GeneMetadata[]
): DesignBuilderState {
  // Pad to 9 slots
  const paddedGeneIds = [...geneIds];
  while (paddedGeneIds.length < 9) {
    paddedGeneIds.push(0n);
  }

  const paddedPlacements = placements
    ? [...placements]
    : Array(9).fill(DEFAULT_PLACEMENT);
  while (paddedPlacements.length < 9) {
    paddedPlacements.push(DEFAULT_PLACEMENT);
  }

  return {
    geneIds: paddedGeneIds.slice(0, 9),
    placements: paddedPlacements.slice(0, 9),
    selectedGeneIndex: null,
    isDirty: false,
    history: [],
    historyIndex: -1,
  };
}

/**
 * Helper to validate design
 */
export function validateDesign(geneIds: bigint[]): {
  isValid: boolean;
  error?: string;
} {
  const nonEmptyGenes = geneIds.filter((id) => id !== 0n);

  if (nonEmptyGenes.length === 0) {
    return { isValid: false, error: 'Design must have at least 1 gene' };
  }

  if (nonEmptyGenes.length > 9) {
    return { isValid: false, error: 'Design cannot have more than 9 genes' };
  }

  return { isValid: true };
}

/**
 * Helper to count non-empty genes in a design
 */
export function countGenes(geneIds: bigint[]): number {
  return geneIds.filter((id) => id !== 0n).length;
}

/**
 * Helper to convert GeneMetadata to contract format
 * @dev Normalizes rotation from UI range (-180 to 180) to contract range (0 to 359)
 */
export function placementToContractFormat(placement: GeneMetadata): {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
} {
  // Normalize rotation: -180 to 180 → 0 to 359
  // The modulo ensures we stay in 0-359 range even for values outside -180 to 180
  let normalizedRotation = placement.rotation % 360;
  if (normalizedRotation < 0) {
    normalizedRotation += 360;
  }

  return {
    offsetX: Math.floor(placement.offsetX),
    offsetY: Math.floor(placement.offsetY),
    scale: Math.floor(placement.scale),
    rotation: Math.floor(normalizedRotation),
  };
}

/**
 * Helper to convert contract placement to GeneMetadata
 * @dev Denormalizes rotation from contract range (0 to 359) to UI range (-180 to 180)
 */
export function contractFormatToPlacement(contractPlacement: {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
}): GeneMetadata {
  // Denormalize rotation: 0 to 359 → -180 to 180
  // Values 0-180 stay the same, values 181-359 become negative
  let uiRotation = contractPlacement.rotation;
  if (uiRotation > 180) {
    uiRotation = uiRotation - 360;
  }

  return {
    offsetX: contractPlacement.offsetX,
    offsetY: contractPlacement.offsetY,
    scale: contractPlacement.scale,
    rotation: uiRotation,
  };
}
