// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { PonderTypes } from './sources/ponder/types';
import * as importedModule$0 from "./sources/ponder/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Meta: ResolverTypeWrapper<Meta>;
  Query: ResolverTypeWrapper<{}>;
  factory: ResolverTypeWrapper<factory>;
  aminalPage: ResolverTypeWrapper<aminalPage>;
  aminal: ResolverTypeWrapper<aminal>;
  aminalFilter: aminalFilter;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  relationshipPage: ResolverTypeWrapper<relationshipPage>;
  relationship: ResolverTypeWrapper<relationship>;
  user: ResolverTypeWrapper<user>;
  relationshipFilter: relationshipFilter;
  geneNFTPage: ResolverTypeWrapper<geneNFTPage>;
  geneNFT: ResolverTypeWrapper<geneNFT>;
  geneProposalPage: ResolverTypeWrapper<geneProposalPage>;
  geneProposal: ResolverTypeWrapper<geneProposal>;
  geneAuction: ResolverTypeWrapper<geneAuction>;
  geneProposalFilter: geneProposalFilter;
  geneVotePage: ResolverTypeWrapper<geneVotePage>;
  geneVote: ResolverTypeWrapper<geneVote>;
  geneVoteFilter: geneVoteFilter;
  geneCreatorPayoutPage: ResolverTypeWrapper<geneCreatorPayoutPage>;
  geneCreatorPayout: ResolverTypeWrapper<geneCreatorPayout>;
  geneCreatorPayoutFilter: geneCreatorPayoutFilter;
  geneNFTFilter: geneNFTFilter;
  feedEventPage: ResolverTypeWrapper<feedEventPage>;
  feedEvent: ResolverTypeWrapper<feedEvent>;
  feedEventFilter: feedEventFilter;
  skillUsedEventPage: ResolverTypeWrapper<skillUsedEventPage>;
  skillUsedEvent: ResolverTypeWrapper<skillUsedEvent>;
  skillUsedEventFilter: skillUsedEventFilter;
  factoryPage: ResolverTypeWrapper<factoryPage>;
  factoryFilter: factoryFilter;
  userPage: ResolverTypeWrapper<userPage>;
  userFilter: userFilter;
  geneAuctionPage: ResolverTypeWrapper<geneAuctionPage>;
  geneAuctionFilter: geneAuctionFilter;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  JSON: Scalars['JSON']['output'];
  BigInt: Scalars['BigInt']['output'];
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean']['output'];
  String: Scalars['String']['output'];
  Meta: Meta;
  Query: {};
  factory: factory;
  aminalPage: aminalPage;
  aminal: aminal;
  aminalFilter: aminalFilter;
  Int: Scalars['Int']['output'];
  relationshipPage: relationshipPage;
  relationship: relationship;
  user: user;
  relationshipFilter: relationshipFilter;
  geneNFTPage: geneNFTPage;
  geneNFT: geneNFT;
  geneProposalPage: geneProposalPage;
  geneProposal: geneProposal;
  geneAuction: geneAuction;
  geneProposalFilter: geneProposalFilter;
  geneVotePage: geneVotePage;
  geneVote: geneVote;
  geneVoteFilter: geneVoteFilter;
  geneCreatorPayoutPage: geneCreatorPayoutPage;
  geneCreatorPayout: geneCreatorPayout;
  geneCreatorPayoutFilter: geneCreatorPayoutFilter;
  geneNFTFilter: geneNFTFilter;
  feedEventPage: feedEventPage;
  feedEvent: feedEvent;
  feedEventFilter: feedEventFilter;
  skillUsedEventPage: skillUsedEventPage;
  skillUsedEvent: skillUsedEvent;
  skillUsedEventFilter: skillUsedEventFilter;
  factoryPage: factoryPage;
  factoryFilter: factoryFilter;
  userPage: userPage;
  userFilter: userFilter;
  geneAuctionPage: geneAuctionPage;
  geneAuctionFilter: geneAuctionFilter;
}>;

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type PageInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MetaResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']> = ResolversObject<{
  status?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  factory?: Resolver<Maybe<ResolversTypes['factory']>, ParentType, ContextType, RequireFields<QueryfactoryArgs, 'id'>>;
  factorys?: Resolver<ResolversTypes['factoryPage'], ParentType, ContextType, Partial<QueryfactorysArgs>>;
  aminal?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType, RequireFields<QueryaminalArgs, 'id'>>;
  aminals?: Resolver<ResolversTypes['aminalPage'], ParentType, ContextType, Partial<QueryaminalsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: Resolver<ResolversTypes['userPage'], ParentType, ContextType, Partial<QueryusersArgs>>;
  relationship?: Resolver<Maybe<ResolversTypes['relationship']>, ParentType, ContextType, RequireFields<QueryrelationshipArgs, 'id'>>;
  relationships?: Resolver<ResolversTypes['relationshipPage'], ParentType, ContextType, Partial<QueryrelationshipsArgs>>;
  geneNFT?: Resolver<Maybe<ResolversTypes['geneNFT']>, ParentType, ContextType, RequireFields<QuerygeneNFTArgs, 'id'>>;
  geneNFTs?: Resolver<ResolversTypes['geneNFTPage'], ParentType, ContextType, Partial<QuerygeneNFTsArgs>>;
  geneAuction?: Resolver<Maybe<ResolversTypes['geneAuction']>, ParentType, ContextType, RequireFields<QuerygeneAuctionArgs, 'id'>>;
  geneAuctions?: Resolver<ResolversTypes['geneAuctionPage'], ParentType, ContextType, Partial<QuerygeneAuctionsArgs>>;
  geneProposal?: Resolver<Maybe<ResolversTypes['geneProposal']>, ParentType, ContextType, RequireFields<QuerygeneProposalArgs, 'id'>>;
  geneProposals?: Resolver<ResolversTypes['geneProposalPage'], ParentType, ContextType, Partial<QuerygeneProposalsArgs>>;
  geneVote?: Resolver<Maybe<ResolversTypes['geneVote']>, ParentType, ContextType, RequireFields<QuerygeneVoteArgs, 'id'>>;
  geneVotes?: Resolver<ResolversTypes['geneVotePage'], ParentType, ContextType, Partial<QuerygeneVotesArgs>>;
  geneCreatorPayout?: Resolver<Maybe<ResolversTypes['geneCreatorPayout']>, ParentType, ContextType, RequireFields<QuerygeneCreatorPayoutArgs, 'id'>>;
  geneCreatorPayouts?: Resolver<ResolversTypes['geneCreatorPayoutPage'], ParentType, ContextType, Partial<QuerygeneCreatorPayoutsArgs>>;
  feedEvent?: Resolver<Maybe<ResolversTypes['feedEvent']>, ParentType, ContextType, RequireFields<QueryfeedEventArgs, 'id'>>;
  feedEvents?: Resolver<ResolversTypes['feedEventPage'], ParentType, ContextType, Partial<QueryfeedEventsArgs>>;
  skillUsedEvent?: Resolver<Maybe<ResolversTypes['skillUsedEvent']>, ParentType, ContextType, RequireFields<QueryskillUsedEventArgs, 'id'>>;
  skillUsedEvents?: Resolver<ResolversTypes['skillUsedEventPage'], ParentType, ContextType, Partial<QueryskillUsedEventsArgs>>;
  _meta?: Resolver<Maybe<ResolversTypes['Meta']>, ParentType, ContextType>;
}>;

