import { createClient } from '@ponder/client';
import * as schema from '../../../ponder/ponder.schema';

/**
 * Ponder Client Configuration
 *
 * This client connects to the Ponder indexer's SQL-over-HTTP endpoint.
 * It provides type-safe access to indexed blockchain data.
 */

// Determine Ponder server URL based on environment
const PONDER_URL =
  process.env.NEXT_PUBLIC_PONDER_URL || 'http://localhost:42069/sql';

export const ponderClient = createClient(PONDER_URL, { schema });
