#!/bin/bash

# Aminals Sepolia Deployment Script
echo "🚀 Deploying Aminals..."

export RPC_URL="http://localhost:8545"


# Check if required environment variables are set
if [ -z "$RPC_URL" ]; then
    echo "❌ RPC_URL not set. Please set it to your RPC endpoint"
    echo "   Example: export RPC_URL=https://ethereum-sepolia.publicnode.com"
    exit 1
fi

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set. Please set your private key"
    echo "   Example: export PRIVATE_KEY=0x..."
    exit 1
fi

echo "📋 Configuration:"
echo "   RPC URL: $RPC_URL"

# Step 1: Deploy core contracts
echo "Step 1: Deploying core contracts..."
forge script script/DeployContracts.s.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast 

# if [ $? -ne 0 ]; then
#     echo "Core contract deployment failed"
#     exit 1
# fi

echo "Core contracts deployed successfully!"

# Step 2: Mint initial genes using mint-all-genes.sh script
echo "Step 2: Minting initial genes (32 genes)..."
./script/mint-all-genes.sh

if [ $? -ne 0 ]; then
    echo "Initial genes minting failed"
    echo "   This could be due to:"
    echo "   - Network congestion (try again later)"
    echo "   - Insufficient gas price (check network conditions)"
    echo "   - RPC rate limiting (try different RPC endpoint)"
    exit 1
fi

echo "Initial genes minted successfully!"

# Step 3: Spawn initial Aminals
echo "Step 3: Spawning initial Aminals..."
forge script script/SpawnInitialAminals.s.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast

if [ $? -eq 0 ]; then
    echo "Initial Aminals spawned successfully!"



    echo "Full deployment process completed!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Check deployment-summary.json for contract addresses"
    echo "2. Update contract addresses in graph/subgraph.yaml"
    echo "3. Update start blocks to deployment blocks"
    echo "4. Deploy subgraph with: cd graph && npm run deploy:sepolia"
else
    echo "Initial Aminals spawning failed"
    exit 1
fi
