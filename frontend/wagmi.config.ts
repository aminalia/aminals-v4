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
      address: '0x489366f66188ce1683960f31044d91e21786907e',
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
      address: '0xc8adb02c7da510185e7c97062c619ee080cb39ef',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x5ef3ba5403cc3050e4152c67829ac69fcb1c5fbc',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x62188d4fb56e9c7656f5321cac589020b9d826c5',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x2fcdcfa024adbd5a55810a23629d1e8e61100b1a',
    },
  ],
});
