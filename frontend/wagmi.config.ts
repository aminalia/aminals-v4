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
      address: '0x61037124aa4650af7091ec62eeaae8fba2128156',
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
      address: '0x6bb1a83bcd3edd524087e8f4d0c8fa9ba8930192',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0xa77a0b0dc24c6805860ee2ee4b5617f2e6f7c894',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xea358805a963a0af845701b5ea5c91ed5e0f7afd',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x5a7466d88f9803bef5a9b07a1c7e32ea2ff4cb76',
    },
  ],
});
