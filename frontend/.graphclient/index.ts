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
import type { Aminalsv3Types } from './sources/aminalsv3/types';
import * as importedModule$0 from "./sources/aminalsv3/introspectionSchema";
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
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type Aminal = {
  id: Scalars['Bytes']['output'];
  contractAddress: Scalars['Bytes']['output'];
  aminalIndex: Scalars['BigInt']['output'];
  factory: AminalFactory;
  parentOne?: Maybe<Aminal>;
  parentTwo?: Maybe<Aminal>;
  auctionId?: Maybe<Scalars['BigInt']['output']>;
  childrenAsParentOne: Array<Aminal>;
  childrenAsParentTwo: Array<Aminal>;
  backId: Scalars['BigInt']['output'];
  armId: Scalars['BigInt']['output'];
  tailId: Scalars['BigInt']['output'];
  earsId: Scalars['BigInt']['output'];
  bodyId: Scalars['BigInt']['output'];
  faceId: Scalars['BigInt']['output'];
  mouthId: Scalars['BigInt']['output'];
  miscId: Scalars['BigInt']['output'];
  tokenURI?: Maybe<Scalars['String']['output']>;
  energy: Scalars['BigInt']['output'];
  totalLove: Scalars['BigInt']['output'];
  ethBalance: Scalars['BigInt']['output'];
  lovers: Array<Maybe<Relationship>>;
  skillUsed: Array<SkillUsed>;
  feeds: Array<FeedAminalEvent>;
  breedingEventsAsParentOne: Array<BreedAminalEvent>;
  breedingEventsAsParentTwo: Array<BreedAminalEvent>;
  auctions: Array<GeneAuction>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};


export type AminalchildrenAsParentOneArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Aminal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Aminal_filter>;
};


export type AminalchildrenAsParentTwoArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Aminal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Aminal_filter>;
};


export type AminalloversArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Relationship_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Relationship_filter>;
};


export type AminalskillUsedArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SkillUsed_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SkillUsed_filter>;
};


export type AminalfeedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FeedAminalEvent_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FeedAminalEvent_filter>;
};


export type AminalbreedingEventsAsParentOneArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BreedAminalEvent_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BreedAminalEvent_filter>;
};


export type AminalbreedingEventsAsParentTwoArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BreedAminalEvent_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BreedAminalEvent_filter>;
};


export type AminalauctionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneAuction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneAuction_filter>;
};

export type AminalFactory = {
  id: Scalars['Bytes']['output'];
  totalAminals: Scalars['BigInt']['output'];
  geneAuction: Scalars['Bytes']['output'];
  genes: Scalars['Bytes']['output'];
  loveVRGDA: Scalars['Bytes']['output'];
  initialAminalSpawned: Scalars['Boolean']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  aminals: Array<Aminal>;
};


export type AminalFactoryaminalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Aminal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Aminal_filter>;
};

export type AminalFactory_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  totalAminals?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAminals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalAminals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  geneAuction?: InputMaybe<Scalars['Bytes']['input']>;
  geneAuction_not?: InputMaybe<Scalars['Bytes']['input']>;
  geneAuction_gt?: InputMaybe<Scalars['Bytes']['input']>;
  geneAuction_lt?: InputMaybe<Scalars['Bytes']['input']>;
  geneAuction_gte?: InputMaybe<Scalars['Bytes']['input']>;
  geneAuction_lte?: InputMaybe<Scalars['Bytes']['input']>;
  geneAuction_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  geneAuction_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  geneAuction_contains?: InputMaybe<Scalars['Bytes']['input']>;
  geneAuction_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  genes?: InputMaybe<Scalars['Bytes']['input']>;
  genes_not?: InputMaybe<Scalars['Bytes']['input']>;
  genes_gt?: InputMaybe<Scalars['Bytes']['input']>;
  genes_lt?: InputMaybe<Scalars['Bytes']['input']>;
  genes_gte?: InputMaybe<Scalars['Bytes']['input']>;
  genes_lte?: InputMaybe<Scalars['Bytes']['input']>;
  genes_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  genes_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  genes_contains?: InputMaybe<Scalars['Bytes']['input']>;
  genes_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  loveVRGDA?: InputMaybe<Scalars['Bytes']['input']>;
  loveVRGDA_not?: InputMaybe<Scalars['Bytes']['input']>;
  loveVRGDA_gt?: InputMaybe<Scalars['Bytes']['input']>;
  loveVRGDA_lt?: InputMaybe<Scalars['Bytes']['input']>;
  loveVRGDA_gte?: InputMaybe<Scalars['Bytes']['input']>;
  loveVRGDA_lte?: InputMaybe<Scalars['Bytes']['input']>;
  loveVRGDA_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  loveVRGDA_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  loveVRGDA_contains?: InputMaybe<Scalars['Bytes']['input']>;
  loveVRGDA_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  initialAminalSpawned?: InputMaybe<Scalars['Boolean']['input']>;
  initialAminalSpawned_not?: InputMaybe<Scalars['Boolean']['input']>;
  initialAminalSpawned_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  initialAminalSpawned_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aminals_?: InputMaybe<Aminal_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AminalFactory_filter>>>;
  or?: InputMaybe<Array<InputMaybe<AminalFactory_filter>>>;
};

export type AminalFactory_orderBy =
  | 'id'
  | 'totalAminals'
  | 'geneAuction'
  | 'genes'
  | 'loveVRGDA'
  | 'initialAminalSpawned'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash'
  | 'aminals';

export type Aminal_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  contractAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  contractAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aminalIndex?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  aminalIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  aminalIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_not?: InputMaybe<Scalars['String']['input']>;
  factory_gt?: InputMaybe<Scalars['String']['input']>;
  factory_lt?: InputMaybe<Scalars['String']['input']>;
  factory_gte?: InputMaybe<Scalars['String']['input']>;
  factory_lte?: InputMaybe<Scalars['String']['input']>;
  factory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_contains?: InputMaybe<Scalars['String']['input']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<AminalFactory_filter>;
  parentOne?: InputMaybe<Scalars['String']['input']>;
  parentOne_not?: InputMaybe<Scalars['String']['input']>;
  parentOne_gt?: InputMaybe<Scalars['String']['input']>;
  parentOne_lt?: InputMaybe<Scalars['String']['input']>;
  parentOne_gte?: InputMaybe<Scalars['String']['input']>;
  parentOne_lte?: InputMaybe<Scalars['String']['input']>;
  parentOne_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentOne_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentOne_contains?: InputMaybe<Scalars['String']['input']>;
  parentOne_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentOne_not_contains?: InputMaybe<Scalars['String']['input']>;
  parentOne_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentOne_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentOne_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentOne_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentOne_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentOne_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentOne_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentOne_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentOne_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentOne_?: InputMaybe<Aminal_filter>;
  parentTwo?: InputMaybe<Scalars['String']['input']>;
  parentTwo_not?: InputMaybe<Scalars['String']['input']>;
  parentTwo_gt?: InputMaybe<Scalars['String']['input']>;
  parentTwo_lt?: InputMaybe<Scalars['String']['input']>;
  parentTwo_gte?: InputMaybe<Scalars['String']['input']>;
  parentTwo_lte?: InputMaybe<Scalars['String']['input']>;
  parentTwo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentTwo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentTwo_contains?: InputMaybe<Scalars['String']['input']>;
  parentTwo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentTwo_not_contains?: InputMaybe<Scalars['String']['input']>;
  parentTwo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentTwo_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentTwo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentTwo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentTwo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentTwo_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentTwo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentTwo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentTwo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentTwo_?: InputMaybe<Aminal_filter>;
  auctionId?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  childrenAsParentOne_?: InputMaybe<Aminal_filter>;
  childrenAsParentTwo_?: InputMaybe<Aminal_filter>;
  backId?: InputMaybe<Scalars['BigInt']['input']>;
  backId_not?: InputMaybe<Scalars['BigInt']['input']>;
  backId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  backId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  backId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  backId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  backId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  backId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  armId?: InputMaybe<Scalars['BigInt']['input']>;
  armId_not?: InputMaybe<Scalars['BigInt']['input']>;
  armId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  armId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  armId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  armId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  armId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  armId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tailId?: InputMaybe<Scalars['BigInt']['input']>;
  tailId_not?: InputMaybe<Scalars['BigInt']['input']>;
  tailId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tailId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tailId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tailId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tailId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tailId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  earsId?: InputMaybe<Scalars['BigInt']['input']>;
  earsId_not?: InputMaybe<Scalars['BigInt']['input']>;
  earsId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  earsId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  earsId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  earsId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  earsId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  earsId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bodyId?: InputMaybe<Scalars['BigInt']['input']>;
  bodyId_not?: InputMaybe<Scalars['BigInt']['input']>;
  bodyId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bodyId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bodyId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bodyId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bodyId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bodyId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  faceId?: InputMaybe<Scalars['BigInt']['input']>;
  faceId_not?: InputMaybe<Scalars['BigInt']['input']>;
  faceId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  faceId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  faceId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  faceId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  faceId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  faceId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mouthId?: InputMaybe<Scalars['BigInt']['input']>;
  mouthId_not?: InputMaybe<Scalars['BigInt']['input']>;
  mouthId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  mouthId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  mouthId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  mouthId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  mouthId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mouthId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  miscId?: InputMaybe<Scalars['BigInt']['input']>;
  miscId_not?: InputMaybe<Scalars['BigInt']['input']>;
  miscId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  miscId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  miscId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  miscId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  miscId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  miscId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenURI?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not?: InputMaybe<Scalars['String']['input']>;
  tokenURI_gt?: InputMaybe<Scalars['String']['input']>;
  tokenURI_lt?: InputMaybe<Scalars['String']['input']>;
  tokenURI_gte?: InputMaybe<Scalars['String']['input']>;
  tokenURI_lte?: InputMaybe<Scalars['String']['input']>;
  tokenURI_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenURI_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenURI_contains?: InputMaybe<Scalars['String']['input']>;
  tokenURI_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenURI_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenURI_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenURI_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenURI_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenURI_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  energy?: InputMaybe<Scalars['BigInt']['input']>;
  energy_not?: InputMaybe<Scalars['BigInt']['input']>;
  energy_gt?: InputMaybe<Scalars['BigInt']['input']>;
  energy_lt?: InputMaybe<Scalars['BigInt']['input']>;
  energy_gte?: InputMaybe<Scalars['BigInt']['input']>;
  energy_lte?: InputMaybe<Scalars['BigInt']['input']>;
  energy_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  energy_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLove?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLove_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ethBalance?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  ethBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ethBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lovers_?: InputMaybe<Relationship_filter>;
  skillUsed_?: InputMaybe<SkillUsed_filter>;
  feeds_?: InputMaybe<FeedAminalEvent_filter>;
  breedingEventsAsParentOne_?: InputMaybe<BreedAminalEvent_filter>;
  breedingEventsAsParentTwo_?: InputMaybe<BreedAminalEvent_filter>;
  auctions_?: InputMaybe<GeneAuction_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Aminal_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Aminal_filter>>>;
};

