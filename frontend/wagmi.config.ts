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
      address: '0x42fa457b1a742c5d7330f24916c60985448b8e8f',
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
      address: '0x9c0ad5e98b4a3dcdaef1a2162172c9ac4391ac1f',
    },
    {
      abi: ABI.GenesNFT.abi,
      name: 'GenesNFT',
      address: '0xbddca7fae18cba8fc457a8b69338d404d443cb0d',
    },
    // GeneNFTFactory not deployed to Sepolia yet
    // {
    //   abi: ABI.GeneNFTFactory.abi,
    //   name: 'GeneNFTFactory',
    //   address: '0x41063967Aa8337Ab89a2F69cA8FF54BA13Ce1f06',
    // },
  ],
});
