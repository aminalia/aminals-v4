#!/bin/bash

# Create all Aminal Genes and spawn initial Aminals
# This script:
# 1. Mints gene 0 as empty SVG
# 2. For each folder in genes/, mints all genes (0-9) and tracks their IDs
# 3. Spawns an Aminal for each folder using the tracked gene IDs
#
# Usage: PRIVATE_KEY=0x... RPC_URL=https://... ./script/create-all.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Check requirements
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}Error: PRIVATE_KEY not set${NC}"
    echo "Usage: PRIVATE_KEY=0x... RPC_URL=https://... ./script/create-all.sh"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    echo -e "${YELLOW}Warning: RPC_URL not set, using default http://localhost:8545${NC}"
    export RPC_URL="http://localhost:8545"
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

# Read contract addresses
if [ ! -f "deployment-summary.json" ]; then
    echo -e "${RED}Error: deployment-summary.json not found${NC}"
    exit 1
fi

GENE_REGISTRY=$(jq -r '.contracts.GeneRegistry' deployment-summary.json)
AMINAL_FACTORY=$(jq -r '.contracts.AminalFactory' deployment-summary.json)

if [ "$GENE_REGISTRY" == "null" ] || [ -z "$GENE_REGISTRY" ]; then
    echo -e "${RED}Error: GeneRegistry address not found${NC}"
    exit 1
fi

if [ "$AMINAL_FACTORY" == "null" ] || [ -z "$AMINAL_FACTORY" ]; then
    echo -e "${RED}Error: AminalFactory address not found${NC}"
    exit 1
fi

DEPLOYER=$(cast wallet address --private-key $PRIVATE_KEY)

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🏭 Aminals Genesis Creation Script 🧬${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}GeneRegistry:  ${GREEN}$GENE_REGISTRY${NC}"
echo -e "${CYAN}AminalFactory: ${GREEN}$AMINAL_FACTORY${NC}"
echo -e "${CYAN}Deployer:      ${GREEN}$DEPLOYER${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Empty SVG for missing traits
EMPTY_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"></svg>'

# Counter for total genes minted
TOTAL_GENES=0

# Initialize or load gene deployment summary JSON
if [ -f "gene-deployment-summary.json" ]; then
    echo -e "${YELLOW}Found existing gene-deployment-summary.json, resuming from previous run...${NC}"
    GENE_DEPLOYMENT_JSON=$(cat gene-deployment-summary.json)
    # Count existing genes
    EXISTING_GENES=$(echo "$GENE_DEPLOYMENT_JSON" | jq '.genes | length')
    echo -e "${YELLOW}Already have $EXISTING_GENES genes minted${NC}"
    echo ""
else
    GENE_DEPLOYMENT_JSON="{\"timestamp\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",\"deployer\":\"$DEPLOYER\",\"geneRegistry\":\"$GENE_REGISTRY\",\"aminalFactory\":\"$AMINAL_FACTORY\",\"genes\":{},\"aminals\":{}}"
fi

