import { defineConfig } from '@wagmi/cli';

// TODO use ABIs in out/ dir
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
      address: '0x54b5b4f464fdb5f34d2b899c435418ab43ebf304',
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
      address: '0x5de69349b98094fa742bb9e426c31ab46a7b7e5e',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0xd5322f9ae14927a67802e5bc8131bfaabe799dc0',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x37980de8a71fc6147e61e1a9e23735e97bfb2170',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0xccc1a96856baac5be57c4e3dd6913755c5f3637e',
    },
  ],
});
