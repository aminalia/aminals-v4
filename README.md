# Aminals

### UI TODO:

- UI to create new trait
- Only show end auction button if auction is endable
- Add traits to a breeding aminal
- Update values after a successful tx
- Toast for TXs
- Show zero traits on breeding?
- Aminal filtering (most loved, newest)
- Trait filtering (most reproduced)

#### Aminal Details Page TODO:

- Show breedableWith info
- Improve trait list display
- Show energy

### Graph TODO

- After successful breeding, remove BreedableWith
- Not sure if new visual proposals are fully working...
- Figure out what we need to index to make an MVP leaderboard (most love given, most loved, most successful traits)

### Contracts TODO

Refactor:

- Aminals.sol -> AminalsFactory.sol, each Aminal gets its own contract. The contract only allows for `callSkill(bytes)`.
- Skills are global, call based, and no registry
- Open Registry for traits
- Aminal Democracy can be bolted on later with skills
- Use standard governance contracts for emergent DAOs...

### Scripts

#### Deploying Skills

To deploy a new skill contract (e.g., Move2D):

1. Set up your environment variables:

```bash
cp .env.example .env
# Edit .env with your private key and RPC URL
```

2. Run the deployment script:

```bash
forge script script/DeploySkill.s.sol --rpc-url $RPC_URL --broadcast
```

The script will:

- Deploy the Move2D skill contract
- Register it with the Aminals contract
- Log the deployed address

Example output:

```
Move2D skill deployed to: 0x...
Skill registered with Aminals contract
```

Note: Make sure you have the correct Aminals contract address in the script before deploying.