# Function to mint a gene and return its ID
mint_gene() {
    local svg=$1
    local description=$2

    # Check if this gene was already minted (by description)
    EXISTING_GENE=$(echo "$GENE_DEPLOYMENT_JSON" | jq -r --arg desc "$description" '.genes | to_entries[] | select(.value.description == $desc) | .key')

    if [ -n "$EXISTING_GENE" ]; then
        echo -e "${CYAN}  ↻ Already minted: $description (Gene ID: $EXISTING_GENE)${NC}" >&2
        echo "$EXISTING_GENE"
        return 0
    fi

    echo -e "${YELLOW}  → Minting: $description${NC}" >&2

    # First get the current gene ID before minting
    GENE_ID=$(cast call $GENE_REGISTRY "totalGenesCreated()(uint256)" --rpc-url $RPC_URL)

    # Send transaction and get result as JSON
    TX_RESULT=$(cast send $GENE_REGISTRY \
        "createGeneFor(address,string)" \
        $DEPLOYER \
        "$svg" \
        --private-key $PRIVATE_KEY \
        --rpc-url $RPC_URL \
        --json 2>&1)

    # Check if the result is valid JSON
    if echo "$TX_RESULT" | jq empty 2>/dev/null; then
        TX_HASH=$(echo "$TX_RESULT" | jq -r '.transactionHash')
    else
        echo -e "${RED}    ✗ Failed to mint gene${NC}" >&2
        echo -e "${RED}    Error: $TX_RESULT${NC}" >&2
        # Save progress before exiting
        echo "$GENE_DEPLOYMENT_JSON" | jq '.' > gene-deployment-summary.json
        exit 1
    fi

    if [ -n "$TX_HASH" ] && [ "$TX_HASH" != "null" ]; then
        # Wait for transaction to be mined
        cast receipt $TX_HASH --rpc-url $RPC_URL > /dev/null 2>&1

        echo -e "${GREEN}    ✓ Gene ID: $GENE_ID | TX: $TX_HASH${NC}" >&2
        TOTAL_GENES=$((TOTAL_GENES + 1))

        # Add to gene deployment summary
        GENE_DEPLOYMENT_JSON=$(echo "$GENE_DEPLOYMENT_JSON" | jq --arg id "$GENE_ID" --arg desc "$description" --arg tx "$TX_HASH" \
            '.genes[$id] = {"description": $desc, "transactionHash": $tx}')

        # Save progress immediately after each successful mint
        echo "$GENE_DEPLOYMENT_JSON" | jq '.' > gene-deployment-summary.json

        # Return the gene ID
        echo "$GENE_ID"
    else
        echo -e "${RED}    ✗ Failed to mint gene${NC}" >&2
        echo -e "${RED}    Transaction result: $TX_RESULT${NC}" >&2
        # Save progress before exiting
        echo "$GENE_DEPLOYMENT_JSON" | jq '.' > gene-deployment-summary.json
        exit 1
    fi
}

# Check if genes directory exists
if [ ! -d "genes" ]; then
    echo -e "${RED}Error: genes/ directory not found${NC}"
    exit 1
fi

# Step 1: Mint empty gene as gene ID 0
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 1: Minting Empty Gene (ID 0)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

EMPTY_GENE_ID=$(mint_gene "$EMPTY_SVG" "Empty trait placeholder")
echo ""

if [ "$EMPTY_GENE_ID" != "0" ]; then
    echo -e "${RED}Error: Empty gene should be ID 0, but got ID $EMPTY_GENE_ID${NC}"
    echo -e "${YELLOW}This might be okay if genes were already minted. Continuing...${NC}"
    echo ""
fi

