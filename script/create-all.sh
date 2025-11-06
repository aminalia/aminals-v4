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
    local name=$2
    local description=$3
    local category=$4

    # Check if this gene was already minted (by name)
    EXISTING_GENE=$(echo "$GENE_DEPLOYMENT_JSON" | jq -r --arg name "$name" '.genes | to_entries[] | select(.value.name == $name) | .key')

    if [ -n "$EXISTING_GENE" ]; then
        echo -e "${CYAN}  ↻ Already minted: $name (Gene ID: $EXISTING_GENE)${NC}" >&2
        echo "$EXISTING_GENE"
        return 0
    fi

    echo -e "${YELLOW}  → Minting: $name${NC}" >&2

    # Get the current gene ID from the Genes contract (this is the next ID that will be minted)
    GENE_ID=$(cast call $GENE_REGISTRY "geneNFT()(address)" --rpc-url $RPC_URL)
    GENE_ID=$(cast call $GENE_ID "currentId()(uint256)" --rpc-url $RPC_URL)

    # Send transaction and get result as JSON
    TX_RESULT=$(cast send $GENE_REGISTRY \
        "createGeneFor(address,string,string,string,string)" \
        $DEPLOYER \
        "$svg" \
        "$name" \
        "$description" \
        "$category" \
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
        GENE_DEPLOYMENT_JSON=$(echo "$GENE_DEPLOYMENT_JSON" | jq --arg id "$GENE_ID" --arg name "$name" --arg desc "$description" --arg cat "$category" --arg tx "$TX_HASH" \
            '.genes[$id] = {"name": $name, "description": $desc, "category": $cat, "transactionHash": $tx}')

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

# Step 1: Note about Gene ID 0
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 1: Gene ID 0 (Reserved for Empty Slots)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Note: Gene IDs now start at 1 (0 is reserved for empty slots)${NC}"
echo ""

# We'll use 0 to represent empty gene slots in Aminal visuals
EMPTY_GENE_ID=0

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

    # Check if this aminal already has genes deployed
    EXISTING_AMINAL=$(echo "$GENE_DEPLOYMENT_JSON" | jq -r --arg name "$aminal_name" '.aminals[$name]')

    if [ "$EXISTING_AMINAL" != "null" ] && [ -n "$EXISTING_AMINAL" ]; then
        echo -e "${CYAN}↻ Aminal '$display_name' already has genes deployed, skipping...${NC}"

        # Extract existing gene IDs
        EXISTING_GENE_IDS=$(echo "$EXISTING_AMINAL" | jq -r '.geneIds | @csv' | tr -d '"')
        ALL_AMINAL_GENES+=("$EXISTING_GENE_IDS")
        echo ""
        continue
    fi

    echo -e "${MAGENTA}────────────────────────────────────────────────────────────${NC}"
    echo -e "${MAGENTA}  🧬 Processing: $display_name${NC}"
    echo -e "${MAGENTA}────────────────────────────────────────────────────────────${NC}"
    echo ""

    # Array to store gene IDs for this Aminal (indices 0-8, MAX_GENES=9)
    declare -a GENE_IDS=()

    # Loop through traits 0-8
    for i in {0..8}; do
        # Find any file starting with "${i}-" in the folder
        file=$(find "$folder" -maxdepth 1 -name "${i}-*.svg" -print -quit)

        if [ -n "$file" ] && [ -f "$file" ]; then
            # File exists, read and mint it
            svg=$(cat "$file" | tr -d '\n')
            filename=$(basename "$file")
            # Extract trait name from filename (remove number prefix and .svg extension)
            trait_name=$(echo "$filename" | sed 's/^[0-9]*-//' | sed 's/.svg$//')

            # Create descriptive name, description, and category
            gene_name="$display_name - $trait_name"
            gene_description="Trait #$i for $display_name"
            gene_category="trait-$i"

            gene_id=$(mint_gene "$svg" "$gene_name" "$gene_description" "$gene_category")
            GENE_IDS[$i]=$gene_id
        else
            # File doesn't exist, use empty gene (ID 0)
            echo -e "${YELLOW}  → No file for trait $i, using empty gene (ID $EMPTY_GENE_ID)${NC}" >&2
            GENE_IDS[$i]=$EMPTY_GENE_ID
        fi
    done

    echo ""
    echo -e "${CYAN}  Gene mapping for $display_name:${NC}"
    echo -e "${CYAN}    [${GENE_IDS[0]}, ${GENE_IDS[1]}, ${GENE_IDS[2]}, ${GENE_IDS[3]}, ${GENE_IDS[4]}, ${GENE_IDS[5]}, ${GENE_IDS[6]}, ${GENE_IDS[7]}, ${GENE_IDS[8]}]${NC}"
    echo ""

    # Store this gene array for spawning later
    ALL_AMINAL_GENES+=("${GENE_IDS[0]},${GENE_IDS[1]},${GENE_IDS[2]},${GENE_IDS[3]},${GENE_IDS[4]},${GENE_IDS[5]},${GENE_IDS[6]},${GENE_IDS[7]},${GENE_IDS[8]}")

    # Add aminal gene mapping to deployment summary
    GENE_DEPLOYMENT_JSON=$(echo "$GENE_DEPLOYMENT_JSON" | jq --arg name "$aminal_name" --arg display "$display_name" --argjson genes "[${GENE_IDS[0]},${GENE_IDS[1]},${GENE_IDS[2]},${GENE_IDS[3]},${GENE_IDS[4]},${GENE_IDS[5]},${GENE_IDS[6]},${GENE_IDS[7]},${GENE_IDS[8]}]" \
        '.aminals[$name] = {"displayName": $display, "geneIds": $genes}')
done

# Step 3: Spawn all Aminals using forge script
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 3: Spawning Initial Aminals${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if initial aminals were already spawned
INITIAL_SPAWNED=$(cast call $AMINAL_FACTORY "initialAminalSpawned()(bool)" --rpc-url $RPC_URL)

if [ "$INITIAL_SPAWNED" == "true" ]; then
    echo -e "${YELLOW}⚠ Initial Aminals have already been spawned!${NC}"
    TOTAL_AMINALS=$(cast call $AMINAL_FACTORY "totalAminals()(uint256)" --rpc-url $RPC_URL)
    echo -e "${CYAN}Total Aminals already created: ${GREEN}$TOTAL_AMINALS${NC}"
    echo -e "${YELLOW}Skipping spawn step...${NC}"
    echo ""
else
    # Build the Visuals array - cast expects: "[([genes]),([genes]),...]" with parentheses inside brackets
    VISUALS_ARRAY="["
    for i in "${!ALL_AMINAL_GENES[@]}"; do
        IFS=',' read -ra GENES <<< "${ALL_AMINAL_GENES[$i]}"
        VISUALS_ARRAY+="([${GENES[0]},${GENES[1]},${GENES[2]},${GENES[3]},${GENES[4]},${GENES[5]},${GENES[6]},${GENES[7]},${GENES[8]}])"
        if [ $i -lt $((${#ALL_AMINAL_GENES[@]} - 1)) ]; then
            VISUALS_ARRAY+=","
        fi
    done
    VISUALS_ARRAY+="]"

    echo -e "${CYAN}Spawning ${#ALL_AMINAL_GENES[@]} Aminals with gene mappings...${NC}"
    echo -e "${CYAN}Visuals array: $VISUALS_ARRAY${NC}"
    echo ""

    # Call spawnInitialAminals on the factory with explicit gas limit
    # Gas limit set high enough for spawning multiple aminals (each aminal deployment costs ~2-3M gas)
    cast send $AMINAL_FACTORY \
        'spawnInitialAminals((uint256[9])[])' \
        "$VISUALS_ARRAY" \
        --private-key $PRIVATE_KEY \
        --rpc-url $RPC_URL \
        --gas-limit 30000000

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Successfully spawned ${#ALL_AMINAL_GENES[@]} Aminals!${NC}"
    else
        echo -e "${RED}✗ Failed to spawn Aminals${NC}"
        exit 1
    fi
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
