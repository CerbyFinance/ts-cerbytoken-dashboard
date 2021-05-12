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

export type BotTransaction = {
  __typename?: 'BotTransaction';
  id: Scalars['ID'];
  from: Scalars['Bytes'];
  to: Scalars['Bytes'];
  taxedAmount: Scalars['BigInt'];
  transferAmount: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
};

export type BotTransaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  from?: Maybe<Scalars['Bytes']>;
  from_not?: Maybe<Scalars['Bytes']>;
  from_in?: Maybe<Array<Scalars['Bytes']>>;
  from_not_in?: Maybe<Array<Scalars['Bytes']>>;
  from_contains?: Maybe<Scalars['Bytes']>;
  from_not_contains?: Maybe<Scalars['Bytes']>;
  to?: Maybe<Scalars['Bytes']>;
  to_not?: Maybe<Scalars['Bytes']>;
  to_in?: Maybe<Array<Scalars['Bytes']>>;
  to_not_in?: Maybe<Array<Scalars['Bytes']>>;
  to_contains?: Maybe<Scalars['Bytes']>;
  to_not_contains?: Maybe<Scalars['Bytes']>;
  taxedAmount?: Maybe<Scalars['BigInt']>;
  taxedAmount_not?: Maybe<Scalars['BigInt']>;
  taxedAmount_gt?: Maybe<Scalars['BigInt']>;
  taxedAmount_lt?: Maybe<Scalars['BigInt']>;
  taxedAmount_gte?: Maybe<Scalars['BigInt']>;
  taxedAmount_lte?: Maybe<Scalars['BigInt']>;
  taxedAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  taxedAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transferAmount?: Maybe<Scalars['BigInt']>;
  transferAmount_not?: Maybe<Scalars['BigInt']>;
  transferAmount_gt?: Maybe<Scalars['BigInt']>;
  transferAmount_lt?: Maybe<Scalars['BigInt']>;
  transferAmount_gte?: Maybe<Scalars['BigInt']>;
  transferAmount_lte?: Maybe<Scalars['BigInt']>;
  transferAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  transferAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum BotTransaction_OrderBy {
  Id = 'id',
  From = 'from',
  To = 'to',
  TaxedAmount = 'taxedAmount',
  TransferAmount = 'transferAmount',
  Timestamp = 'timestamp'
}


export type Multiplier = {
  __typename?: 'Multiplier';
  id: Scalars['ID'];
  value: Scalars['BigInt'];
};

