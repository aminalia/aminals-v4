# TokenURI Fix for Aminal Images

## Problem
Aminal images were not showing because the `tokenURI` field was null in the GraphQL data. The tokenURI fetching was commented out in the subgraph for performance reasons.

## Root Cause
In `/workspace/graph/src/factory.ts`, the tokenURI fetching code was commented out:

```typescript
// Defer tokenURI fetch to avoid blocking indexing - only fetch when needed
// This can be done lazily on frontend or in a separate background process
// let tokenURI = fetchTokenURI(event.params.aminalAddress);
// if (tokenURI) {
//   aminal.tokenURI = tokenURI;
// }
```

## Fix Applied
Uncommented the tokenURI fetching in `handleAminalSpawned` function:

```typescript
// Fetch tokenURI for the Aminal
let tokenURI = fetchTokenURI(event.params.aminalAddress);
if (tokenURI) {
  aminal.tokenURI = tokenURI;
}
```

## Impact
- ✅ New Aminals will have proper tokenURI and images will display
- ❌ Existing Aminals with null tokenURI will still not show images until re-indexed
- 🔧 Subgraph builds successfully with this fix

## Deployment Status
- Subgraph code is fixed and builds successfully
- Ready for deployment but requires deploy key authentication
- Once deployed, new Aminals will have working images

## To Deploy
1. Authenticate with The Graph Studio: `npx graph auth <DEPLOY_KEY>`
2. Deploy the subgraph: `npm run deploy` (version v1.1.0)

## Testing
After deployment, create a new Aminal and verify:
1. The tokenURI is not null in GraphQL queries
2. The Aminal image displays correctly in the frontend
3. The frontend's TokenUriImage component can parse the data URI

## Alternative Solutions for Existing Aminals
For Aminals already indexed with null tokenURI, consider:
1. Re-indexing from an earlier block (data loss)
2. Adding a separate background process to backfill tokenURIs
3. Frontend fallback to direct contract calls for missing tokenURIs