export type factoryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['factory'] = ResolversParentTypes['factory']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAminals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminals?: Resolver<Maybe<ResolversTypes['aminalPage']>, ParentType, ContextType, Partial<factoryaminalsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type aminalPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['aminalPage'] = ResolversParentTypes['aminalPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['aminal']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type aminalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['aminal'] = ResolversParentTypes['aminal']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contractAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminalIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  factoryId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentOneId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parentTwoId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  auctionId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  traits?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  energy?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalLove?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  ethBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tokenURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  factory?: Resolver<Maybe<ResolversTypes['factory']>, ParentType, ContextType>;
  parentOne?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType>;
  parentTwo?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType>;
  childrenAsParentOne?: Resolver<Maybe<ResolversTypes['aminalPage']>, ParentType, ContextType, Partial<aminalchildrenAsParentOneArgs>>;
  childrenAsParentTwo?: Resolver<Maybe<ResolversTypes['aminalPage']>, ParentType, ContextType, Partial<aminalchildrenAsParentTwoArgs>>;
  lovers?: Resolver<Maybe<ResolversTypes['relationshipPage']>, ParentType, ContextType, Partial<aminalloversArgs>>;
  feeds?: Resolver<Maybe<ResolversTypes['feedEventPage']>, ParentType, ContextType, Partial<aminalfeedsArgs>>;
  skillsUsed?: Resolver<Maybe<ResolversTypes['skillUsedEventPage']>, ParentType, ContextType, Partial<aminalskillsUsedArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type relationshipPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['relationshipPage'] = ResolversParentTypes['relationshipPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['relationship']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type relationshipResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['relationship'] = ResolversParentTypes['relationship']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  love?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  aminal?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type userResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['user'] = ResolversParentTypes['user']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lovers?: Resolver<Maybe<ResolversTypes['relationshipPage']>, ParentType, ContextType, Partial<userloversArgs>>;
  genesCreated?: Resolver<Maybe<ResolversTypes['geneNFTPage']>, ParentType, ContextType, Partial<usergenesCreatedArgs>>;
  genesOwned?: Resolver<Maybe<ResolversTypes['geneNFTPage']>, ParentType, ContextType, Partial<usergenesOwnedArgs>>;
  geneVotes?: Resolver<Maybe<ResolversTypes['geneVotePage']>, ParentType, ContextType, Partial<usergeneVotesArgs>>;
  proposedGenes?: Resolver<Maybe<ResolversTypes['geneProposalPage']>, ParentType, ContextType, Partial<userproposedGenesArgs>>;
  receivedPayouts?: Resolver<Maybe<ResolversTypes['geneCreatorPayoutPage']>, ParentType, ContextType, Partial<userreceivedPayoutsArgs>>;
  feedEvents?: Resolver<Maybe<ResolversTypes['feedEventPage']>, ParentType, ContextType, Partial<userfeedEventsArgs>>;
  skillEvents?: Resolver<Maybe<ResolversTypes['skillUsedEventPage']>, ParentType, ContextType, Partial<userskillEventsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneNFTPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneNFTPage'] = ResolversParentTypes['geneNFTPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['geneNFT']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneNFTResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneNFT'] = ResolversParentTypes['geneNFT']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  svg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalEarnings?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  proposals?: Resolver<Maybe<ResolversTypes['geneProposalPage']>, ParentType, ContextType, Partial<geneNFTproposalsArgs>>;
  payouts?: Resolver<Maybe<ResolversTypes['geneCreatorPayoutPage']>, ParentType, ContextType, Partial<geneNFTpayoutsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneProposalPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneProposalPage'] = ResolversParentTypes['geneProposalPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['geneProposal']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneProposalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneProposal'] = ResolversParentTypes['geneProposal']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auctionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  geneNFTId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  proposerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  loveVotes?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  removeVotes?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  removed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auction?: Resolver<Maybe<ResolversTypes['geneAuction']>, ParentType, ContextType>;
  geneNFT?: Resolver<Maybe<ResolversTypes['geneNFT']>, ParentType, ContextType>;
  proposer?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  votes?: Resolver<Maybe<ResolversTypes['geneVotePage']>, ParentType, ContextType, Partial<geneProposalvotesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneAuctionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneAuction'] = ResolversParentTypes['geneAuction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auctionId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  aminalOneId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminalTwoId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalLove?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  parentGeneIds?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  finished?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  childAminalId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminalOne?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType>;
  aminalTwo?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType>;
  childAminal?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType>;
  proposals?: Resolver<Maybe<ResolversTypes['geneProposalPage']>, ParentType, ContextType, Partial<geneAuctionproposalsArgs>>;
  votes?: Resolver<Maybe<ResolversTypes['geneVotePage']>, ParentType, ContextType, Partial<geneAuctionvotesArgs>>;
  payouts?: Resolver<Maybe<ResolversTypes['geneCreatorPayoutPage']>, ParentType, ContextType, Partial<geneAuctionpayoutsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneVotePageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneVotePage'] = ResolversParentTypes['geneVotePage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['geneVote']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneVoteResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneVote'] = ResolversParentTypes['geneVote']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auctionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  proposalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  voterId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isRemoveVote?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  loveAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auction?: Resolver<Maybe<ResolversTypes['geneAuction']>, ParentType, ContextType>;
  proposal?: Resolver<Maybe<ResolversTypes['geneProposal']>, ParentType, ContextType>;
  voter?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneCreatorPayoutPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneCreatorPayoutPage'] = ResolversParentTypes['geneCreatorPayoutPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['geneCreatorPayout']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneCreatorPayoutResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneCreatorPayout'] = ResolversParentTypes['geneCreatorPayout']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auctionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  geneNFTId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  auctionIdRaw?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  geneIdRaw?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auction?: Resolver<Maybe<ResolversTypes['geneAuction']>, ParentType, ContextType>;
  geneNFT?: Resolver<Maybe<ResolversTypes['geneNFT']>, ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type feedEventPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['feedEventPage'] = ResolversParentTypes['feedEventPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['feedEvent']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type feedEventResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['feedEvent'] = ResolversParentTypes['feedEvent']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  senderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  love?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalLove?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  energy?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminal?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type skillUsedEventPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['skillUsedEventPage'] = ResolversParentTypes['skillUsedEventPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['skillUsedEvent']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type skillUsedEventResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['skillUsedEvent'] = ResolversParentTypes['skillUsedEvent']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  callerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skillAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  selector?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  newEnergy?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aminal?: Resolver<Maybe<ResolversTypes['aminal']>, ParentType, ContextType>;
  caller?: Resolver<Maybe<ResolversTypes['user']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type factoryPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['factoryPage'] = ResolversParentTypes['factoryPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['factory']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type userPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['userPage'] = ResolversParentTypes['userPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['user']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type geneAuctionPageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['geneAuctionPage'] = ResolversParentTypes['geneAuctionPage']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['geneAuction']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  JSON?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  PageInfo?: PageInfoResolvers<ContextType>;
  Meta?: MetaResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  factory?: factoryResolvers<ContextType>;
  aminalPage?: aminalPageResolvers<ContextType>;
  aminal?: aminalResolvers<ContextType>;
  relationshipPage?: relationshipPageResolvers<ContextType>;
  relationship?: relationshipResolvers<ContextType>;
  user?: userResolvers<ContextType>;
  geneNFTPage?: geneNFTPageResolvers<ContextType>;
  geneNFT?: geneNFTResolvers<ContextType>;
  geneProposalPage?: geneProposalPageResolvers<ContextType>;
  geneProposal?: geneProposalResolvers<ContextType>;
  geneAuction?: geneAuctionResolvers<ContextType>;
  geneVotePage?: geneVotePageResolvers<ContextType>;
  geneVote?: geneVoteResolvers<ContextType>;
  geneCreatorPayoutPage?: geneCreatorPayoutPageResolvers<ContextType>;
  geneCreatorPayout?: geneCreatorPayoutResolvers<ContextType>;
  feedEventPage?: feedEventPageResolvers<ContextType>;
  feedEvent?: feedEventResolvers<ContextType>;
  skillUsedEventPage?: skillUsedEventPageResolvers<ContextType>;
  skillUsedEvent?: skillUsedEventResolvers<ContextType>;
  factoryPage?: factoryPageResolvers<ContextType>;
  userPage?: userPageResolvers<ContextType>;
  geneAuctionPage?: geneAuctionPageResolvers<ContextType>;
}>;


export type MeshContext = PonderTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/ponder/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const ponderTransforms = [];
const additionalTypeDefs = [] as any[];
const ponderHandler = new GraphqlHandler({
              name: "ponder",
              config: {"endpoint":"http://localhost:42069/graphql"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("ponder"),
              logger: logger.child("ponder"),
              importFn,
            });
sources[0] = {
          name: 'ponder',
          handler: ponderHandler,
          transforms: ponderTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })
const documentHashMap = {
        "4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018": AminalsListDocument,
"4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018": AminalByIdDocument,
"4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018": AminalForChatDocument,
"4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018": AminalByContractAddressDocument,
"4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018": AminalFactoryDocument,
"ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a": GeneAuctionsListDocument,
"ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a": GeneAuctionDocument,
"ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a": GeneProposalsListDocument,
"ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a": GeneVotesListDocument,
"ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a": GeneVotesByAuctionDocument,
"2fd45b040f83cf62b38abfdbfc8ee0663cc123e511f12eeb28ba835944c92361": GeneNftsListDocument,
"2fd45b040f83cf62b38abfdbfc8ee0663cc123e511f12eeb28ba835944c92361": GeneNftByIdDocument,
"2fd45b040f83cf62b38abfdbfc8ee0663cc123e511f12eeb28ba835944c92361": GenesByTraitTypeDocument,
"2fd45b040f83cf62b38abfdbfc8ee0663cc123e511f12eeb28ba835944c92361": GenesByIdsDocument,
"e2527b9798dd3ae376b858290a32b34006831de5efb7aa63c854e1af6a5aad6b": SkillUsedListDocument,
"e2527b9798dd3ae376b858290a32b34006831de5efb7aa63c854e1af6a5aad6b": SkillUsedByAminalDocument,
"e2527b9798dd3ae376b858290a32b34006831de5efb7aa63c854e1af6a5aad6b": SkillUsedBySkillDocument,
"72243d5d571e29e7c72441fdfafd00988a97fb43fb7fd9c8570057b912331b93": UserProfileDocument,
"72243d5d571e29e7c72441fdfafd00988a97fb43fb7fd9c8570057b912331b93": UserEarningsDocument,
"72243d5d571e29e7c72441fdfafd00988a97fb43fb7fd9c8570057b912331b93": UserActivityDocument
      }
additionalEnvelopPlugins.push(usePersistedOperations({
        getPersistedOperation(key) {
          return documentHashMap[key];
        },
        ...{}
      }))

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: AminalsListDocument,
        get rawSDL() {
          return printWithCache(AminalsListDocument);
        },
        location: 'AminalsListDocument.graphql',
        sha256Hash: '4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018'
      },{
        document: AminalByIdDocument,
        get rawSDL() {
          return printWithCache(AminalByIdDocument);
        },
        location: 'AminalByIdDocument.graphql',
        sha256Hash: '4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018'
      },{
        document: AminalForChatDocument,
        get rawSDL() {
          return printWithCache(AminalForChatDocument);
        },
        location: 'AminalForChatDocument.graphql',
        sha256Hash: '4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018'
      },{
        document: AminalByContractAddressDocument,
        get rawSDL() {
          return printWithCache(AminalByContractAddressDocument);
        },
        location: 'AminalByContractAddressDocument.graphql',
        sha256Hash: '4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018'
      },{
        document: AminalFactoryDocument,
        get rawSDL() {
          return printWithCache(AminalFactoryDocument);
        },
        location: 'AminalFactoryDocument.graphql',
        sha256Hash: '4ac62f5a0982250bc67851e8bbd8a38d17cc277ec923dbdc1a99ef936770f018'
      },{
        document: GeneAuctionsListDocument,
        get rawSDL() {
          return printWithCache(GeneAuctionsListDocument);
        },
        location: 'GeneAuctionsListDocument.graphql',
        sha256Hash: 'ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a'
      },{
        document: GeneAuctionDocument,
        get rawSDL() {
          return printWithCache(GeneAuctionDocument);
        },
        location: 'GeneAuctionDocument.graphql',
        sha256Hash: 'ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a'
      },{
        document: GeneProposalsListDocument,
        get rawSDL() {
          return printWithCache(GeneProposalsListDocument);
        },
        location: 'GeneProposalsListDocument.graphql',
        sha256Hash: 'ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a'
      },{
        document: GeneVotesListDocument,
        get rawSDL() {
          return printWithCache(GeneVotesListDocument);
        },
        location: 'GeneVotesListDocument.graphql',
        sha256Hash: 'ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a'
      },{
        document: GeneVotesByAuctionDocument,
        get rawSDL() {
          return printWithCache(GeneVotesByAuctionDocument);
        },
        location: 'GeneVotesByAuctionDocument.graphql',
        sha256Hash: 'ac659dba00c7acb3c516b6327e9067de2fc079ce797555ef39b9bfa6586ab32a'
      },{
        document: GeneNftsListDocument,
        get rawSDL() {
          return printWithCache(GeneNftsListDocument);
        },
        location: 'GeneNftsListDocument.graphql',
        sha256Hash: '2fd45b040f83cf62b38abfdbfc8ee0663cc123e511f12eeb28ba835944c92361'
      },{
        document: GeneNftByIdDocument,
        get rawSDL() {
          return printWithCache(GeneNftByIdDocument);
        },
        location: 'GeneNftByIdDocument.graphql',
        sha256Hash: '2fd45b040f83cf62b38abfdbfc8ee0663cc123e511f12eeb28ba835944c92361'
      },{
        document: GenesByTraitTypeDocument,
        get rawSDL() {
          return printWithCache(GenesByTraitTypeDocument);
        },
        location: 'GenesByTraitTypeDocument.graphql',
        sha256Hash: '2fd45b040f83cf62b38abfdbfc8ee0663cc123e511f12eeb28ba835944c92361'
      },{
        document: GenesByIdsDocument,
        get rawSDL() {
          return printWithCache(GenesByIdsDocument);
        },
        location: 'GenesByIdsDocument.graphql',
        sha256Hash: '2fd45b040f83cf62b38abfdbfc8ee0663cc123e511f12eeb28ba835944c92361'
      },{
        document: SkillUsedListDocument,
        get rawSDL() {
          return printWithCache(SkillUsedListDocument);
        },
        location: 'SkillUsedListDocument.graphql',
        sha256Hash: 'e2527b9798dd3ae376b858290a32b34006831de5efb7aa63c854e1af6a5aad6b'
      },{
        document: SkillUsedByAminalDocument,
        get rawSDL() {
          return printWithCache(SkillUsedByAminalDocument);
        },
        location: 'SkillUsedByAminalDocument.graphql',
        sha256Hash: 'e2527b9798dd3ae376b858290a32b34006831de5efb7aa63c854e1af6a5aad6b'
      },{
        document: SkillUsedBySkillDocument,
        get rawSDL() {
          return printWithCache(SkillUsedBySkillDocument);
        },
        location: 'SkillUsedBySkillDocument.graphql',
        sha256Hash: 'e2527b9798dd3ae376b858290a32b34006831de5efb7aa63c854e1af6a5aad6b'
      },{
        document: UserProfileDocument,
        get rawSDL() {
          return printWithCache(UserProfileDocument);
        },
        location: 'UserProfileDocument.graphql',
        sha256Hash: '72243d5d571e29e7c72441fdfafd00988a97fb43fb7fd9c8570057b912331b93'
      },{
        document: UserEarningsDocument,
        get rawSDL() {
          return printWithCache(UserEarningsDocument);
        },
        location: 'UserEarningsDocument.graphql',
        sha256Hash: '72243d5d571e29e7c72441fdfafd00988a97fb43fb7fd9c8570057b912331b93'
      },{
        document: UserActivityDocument,
        get rawSDL() {
          return printWithCache(UserActivityDocument);
        },
        location: 'UserActivityDocument.graphql',
        sha256Hash: '72243d5d571e29e7c72441fdfafd00988a97fb43fb7fd9c8570057b912331b93'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
        .then(meshOptions => getMesh(meshOptions))
        .then(newMesh =>
          meshInstance$.then(oldMesh => {
            oldMesh.destroy()
            meshInstance$ = Promise.resolve(newMesh)
          })
        ).catch(err => {
          console.error("Mesh polling failed so the existing version will be used:", err);
        });
      }, pollingInterval)
    }
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type AminalsListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
}>;


