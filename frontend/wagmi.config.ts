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
      address: '0xD84e6Cee6c7E4894eE8ef2a3b2E34db152360932',
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
      address: '0x361A3df057d7aE9F9a9Bcb81571BfFb305e892E1',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x8BA3B8C08c7D672138284d1765122394203D6aA5',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x2D34bD575d793dDb5Dc278BDCd56D9247E3F3Ec6',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x9C410254531A4b7604A1E5FB7eae2648ED8C6189',
    },
  ],
});
