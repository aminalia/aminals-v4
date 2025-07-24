// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace Aminalsv3Types {
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

  export type QuerySdk = {
      /** null **/
  aminalFactory: InContextSdkMethod<Query['aminalFactory'], QueryaminalFactoryArgs, MeshContext>,
  /** null **/
  aminalFactories: InContextSdkMethod<Query['aminalFactories'], QueryaminalFactoriesArgs, MeshContext>,
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
  breedAminalEvent: InContextSdkMethod<Query['breedAminalEvent'], QuerybreedAminalEventArgs, MeshContext>,
  /** null **/
  breedAminalEvents: InContextSdkMethod<Query['breedAminalEvents'], QuerybreedAminalEventsArgs, MeshContext>,
  /** null **/
  feedAminalEvent: InContextSdkMethod<Query['feedAminalEvent'], QueryfeedAminalEventArgs, MeshContext>,
  /** null **/
  feedAminalEvents: InContextSdkMethod<Query['feedAminalEvents'], QueryfeedAminalEventsArgs, MeshContext>,
  /** null **/
  skillUsed: InContextSdkMethod<Query['skillUsed'], QueryskillUsedArgs, MeshContext>,
  /** null **/
  skillUseds: InContextSdkMethod<Query['skillUseds'], QueryskillUsedsArgs, MeshContext>,
  /** null **/
  geneAuction: InContextSdkMethod<Query['geneAuction'], QuerygeneAuctionArgs, MeshContext>,
  /** null **/
  geneAuctions: InContextSdkMethod<Query['geneAuctions'], QuerygeneAuctionsArgs, MeshContext>,
  /** null **/
  geneNFT: InContextSdkMethod<Query['geneNFT'], QuerygeneNFTArgs, MeshContext>,
  /** null **/
  geneNFTs: InContextSdkMethod<Query['geneNFTs'], QuerygeneNFTsArgs, MeshContext>,
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
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["aminalsv3"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
