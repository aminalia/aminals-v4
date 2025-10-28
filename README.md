# Aminals

Aminals is a sophisticated decentralized digital pet platform that combines NFT ownership with complex interaction mechanics, autonomous contract behavior, and community governance. Each Aminal is deployed as its own ERC721 contract, enabling them to hold funds and interact autonomously with other contracts.

## Development

### Building and Testing

```bash
# Build contracts
./forge build

# Run tests
./forge test

# Run specific test
./forge test --match-contract AminalFactoryTest
```

### Scripts

All scripts require environment variables to be set:

```bash
cp .env.example .env
# Edit .env with your private key and RPC URL
```

- `PRIVATE_KEY`: Your wallet private key for transactions
- `RPC_URL`: RPC endpoint for the target network
- `ADDRESS`: Your wallet address (for queries)
- `GENERATOR_SOURCE_CONTRACT`: High-volume contract address for randomness
- `GENERATOR_SOURCE_BALANCE`: Balance check contract for randomness

### Deployment Scripts

**Deploy Complete System**

```bash
./deploy.sh
```

This deploys the entire Aminals ecosystem.
