# Ponder Integration Guide

This document provides condensed knowledge about integrating Ponder client libraries into the Aminals frontend for real-time blockchain data queries.

## Overview

Ponder provides a modern approach to querying indexed blockchain data using SQL over HTTP with type-safe client libraries. This eliminates the need for GraphQL codegen and provides live query updates.

## Core Packages

### @ponder/client

Creates a typed SQL client for querying Ponder databases over HTTP.

**Installation:**
```bash
npm add @ponder/client
```

**Setup:**
```typescript
import { createClient } from "@ponder/client";
import * as schema from "../../ponder/ponder.schema";

const client = createClient("https://your-ponder-server.com/sql", { schema });
```

**Basic Usage:**
```typescript
// Simple query
const accounts = await client.db
  .select()
  .from(schema.account)
  .orderBy(desc(schema.account.balance))
  .limit(10);

// Complex filtering
const result = await client.db
  .select()
  .from(schema.account)
  .where(gt(schema.account.balance, 1000n));

// Get indexing status
const status = await client.getStatus();
```

**Live Queries:**
```typescript
// Subscribe to live updates via server-sent events
const unsubscribe = client.live(
  (db) => db.select().from(schema.account),
  (data) => {
    console.log("Updated data:", data);
  }
);

// Clean up when done
unsubscribe();
```

### @ponder/react

React hooks for querying Ponder databases with automatic reactivity.

**Installation:**
```bash
npm add @ponder/react @ponder/client @tanstack/react-query
```

**Setup Provider:**
```typescript
import { PonderProvider } from "@ponder/react";
import { createClient } from "@ponder/client";
import * as schema from "../../ponder/ponder.schema";

const client = createClient("https://your-ponder-server.com/sql", { schema });

function App() {
  return (
    <PonderProvider client={client}>
      <YourApp />
    </PonderProvider>
  );
}
```

**Hooks:**

1. **usePonderQuery** - Main hook for querying data with live updates
```typescript
function AccountList() {
  const { data, isLoading, error, refetch } = usePonderQuery({
    queryFn: (db) => db.select().from(schema.account).limit(10),
    // Optional: enable live updates (default: false)
    live: true,
    // Optional: TanStack Query options
    refetchInterval: 5000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(account => (
        <div key={account.id}>{account.balance}</div>
      ))}
    </div>
  );
}
```

2. **usePonderStatus** - Query indexing status
```typescript
function IndexingStatus() {
  const { data: status } = usePonderStatus();

  return (
    <div>
      {status?.chains.map(chain => (
        <div key={chain.name}>
          {chain.name}: {chain.blockNumber} / {chain.targetBlockNumber}
        </div>
      ))}
    </div>
  );
}
```

3. **usePonderClient** - Access client instance
```typescript
function CustomQuery() {
  const client = usePonderClient();

  // Use client directly for imperative queries
  const handleClick = async () => {
    const result = await client.db.select().from(schema.account);
    console.log(result);
  };

  return <button onClick={handleClick}>Query</button>;
}
```

### @ponder/utils

Utility functions for common Ponder operations.

**Installation:**
```bash
npm add @ponder/utils
```

**Key Functions:**

1. **mergeAbis** - Combine multiple ABIs
```typescript
import { mergeAbis } from "@ponder/utils";

const tokenAbi = mergeAbis([erc20Abi, erc4626Abi]);
```

2. **replaceBigInts** - Handle BigInt serialization
```typescript
import { replaceBigInts } from "@ponder/utils";

// Convert to strings
const jsonData = replaceBigInts(obj, (v) => String(v));

// Convert to hex
const hexData = replaceBigInts(obj, (v) => `0x${v.toString(16)}`);
```

3. **loadBalance** - Distribute RPC requests
```typescript
import { loadBalance } from "@ponder/utils";

const transport = loadBalance([
  http("https://rpc1.example.com"),
  http("https://rpc2.example.com"),
]);
```

4. **rateLimit** - Limit requests per second
```typescript
import { rateLimit } from "@ponder/utils";

const transport = rateLimit(http("https://rpc.example.com"), {
  requestsPerSecond: 50,
});
```

## SQL over HTTP Architecture

### Key Features

- **Zero-codegen type inference**: Type safety without code generation
- **Live queries**: Real-time updates via server-sent events
- **Flexible SQL**: Use Drizzle ORM syntax for complex queries
- **Security**: Read-only transactions, query validation, resource limits

### Query Capabilities

```typescript
// Pagination
const page1 = await client.db
  .select()
  .from(schema.account)
  .limit(10)
  .offset(0);

// Joins and relations
const aminalsWithStats = await client.db
  .select()
  .from(schema.aminal)
  .leftJoin(schema.voteStats, eq(schema.aminal.id, schema.voteStats.aminalId));

// Aggregations
const stats = await client.db
  .select({
    total: count(),
    avgBalance: avg(schema.account.balance),
  })
  .from(schema.account);

// Complex filtering
const results = await client.db
  .select()
  .from(schema.aminal)
  .where(
    and(
      gt(schema.aminal.energy, 0),
      like(schema.aminal.name, "%cat%")
    )
  )
  .orderBy(desc(schema.aminal.createdAt));
```

## Migration Strategy

### From GraphQL to Ponder

1. **Remove GraphQL dependencies**
   - `graphql`
   - `.graphclient/`
   - GraphQL queries and hooks in `src/resources/`

2. **Install Ponder packages**
   ```bash
   npm add @ponder/react @ponder/client @tanstack/react-query
   ```

3. **Setup client and provider**
   - Create client configuration
   - Wrap app with PonderProvider
   - Import schema from `ponder.schema.ts`

4. **Convert queries**
   - Replace GraphQL queries with Drizzle SQL queries
   - Move hooks from `src/resources/` to `src/hooks/`
   - Use `usePonderQuery` instead of GraphQL hooks

5. **Enable live updates**
   - Add `live: true` to queries that need real-time updates
   - Remove manual polling/refetching logic

## Best Practices

1. **Use live queries sparingly**: Only enable for data that truly needs real-time updates
2. **Leverage TanStack Query**: Use caching, refetching, and stale-time options
3. **Type safety**: Import and use schema types throughout
4. **Error handling**: Always handle loading and error states
5. **Pagination**: Implement cursor or offset-based pagination for large datasets
6. **BigInt handling**: Use `replaceBigInts` when serializing data with BigInts

## Performance Considerations

- Live queries use server-sent events (SSE) for efficient updates
- TanStack Query handles caching and deduplication
- Server-side query validation prevents malicious queries
- Resource limits protect against expensive operations
- Consider using `refetchInterval` instead of live queries for less critical data

## Resources

- [Ponder SQL over HTTP Docs](https://ponder.sh/docs/query/sql-over-http)
- [@ponder/react API Reference](https://ponder.sh/docs/api-reference/ponder-react)
- [@ponder/client API Reference](https://ponder.sh/docs/api-reference/ponder-client)
- [@ponder/utils API Reference](https://ponder.sh/docs/api-reference/ponder-utils)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
