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
      {
        name: '_visuals',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'breedableWith',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'breeding',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'skillAddress', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'callSkill',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct GeneBasedDescriptor.TokenURIParams',
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
    inputs: [{ name: 'partner', internalType: 'address', type: 'address' }],
    name: 'disableBreedableWith',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'energy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
      { name: '', internalType: 'contract GeneNFTFactory', type: 'address' },
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
    name: 'genesNFT',
    outputs: [{ name: '', internalType: 'contract GenesNFT', type: 'address' }],
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
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
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
    inputs: [
      { name: 'skill', internalType: 'address', type: 'address' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'getSkillProperty',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
    name: 'getVisuals',
    outputs: [
      {
        name: '',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
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
    inputs: [{ name: 'partner', internalType: 'address', type: 'address' }],
    name: 'isBreedableWith',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'loveDrivenPrice',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
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
    inputs: [
      { name: 'partner', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'setBreedableWith',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_breeding', internalType: 'bool', type: 'bool' }],
    name: 'setBreeding',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setSkillProperty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'skill', internalType: 'address', type: 'address' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'skillProperties',
    outputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
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
    inputs: [],
    name: 'totalLove',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'transferEnergyToOwner',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'visuals',
    outputs: [
      { name: 'backId', internalType: 'uint256', type: 'uint256' },
      { name: 'armId', internalType: 'uint256', type: 'uint256' },
      { name: 'tailId', internalType: 'uint256', type: 'uint256' },
      { name: 'earsId', internalType: 'uint256', type: 'uint256' },
      { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
      { name: 'faceId', internalType: 'uint256', type: 'uint256' },
      { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
      { name: 'miscId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
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
        name: 'partner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'BreedableSet',
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
        name: 'remainingEnergy',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EnergyTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
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
    name: 'FeedAminal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'skillAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'squeakCost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SkillCall',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
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
  { type: 'error', inputs: [], name: 'NotEnoughEnergy' },
  { type: 'error', inputs: [], name: 'NotEnoughEther' },
  { type: 'error', inputs: [], name: 'NotEnoughLove' },
  { type: 'error', inputs: [], name: 'NotRegisteredSkill' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AminalFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aminalFactoryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
    ],
    name: 'breedAminals',
    outputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
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
    name: 'genesNFT',
    outputs: [{ name: '', internalType: 'contract GenesNFT', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getAminalByIndex',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
        name: '',
        internalType: 'struct IAminalStructs.Visuals',
        type: 'tuple',
        components: [
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
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
      { name: '_aminalProposals', internalType: 'address', type: 'address' },
      { name: '_genesNFT', internalType: 'address', type: 'address' },
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
    name: 'proposals',
    outputs: [
      { name: '', internalType: 'contract AminalProposals', type: 'address' },
    ],
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
      { name: 'momAddress', internalType: 'address', type: 'address' },
      { name: 'dadAddress', internalType: 'address', type: 'address' },
      {
        name: 'winningGeneIds',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
      },
    ],
    name: 'spawnAminal',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
          { name: 'backId', internalType: 'uint256', type: 'uint256' },
          { name: 'armId', internalType: 'uint256', type: 'uint256' },
          { name: 'tailId', internalType: 'uint256', type: 'uint256' },
          { name: 'earsId', internalType: 'uint256', type: 'uint256' },
          { name: 'bodyId', internalType: 'uint256', type: 'uint256' },
          { name: 'faceId', internalType: 'uint256', type: 'uint256' },
          { name: 'mouthId', internalType: 'uint256', type: 'uint256' },
          { name: 'miscId', internalType: 'uint256', type: 'uint256' },
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
        name: 'aminalAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'aminalIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'mom', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'dad', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'backId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'armId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tailId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'earsId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'bodyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'faceId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'mouthId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'miscId',
        internalType: 'uint256',
        type: 'uint256',
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
] as const

export const aminalFactoryAddress =
  '0x89b5F7b73217698247AC32c77417a39AbE04bdE0' as const

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
      { name: '_genesNFT', internalType: 'address', type: 'address' },
      { name: '_geneFactory', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ENERGY_TRANSFER_PERCENTAGE',
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
    name: 'aminalsContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
      { name: 'aminalOne', internalType: 'uint256', type: 'uint256' },
      { name: 'aminalTwo', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLove', internalType: 'uint256', type: 'uint256' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'endTime', internalType: 'uint256', type: 'uint256' },
      { name: 'settled', internalType: 'bool', type: 'bool' },
      { name: 'childAminalId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      { name: 'geneIds', internalType: 'uint256[8]', type: 'uint256[8]' },
      { name: 'voteWeights', internalType: 'uint256[8]', type: 'uint256[8]' },
    ],
    name: 'bulkVoteOnGenes',
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
    name: 'emergencyStop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'geneFactory',
    outputs: [
      { name: '', internalType: 'contract GeneNFTFactory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'genesNFT',
    outputs: [{ name: '', internalType: 'contract GenesNFT', type: 'address' }],
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
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'endTime', internalType: 'uint256', type: 'uint256' },
      { name: 'settled', internalType: 'bool', type: 'bool' },
      { name: 'childAminalId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    name: 'getCategoryVoting',
    outputs: [
      {
        name: '',
        internalType: 'struct GeneAuction.CategoryVoteInfo',
        type: 'tuple',
        components: [
          { name: 'highestVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'winningGeneId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'proposedGenes',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'tiedGenes', internalType: 'uint256[]', type: 'uint256[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getGeneRemovalVotes',
    outputs: [
      { name: 'removalVotes', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getGeneVotes',
    outputs: [{ name: 'totalVotes', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'auctionId', internalType: 'uint256', type: 'uint256' }],
    name: 'getParentTraits',
    outputs: [
      {
        name: 'parentOneTraits',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
      },
      {
        name: 'parentTwoTraits',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserVote',
    outputs: [{ name: 'voteWeight', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'proposeGene',
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
      { name: '_aminalsContract', internalType: 'address', type: 'address' },
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
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
      { name: 'voteWeight', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'voteOnGene',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auctionId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'geneId', internalType: 'uint256', type: 'uint256' },
      { name: 'voteWeight', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'voteToRemoveGene',
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
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'geneIds',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
        indexed: false,
      },
      {
        name: 'totalVoteWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BulkVoteCast',
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
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'GeneProposed',
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
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'geneId',
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
    name: 'GeneRemovalVote',
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
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'geneId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'GeneRemoved',
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
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'geneId',
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
    name: 'GeneVoteCast',
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
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endTime',
        internalType: 'uint256',
        type: 'uint256',
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
        name: 'childAminalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'winningGeneIds',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
        indexed: false,
      },
      {
        name: 'totalEnergyTransferred',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingSettled',
  },
  { type: 'error', inputs: [], name: 'EnergyTransferFailed' },
  { type: 'error', inputs: [], name: 'GeneAlreadyRemoved' },
  { type: 'error', inputs: [], name: 'InsufficientLove' },
  { type: 'error', inputs: [], name: 'InvalidCategory' },
  { type: 'error', inputs: [], name: 'InvalidGene' },
  { type: 'error', inputs: [], name: 'OnlyAminals' },
  { type: 'error', inputs: [], name: 'VotingAlreadySettled' },
  { type: 'error', inputs: [], name: 'VotingNotActive' },
  { type: 'error', inputs: [], name: 'VotingNotEnded' },
] as const

export const geneAuctionAddress =
  '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605' as const

export const geneAuctionConfig = {
  address: geneAuctionAddress,
  abi: geneAuctionAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GeneNFTFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geneNftFactoryAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_geneNFT', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_CREATION_FEE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    name: 'createGene',
    outputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'geneCategories',
    outputs: [
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
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
    outputs: [{ name: '', internalType: 'contract GenesNFT', type: 'address' }],
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
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'geneSVGs',
    outputs: [{ name: 'svg', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'geneId', internalType: 'uint256', type: 'uint256' }],
    name: 'getGeneInfo',
    outputs: [
      { name: 'creator', internalType: 'address', type: 'address' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
      { name: 'svg', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
    ],
    name: 'getGenesByCategory',
    outputs: [
      { name: 'geneIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'creator', internalType: 'address', type: 'address' }],
    name: 'getGenesByCreator',
    outputs: [
      { name: 'geneIds', internalType: 'uint256[]', type: 'uint256[]' },
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
    type: 'function',
    inputs: [],
    name: 'withdrawFees',
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
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
        indexed: true,
      },
      { name: 'svg', internalType: 'string', type: 'string', indexed: false },
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
  { type: 'error', inputs: [], name: 'EmptySVG' },
  { type: 'error', inputs: [], name: 'InsufficientFee' },
  { type: 'error', inputs: [], name: 'InvalidSVG' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'SVGTooLarge' },
] as const

export const geneNftFactoryAddress =
  '0x41063967Aa8337Ab89a2F69cA8FF54BA13Ce1f06' as const

export const geneNftFactoryConfig = {
  address: geneNftFactoryAddress,
  abi: geneNftFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GenesNFT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const genesNftAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'aminalsNFT',
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
    name: 'geneFactory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'geneSVGs',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'geneVisualsCat',
    outputs: [
      {
        name: '',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
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
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getGeneInfo',
    outputs: [
      { name: 'svg', internalType: 'string', type: 'string' },
      {
        name: 'category',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
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
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'geneSVG', internalType: 'string', type: 'string' },
      {
        name: 'visualsCategory',
        internalType: 'enum IAminalStructs.VisualsCat',
        type: 'uint8',
      },
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
      { name: 'geneFactory_', internalType: 'address', type: 'address' },
    ],
    name: 'setFactory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'aminalsNFT_', internalType: 'address', type: 'address' }],
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
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
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
        name: 'geneFactory',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'FactorySet',
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
        name: 'aminalsNFT',
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
  { type: 'error', inputs: [], name: 'OnlyFactory' },
  { type: 'error', inputs: [], name: 'OnlyNFTOwner' },
] as const

export const genesNftAddress =
  '0x5443F5010a68a3f65E0C3b51Dd264037dabD244c' as const

export const genesNftConfig = {
  address: genesNftAddress,
  abi: genesNftAbi,
} as const
