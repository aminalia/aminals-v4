import { defineConfig } from '@wagmi/cli';

const ABI = {
  AminalFactory: require('./deployments/AminalFactory.json'),
  Aminal: require('./deployments/Aminal.json'),
  GeneAuction: require('./deployments/GeneAuction.json'),
  GenesNFT: require('./deployments/GenesNFT.json'),
  GeneNFTFactory: require('./deployments/GeneNFTFactory.json'),
};

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      abi: ABI.AminalFactory.abi,
      name: 'AminalFactory',
      address: '0x9b89ac50cc02496d71c659dc765478e66017e521',
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
      address: '0x99ca199a32502e94b1ca879edd264082ba4efaf3',
    },
    {
      abi: ABI.GenesNFT.abi,
      name: 'GenesNFT',
      address: '0x5ad73ca80684d75b2f10bf0d8844de9420d728ad',
    },
    // GeneNFTFactory not deployed to Sepolia yet
    // {
    //   abi: ABI.GeneNFTFactory.abi,
    //   name: 'GeneNFTFactory',
    //   address: '0x41063967Aa8337Ab89a2F69cA8FF54BA13Ce1f06',
    // },
  ],
});
