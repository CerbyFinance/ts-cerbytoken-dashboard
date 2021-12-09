import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: number;
  BigInt: number;
  Bytes: any;
};






export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};


export type CachedInterestPerShare = {
  __typename?: 'CachedInterestPerShare';
  id: Scalars['ID'];
  sealedDay: Scalars['BigInt'];
  sealedCachedDay: Scalars['BigInt'];
  cachedInterestPerShare: Scalars['BigDecimal'];
};

export type CachedInterestPerShare_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  sealedDay?: Maybe<Scalars['BigInt']>;
  sealedDay_not?: Maybe<Scalars['BigInt']>;
  sealedDay_gt?: Maybe<Scalars['BigInt']>;
  sealedDay_lt?: Maybe<Scalars['BigInt']>;
  sealedDay_gte?: Maybe<Scalars['BigInt']>;
  sealedDay_lte?: Maybe<Scalars['BigInt']>;
  sealedDay_in?: Maybe<Array<Scalars['BigInt']>>;
  sealedDay_not_in?: Maybe<Array<Scalars['BigInt']>>;
  sealedCachedDay?: Maybe<Scalars['BigInt']>;
  sealedCachedDay_not?: Maybe<Scalars['BigInt']>;
  sealedCachedDay_gt?: Maybe<Scalars['BigInt']>;
  sealedCachedDay_lt?: Maybe<Scalars['BigInt']>;
  sealedCachedDay_gte?: Maybe<Scalars['BigInt']>;
  sealedCachedDay_lte?: Maybe<Scalars['BigInt']>;
  sealedCachedDay_in?: Maybe<Array<Scalars['BigInt']>>;
  sealedCachedDay_not_in?: Maybe<Array<Scalars['BigInt']>>;
  cachedInterestPerShare?: Maybe<Scalars['BigDecimal']>;
  cachedInterestPerShare_not?: Maybe<Scalars['BigDecimal']>;
  cachedInterestPerShare_gt?: Maybe<Scalars['BigDecimal']>;
  cachedInterestPerShare_lt?: Maybe<Scalars['BigDecimal']>;
  cachedInterestPerShare_gte?: Maybe<Scalars['BigDecimal']>;
  cachedInterestPerShare_lte?: Maybe<Scalars['BigDecimal']>;
  cachedInterestPerShare_in?: Maybe<Array<Scalars['BigDecimal']>>;
  cachedInterestPerShare_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum CachedInterestPerShare_OrderBy {
  Id = 'id',
  SealedDay = 'sealedDay',
  SealedCachedDay = 'sealedCachedDay',
  CachedInterestPerShare = 'cachedInterestPerShare'
}

export type DailySnapshot = {
  __typename?: 'DailySnapshot';
  id: Scalars['ID'];
  sealedDay: Scalars['BigInt'];
  inflationAmount: Scalars['BigDecimal'];
  totalShares: Scalars['BigDecimal'];
  sharePrice: Scalars['BigDecimal'];
  totalStaked: Scalars['BigDecimal'];
  totalSupply: Scalars['BigDecimal'];
};

