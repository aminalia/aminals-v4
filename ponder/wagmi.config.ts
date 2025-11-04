import { defineConfig } from '@wagmi/cli';

const ABI = {
  AminalFactory: require('../out/AminalFactory.sol/AminalFactory.json'),
  Aminal: require('../out/Aminal.sol/Aminal.json'),
  GeneAuction: require('../out/GeneAuction.sol/GeneAuction.json'),
  Genes: require('../out/Genes.sol/Genes.json'),
  GeneRegistry: require('../out/GeneRegistry.sol/GeneRegistry.json'),
};

export default defineConfig({
  out: 'abis/generated.ts',
  contracts: [
    {
      abi: ABI.AminalFactory.abi,
      name: 'AminalFactory',
      address: '0x8364df6bCDDfc3eE749263f5A6D4C8B937fe0E84',
    },
    {
      abi: ABI.Aminal.abi,
      name: 'Aminal',
    },
    {
      abi: ABI.GeneAuction.abi,
      name: 'GeneAuction',
      address: '0x3329bC1De8612423b571b3353DB318995081125e',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x14336FD396682Bc93d89Bd5f7c7f0b52ce6c30C3',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x7078E24274d797f641dcBB2b4B5D0BF31B4d0cb2',
    },
  ],
});