export type Aminal_orderBy =
  | 'id'
  | 'contractAddress'
  | 'aminalIndex'
  | 'factory'
  | 'factory__id'
  | 'factory__totalAminals'
  | 'factory__geneAuction'
  | 'factory__genes'
  | 'factory__loveVRGDA'
  | 'factory__initialAminalSpawned'
  | 'factory__blockNumber'
  | 'factory__blockTimestamp'
  | 'factory__transactionHash'
  | 'parentOne'
  | 'parentOne__id'
  | 'parentOne__contractAddress'
  | 'parentOne__aminalIndex'
  | 'parentOne__auctionId'
  | 'parentOne__backId'
  | 'parentOne__armId'
  | 'parentOne__tailId'
  | 'parentOne__earsId'
  | 'parentOne__bodyId'
  | 'parentOne__faceId'
  | 'parentOne__mouthId'
  | 'parentOne__miscId'
  | 'parentOne__tokenURI'
  | 'parentOne__energy'
  | 'parentOne__totalLove'
  | 'parentOne__ethBalance'
  | 'parentOne__blockNumber'
  | 'parentOne__blockTimestamp'
  | 'parentOne__transactionHash'
  | 'parentTwo'
  | 'parentTwo__id'
  | 'parentTwo__contractAddress'
  | 'parentTwo__aminalIndex'
  | 'parentTwo__auctionId'
  | 'parentTwo__backId'
  | 'parentTwo__armId'
  | 'parentTwo__tailId'
  | 'parentTwo__earsId'
  | 'parentTwo__bodyId'
  | 'parentTwo__faceId'
  | 'parentTwo__mouthId'
  | 'parentTwo__miscId'
  | 'parentTwo__tokenURI'
  | 'parentTwo__energy'
  | 'parentTwo__totalLove'
  | 'parentTwo__ethBalance'
  | 'parentTwo__blockNumber'
  | 'parentTwo__blockTimestamp'
  | 'parentTwo__transactionHash'
  | 'auctionId'
  | 'childrenAsParentOne'
  | 'childrenAsParentTwo'
  | 'backId'
  | 'armId'
  | 'tailId'
  | 'earsId'
  | 'bodyId'
  | 'faceId'
  | 'mouthId'
  | 'miscId'
  | 'tokenURI'
  | 'energy'
  | 'totalLove'
  | 'ethBalance'
  | 'lovers'
  | 'skillUsed'
  | 'feeds'
  | 'breedingEventsAsParentOne'
  | 'breedingEventsAsParentTwo'
  | 'auctions'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type BreedAminalEvent = {
  id: Scalars['Bytes']['output'];
  aminalOne: Aminal;
  aminalTwo: Aminal;
  auctionId: Scalars['BigInt']['output'];
  auction?: Maybe<GeneAuction>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type BreedAminalEvent_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aminalOne?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not?: InputMaybe<Scalars['String']['input']>;
  aminalOne_gt?: InputMaybe<Scalars['String']['input']>;
  aminalOne_lt?: InputMaybe<Scalars['String']['input']>;
  aminalOne_gte?: InputMaybe<Scalars['String']['input']>;
  aminalOne_lte?: InputMaybe<Scalars['String']['input']>;
  aminalOne_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminalOne_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminalOne_contains?: InputMaybe<Scalars['String']['input']>;
  aminalOne_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalOne_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalOne_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_?: InputMaybe<Aminal_filter>;
  aminalTwo?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_gt?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_lt?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_gte?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_lte?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminalTwo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminalTwo_contains?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_?: InputMaybe<Aminal_filter>;
  auctionId?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auction?: InputMaybe<Scalars['String']['input']>;
  auction_not?: InputMaybe<Scalars['String']['input']>;
  auction_gt?: InputMaybe<Scalars['String']['input']>;
  auction_lt?: InputMaybe<Scalars['String']['input']>;
  auction_gte?: InputMaybe<Scalars['String']['input']>;
  auction_lte?: InputMaybe<Scalars['String']['input']>;
  auction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_contains?: InputMaybe<Scalars['String']['input']>;
  auction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_?: InputMaybe<GeneAuction_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BreedAminalEvent_filter>>>;
  or?: InputMaybe<Array<InputMaybe<BreedAminalEvent_filter>>>;
};

export type BreedAminalEvent_orderBy =
  | 'id'
  | 'aminalOne'
  | 'aminalOne__id'
  | 'aminalOne__contractAddress'
  | 'aminalOne__aminalIndex'
  | 'aminalOne__auctionId'
  | 'aminalOne__backId'
  | 'aminalOne__armId'
  | 'aminalOne__tailId'
  | 'aminalOne__earsId'
  | 'aminalOne__bodyId'
  | 'aminalOne__faceId'
  | 'aminalOne__mouthId'
  | 'aminalOne__miscId'
  | 'aminalOne__tokenURI'
  | 'aminalOne__energy'
  | 'aminalOne__totalLove'
  | 'aminalOne__ethBalance'
  | 'aminalOne__blockNumber'
  | 'aminalOne__blockTimestamp'
  | 'aminalOne__transactionHash'
  | 'aminalTwo'
  | 'aminalTwo__id'
  | 'aminalTwo__contractAddress'
  | 'aminalTwo__aminalIndex'
  | 'aminalTwo__auctionId'
  | 'aminalTwo__backId'
  | 'aminalTwo__armId'
  | 'aminalTwo__tailId'
  | 'aminalTwo__earsId'
  | 'aminalTwo__bodyId'
  | 'aminalTwo__faceId'
  | 'aminalTwo__mouthId'
  | 'aminalTwo__miscId'
  | 'aminalTwo__tokenURI'
  | 'aminalTwo__energy'
  | 'aminalTwo__totalLove'
  | 'aminalTwo__ethBalance'
  | 'aminalTwo__blockNumber'
  | 'aminalTwo__blockTimestamp'
  | 'aminalTwo__transactionHash'
  | 'auctionId'
  | 'auction'
  | 'auction__id'
  | 'auction__auctionId'
  | 'auction__totalLove'
  | 'auction__finished'
  | 'auction__blockNumber'
  | 'auction__blockTimestamp'
  | 'auction__transactionHash'
  | 'auction__endBlockNumber'
  | 'auction__endBlockTimestamp'
  | 'auction__endTransactionHash'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type FeedAminalEvent = {
  id: Scalars['Bytes']['output'];
  aminal: Aminal;
  sender: User;
  amount: Scalars['BigInt']['output'];
  love: Scalars['BigInt']['output'];
  totalLove: Scalars['BigInt']['output'];
  energy: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type FeedAminalEvent_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aminal?: InputMaybe<Scalars['String']['input']>;
  aminal_not?: InputMaybe<Scalars['String']['input']>;
  aminal_gt?: InputMaybe<Scalars['String']['input']>;
  aminal_lt?: InputMaybe<Scalars['String']['input']>;
  aminal_gte?: InputMaybe<Scalars['String']['input']>;
  aminal_lte?: InputMaybe<Scalars['String']['input']>;
  aminal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminal_contains?: InputMaybe<Scalars['String']['input']>;
  aminal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_?: InputMaybe<Aminal_filter>;
  sender?: InputMaybe<Scalars['String']['input']>;
  sender_not?: InputMaybe<Scalars['String']['input']>;
  sender_gt?: InputMaybe<Scalars['String']['input']>;
  sender_lt?: InputMaybe<Scalars['String']['input']>;
  sender_gte?: InputMaybe<Scalars['String']['input']>;
  sender_lte?: InputMaybe<Scalars['String']['input']>;
  sender_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_contains?: InputMaybe<Scalars['String']['input']>;
  sender_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_?: InputMaybe<User_filter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  love?: InputMaybe<Scalars['BigInt']['input']>;
  love_not?: InputMaybe<Scalars['BigInt']['input']>;
  love_gt?: InputMaybe<Scalars['BigInt']['input']>;
  love_lt?: InputMaybe<Scalars['BigInt']['input']>;
  love_gte?: InputMaybe<Scalars['BigInt']['input']>;
  love_lte?: InputMaybe<Scalars['BigInt']['input']>;
  love_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  love_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLove?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLove_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  energy?: InputMaybe<Scalars['BigInt']['input']>;
  energy_not?: InputMaybe<Scalars['BigInt']['input']>;
  energy_gt?: InputMaybe<Scalars['BigInt']['input']>;
  energy_lt?: InputMaybe<Scalars['BigInt']['input']>;
  energy_gte?: InputMaybe<Scalars['BigInt']['input']>;
  energy_lte?: InputMaybe<Scalars['BigInt']['input']>;
  energy_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  energy_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FeedAminalEvent_filter>>>;
  or?: InputMaybe<Array<InputMaybe<FeedAminalEvent_filter>>>;
};

export type FeedAminalEvent_orderBy =
  | 'id'
  | 'aminal'
  | 'aminal__id'
  | 'aminal__contractAddress'
  | 'aminal__aminalIndex'
  | 'aminal__auctionId'
  | 'aminal__backId'
  | 'aminal__armId'
  | 'aminal__tailId'
  | 'aminal__earsId'
  | 'aminal__bodyId'
  | 'aminal__faceId'
  | 'aminal__mouthId'
  | 'aminal__miscId'
  | 'aminal__tokenURI'
  | 'aminal__energy'
  | 'aminal__totalLove'
  | 'aminal__ethBalance'
  | 'aminal__blockNumber'
  | 'aminal__blockTimestamp'
  | 'aminal__transactionHash'
  | 'sender'
  | 'sender__id'
  | 'sender__address'
  | 'amount'
  | 'love'
  | 'totalLove'
  | 'energy'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type GeneAuction = {
  id: Scalars['Bytes']['output'];
  auctionId: Scalars['BigInt']['output'];
  aminalOne: Aminal;
  aminalTwo: Aminal;
  totalLove: Scalars['BigInt']['output'];
  finished: Scalars['Boolean']['output'];
  childAminal?: Maybe<Aminal>;
  winningGeneIds?: Maybe<Array<Scalars['BigInt']['output']>>;
  proposals: Array<GeneProposal>;
  votes: Array<GeneVote>;
  payouts: Array<GeneCreatorPayout>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  endBlockNumber?: Maybe<Scalars['BigInt']['output']>;
  endBlockTimestamp?: Maybe<Scalars['BigInt']['output']>;
  endTransactionHash?: Maybe<Scalars['Bytes']['output']>;
};


export type GeneAuctionproposalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneProposal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneProposal_filter>;
};


export type GeneAuctionvotesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneVote_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneVote_filter>;
};


export type GeneAuctionpayoutsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneCreatorPayout_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneCreatorPayout_filter>;
};

export type GeneAuction_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  auctionId?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  aminalOne?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not?: InputMaybe<Scalars['String']['input']>;
  aminalOne_gt?: InputMaybe<Scalars['String']['input']>;
  aminalOne_lt?: InputMaybe<Scalars['String']['input']>;
  aminalOne_gte?: InputMaybe<Scalars['String']['input']>;
  aminalOne_lte?: InputMaybe<Scalars['String']['input']>;
  aminalOne_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminalOne_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminalOne_contains?: InputMaybe<Scalars['String']['input']>;
  aminalOne_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalOne_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalOne_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalOne_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalOne_?: InputMaybe<Aminal_filter>;
  aminalTwo?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_gt?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_lt?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_gte?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_lte?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminalTwo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminalTwo_contains?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminalTwo_?: InputMaybe<Aminal_filter>;
  totalLove?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalLove_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLove_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  finished?: InputMaybe<Scalars['Boolean']['input']>;
  finished_not?: InputMaybe<Scalars['Boolean']['input']>;
  finished_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  finished_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  childAminal?: InputMaybe<Scalars['String']['input']>;
  childAminal_not?: InputMaybe<Scalars['String']['input']>;
  childAminal_gt?: InputMaybe<Scalars['String']['input']>;
  childAminal_lt?: InputMaybe<Scalars['String']['input']>;
  childAminal_gte?: InputMaybe<Scalars['String']['input']>;
  childAminal_lte?: InputMaybe<Scalars['String']['input']>;
  childAminal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  childAminal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  childAminal_contains?: InputMaybe<Scalars['String']['input']>;
  childAminal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  childAminal_not_contains?: InputMaybe<Scalars['String']['input']>;
  childAminal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  childAminal_starts_with?: InputMaybe<Scalars['String']['input']>;
  childAminal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  childAminal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  childAminal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  childAminal_ends_with?: InputMaybe<Scalars['String']['input']>;
  childAminal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  childAminal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  childAminal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  childAminal_?: InputMaybe<Aminal_filter>;
  winningGeneIds?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  winningGeneIds_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  winningGeneIds_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  winningGeneIds_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  winningGeneIds_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  winningGeneIds_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposals_?: InputMaybe<GeneProposal_filter>;
  votes_?: InputMaybe<GeneVote_filter>;
  payouts_?: InputMaybe<GeneCreatorPayout_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  endBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBlockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBlockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTransactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  endTransactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  endTransactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  endTransactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  endTransactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  endTransactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  endTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  endTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  endTransactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  endTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GeneAuction_filter>>>;
  or?: InputMaybe<Array<InputMaybe<GeneAuction_filter>>>;
};