export type DailySnapshot_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  sealedDay?: Maybe<Scalars['BigInt']>;
  sealedDay_not?: Maybe<Scalars['BigInt']>;
  sealedDay_gt?: Maybe<Scalars['BigInt']>;
  sealedDay_lt?: Maybe<Scalars['BigInt']>;
  sealedDay_gte?: Maybe<Scalars['BigInt']>;
  sealedDay_lte?: Maybe<Scalars['BigInt']>;
  sealedDay_in?: Maybe<Array<Scalars['BigInt']>>;
  sealedDay_not_in?: Maybe<Array<Scalars['BigInt']>>;
  inflationAmount?: Maybe<Scalars['BigDecimal']>;
  inflationAmount_not?: Maybe<Scalars['BigDecimal']>;
  inflationAmount_gt?: Maybe<Scalars['BigDecimal']>;
  inflationAmount_lt?: Maybe<Scalars['BigDecimal']>;
  inflationAmount_gte?: Maybe<Scalars['BigDecimal']>;
  inflationAmount_lte?: Maybe<Scalars['BigDecimal']>;
  inflationAmount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  inflationAmount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalShares?: Maybe<Scalars['BigDecimal']>;
  totalShares_not?: Maybe<Scalars['BigDecimal']>;
  totalShares_gt?: Maybe<Scalars['BigDecimal']>;
  totalShares_lt?: Maybe<Scalars['BigDecimal']>;
  totalShares_gte?: Maybe<Scalars['BigDecimal']>;
  totalShares_lte?: Maybe<Scalars['BigDecimal']>;
  totalShares_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalShares_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  sharePrice?: Maybe<Scalars['BigDecimal']>;
  sharePrice_not?: Maybe<Scalars['BigDecimal']>;
  sharePrice_gt?: Maybe<Scalars['BigDecimal']>;
  sharePrice_lt?: Maybe<Scalars['BigDecimal']>;
  sharePrice_gte?: Maybe<Scalars['BigDecimal']>;
  sharePrice_lte?: Maybe<Scalars['BigDecimal']>;
  sharePrice_in?: Maybe<Array<Scalars['BigDecimal']>>;
  sharePrice_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalStaked?: Maybe<Scalars['BigDecimal']>;
  totalStaked_not?: Maybe<Scalars['BigDecimal']>;
  totalStaked_gt?: Maybe<Scalars['BigDecimal']>;
  totalStaked_lt?: Maybe<Scalars['BigDecimal']>;
  totalStaked_gte?: Maybe<Scalars['BigDecimal']>;
  totalStaked_lte?: Maybe<Scalars['BigDecimal']>;
  totalStaked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalStaked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSupply?: Maybe<Scalars['BigDecimal']>;
  totalSupply_not?: Maybe<Scalars['BigDecimal']>;
  totalSupply_gt?: Maybe<Scalars['BigDecimal']>;
  totalSupply_lt?: Maybe<Scalars['BigDecimal']>;
  totalSupply_gte?: Maybe<Scalars['BigDecimal']>;
  totalSupply_lte?: Maybe<Scalars['BigDecimal']>;
  totalSupply_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum DailySnapshot_OrderBy {
  Id = 'id',
  SealedDay = 'sealedDay',
  InflationAmount = 'inflationAmount',
  TotalShares = 'totalShares',
  SharePrice = 'sharePrice',
  TotalStaked = 'totalStaked',
  TotalSupply = 'totalSupply'
}

export type Global = {
  __typename?: 'Global';
  id: Scalars['ID'];
  userCount: Scalars['BigInt'];
  stakeCount: Scalars['BigInt'];
  stakerCount: Scalars['BigInt'];
};

export type Global_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  userCount?: Maybe<Scalars['BigInt']>;
  userCount_not?: Maybe<Scalars['BigInt']>;
  userCount_gt?: Maybe<Scalars['BigInt']>;
  userCount_lt?: Maybe<Scalars['BigInt']>;
  userCount_gte?: Maybe<Scalars['BigInt']>;
  userCount_lte?: Maybe<Scalars['BigInt']>;
  userCount_in?: Maybe<Array<Scalars['BigInt']>>;
  userCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  stakeCount?: Maybe<Scalars['BigInt']>;
  stakeCount_not?: Maybe<Scalars['BigInt']>;
  stakeCount_gt?: Maybe<Scalars['BigInt']>;
  stakeCount_lt?: Maybe<Scalars['BigInt']>;
  stakeCount_gte?: Maybe<Scalars['BigInt']>;
  stakeCount_lte?: Maybe<Scalars['BigInt']>;
  stakeCount_in?: Maybe<Array<Scalars['BigInt']>>;
  stakeCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  stakerCount?: Maybe<Scalars['BigInt']>;
  stakerCount_not?: Maybe<Scalars['BigInt']>;
  stakerCount_gt?: Maybe<Scalars['BigInt']>;
  stakerCount_lt?: Maybe<Scalars['BigInt']>;
  stakerCount_gte?: Maybe<Scalars['BigInt']>;
  stakerCount_lte?: Maybe<Scalars['BigInt']>;
  stakerCount_in?: Maybe<Array<Scalars['BigInt']>>;
  stakerCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Global_OrderBy {
  Id = 'id',
  UserCount = 'userCount',
  StakeCount = 'stakeCount',
  StakerCount = 'stakerCount'
}

export type MaxSharePrice = {
  __typename?: 'MaxSharePrice';
  id: Scalars['ID'];
  sharePrice: Scalars['BigDecimal'];
};