# Step 2: Process each aminal folder
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 2: Minting Genes and Spawning Aminals${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Array to store all gene arrays for spawning
declare -a ALL_AMINAL_GENES=()

# Discover and process all subdirectories in genes/
for folder in genes/*/; do
    # Remove trailing slash and get just the folder name
    folder=${folder%/}
    aminal_name=$(basename "$folder")

    # Convert folder name to title case for display (replace - with space and capitalize)
    display_name=$(echo "$aminal_name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')

    echo -e "${MAGENTA}────────────────────────────────────────────────────────────${NC}"
    echo -e "${MAGENTA}  🧬 Processing: $display_name${NC}"
    echo -e "${MAGENTA}────────────────────────────────────────────────────────────${NC}"
    echo ""

    # Array to store gene IDs for this Aminal (indices 0-9)
    declare -a GENE_IDS=()

    # Loop through traits 0-9
    for i in {0..9}; do
        # Find any file starting with "${i}-" in the folder
        file=$(find "$folder" -maxdepth 1 -name "${i}-*.svg" -print -quit)

        if [ -n "$file" ] && [ -f "$file" ]; then
            # File exists, read and mint it
            svg=$(cat "$file" | tr -d '\n')
            filename=$(basename "$file")
            gene_id=$(mint_gene "$svg" "$display_name - $filename")
            GENE_IDS[$i]=$gene_id
        else
            # File doesn't exist, use empty gene (ID 0)
            echo -e "${YELLOW}  → No file for trait $i, using empty gene (ID $EMPTY_GENE_ID)${NC}" >&2
            GENE_IDS[$i]=$EMPTY_GENE_ID
        fi
    done

    echo ""
    echo -e "${CYAN}  Gene mapping for $display_name:${NC}"
    echo -e "${CYAN}    [${GENE_IDS[0]}, ${GENE_IDS[1]}, ${GENE_IDS[2]}, ${GENE_IDS[3]}, ${GENE_IDS[4]}, ${GENE_IDS[5]}, ${GENE_IDS[6]}, ${GENE_IDS[7]}, ${GENE_IDS[8]}, ${GENE_IDS[9]}]${NC}"
    echo ""

    # Store this gene array for spawning later
    ALL_AMINAL_GENES+=("${GENE_IDS[0]},${GENE_IDS[1]},${GENE_IDS[2]},${GENE_IDS[3]},${GENE_IDS[4]},${GENE_IDS[5]},${GENE_IDS[6]},${GENE_IDS[7]},${GENE_IDS[8]},${GENE_IDS[9]}")

    # Add aminal gene mapping to deployment summary
    GENE_DEPLOYMENT_JSON=$(echo "$GENE_DEPLOYMENT_JSON" | jq --arg name "$aminal_name" --arg display "$display_name" --argjson genes "[${GENE_IDS[0]},${GENE_IDS[1]},${GENE_IDS[2]},${GENE_IDS[3]},${GENE_IDS[4]},${GENE_IDS[5]},${GENE_IDS[6]},${GENE_IDS[7]},${GENE_IDS[8]},${GENE_IDS[9]}]" \
        '.aminals[$name] = {"displayName": $display, "geneIds": $genes}')
done

# Step 3: Spawn all Aminals using forge script
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 3: Spawning Initial Aminals${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Build the Visuals array - cast expects: "[([genes]),([genes]),...]" with parentheses inside brackets
VISUALS_ARRAY="["
for i in "${!ALL_AMINAL_GENES[@]}"; do
    IFS=',' read -ra GENES <<< "${ALL_AMINAL_GENES[$i]}"
    VISUALS_ARRAY+="([${GENES[0]},${GENES[1]},${GENES[2]},${GENES[3]},${GENES[4]},${GENES[5]},${GENES[6]},${GENES[7]},${GENES[8]},${GENES[9]}])"
    if [ $i -lt $((${#ALL_AMINAL_GENES[@]} - 1)) ]; then
        VISUALS_ARRAY+=","
    fi
done
VISUALS_ARRAY+="]"

echo -e "${CYAN}Spawning ${#ALL_AMINAL_GENES[@]} Aminals with gene mappings...${NC}"
echo -e "${CYAN}Visuals array: $VISUALS_ARRAY${NC}"
echo ""

# Call spawnInitialAminals on the factory
cast send $AMINAL_FACTORY \
    'spawnInitialAminals((uint256[10])[])' \
    "$VISUALS_ARRAY" \
    --private-key $PRIVATE_KEY \
    --rpc-url $RPC_URL

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Successfully spawned ${#ALL_AMINAL_GENES[@]} Aminals!${NC}"
else
    echo -e "${RED}✗ Failed to spawn Aminals${NC}"
    exit 1
fi

# Save gene deployment summary
echo "$GENE_DEPLOYMENT_JSON" | jq '.' > gene-deployment-summary.json
echo -e "${GREEN}✓ Gene deployment summary saved to gene-deployment-summary.json${NC}"
echo ""

# Summary
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✨ Genesis Complete! ✨${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Total Genes Minted: ${GREEN}$TOTAL_GENES${NC}"
echo -e "${CYAN}Total Aminals Spawned: ${GREEN}${#ALL_AMINAL_GENES[@]}${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Verification Commands:${NC}"
echo ""
echo -e "${CYAN}Check total genes created:${NC}"
echo "  cast call $GENE_REGISTRY 'totalGenesCreated()(uint256)' --rpc-url $RPC_URL"
echo ""
echo -e "${CYAN}View your genes:${NC}"
echo "  cast call $GENE_REGISTRY 'getGenesByCreator(address)(uint256[])' $DEPLOYER --rpc-url $RPC_URL"
echo ""
echo -e "${CYAN}Check total Aminals:${NC}"
echo "  cast call $AMINAL_FACTORY 'totalAminals()(uint256)' --rpc-url $RPC_URL"
echo ""
echo -e "${CYAN}Get Aminal at index 0:${NC}"
echo "  cast call $AMINAL_FACTORY 'aminalsByIndex(uint256)(address)' 0 --rpc-url $RPC_URL"
echo ""