export type GeneAuction_orderBy =
  | 'id'
  | 'auctionId'
  | 'aminalOne'
  | 'aminalOne__id'
  | 'aminalOne__contractAddress'
  | 'aminalOne__aminalIndex'
  | 'aminalOne__auctionId'
  | 'aminalOne__backId'
  | 'aminalOne__armId'
  | 'aminalOne__tailId'
  | 'aminalOne__earsId'
  | 'aminalOne__bodyId'
  | 'aminalOne__faceId'
  | 'aminalOne__mouthId'
  | 'aminalOne__miscId'
  | 'aminalOne__tokenURI'
  | 'aminalOne__energy'
  | 'aminalOne__totalLove'
  | 'aminalOne__ethBalance'
  | 'aminalOne__blockNumber'
  | 'aminalOne__blockTimestamp'
  | 'aminalOne__transactionHash'
  | 'aminalTwo'
  | 'aminalTwo__id'
  | 'aminalTwo__contractAddress'
  | 'aminalTwo__aminalIndex'
  | 'aminalTwo__auctionId'
  | 'aminalTwo__backId'
  | 'aminalTwo__armId'
  | 'aminalTwo__tailId'
  | 'aminalTwo__earsId'
  | 'aminalTwo__bodyId'
  | 'aminalTwo__faceId'
  | 'aminalTwo__mouthId'
  | 'aminalTwo__miscId'
  | 'aminalTwo__tokenURI'
  | 'aminalTwo__energy'
  | 'aminalTwo__totalLove'
  | 'aminalTwo__ethBalance'
  | 'aminalTwo__blockNumber'
  | 'aminalTwo__blockTimestamp'
  | 'aminalTwo__transactionHash'
  | 'totalLove'
  | 'finished'
  | 'childAminal'
  | 'childAminal__id'
  | 'childAminal__contractAddress'
  | 'childAminal__aminalIndex'
  | 'childAminal__auctionId'
  | 'childAminal__backId'
  | 'childAminal__armId'
  | 'childAminal__tailId'
  | 'childAminal__earsId'
  | 'childAminal__bodyId'
  | 'childAminal__faceId'
  | 'childAminal__mouthId'
  | 'childAminal__miscId'
  | 'childAminal__tokenURI'
  | 'childAminal__energy'
  | 'childAminal__totalLove'
  | 'childAminal__ethBalance'
  | 'childAminal__blockNumber'
  | 'childAminal__blockTimestamp'
  | 'childAminal__transactionHash'
  | 'winningGeneIds'
  | 'proposals'
  | 'votes'
  | 'payouts'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash'
  | 'endBlockNumber'
  | 'endBlockTimestamp'
  | 'endTransactionHash';

export type GeneCreatorPayout = {
  id: Scalars['Bytes']['output'];
  auction: GeneAuction;
  geneNFT: GeneNFT;
  creator: User;
  amount: Scalars['BigInt']['output'];
  auctionId: Scalars['BigInt']['output'];
  geneId: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type GeneCreatorPayout_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  auction?: InputMaybe<Scalars['String']['input']>;
  auction_not?: InputMaybe<Scalars['String']['input']>;
  auction_gt?: InputMaybe<Scalars['String']['input']>;
  auction_lt?: InputMaybe<Scalars['String']['input']>;
  auction_gte?: InputMaybe<Scalars['String']['input']>;
  auction_lte?: InputMaybe<Scalars['String']['input']>;
  auction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_contains?: InputMaybe<Scalars['String']['input']>;
  auction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_?: InputMaybe<GeneAuction_filter>;
  geneNFT?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not?: InputMaybe<Scalars['String']['input']>;
  geneNFT_gt?: InputMaybe<Scalars['String']['input']>;
  geneNFT_lt?: InputMaybe<Scalars['String']['input']>;
  geneNFT_gte?: InputMaybe<Scalars['String']['input']>;
  geneNFT_lte?: InputMaybe<Scalars['String']['input']>;
  geneNFT_in?: InputMaybe<Array<Scalars['String']['input']>>;
  geneNFT_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  geneNFT_contains?: InputMaybe<Scalars['String']['input']>;
  geneNFT_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_contains?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_starts_with?: InputMaybe<Scalars['String']['input']>;
  geneNFT_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_ends_with?: InputMaybe<Scalars['String']['input']>;
  geneNFT_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_?: InputMaybe<GeneNFT_filter>;
  creator?: InputMaybe<Scalars['String']['input']>;
  creator_not?: InputMaybe<Scalars['String']['input']>;
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_contains?: InputMaybe<Scalars['String']['input']>;
  creator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_?: InputMaybe<User_filter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionId?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  geneId?: InputMaybe<Scalars['BigInt']['input']>;
  geneId_not?: InputMaybe<Scalars['BigInt']['input']>;
  geneId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  geneId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  geneId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  geneId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  geneId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  geneId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GeneCreatorPayout_filter>>>;
  or?: InputMaybe<Array<InputMaybe<GeneCreatorPayout_filter>>>;
};

export type GeneCreatorPayout_orderBy =
  | 'id'
  | 'auction'
  | 'auction__id'
  | 'auction__auctionId'
  | 'auction__totalLove'
  | 'auction__finished'
  | 'auction__blockNumber'
  | 'auction__blockTimestamp'
  | 'auction__transactionHash'
  | 'auction__endBlockNumber'
  | 'auction__endBlockTimestamp'
  | 'auction__endTransactionHash'
  | 'geneNFT'
  | 'geneNFT__id'
  | 'geneNFT__tokenId'
  | 'geneNFT__traitType'
  | 'geneNFT__svg'
  | 'geneNFT__name'
  | 'geneNFT__description'
  | 'geneNFT__totalEarnings'
  | 'geneNFT__blockNumber'
  | 'geneNFT__blockTimestamp'
  | 'geneNFT__transactionHash'
  | 'creator'
  | 'creator__id'
  | 'creator__address'
  | 'amount'
  | 'auctionId'
  | 'geneId'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type GeneNFT = {
  id: Scalars['Bytes']['output'];
  tokenId: Scalars['BigInt']['output'];
  traitType: Scalars['Int']['output'];
  owner: User;
  creator: User;
  svg?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  proposalsUsingGene: Array<GeneProposal>;
  totalEarnings: Scalars['BigInt']['output'];
  payouts: Array<GeneCreatorPayout>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};


export type GeneNFTproposalsUsingGeneArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneProposal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneProposal_filter>;
};


export type GeneNFTpayoutsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneCreatorPayout_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneCreatorPayout_filter>;
};

export type GeneNFT_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tokenId?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  traitType?: InputMaybe<Scalars['Int']['input']>;
  traitType_not?: InputMaybe<Scalars['Int']['input']>;
  traitType_gt?: InputMaybe<Scalars['Int']['input']>;
  traitType_lt?: InputMaybe<Scalars['Int']['input']>;
  traitType_gte?: InputMaybe<Scalars['Int']['input']>;
  traitType_lte?: InputMaybe<Scalars['Int']['input']>;
  traitType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  traitType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<User_filter>;
  creator?: InputMaybe<Scalars['String']['input']>;
  creator_not?: InputMaybe<Scalars['String']['input']>;
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_contains?: InputMaybe<Scalars['String']['input']>;
  creator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_?: InputMaybe<User_filter>;
  svg?: InputMaybe<Scalars['String']['input']>;
  svg_not?: InputMaybe<Scalars['String']['input']>;
  svg_gt?: InputMaybe<Scalars['String']['input']>;
  svg_lt?: InputMaybe<Scalars['String']['input']>;
  svg_gte?: InputMaybe<Scalars['String']['input']>;
  svg_lte?: InputMaybe<Scalars['String']['input']>;
  svg_in?: InputMaybe<Array<Scalars['String']['input']>>;
  svg_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  svg_contains?: InputMaybe<Scalars['String']['input']>;
  svg_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  svg_not_contains?: InputMaybe<Scalars['String']['input']>;
  svg_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  svg_starts_with?: InputMaybe<Scalars['String']['input']>;
  svg_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  svg_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  svg_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  svg_ends_with?: InputMaybe<Scalars['String']['input']>;
  svg_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  svg_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  svg_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposalsUsingGene_?: InputMaybe<GeneProposal_filter>;
  totalEarnings?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalEarnings_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalEarnings_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  payouts_?: InputMaybe<GeneCreatorPayout_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GeneNFT_filter>>>;
  or?: InputMaybe<Array<InputMaybe<GeneNFT_filter>>>;
};

export type GeneNFT_orderBy =
  | 'id'
  | 'tokenId'
  | 'traitType'
  | 'owner'
  | 'owner__id'
  | 'owner__address'
  | 'creator'
  | 'creator__id'
  | 'creator__address'
  | 'svg'
  | 'name'
  | 'description'
  | 'proposalsUsingGene'
  | 'totalEarnings'
  | 'payouts'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type GeneProposal = {
  id: Scalars['Bytes']['output'];
  auction: GeneAuction;
  geneNFT: GeneNFT;
  traitType: Scalars['Int']['output'];
  proposer: User;
  loveVotes: Scalars['BigInt']['output'];
  removeVotes: Scalars['BigInt']['output'];
  removed: Scalars['Boolean']['output'];
  votes: Array<GeneVote>;
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};


export type GeneProposalvotesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneVote_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneVote_filter>;
};