export type MaxSharePrice_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  sharePrice?: Maybe<Scalars['BigDecimal']>;
  sharePrice_not?: Maybe<Scalars['BigDecimal']>;
  sharePrice_gt?: Maybe<Scalars['BigDecimal']>;
  sharePrice_lt?: Maybe<Scalars['BigDecimal']>;
  sharePrice_gte?: Maybe<Scalars['BigDecimal']>;
  sharePrice_lte?: Maybe<Scalars['BigDecimal']>;
  sharePrice_in?: Maybe<Array<Scalars['BigDecimal']>>;
  sharePrice_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum MaxSharePrice_OrderBy {
  Id = 'id',
  SharePrice = 'sharePrice'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users: Array<User>;
  global?: Maybe<Global>;
  globals: Array<Global>;
  maxSharePrice?: Maybe<MaxSharePrice>;
  maxSharePrices: Array<MaxSharePrice>;
  dailySnapshot?: Maybe<DailySnapshot>;
  dailySnapshots: Array<DailySnapshot>;
  cachedInterestPerShare?: Maybe<CachedInterestPerShare>;
  cachedInterestPerShares: Array<CachedInterestPerShare>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryUsersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<User_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryGlobalArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryGlobalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Global_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Global_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryMaxSharePriceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMaxSharePricesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MaxSharePrice_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MaxSharePrice_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryDailySnapshotArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryDailySnapshotsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DailySnapshot_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DailySnapshot_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryCachedInterestPerShareArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryCachedInterestPerSharesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CachedInterestPerShare_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CachedInterestPerShare_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryStakeArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryStakesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Stake_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Stake_Filter>;
  block?: Maybe<Block_Height>;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Stake = {
  __typename?: 'Stake';
  id: Scalars['ID'];
  owner: User;
  stakedAmount: Scalars['BigDecimal'];
  startDay: Scalars['BigInt'];
  lockDays: Scalars['BigInt'];
  endDay: Scalars['BigInt'];
  interest: Scalars['BigDecimal'];
  penalty: Scalars['BigDecimal'];
  sharesCount: Scalars['BigDecimal'];
  startTx?: Maybe<Scalars['Bytes']>;
  endTx?: Maybe<Scalars['Bytes']>;
  startedAt?: Maybe<Scalars['BigInt']>;
  completedAt?: Maybe<Scalars['BigInt']>;
  canceledAt?: Maybe<Scalars['BigInt']>;
  timestamp: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
  gasUsed: Scalars['BigInt'];
};

export type Stake_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  owner?: Maybe<Scalars['String']>;
  owner_not?: Maybe<Scalars['String']>;
  owner_gt?: Maybe<Scalars['String']>;
  owner_lt?: Maybe<Scalars['String']>;
  owner_gte?: Maybe<Scalars['String']>;
  owner_lte?: Maybe<Scalars['String']>;
  owner_in?: Maybe<Array<Scalars['String']>>;
  owner_not_in?: Maybe<Array<Scalars['String']>>;
  owner_contains?: Maybe<Scalars['String']>;
  owner_not_contains?: Maybe<Scalars['String']>;
  owner_starts_with?: Maybe<Scalars['String']>;
  owner_not_starts_with?: Maybe<Scalars['String']>;
  owner_ends_with?: Maybe<Scalars['String']>;
  owner_not_ends_with?: Maybe<Scalars['String']>;
  stakedAmount?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_not?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_gt?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_lt?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_gte?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_lte?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  stakedAmount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  startDay?: Maybe<Scalars['BigInt']>;
  startDay_not?: Maybe<Scalars['BigInt']>;
  startDay_gt?: Maybe<Scalars['BigInt']>;
  startDay_lt?: Maybe<Scalars['BigInt']>;
  startDay_gte?: Maybe<Scalars['BigInt']>;
  startDay_lte?: Maybe<Scalars['BigInt']>;
  startDay_in?: Maybe<Array<Scalars['BigInt']>>;
  startDay_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lockDays?: Maybe<Scalars['BigInt']>;
  lockDays_not?: Maybe<Scalars['BigInt']>;
  lockDays_gt?: Maybe<Scalars['BigInt']>;
  lockDays_lt?: Maybe<Scalars['BigInt']>;
  lockDays_gte?: Maybe<Scalars['BigInt']>;
  lockDays_lte?: Maybe<Scalars['BigInt']>;
  lockDays_in?: Maybe<Array<Scalars['BigInt']>>;
  lockDays_not_in?: Maybe<Array<Scalars['BigInt']>>;
  endDay?: Maybe<Scalars['BigInt']>;
  endDay_not?: Maybe<Scalars['BigInt']>;
  endDay_gt?: Maybe<Scalars['BigInt']>;
  endDay_lt?: Maybe<Scalars['BigInt']>;
  endDay_gte?: Maybe<Scalars['BigInt']>;
  endDay_lte?: Maybe<Scalars['BigInt']>;
  endDay_in?: Maybe<Array<Scalars['BigInt']>>;
  endDay_not_in?: Maybe<Array<Scalars['BigInt']>>;
  interest?: Maybe<Scalars['BigDecimal']>;
  interest_not?: Maybe<Scalars['BigDecimal']>;
  interest_gt?: Maybe<Scalars['BigDecimal']>;
  interest_lt?: Maybe<Scalars['BigDecimal']>;
  interest_gte?: Maybe<Scalars['BigDecimal']>;
  interest_lte?: Maybe<Scalars['BigDecimal']>;
  interest_in?: Maybe<Array<Scalars['BigDecimal']>>;
  interest_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  penalty?: Maybe<Scalars['BigDecimal']>;
  penalty_not?: Maybe<Scalars['BigDecimal']>;
  penalty_gt?: Maybe<Scalars['BigDecimal']>;
  penalty_lt?: Maybe<Scalars['BigDecimal']>;
  penalty_gte?: Maybe<Scalars['BigDecimal']>;
  penalty_lte?: Maybe<Scalars['BigDecimal']>;
  penalty_in?: Maybe<Array<Scalars['BigDecimal']>>;
  penalty_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  sharesCount?: Maybe<Scalars['BigDecimal']>;
  sharesCount_not?: Maybe<Scalars['BigDecimal']>;
  sharesCount_gt?: Maybe<Scalars['BigDecimal']>;
  sharesCount_lt?: Maybe<Scalars['BigDecimal']>;
  sharesCount_gte?: Maybe<Scalars['BigDecimal']>;
  sharesCount_lte?: Maybe<Scalars['BigDecimal']>;
  sharesCount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  sharesCount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  startTx?: Maybe<Scalars['Bytes']>;
  startTx_not?: Maybe<Scalars['Bytes']>;
  startTx_in?: Maybe<Array<Scalars['Bytes']>>;
  startTx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  startTx_contains?: Maybe<Scalars['Bytes']>;
  startTx_not_contains?: Maybe<Scalars['Bytes']>;
  endTx?: Maybe<Scalars['Bytes']>;
  endTx_not?: Maybe<Scalars['Bytes']>;
  endTx_in?: Maybe<Array<Scalars['Bytes']>>;
  endTx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  endTx_contains?: Maybe<Scalars['Bytes']>;
  endTx_not_contains?: Maybe<Scalars['Bytes']>;
  startedAt?: Maybe<Scalars['BigInt']>;
  startedAt_not?: Maybe<Scalars['BigInt']>;
  startedAt_gt?: Maybe<Scalars['BigInt']>;
  startedAt_lt?: Maybe<Scalars['BigInt']>;
  startedAt_gte?: Maybe<Scalars['BigInt']>;
  startedAt_lte?: Maybe<Scalars['BigInt']>;
  startedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  startedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  completedAt?: Maybe<Scalars['BigInt']>;
  completedAt_not?: Maybe<Scalars['BigInt']>;
  completedAt_gt?: Maybe<Scalars['BigInt']>;
  completedAt_lt?: Maybe<Scalars['BigInt']>;
  completedAt_gte?: Maybe<Scalars['BigInt']>;
  completedAt_lte?: Maybe<Scalars['BigInt']>;
  completedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  completedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  canceledAt?: Maybe<Scalars['BigInt']>;
  canceledAt_not?: Maybe<Scalars['BigInt']>;
  canceledAt_gt?: Maybe<Scalars['BigInt']>;
  canceledAt_lt?: Maybe<Scalars['BigInt']>;
  canceledAt_gte?: Maybe<Scalars['BigInt']>;
  canceledAt_lte?: Maybe<Scalars['BigInt']>;
  canceledAt_in?: Maybe<Array<Scalars['BigInt']>>;
  canceledAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasPrice_not?: Maybe<Scalars['BigInt']>;
  gasPrice_gt?: Maybe<Scalars['BigInt']>;
  gasPrice_lt?: Maybe<Scalars['BigInt']>;
  gasPrice_gte?: Maybe<Scalars['BigInt']>;
  gasPrice_lte?: Maybe<Scalars['BigInt']>;
  gasPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed?: Maybe<Scalars['BigInt']>;
  gasUsed_not?: Maybe<Scalars['BigInt']>;
  gasUsed_gt?: Maybe<Scalars['BigInt']>;
  gasUsed_lt?: Maybe<Scalars['BigInt']>;
  gasUsed_gte?: Maybe<Scalars['BigInt']>;
  gasUsed_lte?: Maybe<Scalars['BigInt']>;
  gasUsed_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Stake_OrderBy {
  Id = 'id',
  Owner = 'owner',
  StakedAmount = 'stakedAmount',
  StartDay = 'startDay',
  LockDays = 'lockDays',
  EndDay = 'endDay',
  Interest = 'interest',
  Penalty = 'penalty',
  SharesCount = 'sharesCount',
  StartTx = 'startTx',
  EndTx = 'endTx',
  StartedAt = 'startedAt',
  CompletedAt = 'completedAt',
  CanceledAt = 'canceledAt',
  Timestamp = 'timestamp',
  BlockNumber = 'blockNumber',
  GasPrice = 'gasPrice',
  GasUsed = 'gasUsed'
}

export type Subscription = {
  __typename?: 'Subscription';
  user?: Maybe<User>;
  users: Array<User>;
  global?: Maybe<Global>;
  globals: Array<Global>;
  maxSharePrice?: Maybe<MaxSharePrice>;
  maxSharePrices: Array<MaxSharePrice>;
  dailySnapshot?: Maybe<DailySnapshot>;
  dailySnapshots: Array<DailySnapshot>;
  cachedInterestPerShare?: Maybe<CachedInterestPerShare>;
  cachedInterestPerShares: Array<CachedInterestPerShare>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionUserArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionUsersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<User_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionGlobalArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionGlobalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Global_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Global_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionMaxSharePriceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMaxSharePricesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MaxSharePrice_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MaxSharePrice_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionDailySnapshotArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionDailySnapshotsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DailySnapshot_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DailySnapshot_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionCachedInterestPerShareArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionCachedInterestPerSharesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CachedInterestPerShare_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CachedInterestPerShare_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionStakeArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionStakesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Stake_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Stake_Filter>;
  block?: Maybe<Block_Height>;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  stakedAmount: Scalars['BigDecimal'];
  stakes: Array<Stake>;
};


export type UserStakesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Stake_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Stake_Filter>;
};

