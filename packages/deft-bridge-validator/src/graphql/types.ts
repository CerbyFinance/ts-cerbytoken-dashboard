import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: any;
};






export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
  number_gte?: Maybe<Scalars['Int']>;
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
  status_in?: Maybe<Array<TransferStatus>>;
  status_not_in?: Maybe<Array<TransferStatus>>;
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
  type_in?: Maybe<Array<ProofType>>;
  type_not_in?: Maybe<Array<ProofType>>;
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
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProofsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Proof_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Proof_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBridgeTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBridgeTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeTransfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeTransfer_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGlobalArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGlobalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Global_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Global_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
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
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProofsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Proof_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Proof_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBridgeTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBridgeTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeTransfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeTransfer_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGlobalArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGlobalsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Global_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Global_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
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

export type ProofsQueryVariables = Exact<{
  first: Scalars['Int'];
  blockNumberGt: Scalars['BigInt'];
  blockNumberLte: Scalars['BigInt'];
  proofType?: Maybe<ProofType>;
  dest: Scalars['BigInt'];
}>;


export type ProofsQuery = (
  { __typename?: 'Query' }
  & { proofs: Array<(
    { __typename?: 'Proof' }
    & Pick<Proof, 'id' | 'src' | 'dest' | 'logIndex' | 'blockNumber' | 'timestamp'>
  )> }
);

export type ProofBlockNumberQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProofBlockNumberQuery = (
  { __typename?: 'Query' }
  & { proof?: Maybe<(
    { __typename?: 'Proof' }
    & Pick<Proof, 'blockNumber'>
  )> }
);

export type GlobalRecentProofQueryVariables = Exact<{ [key: string]: never; }>;


export type GlobalRecentProofQuery = (
  { __typename?: 'Query' }
  & { global?: Maybe<(
    { __typename?: 'Global' }
    & Pick<Global, 'recentApprovedProof'>
  )> }
);


export const ProofsDocument = gql`
    query Proofs($first: Int!, $blockNumberGt: BigInt!, $blockNumberLte: BigInt!, $proofType: ProofType, $dest: BigInt!) {
  proofs(
    first: $first
    where: {blockNumber_gt: $blockNumberGt, blockNumber_lte: $blockNumberLte, type: $proofType, dest: $dest}
    orderBy: blockNumber
    orderDirection: asc
  ) {
    id
    src
    dest
    logIndex
    blockNumber
    timestamp
  }
}
    `;
export const ProofBlockNumberDocument = gql`
    query ProofBlockNumber($id: ID!) {
  proof(id: $id) {
    blockNumber
  }
}
    `;
export const GlobalRecentProofDocument = gql`
    query GlobalRecentProof {
  global(id: "1") {
    recentApprovedProof
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Proofs(variables: ProofsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProofsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProofsQuery>(ProofsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Proofs');
    },
    ProofBlockNumber(variables: ProofBlockNumberQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProofBlockNumberQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProofBlockNumberQuery>(ProofBlockNumberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProofBlockNumber');
    },
    GlobalRecentProof(variables?: GlobalRecentProofQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GlobalRecentProofQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GlobalRecentProofQuery>(GlobalRecentProofDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GlobalRecentProof');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;