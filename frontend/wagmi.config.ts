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
      address: '0x4BC36F909341B521C6CBf55419815a616e3dDad2',
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
      address: '0x3A6f4C5bA7D0a82dcdB63Da6b9B60Ee958EdCe45',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0xa6C040cf7896Bbee04b8542A47ED30f88cf58d9D',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x90ffaD7CeBF14a779Da2d3484d6989E5Af94f3aa',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0xb951D7B4E96DB12dda74ce48cB3F587559056847',
    },
  ],
});