export type User_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  stakedAmount?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_not?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_gt?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_lt?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_gte?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_lte?: Maybe<Scalars['BigDecimal']>;
  stakedAmount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  stakedAmount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum User_OrderBy {
  Id = 'id',
  StakedAmount = 'stakedAmount',
  Stakes = 'stakes'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
export type ResolversTypes = {
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Block_height: Block_Height;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  CachedInterestPerShare: ResolverTypeWrapper<CachedInterestPerShare>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CachedInterestPerShare_filter: CachedInterestPerShare_Filter;
  CachedInterestPerShare_orderBy: CachedInterestPerShare_OrderBy;
  DailySnapshot: ResolverTypeWrapper<DailySnapshot>;
  DailySnapshot_filter: DailySnapshot_Filter;
  DailySnapshot_orderBy: DailySnapshot_OrderBy;
  Global: ResolverTypeWrapper<Global>;
  Global_filter: Global_Filter;
  Global_orderBy: Global_OrderBy;
  MaxSharePrice: ResolverTypeWrapper<MaxSharePrice>;
  MaxSharePrice_filter: MaxSharePrice_Filter;
  MaxSharePrice_orderBy: MaxSharePrice_OrderBy;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  Stake: ResolverTypeWrapper<Stake>;
  Stake_filter: Stake_Filter;
  String: ResolverTypeWrapper<Scalars['String']>;
  Stake_orderBy: Stake_OrderBy;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  User_filter: User_Filter;
  User_orderBy: User_OrderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  Block_height: Block_Height;
  Int: Scalars['Int'];
  Bytes: Scalars['Bytes'];
  CachedInterestPerShare: CachedInterestPerShare;
  ID: Scalars['ID'];
  CachedInterestPerShare_filter: CachedInterestPerShare_Filter;
  DailySnapshot: DailySnapshot;
  DailySnapshot_filter: DailySnapshot_Filter;
  Global: Global;
  Global_filter: Global_Filter;
  MaxSharePrice: MaxSharePrice;
  MaxSharePrice_filter: MaxSharePrice_Filter;
  Query: {};
  Stake: Stake;
  Stake_filter: Stake_Filter;
  String: Scalars['String'];
  Subscription: {};
  User: User;
  User_filter: User_Filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
  Boolean: Scalars['Boolean'];
};

export type DerivedFromDirectiveArgs = {   field?: Maybe<Scalars['String']>; };

export type DerivedFromDirectiveResolver<Result, Parent, ContextType = any, Args = DerivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {  };

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SubgraphIdDirectiveArgs = {   id?: Maybe<Scalars['String']>; };

export type SubgraphIdDirectiveResolver<Result, Parent, ContextType = any, Args = SubgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type CachedInterestPerShareResolvers<ContextType = any, ParentType extends ResolversParentTypes['CachedInterestPerShare'] = ResolversParentTypes['CachedInterestPerShare']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sealedDay?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  sealedCachedDay?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cachedInterestPerShare?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DailySnapshotResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailySnapshot'] = ResolversParentTypes['DailySnapshot']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sealedDay?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  inflationAmount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  totalShares?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  sharePrice?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  totalStaked?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GlobalResolvers<ContextType = any, ParentType extends ResolversParentTypes['Global'] = ResolversParentTypes['Global']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  stakeCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  stakerCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MaxSharePriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['MaxSharePrice'] = ResolversParentTypes['MaxSharePrice']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sharePrice?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'skip' | 'first'>>;
  global?: Resolver<Maybe<ResolversTypes['Global']>, ParentType, ContextType, RequireFields<QueryGlobalArgs, 'id'>>;
  globals?: Resolver<Array<ResolversTypes['Global']>, ParentType, ContextType, RequireFields<QueryGlobalsArgs, 'skip' | 'first'>>;
  maxSharePrice?: Resolver<Maybe<ResolversTypes['MaxSharePrice']>, ParentType, ContextType, RequireFields<QueryMaxSharePriceArgs, 'id'>>;
  maxSharePrices?: Resolver<Array<ResolversTypes['MaxSharePrice']>, ParentType, ContextType, RequireFields<QueryMaxSharePricesArgs, 'skip' | 'first'>>;
  dailySnapshot?: Resolver<Maybe<ResolversTypes['DailySnapshot']>, ParentType, ContextType, RequireFields<QueryDailySnapshotArgs, 'id'>>;
  dailySnapshots?: Resolver<Array<ResolversTypes['DailySnapshot']>, ParentType, ContextType, RequireFields<QueryDailySnapshotsArgs, 'skip' | 'first'>>;
  cachedInterestPerShare?: Resolver<Maybe<ResolversTypes['CachedInterestPerShare']>, ParentType, ContextType, RequireFields<QueryCachedInterestPerShareArgs, 'id'>>;
  cachedInterestPerShares?: Resolver<Array<ResolversTypes['CachedInterestPerShare']>, ParentType, ContextType, RequireFields<QueryCachedInterestPerSharesArgs, 'skip' | 'first'>>;
  stake?: Resolver<Maybe<ResolversTypes['Stake']>, ParentType, ContextType, RequireFields<QueryStakeArgs, 'id'>>;
  stakes?: Resolver<Array<ResolversTypes['Stake']>, ParentType, ContextType, RequireFields<QueryStakesArgs, 'skip' | 'first'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, RequireFields<Query_MetaArgs, never>>;
};

