import { createConfig, factory } from "ponder";
import { http, parseAbiItem } from "viem";

import {
  aminalAbi,
  aminalFactoryAbi,
  aminalFactoryAddress,
  geneAuctionAbi,
  geneAuctionAddress,
  geneRegistryAbi,
  geneRegistryAddress,
  genesAbi,
  genesAddress,
} from "./abis/generated";

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
      abi: aminalFactoryAbi,
      address: aminalFactoryAddress,
      startBlock: 9345764,
    },
    Aminal: {
      chain: "sepolia",
      abi: aminalAbi,
      address: factory({
        address: aminalFactoryAddress,
        event: parseAbiItem(
          "event AminalSpawned(address indexed child, address indexed parentOne, address indexed parentTwo, uint256 auctionId, uint256[8] geneIds)"
        ),
        parameter: "child",
      }),
      startBlock: 9345764,
    },
    GeneAuction: {
      chain: "sepolia",
      abi: geneAuctionAbi,
      address: geneAuctionAddress,
      startBlock: 9345764,
    },
    Genes: {
      chain: "sepolia",
      abi: genesAbi,
      address: genesAddress,
      startBlock: 9345764,
    },
    GeneRegistry: {
      chain: "sepolia",
      abi: geneRegistryAbi,
      address: geneRegistryAddress,
      startBlock: 9345764,
    },
  },
});
