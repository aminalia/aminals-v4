//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Aminal
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aminalAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_factory', internalType: 'address', type: 'address' },
      { name: '_momAddress', internalType: 'address', type: 'address' },
      { name: '_dadAddress', internalType: 'address', type: 'address' },
      { name: '_proposerAddress', internalType: 'address', type: 'address' },
      {
        name: 'visualTraits',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'genes', internalType: 'uint256[9]', type: 'uint256[9]' },
        ],
      },
      {
        name: 'placements',
        internalType: 'struct IAminalStructs.GeneMetadata[9]',
        type: 'tuple[9]',
        components: [
          { name: 'offsetX', internalType: 'int16', type: 'int16' },
          { name: 'offsetY', internalType: 'int16', type: 'int16' },
          { name: 'scale', internalType: 'uint16', type: 'uint16' },
          { name: 'rotation', internalType: 'uint16', type: 'uint16' },
        ],
      },
      { name: '_aminalIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_loveVRGDA', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'INITIAL_ENERGY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_ENERGY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SKILL_COST',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_BREEDING_LOVE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_FEED_AMOUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'aminalIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct GeneRenderer.TokenURIParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'image', internalType: 'string', type: 'string' },
          { name: 'attributes', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'constructTokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dadAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'dataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [
      { name: '', internalType: 'contract AminalFactory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneFactory',
    outputs: [
      { name: '', internalType: 'contract GeneRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalId', internalType: 'uint256', type: 'uint256' }],
    name: 'generateAttributesList',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'genes',
    outputs: [{ name: '', internalType: 'contract Genes', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getAminalPlacementsByID',
    outputs: [
      {
        name: '',
        internalType: 'struct IAminalStructs.GeneMetadata[9]',
        type: 'tuple[9]',
        components: [
          { name: 'offsetX', internalType: 'int16', type: 'int16' },
          { name: 'offsetY', internalType: 'int16', type: 'int16' },
          { name: 'scale', internalType: 'uint16', type: 'uint16' },
          { name: 'rotation', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalID', internalType: 'uint256', type: 'uint256' }],
    name: 'getAminalVisualsByID',
    outputs: [
      {
        name: '',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'genes', internalType: 'uint256[9]', type: 'uint256[9]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEnergy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getLoveByUser',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'getLoveForAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getParents',
    outputs: [
      { name: 'mom', internalType: 'address', type: 'address' },
      { name: 'dad', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPlacements',
    outputs: [
      {
        name: '',
        internalType: 'struct IAminalStructs.GeneMetadata[9]',
        type: 'tuple[9]',
        components: [
          { name: 'offsetX', internalType: 'int16', type: 'int16' },
          { name: 'offsetY', internalType: 'int16', type: 'int16' },
          { name: 'scale', internalType: 'uint16', type: 'uint16' },
          { name: 'rotation', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalLove',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTreasuryBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVisuals',
    outputs: [
      {
        name: '',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'genes', internalType: 'uint256[9]', type: 'uint256[9]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'lovePerUser',
    outputs: [{ name: 'love', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'loveVRGDA',
    outputs: [
      { name: '', internalType: 'contract AminalVRGDA', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'momAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'payout',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposerAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'squeak',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'squeakFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'useSkill',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'loveGained',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'love',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalLove',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'energyGained',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'energy',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FeedAminal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remainingEnergy',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remainingLove',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ResourcesConsumed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'cost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
    ],
    name: 'SkillUsed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'love',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalLove',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'energy',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Squeak',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remainingBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TreasuryTransferred',
  },
  { type: 'error', inputs: [], name: 'InsufficientEnergy' },
  { type: 'error', inputs: [], name: 'InsufficientLove' },
  { type: 'error', inputs: [], name: 'InsufficientTreasury' },
  { type: 'error', inputs: [], name: 'NotEnoughEnergy' },
  { type: 'error', inputs: [], name: 'NotEnoughEther' },
  { type: 'error', inputs: [], name: 'NotEnoughLove' },
  { type: 'error', inputs: [], name: 'NotRegisteredSkill' },
  { type: 'error', inputs: [], name: 'SkillCallFailed' },
  { type: 'error', inputs: [], name: 'SkillNotSupported' },
  { type: 'error', inputs: [], name: 'TreasuryTransferFailed' },
  { type: 'error', inputs: [], name: 'UnauthorizedCaller' },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AminalFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aminalFactoryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_GENES',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_ENERGY_REQUIRED',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_LOVE_REQUIRED',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRGDA_BASE_PRICE',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRGDA_LOGISTIC_ASYMPTOTE',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRGDA_PRICE_DECAY',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRGDA_TIME_SCALE',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'aminalsByIndex',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalOne', internalType: 'address', type: 'address' },
      { name: 'aminalTwo', internalType: 'address', type: 'address' },
      { name: 'minTotalLove', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'breedAminals',
    outputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneAuction',
    outputs: [
      { name: '', internalType: 'contract GeneAuction', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'genes',
    outputs: [{ name: '', internalType: 'contract Genes', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getAminalByIndex',
    outputs: [
      { name: 'aminalAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getAminalVisualsByAddress',
    outputs: [
      {
        name: 'visuals',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'genes', internalType: 'uint256[9]', type: 'uint256[9]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialAminalSpawned',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_geneAuction', internalType: 'address', type: 'address' },
      { name: '_genes', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isAminal',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'loveVRGDA',
    outputs: [
      { name: '', internalType: 'contract AminalVRGDA', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'parentOne', internalType: 'address', type: 'address' },
      { name: 'parentTwo', internalType: 'address', type: 'address' },
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'proposer', internalType: 'address', type: 'address' },
      {
        name: 'winningGeneIds',
        internalType: 'uint256[9]',
        type: 'uint256[9]',
      },
      {
        name: 'placements',
        internalType: 'struct IAminalStructs.GeneMetadata[9]',
        type: 'tuple[9]',
        components: [
          { name: 'offsetX', internalType: 'int16', type: 'int16' },
          { name: 'offsetY', internalType: 'int16', type: 'int16' },
          { name: 'scale', internalType: 'uint16', type: 'uint16' },
          { name: 'rotation', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    name: 'spawnAminal',
    outputs: [
      { name: 'childAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_visuals',
        internalType: 'struct IAminalStructs.Visuals[]',
        type: 'tuple[]',
        components: [
          { name: 'genes', internalType: 'uint256[9]', type: 'uint256[9]' },
        ],
      },
    ],
    name: 'spawnInitialAminals',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAminals',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'child',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'parentOne',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'parentTwo',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'geneIds',
        internalType: 'uint256[9]',
        type: 'uint256[9]',
        indexed: false,
      },
    ],
    name: 'AminalSpawned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalOne',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'aminalTwo',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BreedAminal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vrgdaAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'VRGDADeployed',
  },
  { type: 'error', inputs: [], name: 'CallerNotAminal' },
  { type: 'error', inputs: [], name: 'CallerNotAuction' },
  { type: 'error', inputs: [], name: 'CannotBreedWithSelf' },
  { type: 'error', inputs: [], name: 'GenesisAlreadyCompleted' },
  { type: 'error', inputs: [], name: 'IndexOutOfBounds' },
  { type: 'error', inputs: [], name: 'InsufficientEnergy' },
  { type: 'error', inputs: [], name: 'InsufficientLove' },
  { type: 'error', inputs: [], name: 'InsufficientTotalLove' },
  { type: 'error', inputs: [], name: 'InvalidAminalAddresses' },
  { type: 'error', inputs: [], name: 'InvalidAuctionAddress' },
  { type: 'error', inputs: [], name: 'InvalidGenesAddress' },
  { type: 'error', inputs: [], name: 'InvalidParentOne' },
  { type: 'error', inputs: [], name: 'InvalidParentTwo' },
  { type: 'error', inputs: [], name: 'MustSpawnAtLeastOne' },
  { type: 'error', inputs: [], name: 'NotRegisteredAminal' },
  { type: 'error', inputs: [], name: 'VRGDAAlreadyDeployed' },
  { type: 'error', inputs: [], name: 'VRGDANotDeployed' },
] as const

export const aminalFactoryAddress =
  '0xcC13d6872c343007B34A1C0a6e5EaAF0D2dACd0C' as const

export const aminalFactoryConfig = {
  address: aminalFactoryAddress,
  abi: aminalFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GeneAuction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geneAuctionAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_Genes', internalType: 'address', type: 'address' },
      { name: '_geneRegistry', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DESIGN_REMOVAL_THRESHOLD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PROPOSE_DESIGN_COST',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TREASURY_TRANSFER_PERCENTAGE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VOTING_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'aminalFactory',
    outputs: [
      { name: '', internalType: 'contract IAminalFactory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'auctionCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'auctions',
    outputs: [
      { name: 'startTime', internalType: 'uint64', type: 'uint64' },
      { name: 'endTime', internalType: 'uint64', type: 'uint64' },
      { name: 'settled', internalType: 'bool', type: 'bool' },
      { name: 'aminalOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
      { name: 'winningDesignId', internalType: 'uint256', type: 'uint256' },
      { name: 'highestVotes', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'claimFailedPayout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createAuction',
    outputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'designCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'failedPayouts',
    outputs: [
      { name: 'amountFromParentOne', internalType: 'uint256', type: 'uint256' },
      { name: 'amountFromParentTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'parentOneAddress', internalType: 'address', type: 'address' },
      { name: 'parentTwoAddress', internalType: 'address', type: 'address' },
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'claimed', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneRegistry',
    outputs: [
      { name: '', internalType: 'contract GeneRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'genes',
    outputs: [{ name: '', internalType: 'contract Genes', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAuctionInfo',
    outputs: [
      { name: 'aminalOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
      { name: 'startTime', internalType: 'uint64', type: 'uint64' },
      { name: 'endTime', internalType: 'uint64', type: 'uint64' },
      { name: 'settled', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAuctionVoting',
    outputs: [
      {
        name: '',
        internalType: 'struct GeneAuction.AuctionVoteInfo',
        type: 'tuple',
        components: [
          { name: 'highestVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'winningDesignId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'proposedDesignIds',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'tiedDesignIds',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'designId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDesign',
    outputs: [
      {
        name: '',
        internalType: 'struct GeneAuction.AminalDesign',
        type: 'tuple',
        components: [
          { name: 'geneIds', internalType: 'uint256[9]', type: 'uint256[9]' },
          { name: 'proposer', internalType: 'address', type: 'address' },
          { name: 'votes', internalType: 'uint256', type: 'uint256' },
          { name: 'removed', internalType: 'bool', type: 'bool' },
          {
            name: 'placements',
            internalType: 'struct IAminalStructs.GeneMetadata[9]',
            type: 'tuple[9]',
            components: [
              { name: 'offsetX', internalType: 'int16', type: 'int16' },
              { name: 'offsetY', internalType: 'int16', type: 'int16' },
              { name: 'scale', internalType: 'uint16', type: 'uint16' },
              { name: 'rotation', internalType: 'uint16', type: 'uint16' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'designId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDesignPlacements',
    outputs: [
      {
        name: 'placements',
        internalType: 'struct IAminalStructs.GeneMetadata[9]',
        type: 'tuple[9]',
        components: [
          { name: 'offsetX', internalType: 'int16', type: 'int16' },
          { name: 'offsetY', internalType: 'int16', type: 'int16' },
          { name: 'scale', internalType: 'uint16', type: 'uint16' },
          { name: 'rotation', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'designId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDesignRemovalVotes',
    outputs: [
      { name: 'removalVotes', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'getFailedPayout',
    outputs: [
      {
        name: 'payout',
        internalType: 'struct GeneAuction.FailedPayout',
        type: 'tuple',
        components: [
          {
            name: 'amountFromParentOne',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'amountFromParentTwo',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'parentOneAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'parentTwoAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
          { name: 'claimed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'getParentGenes',
    outputs: [
      {
        name: 'parentOneGenes',
        internalType: 'uint256[9]',
        type: 'uint256[9]',
      },
      {
        name: 'parentTwoGenes',
        internalType: 'uint256[9]',
        type: 'uint256[9]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserVotedDesign',
    outputs: [{ name: 'designId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserVotingPower',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'isVotingActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'pauseAuction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'pausedAuctions',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'geneIds', internalType: 'uint256[9]', type: 'uint256[9]' },
      {
        name: 'placements',
        internalType: 'struct IAminalStructs.GeneMetadata[9]',
        type: 'tuple[9]',
        components: [
          { name: 'offsetX', internalType: 'int16', type: 'int16' },
          { name: 'offsetY', internalType: 'int16', type: 'int16' },
          { name: 'scale', internalType: 'uint16', type: 'uint16' },
          { name: 'rotation', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    name: 'proposeDesign',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'settleAuction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_aminalFactory', internalType: 'address', type: 'address' },
    ],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'unpauseAuction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'designId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'voteOnDesign',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'designId', internalType: 'uint256', type: 'uint256' },
      { name: 'voteWeight', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'voteToRemoveDesign',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'AuctionPausedEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'AuctionUnpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'designId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'geneIds',
        internalType: 'uint256[9]',
        type: 'uint256[9]',
        indexed: false,
      },
      {
        name: 'placements',
        internalType: 'struct IAminalStructs.GeneMetadata[9]',
        type: 'tuple[9]',
        components: [
          { name: 'offsetX', internalType: 'int16', type: 'int16' },
          { name: 'offsetY', internalType: 'int16', type: 'int16' },
          { name: 'scale', internalType: 'uint16', type: 'uint16' },
          { name: 'rotation', internalType: 'uint16', type: 'uint16' },
        ],
        indexed: false,
      },
    ],
    name: 'DesignProposed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'designId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'voteWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DesignRemovalVote',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'designId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'DesignRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'designId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'userVotingPower',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DesignVoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FailedPayoutClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GeneCreatorPayout',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PayoutFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'aminalOne',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'aminalTwo',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'totalLove',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'startTime',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'endTime',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'VotingCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auctionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'winningDesignId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'winningGeneIds',
        internalType: 'uint256[9]',
        type: 'uint256[9]',
        indexed: false,
      },
      {
        name: 'totalTreasuryTransferred',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingSettled',
  },
  { type: 'error', inputs: [], name: 'AuctionPaused' },
  { type: 'error', inputs: [], name: 'DesignAlreadyRemoved' },
  { type: 'error', inputs: [], name: 'InsufficientLove' },
  { type: 'error', inputs: [], name: 'InvalidDesign' },
  { type: 'error', inputs: [], name: 'InvalidGene' },
  { type: 'error', inputs: [], name: 'InvalidGeneCount' },
  { type: 'error', inputs: [], name: 'NoVotingPower' },
  { type: 'error', inputs: [], name: 'OnlyFactory' },
  { type: 'error', inputs: [], name: 'VotingAlreadySettled' },
  { type: 'error', inputs: [], name: 'VotingNotActive' },
  { type: 'error', inputs: [], name: 'VotingNotEnded' },
] as const

export const geneAuctionAddress =
  '0x4c99c3bf6732c66D31c9bEEe7Aabc5d83b398E09' as const

export const geneAuctionConfig = {
  address: geneAuctionAddress,
  abi: geneAuctionAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GeneRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geneRegistryAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_geneNFT', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SVG_LENGTH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'category', internalType: 'string', type: 'string' },
    ],
    name: 'createGene',
    outputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'svg', internalType: 'string', type: 'string' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'category', internalType: 'string', type: 'string' },
    ],
    name: 'createGeneFor',
    outputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'geneCreators',
    outputs: [{ name: 'creator', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneNFT',
    outputs: [{ name: '', internalType: 'contract Genes', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'geneRegistry',
    outputs: [{ name: 'isFromFactory', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'creator', internalType: 'address', type: 'address' }],
    name: 'getGeneCountByCreator',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'getGeneInfo',
    outputs: [
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'svg', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getGenesByCreator',
    outputs: [
      { name: 'geneIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'total', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'isValidGene',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalGenesCreated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'svg', internalType: 'string', type: 'string', indexed: false },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'category',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'GeneCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'error', inputs: [], name: 'EmptyName' },
  { type: 'error', inputs: [], name: 'EmptySVG' },
  { type: 'error', inputs: [], name: 'InvalidSVG' },
  { type: 'error', inputs: [], name: 'SVGTooLarge' },
] as const

export const geneRegistryAddress =
  '0x3866Ee60CF6F3A98793ecE4Bb03aEB82BB81406D' as const

export const geneRegistryConfig = {
  address: geneRegistryAddress,
  abi: geneRegistryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Genes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const genesAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'aminalFactory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneRegistry',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'geneSVGPointers',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getGeneInfo',
    outputs: [{ name: 'svg', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getGeneSVG',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'geneSVG', internalType: 'string', type: 'string' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'category', internalType: 'string', type: 'string' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalFactory_', internalType: 'address', type: 'address' },
      { name: 'geneRegistry_', internalType: 'address', type: 'address' },
    ],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'category',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'GeneMetadata',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aminalFactory',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'geneRegistry',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Setup',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'AlreadySetup' },
  { type: 'error', inputs: [], name: 'OnlyAminalsFactory' },
  { type: 'error', inputs: [], name: 'OnlyAminalsFactoryOrRegistry' },
  { type: 'error', inputs: [], name: 'OnlyNFTOwner' },
  { type: 'error', inputs: [], name: 'OnlyRegistry' },
] as const

export const genesAddress =
  '0x2B5c0FDD243D14708507f5754EEA9308F1B6229E' as const

export const genesConfig = { address: genesAddress, abi: genesAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Move2D
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const move2DAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_factory', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalContract', internalType: 'address', type: 'address' },
    ],
    name: 'Coords2D',
    outputs: [
      { name: 'x', internalType: 'uint256', type: 'uint256' },
      { name: 'y', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [
      { name: '', internalType: 'contract AminalFactory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'aminalContract', internalType: 'address', type: 'address' },
    ],
    name: 'getCoords',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'x', internalType: 'uint256', type: 'uint256' },
      { name: 'y', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getSkillData',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'x', internalType: 'uint256', type: 'uint256' },
      { name: 'y', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'move',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'skillCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

export const move2DAddress =
  '0x4D006B8d0c84A2C1D82ECD7F9a1a7D6F4d6604B2' as const

export const move2DConfig = { address: move2DAddress, abi: move2DAbi } as const