export type GeneProposal_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  auction?: InputMaybe<Scalars['String']['input']>;
  auction_not?: InputMaybe<Scalars['String']['input']>;
  auction_gt?: InputMaybe<Scalars['String']['input']>;
  auction_lt?: InputMaybe<Scalars['String']['input']>;
  auction_gte?: InputMaybe<Scalars['String']['input']>;
  auction_lte?: InputMaybe<Scalars['String']['input']>;
  auction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_contains?: InputMaybe<Scalars['String']['input']>;
  auction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_?: InputMaybe<GeneAuction_filter>;
  geneNFT?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not?: InputMaybe<Scalars['String']['input']>;
  geneNFT_gt?: InputMaybe<Scalars['String']['input']>;
  geneNFT_lt?: InputMaybe<Scalars['String']['input']>;
  geneNFT_gte?: InputMaybe<Scalars['String']['input']>;
  geneNFT_lte?: InputMaybe<Scalars['String']['input']>;
  geneNFT_in?: InputMaybe<Array<Scalars['String']['input']>>;
  geneNFT_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  geneNFT_contains?: InputMaybe<Scalars['String']['input']>;
  geneNFT_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_contains?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_starts_with?: InputMaybe<Scalars['String']['input']>;
  geneNFT_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_ends_with?: InputMaybe<Scalars['String']['input']>;
  geneNFT_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  geneNFT_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  geneNFT_?: InputMaybe<GeneNFT_filter>;
  traitType?: InputMaybe<Scalars['Int']['input']>;
  traitType_not?: InputMaybe<Scalars['Int']['input']>;
  traitType_gt?: InputMaybe<Scalars['Int']['input']>;
  traitType_lt?: InputMaybe<Scalars['Int']['input']>;
  traitType_gte?: InputMaybe<Scalars['Int']['input']>;
  traitType_lte?: InputMaybe<Scalars['Int']['input']>;
  traitType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  traitType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  proposer?: InputMaybe<Scalars['String']['input']>;
  proposer_not?: InputMaybe<Scalars['String']['input']>;
  proposer_gt?: InputMaybe<Scalars['String']['input']>;
  proposer_lt?: InputMaybe<Scalars['String']['input']>;
  proposer_gte?: InputMaybe<Scalars['String']['input']>;
  proposer_lte?: InputMaybe<Scalars['String']['input']>;
  proposer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposer_contains?: InputMaybe<Scalars['String']['input']>;
  proposer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_?: InputMaybe<User_filter>;
  loveVotes?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  loveVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  loveVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  removeVotes?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  removeVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  removeVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  removed?: InputMaybe<Scalars['Boolean']['input']>;
  removed_not?: InputMaybe<Scalars['Boolean']['input']>;
  removed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  removed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  votes_?: InputMaybe<GeneVote_filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GeneProposal_filter>>>;
  or?: InputMaybe<Array<InputMaybe<GeneProposal_filter>>>;
};

export type GeneProposal_orderBy =
  | 'id'
  | 'auction'
  | 'auction__id'
  | 'auction__auctionId'
  | 'auction__totalLove'
  | 'auction__finished'
  | 'auction__blockNumber'
  | 'auction__blockTimestamp'
  | 'auction__transactionHash'
  | 'auction__endBlockNumber'
  | 'auction__endBlockTimestamp'
  | 'auction__endTransactionHash'
  | 'geneNFT'
  | 'geneNFT__id'
  | 'geneNFT__tokenId'
  | 'geneNFT__traitType'
  | 'geneNFT__svg'
  | 'geneNFT__name'
  | 'geneNFT__description'
  | 'geneNFT__totalEarnings'
  | 'geneNFT__blockNumber'
  | 'geneNFT__blockTimestamp'
  | 'geneNFT__transactionHash'
  | 'traitType'
  | 'proposer'
  | 'proposer__id'
  | 'proposer__address'
  | 'loveVotes'
  | 'removeVotes'
  | 'removed'
  | 'votes'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type GeneVote = {
  id: Scalars['Bytes']['output'];
  auction: GeneAuction;
  proposal: GeneProposal;
  voter: User;
  isRemoveVote: Scalars['Boolean']['output'];
  loveAmount: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type GeneVote_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  auction?: InputMaybe<Scalars['String']['input']>;
  auction_not?: InputMaybe<Scalars['String']['input']>;
  auction_gt?: InputMaybe<Scalars['String']['input']>;
  auction_lt?: InputMaybe<Scalars['String']['input']>;
  auction_gte?: InputMaybe<Scalars['String']['input']>;
  auction_lte?: InputMaybe<Scalars['String']['input']>;
  auction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_contains?: InputMaybe<Scalars['String']['input']>;
  auction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_?: InputMaybe<GeneAuction_filter>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<GeneProposal_filter>;
  voter?: InputMaybe<Scalars['String']['input']>;
  voter_not?: InputMaybe<Scalars['String']['input']>;
  voter_gt?: InputMaybe<Scalars['String']['input']>;
  voter_lt?: InputMaybe<Scalars['String']['input']>;
  voter_gte?: InputMaybe<Scalars['String']['input']>;
  voter_lte?: InputMaybe<Scalars['String']['input']>;
  voter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_contains?: InputMaybe<Scalars['String']['input']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_?: InputMaybe<User_filter>;
  isRemoveVote?: InputMaybe<Scalars['Boolean']['input']>;
  isRemoveVote_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRemoveVote_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isRemoveVote_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  loveAmount?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  loveAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  loveAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GeneVote_filter>>>;
  or?: InputMaybe<Array<InputMaybe<GeneVote_filter>>>;
};

export type GeneVote_orderBy =
  | 'id'
  | 'auction'
  | 'auction__id'
  | 'auction__auctionId'
  | 'auction__totalLove'
  | 'auction__finished'
  | 'auction__blockNumber'
  | 'auction__blockTimestamp'
  | 'auction__transactionHash'
  | 'auction__endBlockNumber'
  | 'auction__endBlockTimestamp'
  | 'auction__endTransactionHash'
  | 'proposal'
  | 'proposal__id'
  | 'proposal__traitType'
  | 'proposal__loveVotes'
  | 'proposal__removeVotes'
  | 'proposal__removed'
  | 'proposal__blockNumber'
  | 'proposal__blockTimestamp'
  | 'proposal__transactionHash'
  | 'voter'
  | 'voter__id'
  | 'voter__address'
  | 'isRemoveVote'
  | 'loveAmount'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  aminalFactory?: Maybe<AminalFactory>;
  aminalFactories: Array<AminalFactory>;
  aminal?: Maybe<Aminal>;
  aminals: Array<Aminal>;
  user?: Maybe<User>;
  users: Array<User>;
  relationship?: Maybe<Relationship>;
  relationships: Array<Relationship>;
  breedAminalEvent?: Maybe<BreedAminalEvent>;
  breedAminalEvents: Array<BreedAminalEvent>;
  feedAminalEvent?: Maybe<FeedAminalEvent>;
  feedAminalEvents: Array<FeedAminalEvent>;
  skillUsed?: Maybe<SkillUsed>;
  skillUseds: Array<SkillUsed>;
  geneAuction?: Maybe<GeneAuction>;
  geneAuctions: Array<GeneAuction>;
  geneNFT?: Maybe<GeneNFT>;
  geneNFTs: Array<GeneNFT>;
  geneProposal?: Maybe<GeneProposal>;
  geneProposals: Array<GeneProposal>;
  geneVote?: Maybe<GeneVote>;
  geneVotes: Array<GeneVote>;
  geneCreatorPayout?: Maybe<GeneCreatorPayout>;
  geneCreatorPayouts: Array<GeneCreatorPayout>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryaminalFactoryArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaminalFactoriesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AminalFactory_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AminalFactory_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaminalArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaminalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Aminal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Aminal_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuserArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryusersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<User_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrelationshipArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrelationshipsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Relationship_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Relationship_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybreedAminalEventArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybreedAminalEventsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BreedAminalEvent_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BreedAminalEvent_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfeedAminalEventArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfeedAminalEventsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FeedAminalEvent_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FeedAminalEvent_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryskillUsedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryskillUsedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SkillUsed_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SkillUsed_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneAuctionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneAuctionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneAuction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneAuction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneNFTArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneNFTsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneNFT_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneNFT_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneProposalArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneProposalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneProposal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneProposal_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneVoteArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneVotesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneVote_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneVote_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneCreatorPayoutArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygeneCreatorPayoutsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneCreatorPayout_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneCreatorPayout_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Relationship = {
  id: Scalars['Bytes']['output'];
  user: User;
  aminal: Aminal;
  love: Scalars['BigInt']['output'];
};

export type Relationship_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_?: InputMaybe<User_filter>;
  aminal?: InputMaybe<Scalars['String']['input']>;
  aminal_not?: InputMaybe<Scalars['String']['input']>;
  aminal_gt?: InputMaybe<Scalars['String']['input']>;
  aminal_lt?: InputMaybe<Scalars['String']['input']>;
  aminal_gte?: InputMaybe<Scalars['String']['input']>;
  aminal_lte?: InputMaybe<Scalars['String']['input']>;
  aminal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminal_contains?: InputMaybe<Scalars['String']['input']>;
  aminal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_?: InputMaybe<Aminal_filter>;
  love?: InputMaybe<Scalars['BigInt']['input']>;
  love_not?: InputMaybe<Scalars['BigInt']['input']>;
  love_gt?: InputMaybe<Scalars['BigInt']['input']>;
  love_lt?: InputMaybe<Scalars['BigInt']['input']>;
  love_gte?: InputMaybe<Scalars['BigInt']['input']>;
  love_lte?: InputMaybe<Scalars['BigInt']['input']>;
  love_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  love_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Relationship_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Relationship_filter>>>;
};

export type Relationship_orderBy =
  | 'id'
  | 'user'
  | 'user__id'
  | 'user__address'
  | 'aminal'
  | 'aminal__id'
  | 'aminal__contractAddress'
  | 'aminal__aminalIndex'
  | 'aminal__auctionId'
  | 'aminal__backId'
  | 'aminal__armId'
  | 'aminal__tailId'
  | 'aminal__earsId'
  | 'aminal__bodyId'
  | 'aminal__faceId'
  | 'aminal__mouthId'
  | 'aminal__miscId'
  | 'aminal__tokenURI'
  | 'aminal__energy'
  | 'aminal__totalLove'
  | 'aminal__ethBalance'
  | 'aminal__blockNumber'
  | 'aminal__blockTimestamp'
  | 'aminal__transactionHash'
  | 'love';

export type SkillUsed = {
  id: Scalars['Bytes']['output'];
  aminal: Aminal;
  caller: User;
  skillAddress: Scalars['Bytes']['output'];
  selector: Scalars['Bytes']['output'];
  newEnergy: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type SkillUsed_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aminal?: InputMaybe<Scalars['String']['input']>;
  aminal_not?: InputMaybe<Scalars['String']['input']>;
  aminal_gt?: InputMaybe<Scalars['String']['input']>;
  aminal_lt?: InputMaybe<Scalars['String']['input']>;
  aminal_gte?: InputMaybe<Scalars['String']['input']>;
  aminal_lte?: InputMaybe<Scalars['String']['input']>;
  aminal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aminal_contains?: InputMaybe<Scalars['String']['input']>;
  aminal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_contains?: InputMaybe<Scalars['String']['input']>;
  aminal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aminal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aminal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aminal_?: InputMaybe<Aminal_filter>;
  caller?: InputMaybe<Scalars['String']['input']>;
  caller_not?: InputMaybe<Scalars['String']['input']>;
  caller_gt?: InputMaybe<Scalars['String']['input']>;
  caller_lt?: InputMaybe<Scalars['String']['input']>;
  caller_gte?: InputMaybe<Scalars['String']['input']>;
  caller_lte?: InputMaybe<Scalars['String']['input']>;
  caller_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_contains?: InputMaybe<Scalars['String']['input']>;
  caller_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_starts_with?: InputMaybe<Scalars['String']['input']>;
  caller_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  caller_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_ends_with?: InputMaybe<Scalars['String']['input']>;
  caller_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  caller_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_?: InputMaybe<User_filter>;
  skillAddress?: InputMaybe<Scalars['Bytes']['input']>;
  skillAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  skillAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  skillAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  skillAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  skillAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  skillAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  skillAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  skillAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  skillAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  selector?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not?: InputMaybe<Scalars['Bytes']['input']>;
  selector_gt?: InputMaybe<Scalars['Bytes']['input']>;
  selector_lt?: InputMaybe<Scalars['Bytes']['input']>;
  selector_gte?: InputMaybe<Scalars['Bytes']['input']>;
  selector_lte?: InputMaybe<Scalars['Bytes']['input']>;
  selector_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  selector_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  selector_contains?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  newEnergy?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_not?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_gt?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_lt?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_gte?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_lte?: InputMaybe<Scalars['BigInt']['input']>;
  newEnergy_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  newEnergy_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SkillUsed_filter>>>;
  or?: InputMaybe<Array<InputMaybe<SkillUsed_filter>>>;
};

