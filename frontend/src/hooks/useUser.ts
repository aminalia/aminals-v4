import { eq } from '@ponder/client';
import { usePonderQuery } from '@ponder/react';
import type { UseQueryResult } from '@tanstack/react-query';
import * as schema from '../../ponder.schema';
import type {
  Aminal,
  FeedEvent,
  GeneAuction,
  GeneCreatorPayout,
  GeneNFT,
  GeneProposal,
  GeneVote,
  Relationship,
  User,
  UserWithRelations,
} from '../types/ponder';

// Re-export types
export type { GeneNFT, User, UserWithRelations };

/**
 * Fetch complete user profile with all relations
 *
 * Note: Ponder queryFn must return SQL, not execute it.
 * Multiple separate queries combined client-side.
 */
export const useUserProfile = (
  address: string
): Omit<UseQueryResult<User[], Error>, 'data'> & {
  data: UserWithRelations | undefined;
} => {
  // Fetch user
  const userResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, address as `0x${string}`))
        .limit(1);
    },
    enabled: !!address,
  }) as UseQueryResult<User[], Error>;

  // Fetch user's relationships (loved Aminals)
  const relationshipsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.relationship)
        .where(eq(schema.relationship.userId, address as `0x${string}`));
    },
    enabled: !!address,
  }) as UseQueryResult<Relationship[], Error>;

  // Fetch all aminals (to match with relationships)
  const aminalsResult = usePonderQuery({
    queryFn: (db) => {
      return db.select().from(schema.aminal);
    },
    enabled: !!address && (relationshipsResult.data?.length || 0) > 0,
  }) as UseQueryResult<Aminal[], Error>;

  // Fetch genes created by user
  const genesCreatedResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneNFT)
        .where(eq(schema.geneNFT.creatorId, address as `0x${string}`));
    },
    enabled: !!address,
  }) as UseQueryResult<GeneNFT[], Error>;

  // Fetch genes owned by user
  const genesOwnedResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneNFT)
        .where(eq(schema.geneNFT.ownerId, address as `0x${string}`));
    },
    enabled: !!address,
  }) as UseQueryResult<GeneNFT[], Error>;

  // Fetch design votes (renamed from gene votes)
  const geneVotesResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.designVote)
        .where(eq(schema.designVote.voterId, address as `0x${string}`));
    },
    enabled: !!address,
  }) as UseQueryResult<GeneVote[], Error>;

  // Fetch all design proposals (to match with votes)
  const geneProposalsResult = usePonderQuery({
    queryFn: (db) => {
      return db.select().from(schema.designProposal);
    },
    enabled: !!address && (geneVotesResult.data?.length || 0) > 0,
  }) as UseQueryResult<GeneProposal[], Error>;

  // Fetch all gene auctions (to match with votes)
  const geneAuctionsResult = usePonderQuery({
    queryFn: (db) => {
      return db.select().from(schema.geneAuction);
    },
    enabled: !!address && (geneVotesResult.data?.length || 0) > 0,
  }) as UseQueryResult<GeneAuction[], Error>;

  // Fetch payouts received
  const receivedPayoutsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneCreatorPayout)
        .where(
          eq(schema.geneCreatorPayout.creatorId, address as `0x${string}`)
        );
    },
    enabled: !!address,
  }) as UseQueryResult<GeneCreatorPayout[], Error>;

  // Fetch feed events
  const feedEventsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.feedEvent)
        .where(eq(schema.feedEvent.senderId, address as `0x${string}`));
    },
    enabled: !!address,
  }) as UseQueryResult<FeedEvent[], Error>;

  // Combine data client-side
  const processedData =
    userResult.data?.[0] &&
    relationshipsResult.data &&
    genesCreatedResult.data &&
    genesOwnedResult.data &&
    geneVotesResult.data &&
    receivedPayoutsResult.data &&
    feedEventsResult.data
      ? processUserProfile(
          userResult.data[0],
          relationshipsResult.data,
          aminalsResult.data || [],
          genesCreatedResult.data,
          genesOwnedResult.data,
          geneVotesResult.data,
          geneProposalsResult.data || [],
          geneAuctionsResult.data || [],
          receivedPayoutsResult.data,
          feedEventsResult.data
        )
      : undefined;

  return {
    ...userResult,
    data: processedData,
  };
};

