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
      address: '0xfd69b3285974f11ac0e8490d86a2dc4ee7d2ce9c',
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
      address: '0x96bd719eb8d32a1210e4e2eb77b5ce6ff157325d',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0xb70c1d4ab9e90eb73b7f8972bd3eeb139201cd43',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0x2706cf8e08f6cbfd8a0fc32637d0289ab6ed2ca4',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x3d771a066f7b6103a612042566082b6304f26b9f',
    },
  ],
});