export type Multiplier_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigInt']>;
  value_not?: Maybe<Scalars['BigInt']>;
  value_gt?: Maybe<Scalars['BigInt']>;
  value_lt?: Maybe<Scalars['BigInt']>;
  value_gte?: Maybe<Scalars['BigInt']>;
  value_lte?: Maybe<Scalars['BigInt']>;
  value_in?: Maybe<Array<Scalars['BigInt']>>;
  value_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Multiplier_OrderBy {
  Id = 'id',
  Value = 'value'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users: Array<User>;
  botTransaction?: Maybe<BotTransaction>;
  botTransactions: Array<BotTransaction>;
  multiplier?: Maybe<Multiplier>;
  multipliers: Array<Multiplier>;
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


export type QueryBotTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBotTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BotTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BotTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryMultiplierArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMultipliersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Multiplier_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Multiplier_Filter>;
  block?: Maybe<Block_Height>;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Subscription = {
  __typename?: 'Subscription';
  user?: Maybe<User>;
  users: Array<User>;
  botTransaction?: Maybe<BotTransaction>;
  botTransactions: Array<BotTransaction>;
  multiplier?: Maybe<Multiplier>;
  multipliers: Array<Multiplier>;
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


export type SubscriptionBotTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBotTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BotTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BotTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionMultiplierArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMultipliersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Multiplier_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Multiplier_Filter>;
  block?: Maybe<Block_Height>;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  reward: Scalars['BigInt'];
  referrer?: Maybe<User>;
  referrals: Array<User>;
  referralsCount: Scalars['BigInt'];
  createdAt: Scalars['BigInt'];
};


export type UserReferralsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<User_Filter>;
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
  reward?: Maybe<Scalars['BigInt']>;
  reward_not?: Maybe<Scalars['BigInt']>;
  reward_gt?: Maybe<Scalars['BigInt']>;
  reward_lt?: Maybe<Scalars['BigInt']>;
  reward_gte?: Maybe<Scalars['BigInt']>;
  reward_lte?: Maybe<Scalars['BigInt']>;
  reward_in?: Maybe<Array<Scalars['BigInt']>>;
  reward_not_in?: Maybe<Array<Scalars['BigInt']>>;
  referrer?: Maybe<Scalars['String']>;
  referrer_not?: Maybe<Scalars['String']>;
  referrer_gt?: Maybe<Scalars['String']>;
  referrer_lt?: Maybe<Scalars['String']>;
  referrer_gte?: Maybe<Scalars['String']>;
  referrer_lte?: Maybe<Scalars['String']>;
  referrer_in?: Maybe<Array<Scalars['String']>>;
  referrer_not_in?: Maybe<Array<Scalars['String']>>;
  referrer_contains?: Maybe<Scalars['String']>;
  referrer_not_contains?: Maybe<Scalars['String']>;
  referrer_starts_with?: Maybe<Scalars['String']>;
  referrer_not_starts_with?: Maybe<Scalars['String']>;
  referrer_ends_with?: Maybe<Scalars['String']>;
  referrer_not_ends_with?: Maybe<Scalars['String']>;
  referralsCount?: Maybe<Scalars['BigInt']>;
  referralsCount_not?: Maybe<Scalars['BigInt']>;
  referralsCount_gt?: Maybe<Scalars['BigInt']>;
  referralsCount_lt?: Maybe<Scalars['BigInt']>;
  referralsCount_gte?: Maybe<Scalars['BigInt']>;
  referralsCount_lte?: Maybe<Scalars['BigInt']>;
  referralsCount_in?: Maybe<Array<Scalars['BigInt']>>;
  referralsCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum User_OrderBy {
  Id = 'id',
  Reward = 'reward',
  Referrer = 'referrer',
  Referrals = 'referrals',
  ReferralsCount = 'referralsCount',
  CreatedAt = 'createdAt'
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

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
export type ResolversTypes = ResolversObject<{
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Block_height: Block_Height;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  BotTransaction: ResolverTypeWrapper<BotTransaction>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  BotTransaction_filter: BotTransaction_Filter;
  BotTransaction_orderBy: BotTransaction_OrderBy;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Multiplier: ResolverTypeWrapper<Multiplier>;
  Multiplier_filter: Multiplier_Filter;
  Multiplier_orderBy: Multiplier_OrderBy;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  User_filter: User_Filter;
  String: ResolverTypeWrapper<Scalars['String']>;
  User_orderBy: User_OrderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  Block_height: Block_Height;
  Int: Scalars['Int'];
  BotTransaction: BotTransaction;
  ID: Scalars['ID'];
  BotTransaction_filter: BotTransaction_Filter;
  Bytes: Scalars['Bytes'];
  Multiplier: Multiplier;
  Multiplier_filter: Multiplier_Filter;
  Query: {};
  Subscription: {};
  User: User;
  User_filter: User_Filter;
  String: Scalars['String'];
  _Block_: _Block_;
  _Meta_: _Meta_;
  Boolean: Scalars['Boolean'];
}>;

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

export type BotTransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotTransaction'] = ResolversParentTypes['BotTransaction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  taxedAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transferAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type MultiplierResolvers<ContextType = any, ParentType extends ResolversParentTypes['Multiplier'] = ResolversParentTypes['Multiplier']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'skip' | 'first'>>;
  botTransaction?: Resolver<Maybe<ResolversTypes['BotTransaction']>, ParentType, ContextType, RequireFields<QueryBotTransactionArgs, 'id'>>;
  botTransactions?: Resolver<Array<ResolversTypes['BotTransaction']>, ParentType, ContextType, RequireFields<QueryBotTransactionsArgs, 'skip' | 'first'>>;
  multiplier?: Resolver<Maybe<ResolversTypes['Multiplier']>, ParentType, ContextType, RequireFields<QueryMultiplierArgs, 'id'>>;
  multipliers?: Resolver<Array<ResolversTypes['Multiplier']>, ParentType, ContextType, RequireFields<QueryMultipliersArgs, 'skip' | 'first'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, RequireFields<Query_MetaArgs, never>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  user?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "user", ParentType, ContextType, RequireFields<SubscriptionUserArgs, 'id'>>;
  users?: SubscriptionResolver<Array<ResolversTypes['User']>, "users", ParentType, ContextType, RequireFields<SubscriptionUsersArgs, 'skip' | 'first'>>;
  botTransaction?: SubscriptionResolver<Maybe<ResolversTypes['BotTransaction']>, "botTransaction", ParentType, ContextType, RequireFields<SubscriptionBotTransactionArgs, 'id'>>;
  botTransactions?: SubscriptionResolver<Array<ResolversTypes['BotTransaction']>, "botTransactions", ParentType, ContextType, RequireFields<SubscriptionBotTransactionsArgs, 'skip' | 'first'>>;
  multiplier?: SubscriptionResolver<Maybe<ResolversTypes['Multiplier']>, "multiplier", ParentType, ContextType, RequireFields<SubscriptionMultiplierArgs, 'id'>>;
  multipliers?: SubscriptionResolver<Array<ResolversTypes['Multiplier']>, "multipliers", ParentType, ContextType, RequireFields<SubscriptionMultipliersArgs, 'skip' | 'first'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, RequireFields<Subscription_MetaArgs, never>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reward?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  referrer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  referrals?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<UserReferralsArgs, 'skip' | 'first'>>;
  referralsCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  BotTransaction?: BotTransactionResolvers<ContextType>;
  Bytes?: GraphQLScalarType;
  Multiplier?: MultiplierResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  derivedFrom?: DerivedFromDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  subgraphId?: SubgraphIdDirectiveResolver<any, any, ContextType>;
}>;


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;
export type MultiplierQueryVariables = Exact<{ [key: string]: never; }>;


export type MultiplierQuery = (
  { __typename?: 'Query' }
  & { multiplier?: Maybe<(
    { __typename?: 'Multiplier' }
    & Pick<Multiplier, 'id' | 'value'>
  )> }
);

export type UserReferrals2lvlQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type UserReferrals2lvlQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'createdAt' | 'referralsCount'>
    & { referrer?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'referralsCount'>
    )>, referrals: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'createdAt' | 'referralsCount'>
      & { referrer?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'referralsCount'>
      )>, referrals: Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'createdAt' | 'referralsCount'>
        & { referrer?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id' | 'referralsCount'>
        )> }
      )> }
    )> }
  )> }
);