export type StakeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Stake'] = ResolversParentTypes['Stake']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  stakedAmount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  startDay?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lockDays?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  endDay?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  interest?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  penalty?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  sharesCount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  startTx?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  endTx?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  canceledAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  gasPrice?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  gasUsed?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  user?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "user", ParentType, ContextType, RequireFields<SubscriptionUserArgs, 'id'>>;
  users?: SubscriptionResolver<Array<ResolversTypes['User']>, "users", ParentType, ContextType, RequireFields<SubscriptionUsersArgs, 'skip' | 'first'>>;
  global?: SubscriptionResolver<Maybe<ResolversTypes['Global']>, "global", ParentType, ContextType, RequireFields<SubscriptionGlobalArgs, 'id'>>;
  globals?: SubscriptionResolver<Array<ResolversTypes['Global']>, "globals", ParentType, ContextType, RequireFields<SubscriptionGlobalsArgs, 'skip' | 'first'>>;
  maxSharePrice?: SubscriptionResolver<Maybe<ResolversTypes['MaxSharePrice']>, "maxSharePrice", ParentType, ContextType, RequireFields<SubscriptionMaxSharePriceArgs, 'id'>>;
  maxSharePrices?: SubscriptionResolver<Array<ResolversTypes['MaxSharePrice']>, "maxSharePrices", ParentType, ContextType, RequireFields<SubscriptionMaxSharePricesArgs, 'skip' | 'first'>>;
  dailySnapshot?: SubscriptionResolver<Maybe<ResolversTypes['DailySnapshot']>, "dailySnapshot", ParentType, ContextType, RequireFields<SubscriptionDailySnapshotArgs, 'id'>>;
  dailySnapshots?: SubscriptionResolver<Array<ResolversTypes['DailySnapshot']>, "dailySnapshots", ParentType, ContextType, RequireFields<SubscriptionDailySnapshotsArgs, 'skip' | 'first'>>;
  cachedInterestPerShare?: SubscriptionResolver<Maybe<ResolversTypes['CachedInterestPerShare']>, "cachedInterestPerShare", ParentType, ContextType, RequireFields<SubscriptionCachedInterestPerShareArgs, 'id'>>;
  cachedInterestPerShares?: SubscriptionResolver<Array<ResolversTypes['CachedInterestPerShare']>, "cachedInterestPerShares", ParentType, ContextType, RequireFields<SubscriptionCachedInterestPerSharesArgs, 'skip' | 'first'>>;
  stake?: SubscriptionResolver<Maybe<ResolversTypes['Stake']>, "stake", ParentType, ContextType, RequireFields<SubscriptionStakeArgs, 'id'>>;
  stakes?: SubscriptionResolver<Array<ResolversTypes['Stake']>, "stakes", ParentType, ContextType, RequireFields<SubscriptionStakesArgs, 'skip' | 'first'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, RequireFields<Subscription_MetaArgs, never>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  stakedAmount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  stakes?: Resolver<Array<ResolversTypes['Stake']>, ParentType, ContextType, RequireFields<UserStakesArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _Block_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = {
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _Meta_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = {
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  CachedInterestPerShare?: CachedInterestPerShareResolvers<ContextType>;
  DailySnapshot?: DailySnapshotResolvers<ContextType>;
  Global?: GlobalResolvers<ContextType>;
  MaxSharePrice?: MaxSharePriceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Stake?: StakeResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  derivedFrom?: DerivedFromDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  subgraphId?: SubgraphIdDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;
export type StakedAmountQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type StakedAmountQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'stakedAmount'>
  )> }
);