export type SkillUsed_orderBy =
  | 'id'
  | 'aminal'
  | 'aminal__id'
  | 'aminal__contractAddress'
  | 'aminal__aminalIndex'
  | 'aminal__auctionId'
  | 'aminal__backId'
  | 'aminal__armId'
  | 'aminal__tailId'
  | 'aminal__earsId'
  | 'aminal__bodyId'
  | 'aminal__faceId'
  | 'aminal__mouthId'
  | 'aminal__miscId'
  | 'aminal__tokenURI'
  | 'aminal__energy'
  | 'aminal__totalLove'
  | 'aminal__ethBalance'
  | 'aminal__blockNumber'
  | 'aminal__blockTimestamp'
  | 'aminal__transactionHash'
  | 'caller'
  | 'caller__id'
  | 'caller__address'
  | 'skillAddress'
  | 'selector'
  | 'newEnergy'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type User = {
  id: Scalars['Bytes']['output'];
  address: Scalars['Bytes']['output'];
  lovers: Array<Maybe<Relationship>>;
  geneProposals: Array<Maybe<GeneProposal>>;
  genesCreated: Array<Maybe<GeneNFT>>;
  genesOwned: Array<Maybe<GeneNFT>>;
  geneVotes: Array<Maybe<GeneVote>>;
};


export type UserloversArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Relationship_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Relationship_filter>;
};


export type UsergeneProposalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneProposal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneProposal_filter>;
};


export type UsergenesCreatedArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneNFT_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneNFT_filter>;
};


export type UsergenesOwnedArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneNFT_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneNFT_filter>;
};


export type UsergeneVotesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GeneVote_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GeneVote_filter>;
};

export type User_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  lovers_?: InputMaybe<Relationship_filter>;
  geneProposals_?: InputMaybe<GeneProposal_filter>;
  genesCreated_?: InputMaybe<GeneNFT_filter>;
  genesOwned_?: InputMaybe<GeneNFT_filter>;
  geneVotes_?: InputMaybe<GeneVote_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<User_filter>>>;
  or?: InputMaybe<Array<InputMaybe<User_filter>>>;
};

