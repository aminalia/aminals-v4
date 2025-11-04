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
      address: '0x10a25AfF567aE9D8A77A8A1D7903Bb5Fc5843f80',
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
      address: '0x6Aa9B90d21028EBf7C806423925996937302D6E1',
    },
    {
      abi: ABI.Genes.abi,
      name: 'Genes',
      address: '0xAd580787160574FD996615050622cAabD9e1ef86',
    },
    {
      abi: ABI.GeneRegistry.abi,
      name: 'GeneRegistry',
      address: '0xf460D0f88fD376F322a834BDDe4d915748432fDF',
    },
    {
      abi: ABI.Move2D.abi,
      name: 'Move2D',
      address: '0x513Bd7e04D456c793A7c1227916Eb51EDBCd799b',
    },
  ],
});
