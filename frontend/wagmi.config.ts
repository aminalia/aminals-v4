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
      address: '0x4b938B36E4425235DD10ea103c1B5104652CAdd7',
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
      address: '0xF7dD65fbFb00424F92B4f82a3067b19e701107B0',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0x47998dC9f4617bE031642954250544De34ebB17E',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xfbd88f99b014A01820EB3336CedE1713acB361ec',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0xf7A7a163B7ca89E351F3B223e9A5B6a6551D14f6',
    },
  ],
});