export type AminalsListQuery = { aminals: { items: Array<(
      Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'ethBalance' | 'blockTimestamp' | 'tokenURI' | 'traits'>
      & { parentOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex'>>, parentTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex'>>, lovers?: Maybe<{ items: Array<Pick<relationship, 'love'>> }> }
    )> } };

export type AminalByIdQueryVariables = Exact<{
  contractAddress: Scalars['String']['input'];
  address?: InputMaybe<Scalars['String']['input']>;
}>;


export type AminalByIdQuery = { aminal?: Maybe<(
    Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'ethBalance' | 'blockTimestamp' | 'tokenURI' | 'traits'>
    & { parentOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex'>>, parentTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex'>>, lovers?: Maybe<{ items: Array<Pick<relationship, 'love'>> }>, feeds?: Maybe<{ items: Array<(
        Pick<feedEvent, 'id' | 'amount' | 'love' | 'totalLove' | 'energy' | 'blockTimestamp'>
        & { sender?: Maybe<Pick<user, 'id' | 'address'>> }
      )> }>, skillsUsed?: Maybe<{ items: Array<(
        Pick<skillUsedEvent, 'id' | 'skillAddress' | 'selector' | 'newEnergy' | 'blockTimestamp'>
        & { caller?: Maybe<Pick<user, 'id' | 'address'>> }
      )> }> }
  )> };