export type User_orderBy =
  | 'id'
  | 'address'
  | 'lovers'
  | 'geneProposals'
  | 'genesCreated'
  | 'genesOwned'
  | 'geneVotes';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

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
  Aggregation_interval: Aggregation_interval;
  Aminal: ResolverTypeWrapper<Aminal>;
  AminalFactory: ResolverTypeWrapper<AminalFactory>;
  AminalFactory_filter: AminalFactory_filter;
  AminalFactory_orderBy: AminalFactory_orderBy;
  Aminal_filter: Aminal_filter;
  Aminal_orderBy: Aminal_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BreedAminalEvent: ResolverTypeWrapper<BreedAminalEvent>;
  BreedAminalEvent_filter: BreedAminalEvent_filter;
  BreedAminalEvent_orderBy: BreedAminalEvent_orderBy;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']['output']>;
  FeedAminalEvent: ResolverTypeWrapper<FeedAminalEvent>;
  FeedAminalEvent_filter: FeedAminalEvent_filter;
  FeedAminalEvent_orderBy: FeedAminalEvent_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GeneAuction: ResolverTypeWrapper<GeneAuction>;
  GeneAuction_filter: GeneAuction_filter;
  GeneAuction_orderBy: GeneAuction_orderBy;
  GeneCreatorPayout: ResolverTypeWrapper<GeneCreatorPayout>;
  GeneCreatorPayout_filter: GeneCreatorPayout_filter;
  GeneCreatorPayout_orderBy: GeneCreatorPayout_orderBy;
  GeneNFT: ResolverTypeWrapper<GeneNFT>;
  GeneNFT_filter: GeneNFT_filter;
  GeneNFT_orderBy: GeneNFT_orderBy;
  GeneProposal: ResolverTypeWrapper<GeneProposal>;
  GeneProposal_filter: GeneProposal_filter;
  GeneProposal_orderBy: GeneProposal_orderBy;
  GeneVote: ResolverTypeWrapper<GeneVote>;
  GeneVote_filter: GeneVote_filter;
  GeneVote_orderBy: GeneVote_orderBy;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']['output']>;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  Relationship: ResolverTypeWrapper<Relationship>;
  Relationship_filter: Relationship_filter;
  Relationship_orderBy: Relationship_orderBy;
  SkillUsed: ResolverTypeWrapper<SkillUsed>;
  SkillUsed_filter: SkillUsed_filter;
  SkillUsed_orderBy: SkillUsed_orderBy;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  User: ResolverTypeWrapper<User>;
  User_filter: User_filter;
  User_orderBy: User_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Aminal: Aminal;
  AminalFactory: AminalFactory;
  AminalFactory_filter: AminalFactory_filter;
  Aminal_filter: Aminal_filter;
  BigDecimal: Scalars['BigDecimal']['output'];
  BigInt: Scalars['BigInt']['output'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean']['output'];
  BreedAminalEvent: BreedAminalEvent;
  BreedAminalEvent_filter: BreedAminalEvent_filter;
  Bytes: Scalars['Bytes']['output'];
  FeedAminalEvent: FeedAminalEvent;
  FeedAminalEvent_filter: FeedAminalEvent_filter;
  Float: Scalars['Float']['output'];
  GeneAuction: GeneAuction;
  GeneAuction_filter: GeneAuction_filter;
  GeneCreatorPayout: GeneCreatorPayout;
  GeneCreatorPayout_filter: GeneCreatorPayout_filter;
  GeneNFT: GeneNFT;
  GeneNFT_filter: GeneNFT_filter;
  GeneProposal: GeneProposal;
  GeneProposal_filter: GeneProposal_filter;
  GeneVote: GeneVote;
  GeneVote_filter: GeneVote_filter;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Int8: Scalars['Int8']['output'];
  Query: {};
  Relationship: Relationship;
  Relationship_filter: Relationship_filter;
  SkillUsed: SkillUsed;
  SkillUsed_filter: SkillUsed_filter;
  String: Scalars['String']['output'];
  Timestamp: Scalars['Timestamp']['output'];
  User: User;
  User_filter: User_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String']['input'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String']['input'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AminalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Aminal'] = ResolversParentTypes['Aminal']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  contractAddress?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  aminalIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['AminalFactory'], ParentType, ContextType>;
  parentOne?: Resolver<Maybe<ResolversTypes['Aminal']>, ParentType, ContextType>;
  parentTwo?: Resolver<Maybe<ResolversTypes['Aminal']>, ParentType, ContextType>;
  auctionId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  childrenAsParentOne?: Resolver<Array<ResolversTypes['Aminal']>, ParentType, ContextType, RequireFields<AminalchildrenAsParentOneArgs, 'skip' | 'first'>>;
  childrenAsParentTwo?: Resolver<Array<ResolversTypes['Aminal']>, ParentType, ContextType, RequireFields<AminalchildrenAsParentTwoArgs, 'skip' | 'first'>>;
  backId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  armId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tailId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  earsId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  bodyId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  faceId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  mouthId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  miscId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tokenURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  energy?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalLove?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  ethBalance?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lovers?: Resolver<Array<Maybe<ResolversTypes['Relationship']>>, ParentType, ContextType, RequireFields<AminalloversArgs, 'skip' | 'first'>>;
  skillUsed?: Resolver<Array<ResolversTypes['SkillUsed']>, ParentType, ContextType, RequireFields<AminalskillUsedArgs, 'skip' | 'first'>>;
  feeds?: Resolver<Array<ResolversTypes['FeedAminalEvent']>, ParentType, ContextType, RequireFields<AminalfeedsArgs, 'skip' | 'first'>>;
  breedingEventsAsParentOne?: Resolver<Array<ResolversTypes['BreedAminalEvent']>, ParentType, ContextType, RequireFields<AminalbreedingEventsAsParentOneArgs, 'skip' | 'first'>>;
  breedingEventsAsParentTwo?: Resolver<Array<ResolversTypes['BreedAminalEvent']>, ParentType, ContextType, RequireFields<AminalbreedingEventsAsParentTwoArgs, 'skip' | 'first'>>;
  auctions?: Resolver<Array<ResolversTypes['GeneAuction']>, ParentType, ContextType, RequireFields<AminalauctionsArgs, 'skip' | 'first'>>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AminalFactoryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AminalFactory'] = ResolversParentTypes['AminalFactory']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  totalAminals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  geneAuction?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  genes?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  loveVRGDA?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  initialAminalSpawned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  aminals?: Resolver<Array<ResolversTypes['Aminal']>, ParentType, ContextType, RequireFields<AminalFactoryaminalsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BreedAminalEventResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['BreedAminalEvent'] = ResolversParentTypes['BreedAminalEvent']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  aminalOne?: Resolver<ResolversTypes['Aminal'], ParentType, ContextType>;
  aminalTwo?: Resolver<ResolversTypes['Aminal'], ParentType, ContextType>;
  auctionId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  auction?: Resolver<Maybe<ResolversTypes['GeneAuction']>, ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type FeedAminalEventResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FeedAminalEvent'] = ResolversParentTypes['FeedAminalEvent']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  aminal?: Resolver<ResolversTypes['Aminal'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  love?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalLove?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  energy?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeneAuctionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['GeneAuction'] = ResolversParentTypes['GeneAuction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  auctionId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  aminalOne?: Resolver<ResolversTypes['Aminal'], ParentType, ContextType>;
  aminalTwo?: Resolver<ResolversTypes['Aminal'], ParentType, ContextType>;
  totalLove?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  finished?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  childAminal?: Resolver<Maybe<ResolversTypes['Aminal']>, ParentType, ContextType>;
  winningGeneIds?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  proposals?: Resolver<Array<ResolversTypes['GeneProposal']>, ParentType, ContextType, RequireFields<GeneAuctionproposalsArgs, 'skip' | 'first'>>;
  votes?: Resolver<Array<ResolversTypes['GeneVote']>, ParentType, ContextType, RequireFields<GeneAuctionvotesArgs, 'skip' | 'first'>>;
  payouts?: Resolver<Array<ResolversTypes['GeneCreatorPayout']>, ParentType, ContextType, RequireFields<GeneAuctionpayoutsArgs, 'skip' | 'first'>>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  endBlockNumber?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  endBlockTimestamp?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  endTransactionHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeneCreatorPayoutResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['GeneCreatorPayout'] = ResolversParentTypes['GeneCreatorPayout']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  auction?: Resolver<ResolversTypes['GeneAuction'], ParentType, ContextType>;
  geneNFT?: Resolver<ResolversTypes['GeneNFT'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  auctionId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  geneId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeneNFTResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['GeneNFT'] = ResolversParentTypes['GeneNFT']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  svg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proposalsUsingGene?: Resolver<Array<ResolversTypes['GeneProposal']>, ParentType, ContextType, RequireFields<GeneNFTproposalsUsingGeneArgs, 'skip' | 'first'>>;
  totalEarnings?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  payouts?: Resolver<Array<ResolversTypes['GeneCreatorPayout']>, ParentType, ContextType, RequireFields<GeneNFTpayoutsArgs, 'skip' | 'first'>>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeneProposalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['GeneProposal'] = ResolversParentTypes['GeneProposal']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  auction?: Resolver<ResolversTypes['GeneAuction'], ParentType, ContextType>;
  geneNFT?: Resolver<ResolversTypes['GeneNFT'], ParentType, ContextType>;
  traitType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  proposer?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  loveVotes?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  removeVotes?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  removed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  votes?: Resolver<Array<ResolversTypes['GeneVote']>, ParentType, ContextType, RequireFields<GeneProposalvotesArgs, 'skip' | 'first'>>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeneVoteResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['GeneVote'] = ResolversParentTypes['GeneVote']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  auction?: Resolver<ResolversTypes['GeneAuction'], ParentType, ContextType>;
  proposal?: Resolver<ResolversTypes['GeneProposal'], ParentType, ContextType>;
  voter?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  isRemoveVote?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  loveAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  aminalFactory?: Resolver<Maybe<ResolversTypes['AminalFactory']>, ParentType, ContextType, RequireFields<QueryaminalFactoryArgs, 'id' | 'subgraphError'>>;
  aminalFactories?: Resolver<Array<ResolversTypes['AminalFactory']>, ParentType, ContextType, RequireFields<QueryaminalFactoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  aminal?: Resolver<Maybe<ResolversTypes['Aminal']>, ParentType, ContextType, RequireFields<QueryaminalArgs, 'id' | 'subgraphError'>>;
  aminals?: Resolver<Array<ResolversTypes['Aminal']>, ParentType, ContextType, RequireFields<QueryaminalsArgs, 'skip' | 'first' | 'subgraphError'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id' | 'subgraphError'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryusersArgs, 'skip' | 'first' | 'subgraphError'>>;
  relationship?: Resolver<Maybe<ResolversTypes['Relationship']>, ParentType, ContextType, RequireFields<QueryrelationshipArgs, 'id' | 'subgraphError'>>;
  relationships?: Resolver<Array<ResolversTypes['Relationship']>, ParentType, ContextType, RequireFields<QueryrelationshipsArgs, 'skip' | 'first' | 'subgraphError'>>;
  breedAminalEvent?: Resolver<Maybe<ResolversTypes['BreedAminalEvent']>, ParentType, ContextType, RequireFields<QuerybreedAminalEventArgs, 'id' | 'subgraphError'>>;
  breedAminalEvents?: Resolver<Array<ResolversTypes['BreedAminalEvent']>, ParentType, ContextType, RequireFields<QuerybreedAminalEventsArgs, 'skip' | 'first' | 'subgraphError'>>;
  feedAminalEvent?: Resolver<Maybe<ResolversTypes['FeedAminalEvent']>, ParentType, ContextType, RequireFields<QueryfeedAminalEventArgs, 'id' | 'subgraphError'>>;
  feedAminalEvents?: Resolver<Array<ResolversTypes['FeedAminalEvent']>, ParentType, ContextType, RequireFields<QueryfeedAminalEventsArgs, 'skip' | 'first' | 'subgraphError'>>;
  skillUsed?: Resolver<Maybe<ResolversTypes['SkillUsed']>, ParentType, ContextType, RequireFields<QueryskillUsedArgs, 'id' | 'subgraphError'>>;
  skillUseds?: Resolver<Array<ResolversTypes['SkillUsed']>, ParentType, ContextType, RequireFields<QueryskillUsedsArgs, 'skip' | 'first' | 'subgraphError'>>;
  geneAuction?: Resolver<Maybe<ResolversTypes['GeneAuction']>, ParentType, ContextType, RequireFields<QuerygeneAuctionArgs, 'id' | 'subgraphError'>>;
  geneAuctions?: Resolver<Array<ResolversTypes['GeneAuction']>, ParentType, ContextType, RequireFields<QuerygeneAuctionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  geneNFT?: Resolver<Maybe<ResolversTypes['GeneNFT']>, ParentType, ContextType, RequireFields<QuerygeneNFTArgs, 'id' | 'subgraphError'>>;
  geneNFTs?: Resolver<Array<ResolversTypes['GeneNFT']>, ParentType, ContextType, RequireFields<QuerygeneNFTsArgs, 'skip' | 'first' | 'subgraphError'>>;
  geneProposal?: Resolver<Maybe<ResolversTypes['GeneProposal']>, ParentType, ContextType, RequireFields<QuerygeneProposalArgs, 'id' | 'subgraphError'>>;
  geneProposals?: Resolver<Array<ResolversTypes['GeneProposal']>, ParentType, ContextType, RequireFields<QuerygeneProposalsArgs, 'skip' | 'first' | 'subgraphError'>>;
  geneVote?: Resolver<Maybe<ResolversTypes['GeneVote']>, ParentType, ContextType, RequireFields<QuerygeneVoteArgs, 'id' | 'subgraphError'>>;
  geneVotes?: Resolver<Array<ResolversTypes['GeneVote']>, ParentType, ContextType, RequireFields<QuerygeneVotesArgs, 'skip' | 'first' | 'subgraphError'>>;
  geneCreatorPayout?: Resolver<Maybe<ResolversTypes['GeneCreatorPayout']>, ParentType, ContextType, RequireFields<QuerygeneCreatorPayoutArgs, 'id' | 'subgraphError'>>;
  geneCreatorPayouts?: Resolver<Array<ResolversTypes['GeneCreatorPayout']>, ParentType, ContextType, RequireFields<QuerygeneCreatorPayoutsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type RelationshipResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Relationship'] = ResolversParentTypes['Relationship']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  aminal?: Resolver<ResolversTypes['Aminal'], ParentType, ContextType>;
  love?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkillUsedResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['SkillUsed'] = ResolversParentTypes['SkillUsed']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  aminal?: Resolver<ResolversTypes['Aminal'], ParentType, ContextType>;
  caller?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  skillAddress?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  selector?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  newEnergy?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  lovers?: Resolver<Array<Maybe<ResolversTypes['Relationship']>>, ParentType, ContextType, RequireFields<UserloversArgs, 'skip' | 'first'>>;
  geneProposals?: Resolver<Array<Maybe<ResolversTypes['GeneProposal']>>, ParentType, ContextType, RequireFields<UsergeneProposalsArgs, 'skip' | 'first'>>;
  genesCreated?: Resolver<Array<Maybe<ResolversTypes['GeneNFT']>>, ParentType, ContextType, RequireFields<UsergenesCreatedArgs, 'skip' | 'first'>>;
  genesOwned?: Resolver<Array<Maybe<ResolversTypes['GeneNFT']>>, ParentType, ContextType, RequireFields<UsergenesOwnedArgs, 'skip' | 'first'>>;
  geneVotes?: Resolver<Array<Maybe<ResolversTypes['GeneVote']>>, ParentType, ContextType, RequireFields<UsergeneVotesArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parentHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Aminal?: AminalResolvers<ContextType>;
  AminalFactory?: AminalFactoryResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  BreedAminalEvent?: BreedAminalEventResolvers<ContextType>;
  Bytes?: GraphQLScalarType;
  FeedAminalEvent?: FeedAminalEventResolvers<ContextType>;
  GeneAuction?: GeneAuctionResolvers<ContextType>;
  GeneCreatorPayout?: GeneCreatorPayoutResolvers<ContextType>;
  GeneNFT?: GeneNFTResolvers<ContextType>;
  GeneProposal?: GeneProposalResolvers<ContextType>;
  GeneVote?: GeneVoteResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Relationship?: RelationshipResolvers<ContextType>;
  SkillUsed?: SkillUsedResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = Aminalsv3Types.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/aminalsv3/introspectionSchema":
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
const aminalsv3Transforms = [];
const additionalTypeDefs = [] as any[];
const aminalsv3Handler = new GraphqlHandler({
              name: "aminalsv3",
              config: {"endpoint":"https://api.studio.thegraph.com/query/57078/aminals-3/version/latest"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("aminalsv3"),
              logger: logger.child("aminalsv3"),
              importFn,
            });
sources[0] = {
          name: 'aminalsv3',
          handler: aminalsv3Handler,
          transforms: aminalsv3Transforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })
const documentHashMap = {
        "043e62421358cc26b5a2abf24a2d783480c25a22cfdac3e6634d3816dc7ee337": AminalsListDocument,
"043e62421358cc26b5a2abf24a2d783480c25a22cfdac3e6634d3816dc7ee337": AminalByIdDocument,
"043e62421358cc26b5a2abf24a2d783480c25a22cfdac3e6634d3816dc7ee337": AminalFactoryDocument,
"cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e": GeneAuctionsListDocument,
"cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e": GeneAuctionDocument,
"cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e": GeneProposalsListDocument,
"cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e": GeneVotesListDocument,
"cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e": GeneVotesByAuctionDocument,
"fefd76273d34f49707460b18b6e22a4089317a1d4e360031844926cee97001a0": GeneNftsListDocument,
"fefd76273d34f49707460b18b6e22a4089317a1d4e360031844926cee97001a0": GeneNftByIdDocument,
"fefd76273d34f49707460b18b6e22a4089317a1d4e360031844926cee97001a0": GenesByTraitTypeDocument,
"c74ae288e6306c3c09b321f4f0058dcd4d94d1427857ec2ca85fbff0c5fe3b14": SkillUsedListDocument,
"c74ae288e6306c3c09b321f4f0058dcd4d94d1427857ec2ca85fbff0c5fe3b14": SkillUsedByAminalDocument,
"c74ae288e6306c3c09b321f4f0058dcd4d94d1427857ec2ca85fbff0c5fe3b14": SkillUsedBySkillDocument,
"d02d3b2a07e80480d50b462927abe4607954fd9559c8dbdcc6e25df4f75915a7": UserProfileDocument,
"d02d3b2a07e80480d50b462927abe4607954fd9559c8dbdcc6e25df4f75915a7": UserEarningsDocument,
"d02d3b2a07e80480d50b462927abe4607954fd9559c8dbdcc6e25df4f75915a7": UserActivityDocument
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
        sha256Hash: '043e62421358cc26b5a2abf24a2d783480c25a22cfdac3e6634d3816dc7ee337'
      },{
        document: AminalByIdDocument,
        get rawSDL() {
          return printWithCache(AminalByIdDocument);
        },
        location: 'AminalByIdDocument.graphql',
        sha256Hash: '043e62421358cc26b5a2abf24a2d783480c25a22cfdac3e6634d3816dc7ee337'
      },{
        document: AminalFactoryDocument,
        get rawSDL() {
          return printWithCache(AminalFactoryDocument);
        },
        location: 'AminalFactoryDocument.graphql',
        sha256Hash: '043e62421358cc26b5a2abf24a2d783480c25a22cfdac3e6634d3816dc7ee337'
      },{
        document: GeneAuctionsListDocument,
        get rawSDL() {
          return printWithCache(GeneAuctionsListDocument);
        },
        location: 'GeneAuctionsListDocument.graphql',
        sha256Hash: 'cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e'
      },{
        document: GeneAuctionDocument,
        get rawSDL() {
          return printWithCache(GeneAuctionDocument);
        },
        location: 'GeneAuctionDocument.graphql',
        sha256Hash: 'cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e'
      },{
        document: GeneProposalsListDocument,
        get rawSDL() {
          return printWithCache(GeneProposalsListDocument);
        },
        location: 'GeneProposalsListDocument.graphql',
        sha256Hash: 'cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e'
      },{
        document: GeneVotesListDocument,
        get rawSDL() {
          return printWithCache(GeneVotesListDocument);
        },
        location: 'GeneVotesListDocument.graphql',
        sha256Hash: 'cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e'
      },{
        document: GeneVotesByAuctionDocument,
        get rawSDL() {
          return printWithCache(GeneVotesByAuctionDocument);
        },
        location: 'GeneVotesByAuctionDocument.graphql',
        sha256Hash: 'cfb4d7042dd02663f5395d18b836e3109d79692089cdd146ecf56626e98e6c6e'
      },{
        document: GeneNftsListDocument,
        get rawSDL() {
          return printWithCache(GeneNftsListDocument);
        },
        location: 'GeneNftsListDocument.graphql',
        sha256Hash: 'fefd76273d34f49707460b18b6e22a4089317a1d4e360031844926cee97001a0'
      },{
        document: GeneNftByIdDocument,
        get rawSDL() {
          return printWithCache(GeneNftByIdDocument);
        },
        location: 'GeneNftByIdDocument.graphql',
        sha256Hash: 'fefd76273d34f49707460b18b6e22a4089317a1d4e360031844926cee97001a0'
      },{
        document: GenesByTraitTypeDocument,
        get rawSDL() {
          return printWithCache(GenesByTraitTypeDocument);
        },
        location: 'GenesByTraitTypeDocument.graphql',
        sha256Hash: 'fefd76273d34f49707460b18b6e22a4089317a1d4e360031844926cee97001a0'
      },{
        document: SkillUsedListDocument,
        get rawSDL() {
          return printWithCache(SkillUsedListDocument);
        },
        location: 'SkillUsedListDocument.graphql',
        sha256Hash: 'c74ae288e6306c3c09b321f4f0058dcd4d94d1427857ec2ca85fbff0c5fe3b14'
      },{
        document: SkillUsedByAminalDocument,
        get rawSDL() {
          return printWithCache(SkillUsedByAminalDocument);
        },
        location: 'SkillUsedByAminalDocument.graphql',
        sha256Hash: 'c74ae288e6306c3c09b321f4f0058dcd4d94d1427857ec2ca85fbff0c5fe3b14'
      },{
        document: SkillUsedBySkillDocument,
        get rawSDL() {
          return printWithCache(SkillUsedBySkillDocument);
        },
        location: 'SkillUsedBySkillDocument.graphql',
        sha256Hash: 'c74ae288e6306c3c09b321f4f0058dcd4d94d1427857ec2ca85fbff0c5fe3b14'
      },{
        document: UserProfileDocument,
        get rawSDL() {
          return printWithCache(UserProfileDocument);
        },
        location: 'UserProfileDocument.graphql',
        sha256Hash: 'd02d3b2a07e80480d50b462927abe4607954fd9559c8dbdcc6e25df4f75915a7'
      },{
        document: UserEarningsDocument,
        get rawSDL() {
          return printWithCache(UserEarningsDocument);
        },
        location: 'UserEarningsDocument.graphql',
        sha256Hash: 'd02d3b2a07e80480d50b462927abe4607954fd9559c8dbdcc6e25df4f75915a7'
      },{
        document: UserActivityDocument,
        get rawSDL() {
          return printWithCache(UserActivityDocument);
        },
        location: 'UserActivityDocument.graphql',
        sha256Hash: 'd02d3b2a07e80480d50b462927abe4607954fd9559c8dbdcc6e25df4f75915a7'
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
  skip?: InputMaybe<Scalars['Int']['input']>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
}>;


export type AminalsListQuery = { aminals: Array<(
    Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'ethBalance' | 'blockTimestamp' | 'tokenURI' | 'backId' | 'armId' | 'tailId' | 'earsId' | 'bodyId' | 'faceId' | 'mouthId' | 'miscId'>
    & { parentOne?: Maybe<Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex'>>, parentTwo?: Maybe<Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex'>>, lovers: Array<Maybe<Pick<Relationship, 'love'>>> }
  )> };

export type AminalByIdQueryVariables = Exact<{
  contractAddress?: InputMaybe<Scalars['Bytes']['input']>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
}>;


export type AminalByIdQuery = { aminals: Array<(
    Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'ethBalance' | 'blockTimestamp' | 'tokenURI' | 'backId' | 'armId' | 'tailId' | 'earsId' | 'bodyId' | 'faceId' | 'mouthId' | 'miscId'>
    & { parentOne?: Maybe<Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex'>>, parentTwo?: Maybe<Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex'>>, lovers: Array<Maybe<Pick<Relationship, 'love'>>>, feeds: Array<(
      Pick<FeedAminalEvent, 'id' | 'amount' | 'love' | 'totalLove' | 'energy' | 'blockTimestamp'>
      & { sender: Pick<User, 'id' | 'address'> }
    )>, skillUsed: Array<(
      Pick<SkillUsed, 'id' | 'skillAddress' | 'selector' | 'newEnergy' | 'blockTimestamp'>
      & { caller: Pick<User, 'id' | 'address'> }
    )> }
  )> };

export type AminalFactoryQueryVariables = Exact<{ [key: string]: never; }>;


export type AminalFactoryQuery = { aminalFactories: Array<(
    Pick<AminalFactory, 'id' | 'totalAminals'>
    & { aminals: Array<Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'energy' | 'totalLove' | 'ethBalance' | 'tokenURI'>> }
  )> };

export type GeneAuctionsListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GeneAuctionsListQuery = { geneAuctions: Array<(
    Pick<GeneAuction, 'id' | 'auctionId' | 'finished' | 'totalLove' | 'blockTimestamp'>
    & { aminalOne: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'backId' | 'armId' | 'tailId' | 'earsId' | 'bodyId' | 'faceId' | 'mouthId' | 'miscId'>, aminalTwo: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'backId' | 'armId' | 'tailId' | 'earsId' | 'bodyId' | 'faceId' | 'mouthId' | 'miscId'>, childAminal?: Maybe<Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove' | 'backId' | 'armId' | 'tailId' | 'earsId' | 'bodyId' | 'faceId' | 'mouthId' | 'miscId'>> }
  )> };

export type GeneAuctionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GeneAuctionQuery = { geneAuction?: Maybe<(
    Pick<GeneAuction, 'id' | 'auctionId' | 'finished' | 'totalLove' | 'blockTimestamp'>
    & { aminalOne: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'backId' | 'armId' | 'tailId' | 'earsId' | 'bodyId' | 'faceId' | 'mouthId' | 'miscId'>, aminalTwo: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'backId' | 'armId' | 'tailId' | 'earsId' | 'bodyId' | 'faceId' | 'mouthId' | 'miscId'>, childAminal?: Maybe<Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove' | 'backId' | 'armId' | 'tailId' | 'earsId' | 'bodyId' | 'faceId' | 'mouthId' | 'miscId'>>, proposals: Array<(
      Pick<GeneProposal, 'id' | 'traitType' | 'loveVotes' | 'removeVotes' | 'removed' | 'blockTimestamp'>
      & { geneNFT: Pick<GeneNFT, 'id' | 'tokenId' | 'name' | 'svg'>, proposer: Pick<User, 'id' | 'address'> }
    )>, votes: Array<(
      Pick<GeneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
      & { proposal: (
        Pick<GeneProposal, 'id' | 'traitType'>
        & { geneNFT: Pick<GeneNFT, 'id' | 'tokenId'> }
      ), voter: Pick<User, 'id' | 'address'> }
    )> }
  )> };

export type GeneProposalsListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GeneProposalsListQuery = { geneProposals: Array<(
    Pick<GeneProposal, 'id' | 'traitType' | 'loveVotes' | 'removeVotes' | 'removed' | 'blockTimestamp'>
    & { auction: Pick<GeneAuction, 'id' | 'auctionId'>, geneNFT: Pick<GeneNFT, 'id' | 'tokenId' | 'name' | 'svg'>, proposer: Pick<User, 'id' | 'address'> }
  )> };

export type GeneVotesListQueryVariables = Exact<{
  auctionId: Scalars['String']['input'];
  traitType: Scalars['Int']['input'];
}>;


export type GeneVotesListQuery = { geneVotes: Array<(
    Pick<GeneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
    & { proposal: (
      Pick<GeneProposal, 'id' | 'traitType'>
      & { geneNFT: Pick<GeneNFT, 'id' | 'tokenId'> }
    ), voter: Pick<User, 'id' | 'address'> }
  )> };

export type GeneVotesByAuctionQueryVariables = Exact<{
  auctionId: Scalars['String']['input'];
}>;


export type GeneVotesByAuctionQuery = { geneVotes: Array<(
    Pick<GeneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
    & { proposal: (
      Pick<GeneProposal, 'id' | 'traitType'>
      & { geneNFT: Pick<GeneNFT, 'id' | 'tokenId' | 'name' | 'svg'> }
    ), voter: Pick<User, 'id' | 'address'> }
  )> };

export type GeneNftsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GeneNftsListQuery = { geneNFTs: Array<(
    Pick<GeneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
    & { owner: Pick<User, 'id' | 'address'>, creator: Pick<User, 'id' | 'address'>, proposalsUsingGene: Array<(
      Pick<GeneProposal, 'id'>
      & { auction: (
        Pick<GeneAuction, 'id'>
        & { aminalOne: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>, aminalTwo: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'> }
      ) }
    )>, payouts: Array<(
      Pick<GeneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>
      & { auction: Pick<GeneAuction, 'id' | 'auctionId'> }
    )> }
  )> };

export type GeneNftByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GeneNftByIdQuery = { geneNFT?: Maybe<(
    Pick<GeneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
    & { owner: Pick<User, 'id' | 'address'>, creator: Pick<User, 'id' | 'address'>, proposalsUsingGene: Array<(
      Pick<GeneProposal, 'id'>
      & { auction: (
        Pick<GeneAuction, 'id'>
        & { aminalOne: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>, aminalTwo: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'> }
      ) }
    )>, payouts: Array<(
      Pick<GeneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>
      & { auction: Pick<GeneAuction, 'id' | 'auctionId'> }
    )> }
  )> };

export type GenesByTraitTypeQueryVariables = Exact<{
  traitType: Scalars['Int']['input'];
}>;


export type GenesByTraitTypeQuery = { geneNFTs: Array<(
    Pick<GeneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
    & { owner: Pick<User, 'id' | 'address'>, creator: Pick<User, 'id' | 'address'>, proposalsUsingGene: Array<(
      Pick<GeneProposal, 'id'>
      & { auction: (
        Pick<GeneAuction, 'id'>
        & { aminalOne: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'>, aminalTwo: Pick<Aminal, 'id' | 'contractAddress' | 'aminalIndex' | 'tokenURI' | 'energy' | 'totalLove'> }
      ) }
    )>, payouts: Array<(
      Pick<GeneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>
      & { auction: Pick<GeneAuction, 'id' | 'auctionId'> }
    )> }
  )> };

export type SkillUsedListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SkillUsedListQuery = { skillUseds: Array<(
    Pick<SkillUsed, 'id' | 'skillAddress' | 'selector' | 'newEnergy' | 'blockTimestamp'>
    & { aminal: Pick<Aminal, 'id'>, caller: Pick<User, 'id' | 'address'> }
  )> };

export type SkillUsedByAminalQueryVariables = Exact<{
  aminalId: Scalars['String']['input'];
}>;


export type SkillUsedByAminalQuery = { skillUseds: Array<(
    Pick<SkillUsed, 'id' | 'skillAddress' | 'selector' | 'newEnergy' | 'blockTimestamp'>
    & { caller: Pick<User, 'id' | 'address'> }
  )> };

export type SkillUsedBySkillQueryVariables = Exact<{
  skillAddress: Scalars['Bytes']['input'];
}>;


export type SkillUsedBySkillQuery = { skillUseds: Array<(
    Pick<SkillUsed, 'id' | 'selector' | 'newEnergy' | 'blockTimestamp'>
    & { aminal: Pick<Aminal, 'id'>, caller: Pick<User, 'id' | 'address'> }
  )> };

export type UserProfileQueryVariables = Exact<{
  address: Scalars['ID']['input'];
}>;


export type UserProfileQuery = { user?: Maybe<(
    Pick<User, 'id' | 'address'>
    & { lovers: Array<Maybe<(
      Pick<Relationship, 'id' | 'love'>
      & { aminal: Pick<Aminal, 'id' | 'contractAddress' | 'tokenURI' | 'totalLove' | 'energy' | 'ethBalance' | 'blockTimestamp'> }
    )>>, genesCreated: Array<Maybe<(
      Pick<GeneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
      & { payouts: Array<Pick<GeneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>> }
    )>>, genesOwned: Array<Maybe<(
      Pick<GeneNFT, 'id' | 'tokenId' | 'traitType' | 'name' | 'description' | 'svg' | 'totalEarnings' | 'blockTimestamp'>
      & { creator: Pick<User, 'id' | 'address'> }
    )>>, geneVotes: Array<Maybe<(
      Pick<GeneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
      & { auction: (
        Pick<GeneAuction, 'id' | 'auctionId'>
        & { aminalOne: Pick<Aminal, 'id' | 'contractAddress' | 'tokenURI'>, aminalTwo: Pick<Aminal, 'id' | 'contractAddress' | 'tokenURI'> }
      ), proposal: (
        Pick<GeneProposal, 'id'>
        & { geneNFT: Pick<GeneNFT, 'id' | 'tokenId' | 'name' | 'traitType'> }
      ) }
    )>> }
  )> };

export type UserEarningsQueryVariables = Exact<{
  address: Scalars['ID']['input'];
}>;


export type UserEarningsQuery = { user?: Maybe<(
    Pick<User, 'id' | 'address'>
    & { genesCreated: Array<Maybe<(
      Pick<GeneNFT, 'id' | 'tokenId' | 'name' | 'traitType' | 'totalEarnings'>
      & { payouts: Array<(
        Pick<GeneCreatorPayout, 'id' | 'amount' | 'auctionId' | 'blockTimestamp'>
        & { auction: (
          Pick<GeneAuction, 'id' | 'auctionId'>
          & { aminalOne: Pick<Aminal, 'id' | 'contractAddress' | 'tokenURI'>, aminalTwo: Pick<Aminal, 'id' | 'contractAddress' | 'tokenURI'> }
        ) }
      )> }
    )>> }
  )> };

export type UserActivityQueryVariables = Exact<{
  address: Scalars['ID']['input'];
}>;


export type UserActivityQuery = { user?: Maybe<(
    Pick<User, 'id' | 'address'>
    & { lovers: Array<Maybe<(
      Pick<Relationship, 'id' | 'love'>
      & { aminal: Pick<Aminal, 'id' | 'contractAddress' | 'tokenURI' | 'totalLove'> }
    )>>, geneVotes: Array<Maybe<(
      Pick<GeneVote, 'id' | 'isRemoveVote' | 'loveAmount' | 'blockTimestamp'>
      & { auction: Pick<GeneAuction, 'id' | 'auctionId'>, proposal: (
        Pick<GeneProposal, 'id'>
        & { geneNFT: Pick<GeneNFT, 'id' | 'tokenId' | 'name' | 'traitType'> }
      ) }
    )>> }
  )> };


export const AminalsListDocument = gql`
    query AminalsList($first: Int = 100, $skip: Int = 0, $address: Bytes = "") {
  aminals(first: $first, skip: $skip) {
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
    backId
    armId
    tailId
    earsId
    bodyId
    faceId
    mouthId
    miscId
    lovers(where: {user_: {address: $address}}) {
      love
    }
  }
}
    ` as unknown as DocumentNode<AminalsListQuery, AminalsListQueryVariables>;
export const AminalByIdDocument = gql`
    query AminalById($contractAddress: Bytes, $address: Bytes = "") {
  aminals(where: {contractAddress: $contractAddress}) {
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
    backId
    armId
    tailId
    earsId
    bodyId
    faceId
    mouthId
    miscId
    lovers(where: {user_: {address: $address}}) {
      love
    }
    feeds {
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
    skillUsed {
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
    ` as unknown as DocumentNode<AminalByIdQuery, AminalByIdQueryVariables>;
export const AminalFactoryDocument = gql`
    query AminalFactory {
  aminalFactories(first: 1) {
    id
    totalAminals
    aminals {
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
    ` as unknown as DocumentNode<AminalFactoryQuery, AminalFactoryQueryVariables>;
export const GeneAuctionsListDocument = gql`
    query GeneAuctionsList($first: Int = 100, $skip: Int = 0) {
  geneAuctions(first: $first, skip: $skip, orderBy: id, orderDirection: desc) {
    id
    auctionId
    aminalOne {
      id
      contractAddress
      aminalIndex
      tokenURI
      backId
      armId
      tailId
      earsId
      bodyId
      faceId
      mouthId
      miscId
    }
    aminalTwo {
      id
      contractAddress
      aminalIndex
      tokenURI
      backId
      armId
      tailId
      earsId
      bodyId
      faceId
      mouthId
      miscId
    }
    childAminal {
      id
      contractAddress
      aminalIndex
      tokenURI
      energy
      totalLove
      backId
      armId
      tailId
      earsId
      bodyId
      faceId
      mouthId
      miscId
    }
    finished
    totalLove
    blockTimestamp
  }
}
    ` as unknown as DocumentNode<GeneAuctionsListQuery, GeneAuctionsListQueryVariables>;
export const GeneAuctionDocument = gql`
    query GeneAuction($id: ID!) {
  geneAuction(id: $id) {
    id
    auctionId
    aminalOne {
      id
      contractAddress
      aminalIndex
      tokenURI
      backId
      armId
      tailId
      earsId
      bodyId
      faceId
      mouthId
      miscId
    }
    aminalTwo {
      id
      contractAddress
      aminalIndex
      tokenURI
      backId
      armId
      tailId
      earsId
      bodyId
      faceId
      mouthId
      miscId
    }
    childAminal {
      id
      contractAddress
      aminalIndex
      tokenURI
      energy
      totalLove
      backId
      armId
      tailId
      earsId
      bodyId
      faceId
      mouthId
      miscId
    }
    finished
    totalLove
    blockTimestamp
    proposals {
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
    votes {
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
    ` as unknown as DocumentNode<GeneAuctionQuery, GeneAuctionQueryVariables>;
export const GeneProposalsListDocument = gql`
    query GeneProposalsList($first: Int = 100, $skip: Int = 0) {
  geneProposals(
    first: $first
    skip: $skip
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
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
    ` as unknown as DocumentNode<GeneProposalsListQuery, GeneProposalsListQueryVariables>;
export const GeneVotesListDocument = gql`
    query GeneVotesList($auctionId: String!, $traitType: Int!) {
  geneVotes(
    where: {auction: $auctionId, proposal_: {traitType: $traitType}}
    orderBy: loveAmount
    orderDirection: desc
  ) {
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
    ` as unknown as DocumentNode<GeneVotesListQuery, GeneVotesListQueryVariables>;
export const GeneVotesByAuctionDocument = gql`
    query GeneVotesByAuction($auctionId: String!) {
  geneVotes(
    where: {auction: $auctionId}
    orderBy: loveAmount
    orderDirection: desc
  ) {
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
    ` as unknown as DocumentNode<GeneVotesByAuctionQuery, GeneVotesByAuctionQueryVariables>;
export const GeneNftsListDocument = gql`
    query GeneNftsList {
  geneNFTs(orderBy: tokenId, orderDirection: asc) {
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
    proposalsUsingGene {
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
    payouts {
      id
      amount
      auctionId
      blockTimestamp
      auction {
        id
        auctionId
      }
    }
    blockTimestamp
  }
}
    ` as unknown as DocumentNode<GeneNftsListQuery, GeneNftsListQueryVariables>;
export const GeneNftByIdDocument = gql`
    query GeneNftById($id: ID!) {
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
    proposalsUsingGene {
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
    payouts {
      id
      amount
      auctionId
      blockTimestamp
      auction {
        id
        auctionId
      }
    }
    blockTimestamp
  }
}
    ` as unknown as DocumentNode<GeneNftByIdQuery, GeneNftByIdQueryVariables>;
export const GenesByTraitTypeDocument = gql`
    query GenesByTraitType($traitType: Int!) {
  geneNFTs(where: {traitType: $traitType}, orderBy: tokenId, orderDirection: asc) {
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
    proposalsUsingGene {
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
    payouts {
      id
      amount
      auctionId
      blockTimestamp
      auction {
        id
        auctionId
      }
    }
    blockTimestamp
  }
}
    ` as unknown as DocumentNode<GenesByTraitTypeQuery, GenesByTraitTypeQueryVariables>;
export const SkillUsedListDocument = gql`
    query SkillUsedList($first: Int = 100, $skip: Int = 0) {
  skillUseds(
    first: $first
    skip: $skip
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
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
    ` as unknown as DocumentNode<SkillUsedListQuery, SkillUsedListQueryVariables>;
export const SkillUsedByAminalDocument = gql`
    query SkillUsedByAminal($aminalId: String!) {
  skillUseds(
    where: {aminal: $aminalId}
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
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
    ` as unknown as DocumentNode<SkillUsedByAminalQuery, SkillUsedByAminalQueryVariables>;
export const SkillUsedBySkillDocument = gql`
    query SkillUsedBySkill($skillAddress: Bytes!) {
  skillUseds(
    where: {skillAddress: $skillAddress}
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
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
    ` as unknown as DocumentNode<SkillUsedBySkillQuery, SkillUsedBySkillQueryVariables>;
export const UserProfileDocument = gql`
    query UserProfile($address: ID!) {
  user(id: $address) {
    id
    address
    lovers {
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
    genesCreated {
      id
      tokenId
      traitType
      name
      description
      svg
      totalEarnings
      blockTimestamp
      payouts {
        id
        amount
        auctionId
        blockTimestamp
      }
    }
    genesOwned {
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
    geneVotes {
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
    ` as unknown as DocumentNode<UserProfileQuery, UserProfileQueryVariables>;
export const UserEarningsDocument = gql`
    query UserEarnings($address: ID!) {
  user(id: $address) {
    id
    address
    genesCreated {
      id
      tokenId
      name
      traitType
      totalEarnings
      payouts {
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
    ` as unknown as DocumentNode<UserEarningsQuery, UserEarningsQueryVariables>;
export const UserActivityDocument = gql`
    query UserActivity($address: ID!) {
  user(id: $address) {
    id
    address
    lovers(orderBy: love, orderDirection: desc, first: 10) {
      id
      aminal {
        id
        contractAddress
        tokenURI
        totalLove
      }
      love
    }
    geneVotes(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
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
    ` as unknown as DocumentNode<UserActivityQuery, UserActivityQueryVariables>;


















export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    AminalsList(variables?: AminalsListQueryVariables, options?: C): Promise<AminalsListQuery> {
      return requester<AminalsListQuery, AminalsListQueryVariables>(AminalsListDocument, variables, options) as Promise<AminalsListQuery>;
    },
    AminalById(variables?: AminalByIdQueryVariables, options?: C): Promise<AminalByIdQuery> {
      return requester<AminalByIdQuery, AminalByIdQueryVariables>(AminalByIdDocument, variables, options) as Promise<AminalByIdQuery>;
    },
    AminalFactory(variables?: AminalFactoryQueryVariables, options?: C): Promise<AminalFactoryQuery> {
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