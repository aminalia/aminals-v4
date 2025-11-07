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

    # Array to store gene instances for this Aminal (indices 0-8, MAX_GENES=9)
    # Each element is a tuple: "geneId,offsetX,offsetY,scale,rotation"
    declare -a GENE_INSTANCES=()

    # Loop through traits 0-8
    for i in {0..8}; do
        # Find any file starting with "${i}-" in the folder
        file=$(find "$folder" -maxdepth 1 -name "${i}-*.svg" -print -quit)

        if [ -n "$file" ] && [ -f "$file" ]; then
            # File exists, read and mint it
            svg=$(cat "$file" | tr -d '\n')
            filename=$(basename "$file")

            # Extract trait name and positioning from filename
            # Format: N-category_X_Y_SCALE_ROTATION.svg or N-category_X-Y-SCALE-ROTATION.svg or N-category.svg
            # Remove slot prefix (N-) and .svg extension
            trait_info=$(echo "$filename" | sed 's/^[0-9]*-//' | sed 's/.svg$//')

            # Parse positioning data
            offsetX=0
            offsetY=0
            scale=100
            rotation=0

            # Check if filename contains positioning data (has underscore or additional hyphens)
            if [[ "$trait_info" == *"_"* ]]; then
                # Split on underscore: category_X_Y_SCALE_ROTATION or category_X-Y-SCALE-ROTATION
                IFS='_' read -ra PARTS <<< "$trait_info"
                trait_name="${PARTS[0]}"

                # Parse positioning components
                if [ ${#PARTS[@]} -gt 1 ]; then
                    # Check if second part contains hyphens (alternate format)
                    if [[ "${PARTS[1]}" == *"-"* ]]; then
                        # Hyphen-separated format: X-Y-SCALE-ROTATION
                        IFS='-' read -ra POS <<< "${PARTS[1]}"
                        [ ${#POS[@]} -gt 0 ] && offsetX=${POS[0]}
                        [ ${#POS[@]} -gt 1 ] && offsetY=${POS[1]}
                        [ ${#POS[@]} -gt 2 ] && scale=${POS[2]}
                        [ ${#POS[@]} -gt 3 ] && rotation=${POS[3]}
                    else
                        # Underscore-separated format: X_Y_SCALE_ROTATION
                        [ ${#PARTS[@]} -gt 1 ] && offsetX=${PARTS[1]}
                        [ ${#PARTS[@]} -gt 2 ] && offsetY=${PARTS[2]}
                        [ ${#PARTS[@]} -gt 3 ] && scale=${PARTS[3]}
                        [ ${#PARTS[@]} -gt 4 ] && rotation=${PARTS[4]}
                    fi
                fi
            else
                # No positioning data, just category name
                trait_name="$trait_info"
            fi

            # Create descriptive name, description, and category
            gene_name="$display_name - $trait_name"
            gene_description="Trait #$i for $display_name"
            gene_category="$trait_name"

            gene_id=$(mint_gene "$svg" "$gene_name" "$gene_description" "$gene_category")

            # Store as GeneInstance tuple: (geneId, offsetX, offsetY, scale, rotation)
            GENE_INSTANCES[$i]="$gene_id,$offsetX,$offsetY,$scale,$rotation"

            echo -e "${CYAN}    Position: x=$offsetX, y=$offsetY, scale=$scale, rotation=$rotation${NC}" >&2
        else
            # File doesn't exist, use empty gene (ID 0) with default positioning
            echo -e "${YELLOW}  → No file for trait $i, using empty gene (ID $EMPTY_GENE_ID)${NC}" >&2
            GENE_INSTANCES[$i]="$EMPTY_GENE_ID,0,0,100,0"
        fi
    done

    echo ""
    echo -e "${CYAN}  Gene instances for $display_name:${NC}"
    for idx in {0..8}; do
        IFS=',' read -ra INST <<< "${GENE_INSTANCES[$idx]}"
        echo -e "${CYAN}    [$idx]: (id=${INST[0]}, x=${INST[1]}, y=${INST[2]}, scale=${INST[3]}, rot=${INST[4]})${NC}"
    done
    echo ""

    # Store this gene instance array for spawning later
    ALL_AMINAL_GENES+=("${GENE_INSTANCES[0]};${GENE_INSTANCES[1]};${GENE_INSTANCES[2]};${GENE_INSTANCES[3]};${GENE_INSTANCES[4]};${GENE_INSTANCES[5]};${GENE_INSTANCES[6]};${GENE_INSTANCES[7]};${GENE_INSTANCES[8]}")

    # Add aminal gene mapping to deployment summary with full GeneInstance data
    # Build JSON array of gene instances
    GENE_INSTANCES_JSON="["
    for idx in {0..8}; do
        IFS=',' read -ra INST <<< "${GENE_INSTANCES[$idx]}"
        GENE_INSTANCES_JSON+="{\"geneId\":${INST[0]},\"offsetX\":${INST[1]},\"offsetY\":${INST[2]},\"scale\":${INST[3]},\"rotation\":${INST[4]}}"
        [ $idx -lt 8 ] && GENE_INSTANCES_JSON+=","
    done
    GENE_INSTANCES_JSON+="]"

    GENE_DEPLOYMENT_JSON=$(echo "$GENE_DEPLOYMENT_JSON" | jq --arg name "$aminal_name" --arg display "$display_name" --argjson instances "$GENE_INSTANCES_JSON" \
        '.aminals[$name] = {"displayName": $display, "geneInstances": $instances}')
done

# Step 3: Spawn all Aminals using forge script
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Step 3: Spawning Initial Aminals${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Check how many genesis aminals have been spawned already
GENESIS_SPAWNED=$(cast call $AMINAL_FACTORY "genesisAminalsSpawned()(uint256)" --rpc-url $RPC_URL)
MAX_GENESIS=$(cast call $AMINAL_FACTORY "MAX_GENESIS_AMINALS()(uint256)" --rpc-url $RPC_URL)
TOTAL_TO_SPAWN=${#ALL_AMINAL_GENES[@]}

echo -e "${CYAN}Genesis Aminals already spawned: ${GREEN}$GENESIS_SPAWNED${NC} / ${GREEN}$MAX_GENESIS${NC}"
echo -e "${CYAN}Total Aminals to spawn this run: ${GREEN}$TOTAL_TO_SPAWN${NC}"
echo ""

if [ "$GENESIS_SPAWNED" -ge "$MAX_GENESIS" ]; then
    echo -e "${YELLOW}⚠ All genesis Aminals have already been spawned!${NC}"
    TOTAL_AMINALS=$(cast call $AMINAL_FACTORY "totalAminals()(uint256)" --rpc-url $RPC_URL)
    echo -e "${CYAN}Total Aminals created: ${GREEN}$TOTAL_AMINALS${NC}"
    echo -e "${YELLOW}Skipping spawn step...${NC}"
    echo ""
elif [ "$TOTAL_TO_SPAWN" -gt "$((MAX_GENESIS - GENESIS_SPAWNED))" ]; then
    echo -e "${RED}Error: Trying to spawn $TOTAL_TO_SPAWN Aminals but only $((MAX_GENESIS - GENESIS_SPAWNED)) slots remaining${NC}"
    echo -e "${YELLOW}Reduce the number of folders in genes/ directory${NC}"
    exit 1
else
    # Spawn Aminals in batches of 2
    BATCH_SIZE=2
    TOTAL_AMINALS=${#ALL_AMINAL_GENES[@]}
    SPAWNED_COUNT=0

    echo -e "${CYAN}Spawning $TOTAL_AMINALS Aminals in batches of $BATCH_SIZE...${NC}"
    echo ""

    # Loop through batches
    for ((batch_start=0; batch_start<TOTAL_AMINALS; batch_start+=BATCH_SIZE)); do
        # Calculate batch end (don't exceed total)
        batch_end=$((batch_start + BATCH_SIZE))
        if [ $batch_end -gt $TOTAL_AMINALS ]; then
            batch_end=$TOTAL_AMINALS
        fi

        batch_size=$((batch_end - batch_start))

        echo -e "${MAGENTA}────────────────────────────────────────────────────────────${NC}"
        echo -e "${MAGENTA}  Batch: Spawning Aminals $((batch_start + 1))-$batch_end${NC}"
        echo -e "${MAGENTA}────────────────────────────────────────────────────────────${NC}"

        # Build the Visuals array for this batch
        # cast expects: "[[(id,x,y,s,r),...],...]"
        VISUALS_ARRAY="["

        for ((i=batch_start; i<batch_end; i++)); do
            # Split the aminal's gene instances (semicolon-separated)
            IFS=';' read -ra INSTANCES <<< "${ALL_AMINAL_GENES[$i]}"

            VISUALS_ARRAY+="["
            for j in {0..8}; do
                # Split each GeneInstance tuple (comma-separated: geneId,x,y,scale,rotation)
                IFS=',' read -ra INST <<< "${INSTANCES[$j]}"
                VISUALS_ARRAY+="(${INST[0]},${INST[1]},${INST[2]},${INST[3]},${INST[4]})"
                if [ $j -lt 8 ]; then
                    VISUALS_ARRAY+=","
                fi
            done
            VISUALS_ARRAY+="]"

            if [ $i -lt $((batch_end - 1)) ]; then
                VISUALS_ARRAY+=","
            fi
        done
        VISUALS_ARRAY+="]"

        echo -e "${CYAN}Spawning $batch_size Aminals...${NC}"
        echo ""

        # Call spawnInitialAminals with this batch
        # Gas limit: ~3M per Aminal + overhead
        TX_RESULT=$(cast send $AMINAL_FACTORY \
            'spawnInitialAminals((uint256,int16,int16,uint16,uint16)[9][])' \
            "$VISUALS_ARRAY" \
            --private-key $PRIVATE_KEY \
            --rpc-url $RPC_URL \
            --gas-limit $((3000000 * batch_size + 1000000)) \
            --json 2>&1)

        # Check if transaction succeeded
        if echo "$TX_RESULT" | jq empty 2>/dev/null; then
            TX_HASH=$(echo "$TX_RESULT" | jq -r '.transactionHash')
            if [ -n "$TX_HASH" ] && [ "$TX_HASH" != "null" ]; then
                echo -e "${GREEN}✓ Batch spawned successfully!${NC}"
                echo -e "${GREEN}  TX: $TX_HASH${NC}"
                SPAWNED_COUNT=$((SPAWNED_COUNT + batch_size))
            else
                echo -e "${RED}✗ Failed to spawn batch${NC}"
                echo -e "${RED}  Result: $TX_RESULT${NC}"
                exit 1
            fi
        else
            echo -e "${RED}✗ Failed to spawn batch${NC}"
            echo -e "${RED}  Error: $TX_RESULT${NC}"
            exit 1
        fi

        echo ""
    done

    echo -e "${GREEN}✓ Successfully spawned $SPAWNED_COUNT Aminals in $((TOTAL_AMINALS / BATCH_SIZE + (TOTAL_AMINALS % BATCH_SIZE > 0))) batches!${NC}"
    echo ""
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