export type AminalForChatQueryVariables = Exact<{
  contractAddress: Scalars['String']['input'];
  address?: InputMaybe<Scalars['String']['input']>;
}>;


export type AminalForChatQuery = { aminal?: Maybe<(
    Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'ethBalance' | 'tokenURI' | 'traits'>
    & { lovers?: Maybe<{ items: Array<Pick<relationship, 'love'>> }> }
  )> };

export type AminalByContractAddressQueryVariables = Exact<{
  contractAddress: Scalars['String']['input'];
  address?: InputMaybe<Scalars['String']['input']>;
}>;


export type AminalByContractAddressQuery = { aminal?: Maybe<(
    Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'ethBalance' | 'blockTimestamp' | 'tokenURI' | 'traits'>
    & { parentOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'tokenURI'>>, parentTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'tokenURI'>>, lovers?: Maybe<{ items: Array<Pick<relationship, 'love'>> }>, feeds?: Maybe<{ items: Array<(
        Pick<feedEvent, 'id' | 'amount' | 'love' | 'blockTimestamp'>
        & { sender?: Maybe<Pick<user, 'address'>> }
      )> }>, skillsUsed?: Maybe<{ items: Array<(
        Pick<skillUsedEvent, 'id' | 'skillAddress' | 'blockTimestamp'>
        & { caller?: Maybe<Pick<user, 'address'>> }
      )> }> }
  )> };

export type AminalFactoryQueryVariables = Exact<{
  factoryId: Scalars['String']['input'];
}>;


export type AminalFactoryQuery = { factory?: Maybe<(
    Pick<factory, 'id' | 'totalAminals'>
    & { aminals?: Maybe<{ items: Array<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'ethBalance' | 'tokenURI'>> }> }
  )> };

export type GeneAuctionsListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GeneAuctionsListQuery = { geneAuctions: { items: Array<(
      Pick<geneAuction, 'id' | 'auctionId' | 'finished' | 'totalLove' | 'blockTimestamp'>
      & { aminalOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'traits'>>, aminalTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'traits'>>, childAminal?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove' | 'traits'>> }
    )> } };

export type GeneAuctionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GeneAuctionQuery = { geneAuction?: Maybe<(
    Pick<geneAuction, 'id' | 'auctionId' | 'finished' | 'totalLove' | 'blockTimestamp'>
    & { aminalOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'traits'>>, aminalTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'traits'>>, childAminal?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove' | 'traits'>>, proposals?: Maybe<{ items: Array<(
        Pick<geneProposal, 'id' | 'traitType' | 'loveVotes' | 'removeVotes' | 'removed' | 'blockTimestamp'>
        & { geneNFT?: Maybe<Pick<geneNFT, 'id' | 'tokenId' | 'name' | 'svg'>>, proposer?: Maybe<Pick<user, 'id' | 'address'>> }
      )> }>, votes?: Maybe<{ items: Array<(
        Pick<geneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
        & { proposal?: Maybe<(
          Pick<geneProposal, 'id' | 'traitType'>
          & { geneNFT?: Maybe<Pick<geneNFT, 'id' | 'tokenId'>> }
        )>, voter?: Maybe<Pick<user, 'id' | 'address'>> }
      )> }> }
  )> };

