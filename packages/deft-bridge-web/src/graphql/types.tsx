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

export type BridgeTransfer = {
  __typename?: 'BridgeTransfer';
  id: Scalars['ID'];
  status: TransferStatus;
};

export type BridgeTransfer_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  status?: Maybe<TransferStatus>;
  status_not?: Maybe<TransferStatus>;
};

export enum BridgeTransfer_OrderBy {
  Id = 'id',
  Status = 'status'
}


export type Global = {
  __typename?: 'Global';
  id: Scalars['ID'];
  approvedCount: Scalars['BigInt'];
  mintedCount: Scalars['BigInt'];
  mintedAmount: Scalars['BigDecimal'];
  burnedCount: Scalars['BigInt'];
  burnedAmount: Scalars['BigDecimal'];
  chargedFee: Scalars['BigDecimal'];
  recentApprovedProof: Scalars['String'];
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
  approvedCount?: Maybe<Scalars['BigInt']>;
  approvedCount_not?: Maybe<Scalars['BigInt']>;
  approvedCount_gt?: Maybe<Scalars['BigInt']>;
  approvedCount_lt?: Maybe<Scalars['BigInt']>;
  approvedCount_gte?: Maybe<Scalars['BigInt']>;
  approvedCount_lte?: Maybe<Scalars['BigInt']>;
  approvedCount_in?: Maybe<Array<Scalars['BigInt']>>;
  approvedCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  mintedCount?: Maybe<Scalars['BigInt']>;
  mintedCount_not?: Maybe<Scalars['BigInt']>;
  mintedCount_gt?: Maybe<Scalars['BigInt']>;
  mintedCount_lt?: Maybe<Scalars['BigInt']>;
  mintedCount_gte?: Maybe<Scalars['BigInt']>;
  mintedCount_lte?: Maybe<Scalars['BigInt']>;
  mintedCount_in?: Maybe<Array<Scalars['BigInt']>>;
  mintedCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  mintedAmount?: Maybe<Scalars['BigDecimal']>;
  mintedAmount_not?: Maybe<Scalars['BigDecimal']>;
  mintedAmount_gt?: Maybe<Scalars['BigDecimal']>;
  mintedAmount_lt?: Maybe<Scalars['BigDecimal']>;
  mintedAmount_gte?: Maybe<Scalars['BigDecimal']>;
  mintedAmount_lte?: Maybe<Scalars['BigDecimal']>;
  mintedAmount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  mintedAmount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  burnedCount?: Maybe<Scalars['BigInt']>;
  burnedCount_not?: Maybe<Scalars['BigInt']>;
  burnedCount_gt?: Maybe<Scalars['BigInt']>;
  burnedCount_lt?: Maybe<Scalars['BigInt']>;
  burnedCount_gte?: Maybe<Scalars['BigInt']>;
  burnedCount_lte?: Maybe<Scalars['BigInt']>;
  burnedCount_in?: Maybe<Array<Scalars['BigInt']>>;
  burnedCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  burnedAmount?: Maybe<Scalars['BigDecimal']>;
  burnedAmount_not?: Maybe<Scalars['BigDecimal']>;
  burnedAmount_gt?: Maybe<Scalars['BigDecimal']>;
  burnedAmount_lt?: Maybe<Scalars['BigDecimal']>;
  burnedAmount_gte?: Maybe<Scalars['BigDecimal']>;
  burnedAmount_lte?: Maybe<Scalars['BigDecimal']>;
  burnedAmount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  burnedAmount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  chargedFee?: Maybe<Scalars['BigDecimal']>;
  chargedFee_not?: Maybe<Scalars['BigDecimal']>;
  chargedFee_gt?: Maybe<Scalars['BigDecimal']>;
  chargedFee_lt?: Maybe<Scalars['BigDecimal']>;
  chargedFee_gte?: Maybe<Scalars['BigDecimal']>;
  chargedFee_lte?: Maybe<Scalars['BigDecimal']>;
  chargedFee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  chargedFee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  recentApprovedProof?: Maybe<Scalars['String']>;
  recentApprovedProof_not?: Maybe<Scalars['String']>;
  recentApprovedProof_gt?: Maybe<Scalars['String']>;
  recentApprovedProof_lt?: Maybe<Scalars['String']>;
  recentApprovedProof_gte?: Maybe<Scalars['String']>;
  recentApprovedProof_lte?: Maybe<Scalars['String']>;
  recentApprovedProof_in?: Maybe<Array<Scalars['String']>>;
  recentApprovedProof_not_in?: Maybe<Array<Scalars['String']>>;
  recentApprovedProof_contains?: Maybe<Scalars['String']>;
  recentApprovedProof_not_contains?: Maybe<Scalars['String']>;
  recentApprovedProof_starts_with?: Maybe<Scalars['String']>;
  recentApprovedProof_not_starts_with?: Maybe<Scalars['String']>;
  recentApprovedProof_ends_with?: Maybe<Scalars['String']>;
  recentApprovedProof_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Global_OrderBy {
  Id = 'id',
  ApprovedCount = 'approvedCount',
  MintedCount = 'mintedCount',
  MintedAmount = 'mintedAmount',
  BurnedCount = 'burnedCount',
  BurnedAmount = 'burnedAmount',
  ChargedFee = 'chargedFee',
  RecentApprovedProof = 'recentApprovedProof'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Proof = {
  __typename?: 'Proof';
  id: Scalars['ID'];
  type: ProofType;
  nonce?: Maybe<Scalars['BigInt']>;
  src?: Maybe<Scalars['BigInt']>;
  dest?: Maybe<Scalars['BigInt']>;
  token: Scalars['String'];
  sender: Scalars['Bytes'];
  amount: Scalars['BigDecimal'];
  amountAsFee: Scalars['BigDecimal'];
  fee: Scalars['BigDecimal'];
  txFee: Scalars['BigDecimal'];
  txHash: Scalars['Bytes'];
  logIndex: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
};

export enum ProofType {
  Mint = 'Mint',
  Burn = 'Burn'
}

export type Proof_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  type?: Maybe<ProofType>;
  type_not?: Maybe<ProofType>;
  nonce?: Maybe<Scalars['BigInt']>;
  nonce_not?: Maybe<Scalars['BigInt']>;
  nonce_gt?: Maybe<Scalars['BigInt']>;
  nonce_lt?: Maybe<Scalars['BigInt']>;
  nonce_gte?: Maybe<Scalars['BigInt']>;
  nonce_lte?: Maybe<Scalars['BigInt']>;
  nonce_in?: Maybe<Array<Scalars['BigInt']>>;
  nonce_not_in?: Maybe<Array<Scalars['BigInt']>>;
  src?: Maybe<Scalars['BigInt']>;
  src_not?: Maybe<Scalars['BigInt']>;
  src_gt?: Maybe<Scalars['BigInt']>;
  src_lt?: Maybe<Scalars['BigInt']>;
  src_gte?: Maybe<Scalars['BigInt']>;
  src_lte?: Maybe<Scalars['BigInt']>;
  src_in?: Maybe<Array<Scalars['BigInt']>>;
  src_not_in?: Maybe<Array<Scalars['BigInt']>>;
  dest?: Maybe<Scalars['BigInt']>;
  dest_not?: Maybe<Scalars['BigInt']>;
  dest_gt?: Maybe<Scalars['BigInt']>;
  dest_lt?: Maybe<Scalars['BigInt']>;
  dest_gte?: Maybe<Scalars['BigInt']>;
  dest_lte?: Maybe<Scalars['BigInt']>;
  dest_in?: Maybe<Array<Scalars['BigInt']>>;
  dest_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigDecimal']>;
  amount_not?: Maybe<Scalars['BigDecimal']>;
  amount_gt?: Maybe<Scalars['BigDecimal']>;
  amount_lt?: Maybe<Scalars['BigDecimal']>;
  amount_gte?: Maybe<Scalars['BigDecimal']>;
  amount_lte?: Maybe<Scalars['BigDecimal']>;
  amount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountAsFee?: Maybe<Scalars['BigDecimal']>;
  amountAsFee_not?: Maybe<Scalars['BigDecimal']>;
  amountAsFee_gt?: Maybe<Scalars['BigDecimal']>;
  amountAsFee_lt?: Maybe<Scalars['BigDecimal']>;
  amountAsFee_gte?: Maybe<Scalars['BigDecimal']>;
  amountAsFee_lte?: Maybe<Scalars['BigDecimal']>;
  amountAsFee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountAsFee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  fee?: Maybe<Scalars['BigDecimal']>;
  fee_not?: Maybe<Scalars['BigDecimal']>;
  fee_gt?: Maybe<Scalars['BigDecimal']>;
  fee_lt?: Maybe<Scalars['BigDecimal']>;
  fee_gte?: Maybe<Scalars['BigDecimal']>;
  fee_lte?: Maybe<Scalars['BigDecimal']>;
  fee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  fee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txFee?: Maybe<Scalars['BigDecimal']>;
  txFee_not?: Maybe<Scalars['BigDecimal']>;
  txFee_gt?: Maybe<Scalars['BigDecimal']>;
  txFee_lt?: Maybe<Scalars['BigDecimal']>;
  txFee_gte?: Maybe<Scalars['BigDecimal']>;
  txFee_lte?: Maybe<Scalars['BigDecimal']>;
  txFee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txFee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txHash?: Maybe<Scalars['Bytes']>;
  txHash_not?: Maybe<Scalars['Bytes']>;
  txHash_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_contains?: Maybe<Scalars['Bytes']>;
  txHash_not_contains?: Maybe<Scalars['Bytes']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  logIndex_not?: Maybe<Scalars['BigInt']>;
  logIndex_gt?: Maybe<Scalars['BigInt']>;
  logIndex_lt?: Maybe<Scalars['BigInt']>;
  logIndex_gte?: Maybe<Scalars['BigInt']>;
  logIndex_lte?: Maybe<Scalars['BigInt']>;
  logIndex_in?: Maybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Proof_OrderBy {
  Id = 'id',
  Type = 'type',
  Nonce = 'nonce',
  Src = 'src',
  Dest = 'dest',
  Token = 'token',
  Sender = 'sender',
  Amount = 'amount',
  AmountAsFee = 'amountAsFee',
  Fee = 'fee',
  TxFee = 'txFee',
  TxHash = 'txHash',
  LogIndex = 'logIndex',
  BlockNumber = 'blockNumber',
  Timestamp = 'timestamp'
}

export type Query = {
  __typename?: 'Query';
  proof?: Maybe<Proof>;
  proofs: Array<Proof>;
  bridgeTransfer?: Maybe<BridgeTransfer>;
  bridgeTransfers: Array<BridgeTransfer>;
  global?: Maybe<Global>;
  globals: Array<Global>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryProofArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryProofsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Proof_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Proof_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBridgeTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBridgeTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeTransfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeTransfer_Filter>;
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


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Subscription = {
  __typename?: 'Subscription';
  proof?: Maybe<Proof>;
  proofs: Array<Proof>;
  bridgeTransfer?: Maybe<BridgeTransfer>;
  bridgeTransfers: Array<BridgeTransfer>;
  global?: Maybe<Global>;
  globals: Array<Global>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionProofArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionProofsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Proof_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Proof_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBridgeTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBridgeTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeTransfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeTransfer_Filter>;
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


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export enum TransferStatus {
  Created = 'Created',
  Burned = 'Burned',
  Approved = 'Approved',
  Executed = 'Executed'
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
  BridgeTransfer: ResolverTypeWrapper<BridgeTransfer>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  BridgeTransfer_filter: BridgeTransfer_Filter;
  BridgeTransfer_orderBy: BridgeTransfer_OrderBy;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Global: ResolverTypeWrapper<Global>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Global_filter: Global_Filter;
  Global_orderBy: Global_OrderBy;
  OrderDirection: OrderDirection;
  Proof: ResolverTypeWrapper<Proof>;
  ProofType: ProofType;
  Proof_filter: Proof_Filter;
  Proof_orderBy: Proof_OrderBy;
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  TransferStatus: TransferStatus;
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
  BridgeTransfer: BridgeTransfer;
  ID: Scalars['ID'];
  BridgeTransfer_filter: BridgeTransfer_Filter;
  Bytes: Scalars['Bytes'];
  Global: Global;
  String: Scalars['String'];
  Global_filter: Global_Filter;
  Proof: Proof;
  Proof_filter: Proof_Filter;
  Query: {};
  Subscription: {};
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

export type BridgeTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['BridgeTransfer'] = ResolversParentTypes['BridgeTransfer']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TransferStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type GlobalResolvers<ContextType = any, ParentType extends ResolversParentTypes['Global'] = ResolversParentTypes['Global']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  approvedCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  mintedCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  mintedAmount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  burnedCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  burnedAmount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  chargedFee?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  recentApprovedProof?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProofResolvers<ContextType = any, ParentType extends ResolversParentTypes['Proof'] = ResolversParentTypes['Proof']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ProofType'], ParentType, ContextType>;
  nonce?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  src?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  dest?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  amountAsFee?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  fee?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  txFee?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  logIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  proof?: Resolver<Maybe<ResolversTypes['Proof']>, ParentType, ContextType, RequireFields<QueryProofArgs, 'id'>>;
  proofs?: Resolver<Array<ResolversTypes['Proof']>, ParentType, ContextType, RequireFields<QueryProofsArgs, 'skip' | 'first'>>;
  bridgeTransfer?: Resolver<Maybe<ResolversTypes['BridgeTransfer']>, ParentType, ContextType, RequireFields<QueryBridgeTransferArgs, 'id'>>;
  bridgeTransfers?: Resolver<Array<ResolversTypes['BridgeTransfer']>, ParentType, ContextType, RequireFields<QueryBridgeTransfersArgs, 'skip' | 'first'>>;
  global?: Resolver<Maybe<ResolversTypes['Global']>, ParentType, ContextType, RequireFields<QueryGlobalArgs, 'id'>>;
  globals?: Resolver<Array<ResolversTypes['Global']>, ParentType, ContextType, RequireFields<QueryGlobalsArgs, 'skip' | 'first'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, RequireFields<Query_MetaArgs, never>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  proof?: SubscriptionResolver<Maybe<ResolversTypes['Proof']>, "proof", ParentType, ContextType, RequireFields<SubscriptionProofArgs, 'id'>>;
  proofs?: SubscriptionResolver<Array<ResolversTypes['Proof']>, "proofs", ParentType, ContextType, RequireFields<SubscriptionProofsArgs, 'skip' | 'first'>>;
  bridgeTransfer?: SubscriptionResolver<Maybe<ResolversTypes['BridgeTransfer']>, "bridgeTransfer", ParentType, ContextType, RequireFields<SubscriptionBridgeTransferArgs, 'id'>>;
  bridgeTransfers?: SubscriptionResolver<Array<ResolversTypes['BridgeTransfer']>, "bridgeTransfers", ParentType, ContextType, RequireFields<SubscriptionBridgeTransfersArgs, 'skip' | 'first'>>;
  global?: SubscriptionResolver<Maybe<ResolversTypes['Global']>, "global", ParentType, ContextType, RequireFields<SubscriptionGlobalArgs, 'id'>>;
  globals?: SubscriptionResolver<Array<ResolversTypes['Global']>, "globals", ParentType, ContextType, RequireFields<SubscriptionGlobalsArgs, 'skip' | 'first'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, RequireFields<Subscription_MetaArgs, never>>;
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
  BridgeTransfer?: BridgeTransferResolvers<ContextType>;
  Bytes?: GraphQLScalarType;
  Global?: GlobalResolvers<ContextType>;
  Proof?: ProofResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
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
export type MetaBlockNumberQueryVariables = Exact<{ [key: string]: never; }>;


export type MetaBlockNumberQuery = (
  { __typename?: 'Query' }
  & { _meta?: Maybe<(
    { __typename?: '_Meta_' }
    & { block: (
      { __typename?: '_Block_' }
      & Pick<_Block_, 'number'>
    ) }
  )> }
);

export type ProofByTxHashQueryVariables = Exact<{
  txHash: Scalars['Bytes'];
}>;


export type ProofByTxHashQuery = (
  { __typename?: 'Query' }
  & { proofs: Array<(
    { __typename?: 'Proof' }
    & Pick<Proof, 'id' | 'type' | 'src' | 'dest' | 'nonce' | 'sender' | 'amount' | 'fee' | 'txFee'>
  )> }
);

export type ProofByIdQueryVariables = Exact<{
  id: Scalars['ID'];
  proofType: ProofType;
}>;


export type ProofByIdQuery = (
  { __typename?: 'Query' }
  & { proofs: Array<(
    { __typename?: 'Proof' }
    & Pick<Proof, 'id' | 'type' | 'src' | 'dest' | 'nonce' | 'sender' | 'amount' | 'fee' | 'txFee'>
  )> }
);

export type MyLastProofQueryVariables = Exact<{
  sender: Scalars['Bytes'];
  proofType: ProofType;
}>;


export type MyLastProofQuery = (
  { __typename?: 'Query' }
  & { proofs: Array<(
    { __typename?: 'Proof' }
    & Pick<Proof, 'id' | 'type' | 'src' | 'dest' | 'nonce' | 'sender' | 'amount' | 'fee' | 'txFee'>
  )> }
);

export type BridgeTransferQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BridgeTransferQuery = (
  { __typename?: 'Query' }
  & { bridgeTransfer?: Maybe<(
    { __typename?: 'BridgeTransfer' }
    & Pick<BridgeTransfer, 'id' | 'status'>
  )> }
);


export const MetaBlockNumberDocument = gql`
    query MetaBlockNumber {
  _meta {
    block {
      number
    }
  }
}
    `;

/**
 * __useMetaBlockNumberQuery__
 *
 * To run a query within a React component, call `useMetaBlockNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useMetaBlockNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMetaBlockNumberQuery({
 *   variables: {
 *   },
 * });
 */
export function useMetaBlockNumberQuery(baseOptions?: Apollo.QueryHookOptions<MetaBlockNumberQuery, MetaBlockNumberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MetaBlockNumberQuery, MetaBlockNumberQueryVariables>(MetaBlockNumberDocument, options);
      }
export function useMetaBlockNumberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MetaBlockNumberQuery, MetaBlockNumberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MetaBlockNumberQuery, MetaBlockNumberQueryVariables>(MetaBlockNumberDocument, options);
        }
export type MetaBlockNumberQueryHookResult = ReturnType<typeof useMetaBlockNumberQuery>;
export type MetaBlockNumberLazyQueryHookResult = ReturnType<typeof useMetaBlockNumberLazyQuery>;
export type MetaBlockNumberQueryResult = Apollo.QueryResult<MetaBlockNumberQuery, MetaBlockNumberQueryVariables>;
export const ProofByTxHashDocument = gql`
    query ProofByTxHash($txHash: Bytes!) {
  proofs(where: {txHash: $txHash}, orderBy: nonce, orderDirection: desc, first: 1) {
    id
    type
    src
    dest
    nonce
    sender
    amount
    fee
    txFee
  }
}
    `;

/**
 * __useProofByTxHashQuery__
 *
 * To run a query within a React component, call `useProofByTxHashQuery` and pass it any options that fit your needs.
 * When your component renders, `useProofByTxHashQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProofByTxHashQuery({
 *   variables: {
 *      txHash: // value for 'txHash'
 *   },
 * });
 */
export function useProofByTxHashQuery(baseOptions: Apollo.QueryHookOptions<ProofByTxHashQuery, ProofByTxHashQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProofByTxHashQuery, ProofByTxHashQueryVariables>(ProofByTxHashDocument, options);
      }
export function useProofByTxHashLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProofByTxHashQuery, ProofByTxHashQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProofByTxHashQuery, ProofByTxHashQueryVariables>(ProofByTxHashDocument, options);
        }
export type ProofByTxHashQueryHookResult = ReturnType<typeof useProofByTxHashQuery>;
export type ProofByTxHashLazyQueryHookResult = ReturnType<typeof useProofByTxHashLazyQuery>;
export type ProofByTxHashQueryResult = Apollo.QueryResult<ProofByTxHashQuery, ProofByTxHashQueryVariables>;
export const ProofByIdDocument = gql`
    query ProofById($id: ID!, $proofType: ProofType!) {
  proofs(
    where: {id: $id, type: $proofType}
    orderBy: nonce
    orderDirection: desc
    first: 1
  ) {
    id
    type
    src
    dest
    nonce
    sender
    amount
    fee
    txFee
  }
}
    `;

/**
 * __useProofByIdQuery__
 *
 * To run a query within a React component, call `useProofByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useProofByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProofByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      proofType: // value for 'proofType'
 *   },
 * });
 */
export function useProofByIdQuery(baseOptions: Apollo.QueryHookOptions<ProofByIdQuery, ProofByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProofByIdQuery, ProofByIdQueryVariables>(ProofByIdDocument, options);
      }
export function useProofByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProofByIdQuery, ProofByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProofByIdQuery, ProofByIdQueryVariables>(ProofByIdDocument, options);
        }
export type ProofByIdQueryHookResult = ReturnType<typeof useProofByIdQuery>;
export type ProofByIdLazyQueryHookResult = ReturnType<typeof useProofByIdLazyQuery>;
export type ProofByIdQueryResult = Apollo.QueryResult<ProofByIdQuery, ProofByIdQueryVariables>;
export const MyLastProofDocument = gql`
    query MyLastProof($sender: Bytes!, $proofType: ProofType!) {
  proofs(
    where: {sender: $sender, type: $proofType}
    orderBy: nonce
    orderDirection: desc
    first: 1
  ) {
    id
    type
    src
    dest
    nonce
    sender
    amount
    fee
    txFee
  }
}
    `;

/**
 * __useMyLastProofQuery__
 *
 * To run a query within a React component, call `useMyLastProofQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyLastProofQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyLastProofQuery({
 *   variables: {
 *      sender: // value for 'sender'
 *      proofType: // value for 'proofType'
 *   },
 * });
 */
export function useMyLastProofQuery(baseOptions: Apollo.QueryHookOptions<MyLastProofQuery, MyLastProofQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyLastProofQuery, MyLastProofQueryVariables>(MyLastProofDocument, options);
      }
export function useMyLastProofLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyLastProofQuery, MyLastProofQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyLastProofQuery, MyLastProofQueryVariables>(MyLastProofDocument, options);
        }
export type MyLastProofQueryHookResult = ReturnType<typeof useMyLastProofQuery>;
export type MyLastProofLazyQueryHookResult = ReturnType<typeof useMyLastProofLazyQuery>;
export type MyLastProofQueryResult = Apollo.QueryResult<MyLastProofQuery, MyLastProofQueryVariables>;
export const BridgeTransferDocument = gql`
    query BridgeTransfer($id: ID!) {
  bridgeTransfer(id: $id) {
    id
    status
  }
}
    `;

/**
 * __useBridgeTransferQuery__
 *
 * To run a query within a React component, call `useBridgeTransferQuery` and pass it any options that fit your needs.
 * When your component renders, `useBridgeTransferQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBridgeTransferQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBridgeTransferQuery(baseOptions: Apollo.QueryHookOptions<BridgeTransferQuery, BridgeTransferQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BridgeTransferQuery, BridgeTransferQueryVariables>(BridgeTransferDocument, options);
      }
export function useBridgeTransferLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BridgeTransferQuery, BridgeTransferQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BridgeTransferQuery, BridgeTransferQueryVariables>(BridgeTransferDocument, options);
        }
export type BridgeTransferQueryHookResult = ReturnType<typeof useBridgeTransferQuery>;
export type BridgeTransferLazyQueryHookResult = ReturnType<typeof useBridgeTransferLazyQuery>;
export type BridgeTransferQueryResult = Apollo.QueryResult<BridgeTransferQuery, BridgeTransferQueryVariables>;