export type StakesQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type StakesQuery = (
  { __typename?: 'Query' }
  & { stakes: Array<(
    { __typename?: 'Stake' }
    & Pick<Stake, 'id' | 'startedAt' | 'canceledAt' | 'completedAt' | 'startTx' | 'endTx' | 'startDay' | 'lockDays' | 'endDay' | 'interest' | 'stakedAmount' | 'sharesCount'>
    & { owner: (
      { __typename?: 'User' }
      & Pick<User, 'id'>
    ) }
  )> }
);

export type MaxSharePriceQueryVariables = Exact<{ [key: string]: never; }>;


export type MaxSharePriceQuery = (
  { __typename?: 'Query' }
  & { maxSharePrice?: Maybe<(
    { __typename?: 'MaxSharePrice' }
    & Pick<MaxSharePrice, 'id' | 'sharePrice'>
  )> }
);

export type SnapshotsAndInterestQueryVariables = Exact<{ [key: string]: never; }>;


export type SnapshotsAndInterestQuery = (
  { __typename?: 'Query' }
  & { cachedInterestPerShares: Array<(
    { __typename?: 'CachedInterestPerShare' }
    & Pick<CachedInterestPerShare, 'id' | 'sealedDay' | 'sealedCachedDay' | 'cachedInterestPerShare'>
  )>, dailySnapshots: Array<(
    { __typename?: 'DailySnapshot' }
    & Pick<DailySnapshot, 'id' | 'sealedDay' | 'inflationAmount' | 'totalShares' | 'sharePrice' | 'totalStaked' | 'totalSupply'>
  )> }
);