export type GeneProposalsListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GeneProposalsListQuery = { geneProposals: { items: Array<(
      Pick<geneProposal, 'id' | 'traitType' | 'loveVotes' | 'removeVotes' | 'removed' | 'blockTimestamp'>
      & { auction?: Maybe<Pick<geneAuction, 'id' | 'auctionId'>>, geneNFT?: Maybe<Pick<geneNFT, 'id' | 'tokenId' | 'name' | 'svg'>>, proposer?: Maybe<Pick<user, 'id' | 'address'>> }
    )> } };

export type GeneVotesListQueryVariables = Exact<{
  auctionId: Scalars['String']['input'];
  traitType: Scalars['Int']['input'];
}>;


export type GeneVotesListQuery = { geneVotes: { items: Array<(
      Pick<geneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
      & { proposal?: Maybe<(
        Pick<geneProposal, 'id' | 'traitType'>
        & { geneNFT?: Maybe<Pick<geneNFT, 'id' | 'tokenId'>> }
      )>, voter?: Maybe<Pick<user, 'id' | 'address'>> }
    )> } };

export type GeneVotesByAuctionQueryVariables = Exact<{
  auctionId: Scalars['String']['input'];
}>;


export type GeneVotesByAuctionQuery = { geneVotes: { items: Array<(
      Pick<geneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
      & { proposal?: Maybe<(
        Pick<geneProposal, 'id' | 'traitType'>
        & { geneNFT?: Maybe<Pick<geneNFT, 'id' | 'tokenId' | 'name' | 'svg'>> }
      )>, voter?: Maybe<Pick<user, 'id' | 'address'>> }
    )> } };

export type GeneNftsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GeneNftsListQuery = { geneNFTs: { items: Array<(
      Pick<geneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
      & { owner?: Maybe<Pick<user, 'id' | 'address'>>, creator?: Maybe<Pick<user, 'id' | 'address'>>, proposals?: Maybe<{ items: Array<(
          Pick<geneProposal, 'id'>
          & { auction?: Maybe<(
            Pick<geneAuction, 'id'>
            & { aminalOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>>, aminalTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>> }
          )> }
        )> }>, payouts?: Maybe<{ items: Array<(
          Pick<geneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>
          & { auction?: Maybe<Pick<geneAuction, 'id' | 'auctionId'>> }
        )> }> }
    )> } };

export type GeneNftByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GeneNftByIdQuery = { geneNFT?: Maybe<(
    Pick<geneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
    & { owner?: Maybe<Pick<user, 'id' | 'address'>>, creator?: Maybe<Pick<user, 'id' | 'address'>>, proposals?: Maybe<{ items: Array<(
        Pick<geneProposal, 'id'>
        & { auction?: Maybe<(
          Pick<geneAuction, 'id'>
          & { aminalOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>>, aminalTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>> }
        )> }
      )> }>, payouts?: Maybe<{ items: Array<(
        Pick<geneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>
        & { auction?: Maybe<Pick<geneAuction, 'id' | 'auctionId'>> }
      )> }> }
  )> };

export type GenesByTraitTypeQueryVariables = Exact<{
  traitType: Scalars['Int']['input'];
}>;


export type GenesByTraitTypeQuery = { geneNFTs: { items: Array<(
      Pick<geneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
      & { owner?: Maybe<Pick<user, 'id' | 'address'>>, creator?: Maybe<Pick<user, 'id' | 'address'>>, proposals?: Maybe<{ items: Array<(
          Pick<geneProposal, 'id'>
          & { auction?: Maybe<(
            Pick<geneAuction, 'id'>
            & { aminalOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>>, aminalTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>> }
          )> }
        )> }>, payouts?: Maybe<{ items: Array<(
          Pick<geneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>
          & { auction?: Maybe<Pick<geneAuction, 'id' | 'auctionId'>> }
        )> }> }
    )> } };

export type GenesByIdsQueryVariables = Exact<{
  ids: Array<Scalars['BigInt']['input']> | Scalars['BigInt']['input'];
}>;


