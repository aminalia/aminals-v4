import { createConfig } from "ponder";
import { http } from "viem";

import AminalFactoryAbi from "./abis/AminalFactory.json";
import AminalAbi from "./abis/Aminal.json";
import GeneAuctionAbi from "./abis/GeneAuction.json";
import GenesAbi from "./abis/Genes.json";
import GeneRegistryAbi from "./abis/GeneRegistry.json";

export default createConfig({
  chains: {
    sepolia: {
      id: 11155111,
      rpc: http(process.env.PONDER_RPC_URL_11155111!),
    },
  },
  contracts: {
    AminalFactory: {
      chain: "sepolia",
      abi: AminalFactoryAbi.abi,
      address: "0xfd69b3285974f11ac0e8490d86a2dc4ee7d2ce9c",
      startBlock: 8828041,
    },
    Aminal: {
      chain: "sepolia",
      abi: AminalAbi.abi,
      factory: {
        address: "0xfd69b3285974f11ac0e8490d86a2dc4ee7d2ce9c",
        event: AminalFactoryAbi.abi.find(
          (item: any) => item.type === "event" && item.name === "AminalSpawned"
        )!,
        parameter: "child",
      },
      startBlock: 8828041,
    },
    GeneAuction: {
      chain: "sepolia",
      abi: GeneAuctionAbi.abi,
      address: "0x96bd719eb8d32a1210e4e2eb77b5ce6ff157325d",
      startBlock: 8828041,
    },
    Genes: {
      chain: "sepolia",
      abi: GenesAbi.abi,
      address: "0xb70c1d4ab9e90eb73b7f8972bd3eeb139201cd43",
      startBlock: 8828041,
    },
    GeneRegistry: {
      chain: "sepolia",
      abi: GeneRegistryAbi.abi,
      address: "0x2706cf8e08f6cbfd8a0fc32637d0289ab6ed2ca4",
      startBlock: 8828041,
    },
  },
});
