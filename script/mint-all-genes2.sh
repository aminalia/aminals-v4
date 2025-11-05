#!/bin/bash

# Mint Aminal Genes from SVG files
# This script reads SVG files from the genes/ directory and mints them
# Usage: PRIVATE_KEY=0x... RPC_URL=https://... ./script/mint-all-genes2.sh

set -e

export RPC_URL="http://localhost:8545"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check requirements
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}Error: PRIVATE_KEY not set${NC}"
    echo "Usage: PRIVATE_KEY=0x... RPC_URL=https://... ./script/mint-all-genes2.sh"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    echo -e "${YELLOW}Warning: RPC_URL not set, using default Sepolia${NC}"
fi

# Check tools
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq not installed${NC}"
    exit 1
fi

if ! command -v cast &> /dev/null; then
    echo -e "${RED}Error: cast not installed${NC}"
    exit 1
fi

# Read GeneRegistry address
if [ ! -f "deployment-summary.json" ]; then
    echo -e "${RED}Error: deployment-summary.json not found${NC}"
    exit 1
fi

GENE_REGISTRY=$(jq -r '.contracts.GeneRegistry' deployment-summary.json)
if [ "$GENE_REGISTRY" == "null" ] || [ -z "$GENE_REGISTRY" ]; then
    echo -e "${RED}Error: GeneRegistry address not found${NC}"
    exit 1
fi

DEPLOYER=$(cast wallet address --private-key $PRIVATE_KEY)

echo -e "${GREEN}✓ GeneRegistry: $GENE_REGISTRY${NC}"
echo -e "${GREEN}✓ Deployer: $DEPLOYER${NC}"
echo ""

# Empty SVG for missing traits
EMPTY_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"></svg>'

# Counter for total genes minted
TOTAL_GENES=0

# Function to mint a gene
mint_gene() {
    local svg=$1
    local zindex=$2
    local description=$3

    echo -e "${YELLOW}→ Minting: $description (z-index $zindex)${NC}"

    TX_HASH=$(cast send $GENE_REGISTRY \
        "createGeneFor(address,string,uint8)" \
        $DEPLOYER \
        "$svg" \
        $zindex \
        --private-key $PRIVATE_KEY \
        --rpc-url $RPC_URL \
        --json 2>/dev/null | jq -r '.transactionHash')

    if [ $? -eq 0 ] && [ "$TX_HASH" != "null" ] && [ -n "$TX_HASH" ]; then
        echo -e "${GREEN}✓ Success - TX: $TX_HASH${NC}"
        echo ""
        TOTAL_GENES=$((TOTAL_GENES + 1))
    else
        echo -e "${RED}✗ Failed${NC}"
        exit 1
    fi
}

# Function to process an aminal type folder
process_aminal_folder() {
    local folder=$1
    local aminal_name=$2

    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Mint ${aminal_name} Genes${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""

    # Loop through traits 0-9
    for i in {0..9}; do
        # Find any file starting with "${i}-" in the folder
        local file=$(find "$folder" -maxdepth 1 -name "${i}-*.svg" -print -quit)

        if [ -n "$file" ] && [ -f "$file" ]; then
            # File exists, read it
            local svg=$(cat "$file" | tr -d '\n')
            local filename=$(basename "$file")
            mint_gene "$svg" $i "${aminal_name} - ${filename}"
        else
            # File doesn't exist, use empty SVG
            echo -e "${YELLOW}→ No file found for trait $i, using empty SVG${NC}"
            mint_gene "$EMPTY_SVG" $i "${aminal_name} - Empty trait $i"
        fi
    done
}

# Check if genes directory exists
if [ ! -d "genes" ]; then
    echo -e "${RED}Error: genes/ directory not found${NC}"
    exit 1
fi

# Discover and process all subdirectories in genes/
for folder in genes/*/; do
    # Remove trailing slash and get just the folder name
    folder=${folder%/}
    aminal_name=$(basename "$folder")

    # Convert folder name to title case for display (replace - with space and capitalize)
    display_name=$(echo "$aminal_name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')

    process_aminal_folder "$folder" "$display_name"
done

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ All $TOTAL_GENES genes minted successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Verify genes created:"
echo "  cast call $GENE_REGISTRY 'totalGenesCreated()(uint256)' --rpc-url $RPC_URL"
echo ""
echo "View your genes:"
echo "  cast call $GENE_REGISTRY 'getGenesByCreator(address)(uint256[])' $DEPLOYER --rpc-url $RPC_URL"
echo ""
