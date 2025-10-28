import { defineConfig } from '@wagmi/cli';

const ABI = {
  AminalFactory: require('../out/AminalFactory.sol/AminalFactory.json'),
  Aminal: require('../out/Aminal.sol/Aminal.json'),
  GeneAuction: require('../out/GeneAuction.sol/GeneAuction.json'),
  Genes: require('../out/Genes.sol/Genes.json'),
  GeneRegistry: require('../out/GeneRegistry.sol/GeneRegistry.json'),
  Move2D: require('../out/Move2D.sol/Move2D.json'),
};

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      abi: ABI.AminalFactory.abi,
      name: 'AminalFactory',
      address: '0x8CE7Fbbe9d92136D842a76734C3883dd00839E7e',
    },
    {
      abi: ABI.Aminal.abi,
      name: 'Aminal',
      // Note: This will be used as a template for individual Aminal contracts
      // Actual addresses will be dynamic based on factory spawns
    },
    {
      abi: ABI.GeneAuction.abi,
      name: 'GeneAuction',
      address: '0xc37B75BB83d9FcCe10bA6fED81C4672Dfd771b8D',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0xA3Aa1667884f6f2111f46d4dfF74549252531232',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x184C5b935C7fE0D5397b62DBB169e08Bdb10757F',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x51Bd74f7cD9b35C6f1c2B48FA859846Afea11b3d',
    },
  ],
});
