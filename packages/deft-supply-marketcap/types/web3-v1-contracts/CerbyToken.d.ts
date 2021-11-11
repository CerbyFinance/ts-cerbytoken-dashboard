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

export interface CerbyToken extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): CerbyToken;
  clone(): CerbyToken;
  methods: {
    allowance(
      owner: string,
      spender: string
    ): NonPayableTransactionObject<string>;

    approve(
      _spender: string,
      _value: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    balanceOf(account: string): NonPayableTransactionObject<string>;

    burnByBridge(
      from: string,
      realAmountBurn: number | string | BN
    ): NonPayableTransactionObject<void>;

    burnHumanAddress(
      from: string,
      desiredAmountToBurn: number | string | BN
    ): NonPayableTransactionObject<void>;

    chargeCustomTax(
      from: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    getUtilsContractAtPos(
      pos: number | string | BN
    ): NonPayableTransactionObject<string>;

    mintByBridge(
      to: string,
      realAmountToMint: number | string | BN
    ): NonPayableTransactionObject<void>;

    mintHumanAddress(
      to: string,
      desiredAmountToMint: number | string | BN
    ): NonPayableTransactionObject<void>;

    totalSupply(): NonPayableTransactionObject<string>;

    transfer(
      recipient: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    transferCustom(
      sender: string,
      recipient: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    updateUtilsContracts(
      accessSettings: [boolean, boolean, boolean, boolean, boolean, string][]
    ): NonPayableTransactionObject<void>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}