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
      address: '0x06fb0b3feee8cbbac108c51e8210bea1ac71950d',
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
      address: '0x5cec16d733789799525111c9f94bfe45468145fa',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x8738774a2feb8a9f917de3fd6d3f1a450bb8d948',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xe27e526879fd981ac7a774bac914b771c5dd2cfe',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x10919117d2abda21e09534ccb4bc175964d19b6d',
    },
  ],
});
