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
      address: '0xcC13d6872c343007B34A1C0a6e5EaAF0D2dACd0C',
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
      address: '0x4c99c3bf6732c66D31c9bEEe7Aabc5d83b398E09',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x2B5c0FDD243D14708507f5754EEA9308F1B6229E',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x3866Ee60CF6F3A98793ecE4Bb03aEB82BB81406D',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x4D006B8d0c84A2C1D82ECD7F9a1a7D6F4d6604B2',
    },
  ],
});
