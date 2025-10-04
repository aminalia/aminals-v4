// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace PonderTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
  BigInt: { input: any; output: any; }
};

export type PageInfo = {
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
  endCursor?: Maybe<Scalars['String']['output']>;
};

export type Meta = {
  status?: Maybe<Scalars['JSON']['output']>;
};

export type Query = {
  factory?: Maybe<factory>;
  factorys: factoryPage;
  aminal?: Maybe<aminal>;
  aminals: aminalPage;
  user?: Maybe<user>;
  users: userPage;
  relationship?: Maybe<relationship>;
  relationships: relationshipPage;
  geneNFT?: Maybe<geneNFT>;
  geneNFTs: geneNFTPage;
  geneAuction?: Maybe<geneAuction>;
  geneAuctions: geneAuctionPage;
  geneProposal?: Maybe<geneProposal>;
  geneProposals: geneProposalPage;
  geneVote?: Maybe<geneVote>;
  geneVotes: geneVotePage;
  geneCreatorPayout?: Maybe<geneCreatorPayout>;
  geneCreatorPayouts: geneCreatorPayoutPage;
  feedEvent?: Maybe<feedEvent>;
  feedEvents: feedEventPage;
  skillUsedEvent?: Maybe<skillUsedEvent>;
  skillUsedEvents: skillUsedEventPage;
  _meta?: Maybe<Meta>;
};