export type StakeQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StakeQuery = (
  { __typename?: 'Query' }
  & { stakes: Array<(
    { __typename?: 'Stake' }
    & Pick<Stake, 'id'>
  )> }
);


export const StakedAmountDocument = gql`
    query StakedAmount($address: ID!) {
  user(id: $address) {
    id
    stakedAmount
  }
}
    `;

/**
 * __useStakedAmountQuery__
 *
 * To run a query within a React component, call `useStakedAmountQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakedAmountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakedAmountQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useStakedAmountQuery(baseOptions: Apollo.QueryHookOptions<StakedAmountQuery, StakedAmountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StakedAmountQuery, StakedAmountQueryVariables>(StakedAmountDocument, options);
      }
export function useStakedAmountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StakedAmountQuery, StakedAmountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StakedAmountQuery, StakedAmountQueryVariables>(StakedAmountDocument, options);
        }
export type StakedAmountQueryHookResult = ReturnType<typeof useStakedAmountQuery>;
export type StakedAmountLazyQueryHookResult = ReturnType<typeof useStakedAmountLazyQuery>;
export type StakedAmountQueryResult = Apollo.QueryResult<StakedAmountQuery, StakedAmountQueryVariables>;
export const StakesDocument = gql`
    query Stakes($address: String!) {
  stakes(
    orderBy: startedAt
    orderDirection: desc
    where: {owner: $address}
    first: 950
  ) {
    id
    startedAt
    canceledAt
    completedAt
    startTx
    endTx
    owner {
      id
    }
    startDay
    lockDays
    endDay
    interest
    stakedAmount
    sharesCount
  }
}
    `;

/**
 * __useStakesQuery__
 *
 * To run a query within a React component, call `useStakesQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useStakesQuery(baseOptions: Apollo.QueryHookOptions<StakesQuery, StakesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StakesQuery, StakesQueryVariables>(StakesDocument, options);
      }
export function useStakesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StakesQuery, StakesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StakesQuery, StakesQueryVariables>(StakesDocument, options);
        }
export type StakesQueryHookResult = ReturnType<typeof useStakesQuery>;
export type StakesLazyQueryHookResult = ReturnType<typeof useStakesLazyQuery>;
export type StakesQueryResult = Apollo.QueryResult<StakesQuery, StakesQueryVariables>;
export const MaxSharePriceDocument = gql`
    query maxSharePrice {
  maxSharePrice(id: 0) {
    id
    sharePrice
  }
}
    `;

/**
 * __useMaxSharePriceQuery__
 *
 * To run a query within a React component, call `useMaxSharePriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useMaxSharePriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMaxSharePriceQuery({
 *   variables: {
 *   },
 * });
 */
