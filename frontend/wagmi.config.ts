import { defineConfig } from '@wagmi/cli';

const ABI = {
  AminalFactory: require('./deployments/AminalFactory.json'),
  Aminal: require('./deployments/Aminal.json'),
  GeneAuction: require('./deployments/GeneAuction.json'),
  GenesNFT: require('./deployments/GenesNFT.json'),
};

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      abi: ABI.AminalFactory.abi,
      name: 'AminalFactory',
      address: '0x89b5F7b73217698247AC32c77417a39AbE04bdE0',
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
      address: '0x30484F8a6CEC8Fc02EFEA2320e3E3A5f710B7605',
    },
    {
      abi: ABI.GenesNFT.abi,
      name: 'GenesNFT',
      address: '0x5443F5010a68a3f65E0C3b51Dd264037dabD244c',
    },
  ],
});
