// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Swap extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Swap entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Swap entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Swap", id.toString(), this);
  }

  static load(id: string): Swap | null {
    return store.get("Swap", id) as Swap | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get feedType(): string {
    let value = this.get("feedType");
    return value.toString();
  }

  set feedType(value: string) {
    this.set("feedType", Value.fromString(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    return value.toBytes();
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get from(): Bytes {
    let value = this.get("from");
    return value.toBytes();
  }

  set from(value: Bytes) {
    this.set("from", Value.fromBytes(value));
  }

  get to(): Bytes {
    let value = this.get("to");
    return value.toBytes();
  }

  set to(value: Bytes) {
    this.set("to", Value.fromBytes(value));
  }

  get deftInEth(): BigDecimal {
    let value = this.get("deftInEth");
    return value.toBigDecimal();
  }

  set deftInEth(value: BigDecimal) {
    this.set("deftInEth", Value.fromBigDecimal(value));
  }

  get deftInUsd(): BigDecimal {
    let value = this.get("deftInUsd");
    return value.toBigDecimal();
  }

  set deftInUsd(value: BigDecimal) {
    this.set("deftInUsd", Value.fromBigDecimal(value));
  }

  get amountDeft(): BigDecimal {
    let value = this.get("amountDeft");
    return value.toBigDecimal();
  }

  set amountDeft(value: BigDecimal) {
    this.set("amountDeft", Value.fromBigDecimal(value));
  }

  get amountDeftInEth(): BigDecimal {
    let value = this.get("amountDeftInEth");
    return value.toBigDecimal();
  }

  set amountDeftInEth(value: BigDecimal) {
    this.set("amountDeftInEth", Value.fromBigDecimal(value));
  }

  get amountDeftInUsd(): BigDecimal {
    let value = this.get("amountDeftInUsd");
    return value.toBigDecimal();
  }

  set amountDeftInUsd(value: BigDecimal) {
    this.set("amountDeftInUsd", Value.fromBigDecimal(value));
  }

  get transactionFeeInEth(): BigDecimal {
    let value = this.get("transactionFeeInEth");
    return value.toBigDecimal();
  }

  set transactionFeeInEth(value: BigDecimal) {
    this.set("transactionFeeInEth", Value.fromBigDecimal(value));
  }

  get transactionFeeInUsd(): BigDecimal {
    let value = this.get("transactionFeeInUsd");
    return value.toBigDecimal();
  }

  set transactionFeeInUsd(value: BigDecimal) {
    this.set("transactionFeeInUsd", Value.fromBigDecimal(value));
  }

  get logIndex(): BigInt {
    let value = this.get("logIndex");
    return value.toBigInt();
  }

  set logIndex(value: BigInt) {
    this.set("logIndex", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get price(): BigDecimal {
    let value = this.get("price");
    return value.toBigDecimal();
  }

  set price(value: BigDecimal) {
    this.set("price", Value.fromBigDecimal(value));
  }
}
