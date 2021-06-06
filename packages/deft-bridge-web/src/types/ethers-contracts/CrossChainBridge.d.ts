/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface CrossChainBridgeInterface extends ethers.utils.Interface {
  functions: {
    "ROLE_ADMIN()": FunctionFragment;
    "ROLE_APPROVER()": FunctionFragment;
    "ROLE_BENEFICIARY()": FunctionFragment;
    "bulkMarkTransactionsAsApproved(bytes32[])": FunctionFragment;
    "burnAndCreateProof(uint256,uint256)": FunctionFragment;
    "chainIdToFee(uint256)": FunctionFragment;
    "currentNonce()": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "getRoleMember(bytes32,uint256)": FunctionFragment;
    "getRoleMemberCount(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "isAllowedToBridgeToChainId(uint256)": FunctionFragment;
    "markTransactionAsApproved(bytes32)": FunctionFragment;
    "minAmountToBurn()": FunctionFragment;
    "mintWithBurnProof(tuple)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "transactionStorage(bytes32)": FunctionFragment;
    "updateChains(uint256,uint256,bool)": FunctionFragment;
    "updateSettings(uint256,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ROLE_ADMIN",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ROLE_APPROVER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ROLE_BENEFICIARY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "bulkMarkTransactionsAsApproved",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "burnAndCreateProof",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "chainIdToFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "currentNonce",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleMember",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleMemberCount",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isAllowedToBridgeToChainId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "markTransactionAsApproved",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "minAmountToBurn",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mintWithBurnProof",
    values: [
      {
        amount: BigNumberish;
        sourceChainId: BigNumberish;
        sourceNonce: BigNumberish;
        transactionHash: BytesLike;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transactionStorage",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateChains",
    values: [BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSettings",
    values: [BigNumberish, string]
  ): string;

  decodeFunctionResult(functionFragment: "ROLE_ADMIN", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ROLE_APPROVER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ROLE_BENEFICIARY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bulkMarkTransactionsAsApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burnAndCreateProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "chainIdToFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleMember",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleMemberCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isAllowedToBridgeToChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "markTransactionAsApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minAmountToBurn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintWithBurnProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transactionStorage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateChains",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSettings",
    data: BytesLike
  ): Result;

  events: {
    "ApprovedTransaction(bytes32)": EventFragment;
    "BulkApprovedTransactions(bytes32[])": EventFragment;
    "ProofOfBurn(address,uint256,uint256,uint256,uint256,bytes32)": EventFragment;
    "ProofOfMint(address,uint256,uint256,bytes32)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApprovedTransaction"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BulkApprovedTransactions"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProofOfBurn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProofOfMint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
}

export class CrossChainBridge extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: CrossChainBridgeInterface;

  functions: {
    ROLE_ADMIN(overrides?: CallOverrides): Promise<[string]>;

    ROLE_APPROVER(overrides?: CallOverrides): Promise<[string]>;

    ROLE_BENEFICIARY(overrides?: CallOverrides): Promise<[string]>;

    bulkMarkTransactionsAsApproved(
      transactionHashes: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    burnAndCreateProof(
      amount: BigNumberish,
      destinationChainId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    chainIdToFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    currentNonce(overrides?: CallOverrides): Promise<[BigNumber]>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    getRoleMember(
      role: BytesLike,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getRoleMemberCount(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isAllowedToBridgeToChainId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    markTransactionAsApproved(
      transactionHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    minAmountToBurn(overrides?: CallOverrides): Promise<[BigNumber]>;

    mintWithBurnProof(
      sourceProofOfBurn: {
        amount: BigNumberish;
        sourceChainId: BigNumberish;
        sourceNonce: BigNumberish;
        transactionHash: BytesLike;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    transactionStorage(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[number]>;

    updateChains(
      chainId: BigNumberish,
      chainFee: BigNumberish,
      isAllowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateSettings(
      newMinAmountToBurn: BigNumberish,
      newDefiFactoryContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  ROLE_ADMIN(overrides?: CallOverrides): Promise<string>;

  ROLE_APPROVER(overrides?: CallOverrides): Promise<string>;

  ROLE_BENEFICIARY(overrides?: CallOverrides): Promise<string>;

  bulkMarkTransactionsAsApproved(
    transactionHashes: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  burnAndCreateProof(
    amount: BigNumberish,
    destinationChainId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  chainIdToFee(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  currentNonce(overrides?: CallOverrides): Promise<BigNumber>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  getRoleMember(
    role: BytesLike,
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getRoleMemberCount(
    role: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isAllowedToBridgeToChainId(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  markTransactionAsApproved(
    transactionHash: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  minAmountToBurn(overrides?: CallOverrides): Promise<BigNumber>;

  mintWithBurnProof(
    sourceProofOfBurn: {
      amount: BigNumberish;
      sourceChainId: BigNumberish;
      sourceNonce: BigNumberish;
      transactionHash: BytesLike;
    },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  transactionStorage(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<number>;

  updateChains(
    chainId: BigNumberish,
    chainFee: BigNumberish,
    isAllowed: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateSettings(
    newMinAmountToBurn: BigNumberish,
    newDefiFactoryContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    ROLE_ADMIN(overrides?: CallOverrides): Promise<string>;

    ROLE_APPROVER(overrides?: CallOverrides): Promise<string>;

    ROLE_BENEFICIARY(overrides?: CallOverrides): Promise<string>;

    bulkMarkTransactionsAsApproved(
      transactionHashes: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    burnAndCreateProof(
      amount: BigNumberish,
      destinationChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    chainIdToFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentNonce(overrides?: CallOverrides): Promise<BigNumber>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    getRoleMember(
      role: BytesLike,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getRoleMemberCount(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isAllowedToBridgeToChainId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    markTransactionAsApproved(
      transactionHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    minAmountToBurn(overrides?: CallOverrides): Promise<BigNumber>;

    mintWithBurnProof(
      sourceProofOfBurn: {
        amount: BigNumberish;
        sourceChainId: BigNumberish;
        sourceNonce: BigNumberish;
        transactionHash: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<void>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transactionStorage(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<number>;

    updateChains(
      chainId: BigNumberish,
      chainFee: BigNumberish,
      isAllowed: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSettings(
      newMinAmountToBurn: BigNumberish,
      newDefiFactoryContract: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    ApprovedTransaction(
      transactionHash?: null
    ): TypedEventFilter<[string], { transactionHash: string }>;

    BulkApprovedTransactions(
      transactionHashes?: null
    ): TypedEventFilter<[string[]], { transactionHashes: string[] }>;

    ProofOfBurn(
      addr?: null,
      amount?: null,
      currentNonce?: null,
      sourceChain?: null,
      destinationChain?: null,
      transactionHash?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, string],
      {
        addr: string;
        amount: BigNumber;
        currentNonce: BigNumber;
        sourceChain: BigNumber;
        destinationChain: BigNumber;
        transactionHash: string;
      }
    >;

    ProofOfMint(
      addr?: null,
      amountAsFee?: null,
      finalAmount?: null,
      transactionHash?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, string],
      {
        addr: string;
        amountAsFee: BigNumber;
        finalAmount: BigNumber;
        transactionHash: string;
      }
    >;

    RoleAdminChanged(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;
  };

  estimateGas: {
    ROLE_ADMIN(overrides?: CallOverrides): Promise<BigNumber>;

    ROLE_APPROVER(overrides?: CallOverrides): Promise<BigNumber>;

    ROLE_BENEFICIARY(overrides?: CallOverrides): Promise<BigNumber>;

    bulkMarkTransactionsAsApproved(
      transactionHashes: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    burnAndCreateProof(
      amount: BigNumberish,
      destinationChainId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    chainIdToFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentNonce(overrides?: CallOverrides): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleMember(
      role: BytesLike,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleMemberCount(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isAllowedToBridgeToChainId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    markTransactionAsApproved(
      transactionHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    minAmountToBurn(overrides?: CallOverrides): Promise<BigNumber>;

    mintWithBurnProof(
      sourceProofOfBurn: {
        amount: BigNumberish;
        sourceChainId: BigNumberish;
        sourceNonce: BigNumberish;
        transactionHash: BytesLike;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transactionStorage(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    updateChains(
      chainId: BigNumberish,
      chainFee: BigNumberish,
      isAllowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateSettings(
      newMinAmountToBurn: BigNumberish,
      newDefiFactoryContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ROLE_ADMIN(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ROLE_APPROVER(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ROLE_BENEFICIARY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bulkMarkTransactionsAsApproved(
      transactionHashes: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    burnAndCreateProof(
      amount: BigNumberish,
      destinationChainId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    chainIdToFee(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    currentNonce(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleMember(
      role: BytesLike,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleMemberCount(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isAllowedToBridgeToChainId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    markTransactionAsApproved(
      transactionHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    minAmountToBurn(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mintWithBurnProof(
      sourceProofOfBurn: {
        amount: BigNumberish;
        sourceChainId: BigNumberish;
        sourceNonce: BigNumberish;
        transactionHash: BytesLike;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transactionStorage(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    updateChains(
      chainId: BigNumberish,
      chainFee: BigNumberish,
      isAllowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateSettings(
      newMinAmountToBurn: BigNumberish,
      newDefiFactoryContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