export type GenesByIdsQuery = { geneNFTs: { items: Array<Pick<geneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg'>> } };

export type SkillUsedListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SkillUsedListQuery = { skillUsedEvents: { items: Array<(
      Pick<skillUsedEvent, 'id' | 'skillAddress' | 'selector' | 'newEnergy' | 'blockTimestamp'>
      & { aminal?: Maybe<Pick<aminal, 'id'>>, caller?: Maybe<Pick<user, 'id' | 'address'>> }
    )> } };

export type SkillUsedByAminalQueryVariables = Exact<{
  aminalId: Scalars['String']['input'];
}>;


export type SkillUsedByAminalQuery = { skillUsedEvents: { items: Array<(
      Pick<skillUsedEvent, 'id' | 'skillAddress' | 'selector' | 'newEnergy' | 'blockTimestamp'>
      & { caller?: Maybe<Pick<user, 'id' | 'address'>> }
    )> } };

export type SkillUsedBySkillQueryVariables = Exact<{
  skillAddress: Scalars['String']['input'];
}>;


export type SkillUsedBySkillQuery = { skillUsedEvents: { items: Array<(
      Pick<skillUsedEvent, 'id' | 'selector' | 'newEnergy' | 'blockTimestamp'>
      & { aminal?: Maybe<Pick<aminal, 'id'>>, caller?: Maybe<Pick<user, 'id' | 'address'>> }
    )> } };

export type UserProfileQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type UserProfileQuery = { user?: Maybe<(
    Pick<user, 'id' | 'address'>
    & { lovers?: Maybe<{ items: Array<(
        Pick<relationship, 'id' | 'love'>
        & { aminal?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'tokenURI' | 'totalLove' | 'energy' | 'ethBalance' | 'blockTimestamp'>> }
      )> }>, genesCreated?: Maybe<{ items: Array<(
        Pick<geneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
        & { payouts?: Maybe<{ items: Array<Pick<geneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>> }> }
      )> }>, genesOwned?: Maybe<{ items: Array<(
        Pick<geneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
        & { creator?: Maybe<Pick<user, 'id' | 'address'>> }
      )> }>, geneVotes?: Maybe<{ items: Array<(
        Pick<geneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
        & { auction?: Maybe<(
          Pick<geneAuction, 'id' | 'auctionId'>
          & { aminalOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'tokenURI'>>, aminalTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'tokenURI'>> }
        )>, proposal?: Maybe<(
          Pick<geneProposal, 'id'>
          & { geneNFT?: Maybe<Pick<geneNFT, 'id' | 'tokenId' | 'name' | 'traitType'>> }
        )> }
      )> }> }
  )> };

export type UserEarningsQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type UserEarningsQuery = { user?: Maybe<(
    Pick<user, 'id' | 'address'>
    & { genesCreated?: Maybe<{ items: Array<(
        Pick<geneNFT, 'id' | 'tokenId' | 'name' | 'traitType' | 'totalEarnings'>
        & { payouts?: Maybe<{ items: Array<(
            Pick<geneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>
            & { auction?: Maybe<(
              Pick<geneAuction, 'id' | 'auctionId'>
              & { aminalOne?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'tokenURI'>>, aminalTwo?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'tokenURI'>> }
            )> }
          )> }> }
      )> }> }
  )> };

export type UserActivityQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type UserActivityQuery = { user?: Maybe<(
    Pick<user, 'id' | 'address'>
    & { lovers?: Maybe<{ items: Array<(
        Pick<relationship, 'id' | 'love'>
        & { aminal?: Maybe<Pick<aminal, 'id' | 'contractAddress' | 'tokenURI' | 'totalLove'>> }
      )> }>, geneVotes?: Maybe<{ items: Array<(
        Pick<geneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
        & { auction?: Maybe<Pick<geneAuction, 'id' | 'auctionId'>>, proposal?: Maybe<(
          Pick<geneProposal, 'id'>
          & { geneNFT?: Maybe<Pick<geneNFT, 'id' | 'tokenId' | 'name' | 'traitType'>> }
        )> }
      )> }> }
  )> };


export const AminalsListDocument = gql`
    query AminalsList($first: Int = 100, $address: String = "") {
  aminals(limit: $first, orderBy: "aminalIndex", orderDirection: "asc") {
    items {
      id
      contractAddress
      aminalIndex
      parentOne {
        id
        contractAddress
        aminalIndex
      }
      parentTwo {
        id
        contractAddress
        aminalIndex
      }
      energy
      totalLove
      ethBalance
      blockTimestamp
      tokenURI
      traits
      lovers(where: {userId: $address}, limit: 1) {
        items {
          love
        }
      }
    }
  }
}
    ` as unknown as DocumentNode<AminalsListQuery, AminalsListQueryVariables>;
export const AminalByIdDocument = gql`
    query AminalById($contractAddress: String!, $address: String = "") {
  aminal(id: $contractAddress) {
    id
    contractAddress
    aminalIndex
    parentOne {
      id
      contractAddress
      aminalIndex
    }
    parentTwo {
      id
      contractAddress
      aminalIndex
    }
    energy
    totalLove
    ethBalance
    blockTimestamp
    tokenURI
    traits
    lovers(where: {userId: $address}, limit: 1) {
      items {
        love
      }
    }
    feeds(limit: 100, orderBy: "blockTimestamp", orderDirection: "desc") {
      items {
        id
        sender {
          id
          address
        }
        amount
        love
        totalLove
        energy
        blockTimestamp
      }
    }
    skillsUsed(limit: 100, orderBy: "blockTimestamp", orderDirection: "desc") {
      items {
        id
        caller {
          id
          address
        }
        skillAddress
        selector
        newEnergy
        blockTimestamp
      }
    }
  }
}
    ` as unknown as DocumentNode<AminalByIdQuery, AminalByIdQueryVariables>;
export const AminalForChatDocument = gql`
    query AminalForChat($contractAddress: String!, $address: String = "") {
  aminal(id: $contractAddress) {
    id
    contractAddress
    aminalIndex
    energy
    totalLove
    ethBalance
    tokenURI
    traits
    lovers(where: {userId: $address}, limit: 1) {
      items {
        love
      }
    }
  }
}
    ` as unknown as DocumentNode<AminalForChatQuery, AminalForChatQueryVariables>;
export const AminalByContractAddressDocument = gql`
    query AminalByContractAddress($contractAddress: String!, $address: String = "") {
  aminal(id: $contractAddress) {
    id
    contractAddress
    aminalIndex
    parentOne {
      id
      contractAddress
      aminalIndex
      energy
      totalLove
      tokenURI
    }
    parentTwo {
      id
      contractAddress
      aminalIndex
      energy
      totalLove
      tokenURI
    }
    energy
    totalLove
    ethBalance
    blockTimestamp
    tokenURI
    traits
    lovers(where: {userId: $address}, limit: 1) {
      items {
        love
      }
    }
    feeds(limit: 10, orderBy: "blockTimestamp", orderDirection: "desc") {
      items {
        id
        sender {
          address
        }
        amount
        love
        blockTimestamp
      }
    }
    skillsUsed(limit: 10, orderBy: "blockTimestamp", orderDirection: "desc") {
      items {
        id
        caller {
          address
        }
        skillAddress
        blockTimestamp
      }
    }
  }
}
    ` as unknown as DocumentNode<AminalByContractAddressQuery, AminalByContractAddressQueryVariables>;
export const AminalFactoryDocument = gql`
    query AminalFactory($factoryId: String!) {
  factory(id: $factoryId) {
    id
    totalAminals
    aminals(limit: 100, orderBy: "aminalIndex", orderDirection: "asc") {
      items {
        id
        contractAddress
        aminalIndex
        energy
        totalLove
        ethBalance
        tokenURI
      }
    }
  }
}
    ` as unknown as DocumentNode<AminalFactoryQuery, AminalFactoryQueryVariables>;
export const GeneAuctionsListDocument = gql`
    query GeneAuctionsList($first: Int = 100) {
  geneAuctions(limit: $first, orderBy: "auctionId", orderDirection: "desc") {
    items {
      id
      auctionId
      aminalOne {
        id
        contractAddress
        aminalIndex
        tokenURI
        traits
      }
      aminalTwo {
        id
        contractAddress
        aminalIndex
        tokenURI
        traits
      }
      childAminal {
        id
        contractAddress
        aminalIndex
        tokenURI
        energy
        totalLove
        traits
      }
      finished
      totalLove
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<GeneAuctionsListQuery, GeneAuctionsListQueryVariables>;
export const GeneAuctionDocument = gql`
    query GeneAuction($id: String!) {
  geneAuction(id: $id) {
    id
    auctionId
    aminalOne {
      id
      contractAddress
      aminalIndex
      tokenURI
      traits
    }
    aminalTwo {
      id
      contractAddress
      aminalIndex
      tokenURI
      traits
    }
    childAminal {
      id
      contractAddress
      aminalIndex
      tokenURI
      energy
      totalLove
      traits
    }
    finished
    totalLove
    blockTimestamp
    proposals(limit: 100) {
      items {
        id
        geneNFT {
          id
          tokenId
          name
          svg
        }
        traitType
        proposer {
          id
          address
        }
        loveVotes
        removeVotes
        removed
        blockTimestamp
      }
    }
    votes(limit: 100, orderBy: "loveAmount", orderDirection: "desc") {
      items {
        id
        proposal {
          id
          geneNFT {
            id
            tokenId
          }
          traitType
        }
        voter {
          id
          address
        }
        isRemoveVote
        loveAmount
        blockTimestamp
      }
    }
  }
}
    ` as unknown as DocumentNode<GeneAuctionQuery, GeneAuctionQueryVariables>;
export const GeneProposalsListDocument = gql`
    query GeneProposalsList($first: Int = 100) {
  geneProposals(limit: $first, orderBy: "blockTimestamp", orderDirection: "desc") {
    items {
      id
      auction {
        id
        auctionId
      }
      geneNFT {
        id
        tokenId
        name
        svg
      }
      traitType
      proposer {
        id
        address
      }
      loveVotes
      removeVotes
      removed
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<GeneProposalsListQuery, GeneProposalsListQueryVariables>;
export const GeneVotesListDocument = gql`
    query GeneVotesList($auctionId: String!, $traitType: Int!) {
  geneVotes(
    where: {auctionId: $auctionId}
    orderBy: "loveAmount"
    orderDirection: "desc"
    limit: 100
  ) {
    items {
      id
      proposal {
        id
        geneNFT {
          id
          tokenId
        }
        traitType
      }
      voter {
        id
        address
      }
      isRemoveVote
      loveAmount
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<GeneVotesListQuery, GeneVotesListQueryVariables>;
export const GeneVotesByAuctionDocument = gql`
    query GeneVotesByAuction($auctionId: String!) {
  geneVotes(
    where: {auctionId: $auctionId}
    orderBy: "loveAmount"
    orderDirection: "desc"
    limit: 100
  ) {
    items {
      id
      proposal {
        id
        geneNFT {
          id
          tokenId
          name
          svg
        }
        traitType
      }
      voter {
        id
        address
      }
      isRemoveVote
      loveAmount
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<GeneVotesByAuctionQuery, GeneVotesByAuctionQueryVariables>;
export const GeneNftsListDocument = gql`
    query GeneNftsList {
  geneNFTs(orderBy: "tokenId", orderDirection: "asc", limit: 100) {
    items {
      id
      tokenId
      traitType
      name
      description
      svg
      owner {
        id
        address
      }
      creator {
        id
        address
      }
      totalEarnings
      proposals(limit: 100) {
        items {
          id
          auction {
            id
            aminalOne {
              id
              contractAddress
              aminalIndex
              tokenURI
              energy
              totalLove
            }
            aminalTwo {
              id
              contractAddress
              aminalIndex
              tokenURI
              energy
              totalLove
            }
          }
        }
      }
      payouts(limit: 100, orderBy: "blockTimestamp", orderDirection: "desc") {
        items {
          id
          amount
          auctionId
          blockTimestamp
          auction {
            id
            auctionId
          }
        }
      }
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<GeneNftsListQuery, GeneNftsListQueryVariables>;
export const GeneNftByIdDocument = gql`
    query GeneNftById($id: String!) {
  geneNFT(id: $id) {
    id
    tokenId
    traitType
    name
    description
    svg
    owner {
      id
      address
    }
    creator {
      id
      address
    }
    totalEarnings
    proposals(limit: 100) {
      items {
        id
        auction {
          id
          aminalOne {
            id
            contractAddress
            aminalIndex
            tokenURI
            energy
            totalLove
          }
          aminalTwo {
            id
            contractAddress
            aminalIndex
            tokenURI
            energy
            totalLove
          }
        }
      }
    }
    payouts(limit: 100, orderBy: "blockTimestamp", orderDirection: "desc") {
      items {
        id
        amount
        auctionId
        blockTimestamp
        auction {
          id
          auctionId
        }
      }
    }
    blockTimestamp
  }
}
    ` as unknown as DocumentNode<GeneNftByIdQuery, GeneNftByIdQueryVariables>;
export const GenesByTraitTypeDocument = gql`
    query GenesByTraitType($traitType: Int!) {
  geneNFTs(
    where: {traitType: $traitType}
    orderBy: "tokenId"
    orderDirection: "asc"
    limit: 100
  ) {
    items {
      id
      tokenId
      traitType
      name
      description
      svg
      owner {
        id
        address
      }
      creator {
        id
        address
      }
      totalEarnings
      proposals(limit: 100) {
        items {
          id
          auction {
            id
            aminalOne {
              id
              contractAddress
              aminalIndex
              tokenURI
              energy
              totalLove
            }
            aminalTwo {
              id
              contractAddress
              aminalIndex
              tokenURI
              energy
              totalLove
            }
          }
        }
      }
      payouts(limit: 100, orderBy: "blockTimestamp", orderDirection: "desc") {
        items {
          id
          amount
          auctionId
          blockTimestamp
          auction {
            id
            auctionId
          }
        }
      }
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<GenesByTraitTypeQuery, GenesByTraitTypeQueryVariables>;
export const GenesByIdsDocument = gql`
    query GenesByIds($ids: [BigInt!]!) {
  geneNFTs(where: {tokenId_in: $ids}, limit: 100) {
    items {
      id
      tokenId
      traitType
      name
      description
      svg
    }
  }
}
    ` as unknown as DocumentNode<GenesByIdsQuery, GenesByIdsQueryVariables>;
export const SkillUsedListDocument = gql`
    query SkillUsedList($first: Int = 100) {
  skillUsedEvents(
    limit: $first
    orderBy: "blockTimestamp"
    orderDirection: "desc"
  ) {
    items {
      id
      aminal {
        id
      }
      caller {
        id
        address
      }
      skillAddress
      selector
      newEnergy
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<SkillUsedListQuery, SkillUsedListQueryVariables>;
export const SkillUsedByAminalDocument = gql`
    query SkillUsedByAminal($aminalId: String!) {
  skillUsedEvents(
    where: {aminalId: $aminalId}
    orderBy: "blockTimestamp"
    orderDirection: "desc"
    limit: 100
  ) {
    items {
      id
      caller {
        id
        address
      }
      skillAddress
      selector
      newEnergy
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<SkillUsedByAminalQuery, SkillUsedByAminalQueryVariables>;
export const SkillUsedBySkillDocument = gql`
    query SkillUsedBySkill($skillAddress: String!) {
  skillUsedEvents(
    where: {skillAddress: $skillAddress}
    orderBy: "blockTimestamp"
    orderDirection: "desc"
    limit: 100
  ) {
    items {
      id
      aminal {
        id
      }
      caller {
        id
        address
      }
      selector
      newEnergy
      blockTimestamp
    }
  }
}
    ` as unknown as DocumentNode<SkillUsedBySkillQuery, SkillUsedBySkillQueryVariables>;
export const UserProfileDocument = gql`
    query UserProfile($address: String!) {
  user(id: $address) {
    id
    address
    lovers(limit: 100) {
      items {
        id
        aminal {
          id
          contractAddress
          tokenURI
          totalLove
          energy
          ethBalance
          blockTimestamp
        }
        love
      }
    }
    genesCreated(limit: 100) {
      items {
        id
        tokenId
        traitType
        name
        description
        svg
        totalEarnings
        blockTimestamp
        payouts(limit: 100) {
          items {
            id
            amount
            auctionId
            blockTimestamp
          }
        }
      }
    }
    genesOwned(limit: 100) {
      items {
        id
        tokenId
        traitType
        name
        description
        svg
        totalEarnings
        blockTimestamp
        creator {
          id
          address
        }
      }
    }
    geneVotes(limit: 100) {
      items {
        id
        auction {
          id
          auctionId
          aminalOne {
            id
            contractAddress
            tokenURI
          }
          aminalTwo {
            id
            contractAddress
            tokenURI
          }
        }
        proposal {
          id
          geneNFT {
            id
            tokenId
            name
            traitType
          }
        }
        isRemoveVote
        loveAmount
        blockTimestamp
      }
    }
  }
}
    ` as unknown as DocumentNode<UserProfileQuery, UserProfileQueryVariables>;
export const UserEarningsDocument = gql`
    query UserEarnings($address: String!) {
  user(id: $address) {
    id
    address
    genesCreated(limit: 100) {
      items {
        id
        tokenId
        name
        traitType
        totalEarnings
        payouts(limit: 100, orderBy: "blockTimestamp", orderDirection: "desc") {
          items {
            id
            amount
            auctionId
            blockTimestamp
            auction {
              id
              auctionId
              aminalOne {
                id
                contractAddress
                tokenURI
              }
              aminalTwo {
                id
                contractAddress
                tokenURI
              }
            }
          }
        }
      }
    }
  }
}
    ` as unknown as DocumentNode<UserEarningsQuery, UserEarningsQueryVariables>;
export const UserActivityDocument = gql`
    query UserActivity($address: String!) {
  user(id: $address) {
    id
    address
    lovers(orderBy: "love", orderDirection: "desc", limit: 10) {
      items {
        id
        aminal {
          id
          contractAddress
          tokenURI
          totalLove
        }
        love
      }
    }
    geneVotes(orderBy: "blockTimestamp", orderDirection: "desc", limit: 10) {
      items {
        id
        auction {
          id
          auctionId
        }
        proposal {
          id
          geneNFT {
            id
            tokenId
            name
            traitType
          }
        }
        isRemoveVote
        loveAmount
        blockTimestamp
      }
    }
  }
}
    ` as unknown as DocumentNode<UserActivityQuery, UserActivityQueryVariables>;





















export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    AminalsList(variables?: AminalsListQueryVariables, options?: C): Promise<AminalsListQuery> {
      return requester<AminalsListQuery, AminalsListQueryVariables>(AminalsListDocument, variables, options) as Promise<AminalsListQuery>;
    },
    AminalById(variables: AminalByIdQueryVariables, options?: C): Promise<AminalByIdQuery> {
      return requester<AminalByIdQuery, AminalByIdQueryVariables>(AminalByIdDocument, variables, options) as Promise<AminalByIdQuery>;
    },
    AminalForChat(variables: AminalForChatQueryVariables, options?: C): Promise<AminalForChatQuery> {
      return requester<AminalForChatQuery, AminalForChatQueryVariables>(AminalForChatDocument, variables, options) as Promise<AminalForChatQuery>;
    },
    AminalByContractAddress(variables: AminalByContractAddressQueryVariables, options?: C): Promise<AminalByContractAddressQuery> {
      return requester<AminalByContractAddressQuery, AminalByContractAddressQueryVariables>(AminalByContractAddressDocument, variables, options) as Promise<AminalByContractAddressQuery>;
    },
    AminalFactory(variables: AminalFactoryQueryVariables, options?: C): Promise<AminalFactoryQuery> {
      return requester<AminalFactoryQuery, AminalFactoryQueryVariables>(AminalFactoryDocument, variables, options) as Promise<AminalFactoryQuery>;
    },
    GeneAuctionsList(variables?: GeneAuctionsListQueryVariables, options?: C): Promise<GeneAuctionsListQuery> {
      return requester<GeneAuctionsListQuery, GeneAuctionsListQueryVariables>(GeneAuctionsListDocument, variables, options) as Promise<GeneAuctionsListQuery>;
    },
    GeneAuction(variables: GeneAuctionQueryVariables, options?: C): Promise<GeneAuctionQuery> {
      return requester<GeneAuctionQuery, GeneAuctionQueryVariables>(GeneAuctionDocument, variables, options) as Promise<GeneAuctionQuery>;
    },
    GeneProposalsList(variables?: GeneProposalsListQueryVariables, options?: C): Promise<GeneProposalsListQuery> {
      return requester<GeneProposalsListQuery, GeneProposalsListQueryVariables>(GeneProposalsListDocument, variables, options) as Promise<GeneProposalsListQuery>;
    },
    GeneVotesList(variables: GeneVotesListQueryVariables, options?: C): Promise<GeneVotesListQuery> {
      return requester<GeneVotesListQuery, GeneVotesListQueryVariables>(GeneVotesListDocument, variables, options) as Promise<GeneVotesListQuery>;
    },
    GeneVotesByAuction(variables: GeneVotesByAuctionQueryVariables, options?: C): Promise<GeneVotesByAuctionQuery> {
      return requester<GeneVotesByAuctionQuery, GeneVotesByAuctionQueryVariables>(GeneVotesByAuctionDocument, variables, options) as Promise<GeneVotesByAuctionQuery>;
    },
    GeneNftsList(variables?: GeneNftsListQueryVariables, options?: C): Promise<GeneNftsListQuery> {
      return requester<GeneNftsListQuery, GeneNftsListQueryVariables>(GeneNftsListDocument, variables, options) as Promise<GeneNftsListQuery>;
    },
    GeneNftById(variables: GeneNftByIdQueryVariables, options?: C): Promise<GeneNftByIdQuery> {
      return requester<GeneNftByIdQuery, GeneNftByIdQueryVariables>(GeneNftByIdDocument, variables, options) as Promise<GeneNftByIdQuery>;
    },
    GenesByTraitType(variables: GenesByTraitTypeQueryVariables, options?: C): Promise<GenesByTraitTypeQuery> {
      return requester<GenesByTraitTypeQuery, GenesByTraitTypeQueryVariables>(GenesByTraitTypeDocument, variables, options) as Promise<GenesByTraitTypeQuery>;
    },
    GenesByIds(variables: GenesByIdsQueryVariables, options?: C): Promise<GenesByIdsQuery> {
      return requester<GenesByIdsQuery, GenesByIdsQueryVariables>(GenesByIdsDocument, variables, options) as Promise<GenesByIdsQuery>;
    },
    SkillUsedList(variables?: SkillUsedListQueryVariables, options?: C): Promise<SkillUsedListQuery> {
      return requester<SkillUsedListQuery, SkillUsedListQueryVariables>(SkillUsedListDocument, variables, options) as Promise<SkillUsedListQuery>;
    },
    SkillUsedByAminal(variables: SkillUsedByAminalQueryVariables, options?: C): Promise<SkillUsedByAminalQuery> {
      return requester<SkillUsedByAminalQuery, SkillUsedByAminalQueryVariables>(SkillUsedByAminalDocument, variables, options) as Promise<SkillUsedByAminalQuery>;
    },
    SkillUsedBySkill(variables: SkillUsedBySkillQueryVariables, options?: C): Promise<SkillUsedBySkillQuery> {
      return requester<SkillUsedBySkillQuery, SkillUsedBySkillQueryVariables>(SkillUsedBySkillDocument, variables, options) as Promise<SkillUsedBySkillQuery>;
    },
    UserProfile(variables: UserProfileQueryVariables, options?: C): Promise<UserProfileQuery> {
      return requester<UserProfileQuery, UserProfileQueryVariables>(UserProfileDocument, variables, options) as Promise<UserProfileQuery>;
    },
    UserEarnings(variables: UserEarningsQueryVariables, options?: C): Promise<UserEarningsQuery> {
      return requester<UserEarningsQuery, UserEarningsQueryVariables>(UserEarningsDocument, variables, options) as Promise<UserEarningsQuery>;
    },
    UserActivity(variables: UserActivityQueryVariables, options?: C): Promise<UserActivityQuery> {
      return requester<UserActivityQuery, UserActivityQueryVariables>(UserActivityDocument, variables, options) as Promise<UserActivityQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;