export const MultiplierDocument = gql`
    query Multiplier {
  multiplier(id: 1) {
    id
    value
  }
}
    `;

/**
 * __useMultiplierQuery__
 *
 * To run a query within a React component, call `useMultiplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useMultiplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMultiplierQuery({
 *   variables: {
 *   },
 * });
 */
export function useMultiplierQuery(baseOptions?: Apollo.QueryHookOptions<MultiplierQuery, MultiplierQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MultiplierQuery, MultiplierQueryVariables>(MultiplierDocument, options);
      }
export function useMultiplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MultiplierQuery, MultiplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MultiplierQuery, MultiplierQueryVariables>(MultiplierDocument, options);
        }
export type MultiplierQueryHookResult = ReturnType<typeof useMultiplierQuery>;
export type MultiplierLazyQueryHookResult = ReturnType<typeof useMultiplierLazyQuery>;
export type MultiplierQueryResult = Apollo.QueryResult<MultiplierQuery, MultiplierQueryVariables>;
export const UserReferrals2lvlDocument = gql`
    query UserReferrals2lvl($address: ID!) {
  user(id: $address) {
    id
    createdAt
    referralsCount
    referrer {
      id
      referralsCount
    }
    referrals(first: 1000) {
      id
      createdAt
      referralsCount
      referrer {
        id
        referralsCount
      }
      referrals(first: 1000) {
        id
        createdAt
        referralsCount
        referrer {
          id
          referralsCount
        }
      }
    }
  }
}
    `;

/**
 * __useUserReferrals2lvlQuery__
 *
 * To run a query within a React component, call `useUserReferrals2lvlQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserReferrals2lvlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserReferrals2lvlQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserReferrals2lvlQuery(baseOptions: Apollo.QueryHookOptions<UserReferrals2lvlQuery, UserReferrals2lvlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserReferrals2lvlQuery, UserReferrals2lvlQueryVariables>(UserReferrals2lvlDocument, options);
      }
export function useUserReferrals2lvlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserReferrals2lvlQuery, UserReferrals2lvlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserReferrals2lvlQuery, UserReferrals2lvlQueryVariables>(UserReferrals2lvlDocument, options);
        }
export type UserReferrals2lvlQueryHookResult = ReturnType<typeof useUserReferrals2lvlQuery>;
export type UserReferrals2lvlLazyQueryHookResult = ReturnType<typeof useUserReferrals2lvlLazyQuery>;
export type UserReferrals2lvlQueryResult = Apollo.QueryResult<UserReferrals2lvlQuery, UserReferrals2lvlQueryVariables>;