export function useMaxSharePriceQuery(baseOptions?: Apollo.QueryHookOptions<MaxSharePriceQuery, MaxSharePriceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MaxSharePriceQuery, MaxSharePriceQueryVariables>(MaxSharePriceDocument, options);
      }
export function useMaxSharePriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MaxSharePriceQuery, MaxSharePriceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MaxSharePriceQuery, MaxSharePriceQueryVariables>(MaxSharePriceDocument, options);
        }
export type MaxSharePriceQueryHookResult = ReturnType<typeof useMaxSharePriceQuery>;
export type MaxSharePriceLazyQueryHookResult = ReturnType<typeof useMaxSharePriceLazyQuery>;
export type MaxSharePriceQueryResult = Apollo.QueryResult<MaxSharePriceQuery, MaxSharePriceQueryVariables>;
export const SnapshotsAndInterestDocument = gql`
    query SnapshotsAndInterest {
  cachedInterestPerShares(first: 1000, orderDirection: asc, orderBy: sealedDay) {
    id
    sealedDay
    sealedCachedDay
    cachedInterestPerShare
  }
  dailySnapshots(first: 1000, orderDirection: asc, orderBy: sealedDay) {
    id
    sealedDay
    inflationAmount
    totalShares
    sharePrice
    totalStaked
    totalSupply
  }
}
    `;

/**
 * __useSnapshotsAndInterestQuery__
 *
 * To run a query within a React component, call `useSnapshotsAndInterestQuery` and pass it any options that fit your needs.
 * When your component renders, `useSnapshotsAndInterestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSnapshotsAndInterestQuery({
 *   variables: {
 *   },
 * });
 */
export function useSnapshotsAndInterestQuery(baseOptions?: Apollo.QueryHookOptions<SnapshotsAndInterestQuery, SnapshotsAndInterestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SnapshotsAndInterestQuery, SnapshotsAndInterestQueryVariables>(SnapshotsAndInterestDocument, options);
      }
export function useSnapshotsAndInterestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SnapshotsAndInterestQuery, SnapshotsAndInterestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SnapshotsAndInterestQuery, SnapshotsAndInterestQueryVariables>(SnapshotsAndInterestDocument, options);
        }
export type SnapshotsAndInterestQueryHookResult = ReturnType<typeof useSnapshotsAndInterestQuery>;
export type SnapshotsAndInterestLazyQueryHookResult = ReturnType<typeof useSnapshotsAndInterestLazyQuery>;
export type SnapshotsAndInterestQueryResult = Apollo.QueryResult<SnapshotsAndInterestQuery, SnapshotsAndInterestQueryVariables>;
export const StakeDocument = gql`
    query Stake($id: ID!) {
  stakes(where: {id: $id}) {
    id
  }
}
    `;

/**
 * __useStakeQuery__
 *
 * To run a query within a React component, call `useStakeQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStakeQuery(baseOptions: Apollo.QueryHookOptions<StakeQuery, StakeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StakeQuery, StakeQueryVariables>(StakeDocument, options);
      }
export function useStakeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StakeQuery, StakeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StakeQuery, StakeQueryVariables>(StakeDocument, options);
        }
export type StakeQueryHookResult = ReturnType<typeof useStakeQuery>;
export type StakeLazyQueryHookResult = ReturnType<typeof useStakeLazyQuery>;
export type StakeQueryResult = Apollo.QueryResult<StakeQuery, StakeQueryVariables>;