export type QueryfactoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryfactorysArgs = {
  where?: InputMaybe<factoryFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryaminalArgs = {
  id: Scalars['String']['input'];
};


export type QueryaminalsArgs = {
  where?: InputMaybe<aminalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryuserArgs = {
  id: Scalars['String']['input'];
};


export type QueryusersArgs = {
  where?: InputMaybe<userFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryrelationshipArgs = {
  id: Scalars['String']['input'];
};


export type QueryrelationshipsArgs = {
  where?: InputMaybe<relationshipFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerygeneNFTArgs = {
  id: Scalars['String']['input'];
};


export type QuerygeneNFTsArgs = {
  where?: InputMaybe<geneNFTFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerygeneAuctionArgs = {
  id: Scalars['String']['input'];
};


export type QuerygeneAuctionsArgs = {
  where?: InputMaybe<geneAuctionFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerygeneProposalArgs = {
  id: Scalars['String']['input'];
};


export type QuerygeneProposalsArgs = {
  where?: InputMaybe<geneProposalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerygeneVoteArgs = {
  id: Scalars['String']['input'];
};


export type QuerygeneVotesArgs = {
  where?: InputMaybe<geneVoteFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerygeneCreatorPayoutArgs = {
  id: Scalars['String']['input'];
};


export type QuerygeneCreatorPayoutsArgs = {
  where?: InputMaybe<geneCreatorPayoutFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryfeedEventArgs = {
  id: Scalars['String']['input'];
};


export type QueryfeedEventsArgs = {
  where?: InputMaybe<feedEventFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryskillUsedEventArgs = {
  id: Scalars['String']['input'];
};


export type QueryskillUsedEventsArgs = {
  where?: InputMaybe<skillUsedEventFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type factory = {
  id: Scalars['String']['output'];
  totalAminals: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  aminals?: Maybe<aminalPage>;
};


export type factoryaminalsArgs = {
  where?: InputMaybe<aminalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type aminalPage = {
  items: Array<aminal>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type aminal = {
  id: Scalars['String']['output'];
  contractAddress: Scalars['String']['output'];
  aminalIndex: Scalars['BigInt']['output'];
  factoryId: Scalars['String']['output'];
  parentOneId?: Maybe<Scalars['String']['output']>;
  parentTwoId?: Maybe<Scalars['String']['output']>;
  auctionId?: Maybe<Scalars['BigInt']['output']>;
  traits: Array<Scalars['BigInt']['output']>;
  energy: Scalars['BigInt']['output'];
  totalLove: Scalars['BigInt']['output'];
  ethBalance: Scalars['BigInt']['output'];
  tokenURI?: Maybe<Scalars['String']['output']>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  factory?: Maybe<factory>;
  parentOne?: Maybe<aminal>;
  parentTwo?: Maybe<aminal>;
  childrenAsParentOne?: Maybe<aminalPage>;
  childrenAsParentTwo?: Maybe<aminalPage>;
  lovers?: Maybe<relationshipPage>;
  feeds?: Maybe<feedEventPage>;
  skillsUsed?: Maybe<skillUsedEventPage>;
};


export type aminalchildrenAsParentOneArgs = {
  where?: InputMaybe<aminalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type aminalchildrenAsParentTwoArgs = {
  where?: InputMaybe<aminalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type aminalloversArgs = {
  where?: InputMaybe<relationshipFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type aminalfeedsArgs = {
  where?: InputMaybe<feedEventFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type aminalskillsUsedArgs = {
  where?: InputMaybe<skillUsedEventFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type aminalFilter = {
  AND?: InputMaybe<Array<InputMaybe<aminalFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<aminalFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not?: InputMaybe<Scalars['String']['input']>;
  contractAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contractAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalIndex?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  aminalIndex_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  aminalIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  factoryId?: InputMaybe<Scalars['String']['input']>;
  factoryId_not?: InputMaybe<Scalars['String']['input']>;
  factoryId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  factoryId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  factoryId_contains?: InputMaybe<Scalars['String']['input']>;
  factoryId_not_contains?: InputMaybe<Scalars['String']['input']>;
  factoryId_starts_with?: InputMaybe<Scalars['String']['input']>;
  factoryId_ends_with?: InputMaybe<Scalars['String']['input']>;
  factoryId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factoryId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentOneId?: InputMaybe<Scalars['String']['input']>;
  parentOneId_not?: InputMaybe<Scalars['String']['input']>;
  parentOneId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  parentOneId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  parentOneId_contains?: InputMaybe<Scalars['String']['input']>;
  parentOneId_not_contains?: InputMaybe<Scalars['String']['input']>;
  parentOneId_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentOneId_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentOneId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentOneId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentTwoId?: InputMaybe<Scalars['String']['input']>;
  parentTwoId_not?: InputMaybe<Scalars['String']['input']>;
  parentTwoId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  parentTwoId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  parentTwoId_contains?: InputMaybe<Scalars['String']['input']>;
  parentTwoId_not_contains?: InputMaybe<Scalars['String']['input']>;
  parentTwoId_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentTwoId_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentTwoId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentTwoId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auctionId?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  auctionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  auctionId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  traits?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  traits_not?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  traits_has?: InputMaybe<Scalars['BigInt']['input']>;
  traits_not_has?: InputMaybe<Scalars['BigInt']['input']>;
  energy?: InputMaybe<Scalars['BigInt']['input']>;
  energy_not?: InputMaybe<Scalars['BigInt']['input']>;
  energy_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  energy_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  energy_gt?: InputMaybe<Scalars['BigInt']['input']>;
  energy_lt?: InputMaybe<Scalars['BigInt']['input']>;
  energy_gte?: InputMaybe<Scalars['BigInt']['input']>;
  energy_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalLove_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalLove_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lte?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  ethBalance_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  ethBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenURI?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not?: InputMaybe<Scalars['String']['input']>;
  tokenURI_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenURI_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenURI_contains?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenURI_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenURI_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type relationshipPage = {
  items: Array<relationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type relationship = {
  id: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  aminalId: Scalars['String']['output'];
  love: Scalars['BigInt']['output'];
  user?: Maybe<user>;
  aminal?: Maybe<aminal>;
};

export type user = {
  id: Scalars['String']['output'];
  address: Scalars['String']['output'];
  lovers?: Maybe<relationshipPage>;
  genesCreated?: Maybe<geneNFTPage>;
  genesOwned?: Maybe<geneNFTPage>;
  geneVotes?: Maybe<geneVotePage>;
  proposedGenes?: Maybe<geneProposalPage>;
  receivedPayouts?: Maybe<geneCreatorPayoutPage>;
  feedEvents?: Maybe<feedEventPage>;
  skillEvents?: Maybe<skillUsedEventPage>;
};


export type userloversArgs = {
  where?: InputMaybe<relationshipFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type usergenesCreatedArgs = {
  where?: InputMaybe<geneNFTFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type usergenesOwnedArgs = {
  where?: InputMaybe<geneNFTFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type usergeneVotesArgs = {
  where?: InputMaybe<geneVoteFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type userproposedGenesArgs = {
  where?: InputMaybe<geneProposalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type userreceivedPayoutsArgs = {
  where?: InputMaybe<geneCreatorPayoutFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type userfeedEventsArgs = {
  where?: InputMaybe<feedEventFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type userskillEventsArgs = {
  where?: InputMaybe<skillUsedEventFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type relationshipFilter = {
  AND?: InputMaybe<Array<InputMaybe<relationshipFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<relationshipFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_not?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_contains?: InputMaybe<Scalars['String']['input']>;
  userId_not_contains?: InputMaybe<Scalars['String']['input']>;
  userId_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_ends_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalId?: InputMaybe<Scalars['String']['input']>;
  aminalId_not?: InputMaybe<Scalars['String']['input']>;
  aminalId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalId_contains?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalId_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  love?: InputMaybe<Scalars['BigInt']['input']>;
  love_not?: InputMaybe<Scalars['BigInt']['input']>;
  love_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  love_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  love_gt?: InputMaybe<Scalars['BigInt']['input']>;
  love_lt?: InputMaybe<Scalars['BigInt']['input']>;
  love_gte?: InputMaybe<Scalars['BigInt']['input']>;
  love_lte?: InputMaybe<Scalars['BigInt']['input']>;
};

export type geneNFTPage = {
  items: Array<geneNFT>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type geneNFT = {
  id: Scalars['String']['output'];
  tokenId: Scalars['BigInt']['output'];
  traitType: Scalars['Int']['output'];
  ownerId: Scalars['String']['output'];
  creatorId: Scalars['String']['output'];
  svg?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  totalEarnings: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  owner?: Maybe<user>;
  creator?: Maybe<user>;
  proposals?: Maybe<geneProposalPage>;
  payouts?: Maybe<geneCreatorPayoutPage>;
};


export type geneNFTproposalsArgs = {
  where?: InputMaybe<geneProposalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type geneNFTpayoutsArgs = {
  where?: InputMaybe<geneCreatorPayoutFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type geneProposalPage = {
  items: Array<geneProposal>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type geneProposal = {
  id: Scalars['String']['output'];
  auctionId: Scalars['String']['output'];
  geneNFTId: Scalars['String']['output'];
  traitType: Scalars['Int']['output'];
  proposerId: Scalars['String']['output'];
  loveVotes: Scalars['BigInt']['output'];
  removeVotes: Scalars['BigInt']['output'];
  removed: Scalars['Boolean']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  auction?: Maybe<geneAuction>;
  geneNFT?: Maybe<geneNFT>;
  proposer?: Maybe<user>;
  votes?: Maybe<geneVotePage>;
};


export type geneProposalvotesArgs = {
  where?: InputMaybe<geneVoteFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type geneAuction = {
  id: Scalars['String']['output'];
  auctionId: Scalars['BigInt']['output'];
  aminalOneId: Scalars['String']['output'];
  aminalTwoId: Scalars['String']['output'];
  totalLove: Scalars['BigInt']['output'];
  parentGeneIds: Array<Scalars['BigInt']['output']>;
  finished: Scalars['Boolean']['output'];
  childAminalId?: Maybe<Scalars['String']['output']>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  aminalOne?: Maybe<aminal>;
  aminalTwo?: Maybe<aminal>;
  childAminal?: Maybe<aminal>;
  proposals?: Maybe<geneProposalPage>;
  votes?: Maybe<geneVotePage>;
  payouts?: Maybe<geneCreatorPayoutPage>;
};


export type geneAuctionproposalsArgs = {
  where?: InputMaybe<geneProposalFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type geneAuctionvotesArgs = {
  where?: InputMaybe<geneVoteFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type geneAuctionpayoutsArgs = {
  where?: InputMaybe<geneCreatorPayoutFilter>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type geneProposalFilter = {
  AND?: InputMaybe<Array<InputMaybe<geneProposalFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<geneProposalFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auctionId?: InputMaybe<Scalars['String']['input']>;
  auctionId_not?: InputMaybe<Scalars['String']['input']>;
  auctionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  auctionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  auctionId_contains?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  auctionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  geneNFTId?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_not?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  geneNFTId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  geneNFTId_contains?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_not_contains?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_starts_with?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_ends_with?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  traitType?: InputMaybe<Scalars['Int']['input']>;
  traitType_not?: InputMaybe<Scalars['Int']['input']>;
  traitType_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  traitType_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  traitType_gt?: InputMaybe<Scalars['Int']['input']>;
  traitType_lt?: InputMaybe<Scalars['Int']['input']>;
  traitType_gte?: InputMaybe<Scalars['Int']['input']>;
  traitType_lte?: InputMaybe<Scalars['Int']['input']>;
  proposerId?: InputMaybe<Scalars['String']['input']>;
  proposerId_not?: InputMaybe<Scalars['String']['input']>;
  proposerId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  proposerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  proposerId_contains?: InputMaybe<Scalars['String']['input']>;
  proposerId_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposerId_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposerId_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposerId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposerId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  loveVotes?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  loveVotes_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  loveVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  removeVotes_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  removeVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  removed?: InputMaybe<Scalars['Boolean']['input']>;
  removed_not?: InputMaybe<Scalars['Boolean']['input']>;
  removed_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  removed_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type geneVotePage = {
  items: Array<geneVote>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type geneVote = {
  id: Scalars['String']['output'];
  auctionId: Scalars['String']['output'];
  proposalId: Scalars['String']['output'];
  voterId: Scalars['String']['output'];
  isRemoveVote: Scalars['Boolean']['output'];
  loveAmount: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  auction?: Maybe<geneAuction>;
  proposal?: Maybe<geneProposal>;
  voter?: Maybe<user>;
};

export type geneVoteFilter = {
  AND?: InputMaybe<Array<InputMaybe<geneVoteFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<geneVoteFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auctionId?: InputMaybe<Scalars['String']['input']>;
  auctionId_not?: InputMaybe<Scalars['String']['input']>;
  auctionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  auctionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  auctionId_contains?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  auctionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposalId?: InputMaybe<Scalars['String']['input']>;
  proposalId_not?: InputMaybe<Scalars['String']['input']>;
  proposalId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  proposalId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  proposalId_contains?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposalId_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposalId_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voterId?: InputMaybe<Scalars['String']['input']>;
  voterId_not?: InputMaybe<Scalars['String']['input']>;
  voterId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  voterId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  voterId_contains?: InputMaybe<Scalars['String']['input']>;
  voterId_not_contains?: InputMaybe<Scalars['String']['input']>;
  voterId_starts_with?: InputMaybe<Scalars['String']['input']>;
  voterId_ends_with?: InputMaybe<Scalars['String']['input']>;
  voterId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voterId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  isRemoveVote?: InputMaybe<Scalars['Boolean']['input']>;
  isRemoveVote_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRemoveVote_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isRemoveVote_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  loveAmount?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  loveAmount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  loveAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type geneCreatorPayoutPage = {
  items: Array<geneCreatorPayout>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type geneCreatorPayout = {
  id: Scalars['String']['output'];
  auctionId: Scalars['String']['output'];
  geneNFTId: Scalars['String']['output'];
  creatorId: Scalars['String']['output'];
  amount: Scalars['BigInt']['output'];
  auctionIdRaw: Scalars['BigInt']['output'];
  geneIdRaw: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  auction?: Maybe<geneAuction>;
  geneNFT?: Maybe<geneNFT>;
  creator?: Maybe<user>;
};

export type geneCreatorPayoutFilter = {
  AND?: InputMaybe<Array<InputMaybe<geneCreatorPayoutFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<geneCreatorPayoutFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auctionId?: InputMaybe<Scalars['String']['input']>;
  auctionId_not?: InputMaybe<Scalars['String']['input']>;
  auctionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  auctionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  auctionId_contains?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  auctionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auctionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  geneNFTId?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_not?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  geneNFTId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  geneNFTId_contains?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_not_contains?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_starts_with?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_ends_with?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  geneNFTId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorId?: InputMaybe<Scalars['String']['input']>;
  creatorId_not?: InputMaybe<Scalars['String']['input']>;
  creatorId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  creatorId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  creatorId_contains?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_contains?: InputMaybe<Scalars['String']['input']>;
  creatorId_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionIdRaw?: InputMaybe<Scalars['BigInt']['input']>;
  auctionIdRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionIdRaw_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  auctionIdRaw_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  auctionIdRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionIdRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionIdRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionIdRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  geneIdRaw?: InputMaybe<Scalars['BigInt']['input']>;
  geneIdRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  geneIdRaw_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  geneIdRaw_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  geneIdRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  geneIdRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  geneIdRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  geneIdRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type geneNFTFilter = {
  AND?: InputMaybe<Array<InputMaybe<geneNFTFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<geneNFTFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  tokenId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  traitType?: InputMaybe<Scalars['Int']['input']>;
  traitType_not?: InputMaybe<Scalars['Int']['input']>;
  traitType_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  traitType_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  traitType_gt?: InputMaybe<Scalars['Int']['input']>;
  traitType_lt?: InputMaybe<Scalars['Int']['input']>;
  traitType_gte?: InputMaybe<Scalars['Int']['input']>;
  traitType_lte?: InputMaybe<Scalars['Int']['input']>;
  ownerId?: InputMaybe<Scalars['String']['input']>;
  ownerId_not?: InputMaybe<Scalars['String']['input']>;
  ownerId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ownerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ownerId_contains?: InputMaybe<Scalars['String']['input']>;
  ownerId_not_contains?: InputMaybe<Scalars['String']['input']>;
  ownerId_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerId_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorId?: InputMaybe<Scalars['String']['input']>;
  creatorId_not?: InputMaybe<Scalars['String']['input']>;
  creatorId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  creatorId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  creatorId_contains?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_contains?: InputMaybe<Scalars['String']['input']>;
  creatorId_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_ends_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creatorId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  svg?: InputMaybe<Scalars['String']['input']>;
  svg_not?: InputMaybe<Scalars['String']['input']>;
  svg_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  svg_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  svg_contains?: InputMaybe<Scalars['String']['input']>;
  svg_not_contains?: InputMaybe<Scalars['String']['input']>;
  svg_starts_with?: InputMaybe<Scalars['String']['input']>;
  svg_ends_with?: InputMaybe<Scalars['String']['input']>;
  svg_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  svg_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalEarnings?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalEarnings_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalEarnings_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type feedEventPage = {
  items: Array<feedEvent>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type feedEvent = {
  id: Scalars['String']['output'];
  aminalId: Scalars['String']['output'];
  senderId: Scalars['String']['output'];
  amount: Scalars['BigInt']['output'];
  love: Scalars['BigInt']['output'];
  totalLove: Scalars['BigInt']['output'];
  energy: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  aminal?: Maybe<aminal>;
  sender?: Maybe<user>;
};

export type feedEventFilter = {
  AND?: InputMaybe<Array<InputMaybe<feedEventFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<feedEventFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalId?: InputMaybe<Scalars['String']['input']>;
  aminalId_not?: InputMaybe<Scalars['String']['input']>;
  aminalId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalId_contains?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalId_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  senderId?: InputMaybe<Scalars['String']['input']>;
  senderId_not?: InputMaybe<Scalars['String']['input']>;
  senderId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  senderId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  senderId_contains?: InputMaybe<Scalars['String']['input']>;
  senderId_not_contains?: InputMaybe<Scalars['String']['input']>;
  senderId_starts_with?: InputMaybe<Scalars['String']['input']>;
  senderId_ends_with?: InputMaybe<Scalars['String']['input']>;
  senderId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  senderId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  love?: InputMaybe<Scalars['BigInt']['input']>;
  love_not?: InputMaybe<Scalars['BigInt']['input']>;
  love_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  love_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  love_gt?: InputMaybe<Scalars['BigInt']['input']>;
  love_lt?: InputMaybe<Scalars['BigInt']['input']>;
  love_gte?: InputMaybe<Scalars['BigInt']['input']>;
  love_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalLove_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalLove_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lte?: InputMaybe<Scalars['BigInt']['input']>;
  energy?: InputMaybe<Scalars['BigInt']['input']>;
  energy_not?: InputMaybe<Scalars['BigInt']['input']>;
  energy_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  energy_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  energy_gt?: InputMaybe<Scalars['BigInt']['input']>;
  energy_lt?: InputMaybe<Scalars['BigInt']['input']>;
  energy_gte?: InputMaybe<Scalars['BigInt']['input']>;
  energy_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type skillUsedEventPage = {
  items: Array<skillUsedEvent>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type skillUsedEvent = {
  id: Scalars['String']['output'];
  aminalId: Scalars['String']['output'];
  callerId: Scalars['String']['output'];
  skillAddress: Scalars['String']['output'];
  selector: Scalars['String']['output'];
  newEnergy: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
  aminal?: Maybe<aminal>;
  caller?: Maybe<user>;
};

export type skillUsedEventFilter = {
  AND?: InputMaybe<Array<InputMaybe<skillUsedEventFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<skillUsedEventFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalId?: InputMaybe<Scalars['String']['input']>;
  aminalId_not?: InputMaybe<Scalars['String']['input']>;
  aminalId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalId_contains?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalId_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  callerId?: InputMaybe<Scalars['String']['input']>;
  callerId_not?: InputMaybe<Scalars['String']['input']>;
  callerId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  callerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  callerId_contains?: InputMaybe<Scalars['String']['input']>;
  callerId_not_contains?: InputMaybe<Scalars['String']['input']>;
  callerId_starts_with?: InputMaybe<Scalars['String']['input']>;
  callerId_ends_with?: InputMaybe<Scalars['String']['input']>;
  callerId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  callerId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  skillAddress?: InputMaybe<Scalars['String']['input']>;
  skillAddress_not?: InputMaybe<Scalars['String']['input']>;
  skillAddress_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skillAddress_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  skillAddress_contains?: InputMaybe<Scalars['String']['input']>;
  skillAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  skillAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  skillAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  skillAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  skillAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  selector?: InputMaybe<Scalars['String']['input']>;
  selector_not?: InputMaybe<Scalars['String']['input']>;
  selector_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  selector_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  selector_contains?: InputMaybe<Scalars['String']['input']>;
  selector_not_contains?: InputMaybe<Scalars['String']['input']>;
  selector_starts_with?: InputMaybe<Scalars['String']['input']>;
  selector_ends_with?: InputMaybe<Scalars['String']['input']>;
  selector_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  selector_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  newEnergy?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_not?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  newEnergy_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  newEnergy_gt?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_lt?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_gte?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type factoryPage = {
  items: Array<factory>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type factoryFilter = {
  AND?: InputMaybe<Array<InputMaybe<factoryFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<factoryFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalAminals?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalAminals_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalAminals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type userPage = {
  items: Array<user>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type userFilter = {
  AND?: InputMaybe<Array<InputMaybe<userFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<userFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

export type geneAuctionPage = {
  items: Array<geneAuction>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type geneAuctionFilter = {
  AND?: InputMaybe<Array<InputMaybe<geneAuctionFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<geneAuctionFilter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auctionId?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  auctionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  auctionId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  aminalOneId?: InputMaybe<Scalars['String']['input']>;
  aminalOneId_not?: InputMaybe<Scalars['String']['input']>;
  aminalOneId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalOneId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalOneId_contains?: InputMaybe<Scalars['String']['input']>;
  aminalOneId_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalOneId_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalOneId_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalOneId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalOneId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwoId?: InputMaybe<Scalars['String']['input']>;
  aminalTwoId_not?: InputMaybe<Scalars['String']['input']>;
  aminalTwoId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalTwoId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  aminalTwoId_contains?: InputMaybe<Scalars['String']['input']>;
  aminalTwoId_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalTwoId_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwoId_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwoId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwoId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  totalLove?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalLove_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  totalLove_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lte?: InputMaybe<Scalars['BigInt']['input']>;
  parentGeneIds?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  parentGeneIds_not?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  parentGeneIds_has?: InputMaybe<Scalars['BigInt']['input']>;
  parentGeneIds_not_has?: InputMaybe<Scalars['BigInt']['input']>;
  finished?: InputMaybe<Scalars['Boolean']['input']>;
  finished_not?: InputMaybe<Scalars['Boolean']['input']>;
  finished_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  finished_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  childAminalId?: InputMaybe<Scalars['String']['input']>;
  childAminalId_not?: InputMaybe<Scalars['String']['input']>;
  childAminalId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  childAminalId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  childAminalId_contains?: InputMaybe<Scalars['String']['input']>;
  childAminalId_not_contains?: InputMaybe<Scalars['String']['input']>;
  childAminalId_starts_with?: InputMaybe<Scalars['String']['input']>;
  childAminalId_ends_with?: InputMaybe<Scalars['String']['input']>;
  childAminalId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  childAminalId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
};

  export type QuerySdk = {
      /** null **/
  factory: InContextSdkMethod<Query['factory'], QueryfactoryArgs, MeshContext>,
  /** null **/
  factorys: InContextSdkMethod<Query['factorys'], QueryfactorysArgs, MeshContext>,
  /** null **/
  aminal: InContextSdkMethod<Query['aminal'], QueryaminalArgs, MeshContext>,
  /** null **/
  aminals: InContextSdkMethod<Query['aminals'], QueryaminalsArgs, MeshContext>,
  /** null **/
  user: InContextSdkMethod<Query['user'], QueryuserArgs, MeshContext>,
  /** null **/
  users: InContextSdkMethod<Query['users'], QueryusersArgs, MeshContext>,
  /** null **/
  relationship: InContextSdkMethod<Query['relationship'], QueryrelationshipArgs, MeshContext>,
  /** null **/
  relationships: InContextSdkMethod<Query['relationships'], QueryrelationshipsArgs, MeshContext>,
  /** null **/
  geneNFT: InContextSdkMethod<Query['geneNFT'], QuerygeneNFTArgs, MeshContext>,
  /** null **/
  geneNFTs: InContextSdkMethod<Query['geneNFTs'], QuerygeneNFTsArgs, MeshContext>,
  /** null **/
  geneAuction: InContextSdkMethod<Query['geneAuction'], QuerygeneAuctionArgs, MeshContext>,
  /** null **/
  geneAuctions: InContextSdkMethod<Query['geneAuctions'], QuerygeneAuctionsArgs, MeshContext>,
  /** null **/
  geneProposal: InContextSdkMethod<Query['geneProposal'], QuerygeneProposalArgs, MeshContext>,
  /** null **/
  geneProposals: InContextSdkMethod<Query['geneProposals'], QuerygeneProposalsArgs, MeshContext>,
  /** null **/
  geneVote: InContextSdkMethod<Query['geneVote'], QuerygeneVoteArgs, MeshContext>,
  /** null **/
  geneVotes: InContextSdkMethod<Query['geneVotes'], QuerygeneVotesArgs, MeshContext>,
  /** null **/
  geneCreatorPayout: InContextSdkMethod<Query['geneCreatorPayout'], QuerygeneCreatorPayoutArgs, MeshContext>,
  /** null **/
  geneCreatorPayouts: InContextSdkMethod<Query['geneCreatorPayouts'], QuerygeneCreatorPayoutsArgs, MeshContext>,
  /** null **/
  feedEvent: InContextSdkMethod<Query['feedEvent'], QueryfeedEventArgs, MeshContext>,
  /** null **/
  feedEvents: InContextSdkMethod<Query['feedEvents'], QueryfeedEventsArgs, MeshContext>,
  /** null **/
  skillUsedEvent: InContextSdkMethod<Query['skillUsedEvent'], QueryskillUsedEventArgs, MeshContext>,
  /** null **/
  skillUsedEvents: InContextSdkMethod<Query['skillUsedEvents'], QueryskillUsedEventsArgs, MeshContext>,
  /** null **/
  _meta: InContextSdkMethod<Query['_meta'], {}, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["ponder"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