/**
 * Client-side processing of user profile data
 */
function processUserProfile(
  user: User,
  relationships: Relationship[],
  aminals: Aminal[],
  genesCreated: GeneNFT[],
  genesOwned: GeneNFT[],
  geneVotes: GeneVote[],
  geneProposals: GeneProposal[],
  geneAuctions: GeneAuction[],
  receivedPayouts: GeneCreatorPayout[],
  feedEvents: FeedEvent[]
): UserWithRelations {
  // Create maps for efficient lookups
  const aminalsMap = new Map(aminals.map((a) => [a.id.toLowerCase(), a]));
  const proposalsMap = new Map(geneProposals.map((p) => [p.id, p]));
  const auctionsMap = new Map(geneAuctions.map((a) => [a.id, a]));
  const genesMap = new Map(
    [...genesCreated, ...genesOwned].map((g) => [g.id.toLowerCase(), g])
  );

  // Match relationships with aminals
  const loversWithAminals = relationships.map((rel) => ({
    ...rel,
    aminal: aminalsMap.get(rel.aminalId.toLowerCase()),
  }));

  // Match votes with proposals and auctions
  // Note: Design proposals now have geneIds (array), not a single geneNFTId
  const geneVotesWithRelations = geneVotes.map((vote) => {
    const proposal = proposalsMap.get(vote.proposalId);

    return {
      ...vote,
      proposal,
      auction: auctionsMap.get(vote.auctionId),
    };
  });

  return {
    ...user,
    lovers: loversWithAminals,
    genesCreated,
    genesOwned,
    geneVotes: geneVotesWithRelations,
    receivedPayouts,
    feedEvents,
  } as UserWithRelations;
}

/**
 * Fetch user's gene earnings with payout history
 */
export const useUserEarnings = (
  address: string
): Omit<UseQueryResult<GeneNFT[], Error>, 'data'> & {
  data:
    | {
        genesCreated: Array<GeneNFT & { payouts: GeneCreatorPayout[] }>;
      }
    | undefined;
} => {
  // Fetch genes created by user
  const genesCreatedResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneNFT)
        .where(eq(schema.geneNFT.creatorId, address as `0x${string}`));
    },
    enabled: !!address,
  }) as UseQueryResult<GeneNFT[], Error>;

  // Fetch all payouts for these genes
  const payoutsResult = usePonderQuery({
    queryFn: (db) => {
      return db
        .select()
        .from(schema.geneCreatorPayout)
        .where(
          eq(schema.geneCreatorPayout.creatorId, address as `0x${string}`)
        );
    },
    enabled: !!address,
  }) as UseQueryResult<GeneCreatorPayout[], Error>;

  // Combine data client-side
  const processedData =
    genesCreatedResult.data && payoutsResult.data
      ? processUserEarnings(genesCreatedResult.data, payoutsResult.data)
      : undefined;

  return {
    ...genesCreatedResult,
    data: processedData,
  };
};

/**
 * Client-side processing of user earnings data
 */
function processUserEarnings(
  genesCreated: GeneNFT[],
  payouts: GeneCreatorPayout[]
) {
  // Create map of gene ID to payouts
  const payoutsMap = new Map<string, GeneCreatorPayout[]>();
  payouts.forEach((payout) => {
    const geneId = payout.geneNFTId.toLowerCase();
    if (!payoutsMap.has(geneId)) {
      payoutsMap.set(geneId, []);
    }
    payoutsMap.get(geneId)!.push(payout);
  });

  // Attach payouts to genes
  const genesWithPayouts = genesCreated.map((gene) => ({
    ...gene,
    payouts: payoutsMap.get(gene.id.toLowerCase()) || [],
  }));

  return {
    genesCreated: genesWithPayouts,
  };
}
