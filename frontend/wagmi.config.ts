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
      address: '0x897f05c884bf0f8dca32b46a582d38572addfb8f',
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
      address: '0xd80319fb25736be58ab0dd78cc62dedd8c0d6591',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x07ab810423beb0bbb9ceaf13064f11ffd934232b',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xfaac5302a47f7e2bc6b978ed32c5734a0be10119',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x5a5d0ca9979034f5aa1a2621178e1869e741021d',
    },
  ],
});
