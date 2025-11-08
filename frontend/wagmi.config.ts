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
      address: '0x70606E311655F973058c2b36442AAABe7ADC3e78',
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
      address: '0x4677F67ceDF70077A7e9eB32787A38c94E786ac5',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0xb4f2E47C71a511372498A57E001a13D9989d6839',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x7D9ba0754B8009113E111D7E2aE181B73fe6B38b',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x47008402c9c4f985499f6ccEb1E48455EA4E735e',
    },
  ],
});
