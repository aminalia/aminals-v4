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
      address: '0x7a934715904D3E4EF038098FbBCcdfD92F3455c8',
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
      address: '0x410ffC0C02A20c32Ffb6b4d39757dab1d8A1841c',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x64E13CE65b10Ad1220a95E9ef28020f85C22507D',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x703a651357B92d3F80542E7E33E060bCfc242F37',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x20B8014B4353d701839e121384659c964B56B5BE',
    },
  ],
});
