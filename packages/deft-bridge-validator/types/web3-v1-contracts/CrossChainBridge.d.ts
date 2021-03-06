/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type ApprovedTransaction = ContractEventLog<{
  transactionHash: string;
  0: string;
}>;
export type BulkApprovedTransactions = ContractEventLog<{
  transactionHashes: string[];
  0: string[];
}>;
export type FeeUpdated = ContractEventLog<{
  newFeePercent: string;
  0: string;
}>;
export type ProofOfBurn = ContractEventLog<{
  addr: string;
  token: string;
  amount: string;
  currentNonce: string;
  sourceChain: string;
  destinationChain: string;
  transactionHash: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
}>;
export type ProofOfMint = ContractEventLog<{
  addr: string;
  token: string;
  amountAsFee: string;
  finalAmount: string;
  transactionHash: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
}>;
export type RoleAdminChanged = ContractEventLog<{
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
  0: string;
  1: string;
  2: string;
}>;
export type RoleGranted = ContractEventLog<{
  role: string;
  account: string;
  sender: string;
  0: string;
  1: string;
  2: string;
}>;
export type RoleRevoked = ContractEventLog<{
  role: string;
  account: string;
  sender: string;
  0: string;
  1: string;
  2: string;
}>;

export interface CrossChainBridge extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): CrossChainBridge;
  clone(): CrossChainBridge;
  methods: {
    ROLE_ADMIN(): NonPayableTransactionObject<string>;

    ROLE_APPROVER(): NonPayableTransactionObject<string>;

    allowChain(
      token: string,
      chainId: number | string | BN,
      isAllowed: boolean
    ): NonPayableTransactionObject<void>;

    allowContract(
      addr: string,
      isAllow: boolean
    ): NonPayableTransactionObject<void>;

    beneficiaryAddress(): NonPayableTransactionObject<string>;

    bulkMarkTransactionsAsApproved(
      transactionHashes: (string | number[])[]
    ): NonPayableTransactionObject<void>;

    burnAndCreateProof(
      token: string,
      amount: number | string | BN,
      destinationChainId: number | string | BN
    ): NonPayableTransactionObject<void>;

    currentNonce(arg0: string): NonPayableTransactionObject<string>;

    feePercent(): NonPayableTransactionObject<string>;

    getMinAmountToBurn(token: string): NonPayableTransactionObject<string>;

    getRoleAdmin(role: string | number[]): NonPayableTransactionObject<string>;

    getRoleMember(
      role: string | number[],
      index: number | string | BN
    ): NonPayableTransactionObject<string>;

    getRoleMemberCount(
      role: string | number[]
    ): NonPayableTransactionObject<string>;

    getSettings(token: string): NonPayableTransactionObject<{
      0: boolean;
      1: string;
      2: string;
    }>;

    grantRole(
      role: string | number[],
      account: string
    ): NonPayableTransactionObject<void>;

    grantRolesBulk(
      roles: [string | number[], string][]
    ): NonPayableTransactionObject<void>;

    hasRole(
      role: string | number[],
      account: string
    ): NonPayableTransactionObject<boolean>;

    isAllowedContract(addr: string): NonPayableTransactionObject<boolean>;

    isAllowedToBridgeToChainId(
      arg0: string,
      arg1: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    markTransactionAsApproved(
      transactionHash: string | number[]
    ): NonPayableTransactionObject<void>;

    mintWithBurnProof(
      sourceProofOfBurn: [
        number | string | BN,
        number | string | BN,
        number | string | BN,
        string,
        string | number[]
      ]
    ): NonPayableTransactionObject<void>;

    renounceRole(
      role: string | number[],
      account: string
    ): NonPayableTransactionObject<void>;

    revokeRole(
      role: string | number[],
      account: string
    ): NonPayableTransactionObject<void>;

    supportsInterface(
      interfaceId: string | number[]
    ): NonPayableTransactionObject<boolean>;

    transactionStorage(
      arg0: string | number[]
    ): NonPayableTransactionObject<string>;

    updateBeneficiaryAddress(
      newBeneficiaryAddr: string
    ): NonPayableTransactionObject<void>;

    updateFee(
      newFeePercent: number | string | BN
    ): NonPayableTransactionObject<void>;
  };
  events: {
    ApprovedTransaction(cb?: Callback<ApprovedTransaction>): EventEmitter;
    ApprovedTransaction(
      options?: EventOptions,
      cb?: Callback<ApprovedTransaction>
    ): EventEmitter;

    BulkApprovedTransactions(
      cb?: Callback<BulkApprovedTransactions>
    ): EventEmitter;
    BulkApprovedTransactions(
      options?: EventOptions,
      cb?: Callback<BulkApprovedTransactions>
    ): EventEmitter;

    FeeUpdated(cb?: Callback<FeeUpdated>): EventEmitter;
    FeeUpdated(options?: EventOptions, cb?: Callback<FeeUpdated>): EventEmitter;

    ProofOfBurn(cb?: Callback<ProofOfBurn>): EventEmitter;
    ProofOfBurn(
      options?: EventOptions,
      cb?: Callback<ProofOfBurn>
    ): EventEmitter;

    ProofOfMint(cb?: Callback<ProofOfMint>): EventEmitter;
    ProofOfMint(
      options?: EventOptions,
      cb?: Callback<ProofOfMint>
    ): EventEmitter;

    RoleAdminChanged(cb?: Callback<RoleAdminChanged>): EventEmitter;
    RoleAdminChanged(
      options?: EventOptions,
      cb?: Callback<RoleAdminChanged>
    ): EventEmitter;

    RoleGranted(cb?: Callback<RoleGranted>): EventEmitter;
    RoleGranted(
      options?: EventOptions,
      cb?: Callback<RoleGranted>
    ): EventEmitter;

    RoleRevoked(cb?: Callback<RoleRevoked>): EventEmitter;
    RoleRevoked(
      options?: EventOptions,
      cb?: Callback<RoleRevoked>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "ApprovedTransaction", cb: Callback<ApprovedTransaction>): void;
  once(
    event: "ApprovedTransaction",
    options: EventOptions,
    cb: Callback<ApprovedTransaction>
  ): void;

  once(
    event: "BulkApprovedTransactions",
    cb: Callback<BulkApprovedTransactions>
  ): void;
  once(
    event: "BulkApprovedTransactions",
    options: EventOptions,
    cb: Callback<BulkApprovedTransactions>
  ): void;

  once(event: "FeeUpdated", cb: Callback<FeeUpdated>): void;
  once(
    event: "FeeUpdated",
    options: EventOptions,
    cb: Callback<FeeUpdated>
  ): void;

  once(event: "ProofOfBurn", cb: Callback<ProofOfBurn>): void;
  once(
    event: "ProofOfBurn",
    options: EventOptions,
    cb: Callback<ProofOfBurn>
  ): void;

  once(event: "ProofOfMint", cb: Callback<ProofOfMint>): void;
  once(
    event: "ProofOfMint",
    options: EventOptions,
    cb: Callback<ProofOfMint>
  ): void;

  once(event: "RoleAdminChanged", cb: Callback<RoleAdminChanged>): void;
  once(
    event: "RoleAdminChanged",
    options: EventOptions,
    cb: Callback<RoleAdminChanged>
  ): void;

  once(event: "RoleGranted", cb: Callback<RoleGranted>): void;
  once(
    event: "RoleGranted",
    options: EventOptions,
    cb: Callback<RoleGranted>
  ): void;

  once(event: "RoleRevoked", cb: Callback<RoleRevoked>): void;
  once(
    event: "RoleRevoked",
    options: EventOptions,
    cb: Callback<RoleRevoked>
  ): void;
}
