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
      address: '0xf71044CEa74b6c6C9FB5134199BFAaBedC42ffBB',
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
      address: '0x7Bb49627Fc04B372A800E6cA5fA18C317778dA1d',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x51677a84DAcCe610eC055522d613C2543AA93ad1',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xdab09A04E8C02E5cC014BfaA513CA1a6100A3083',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0xca29A1948f0b12306c6709dD79542E108c068669',
    },
  ],
});
