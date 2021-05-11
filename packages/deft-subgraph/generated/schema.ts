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

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save User entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save User entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("User", id.toString(), this);
  }

  static load(id: string): User | null {
    return store.get("User", id) as User | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get reward(): BigInt {
    let value = this.get("reward");
    return value.toBigInt();
  }

  set reward(value: BigInt) {
    this.set("reward", Value.fromBigInt(value));
  }

  get referrer(): string | null {
    let value = this.get("referrer");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set referrer(value: string | null) {
    if (value === null) {
      this.unset("referrer");
    } else {
      this.set("referrer", Value.fromString(value as string));
    }
  }

  get referrals(): Array<string> {
    let value = this.get("referrals");
    return value.toStringArray();
  }

  set referrals(value: Array<string>) {
    this.set("referrals", Value.fromStringArray(value));
  }

  get referralsCount(): BigInt {
    let value = this.get("referralsCount");
    return value.toBigInt();
  }

  set referralsCount(value: BigInt) {
    this.set("referralsCount", Value.fromBigInt(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }
}

export class BotTransaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BotTransaction entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BotTransaction entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BotTransaction", id.toString(), this);
  }

  static load(id: string): BotTransaction | null {
    return store.get("BotTransaction", id) as BotTransaction | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
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

  get taxedAmount(): BigInt {
    let value = this.get("taxedAmount");
    return value.toBigInt();
  }

  set taxedAmount(value: BigInt) {
    this.set("taxedAmount", Value.fromBigInt(value));
  }

  get transferAmount(): BigInt {
    let value = this.get("transferAmount");
    return value.toBigInt();
  }

  set transferAmount(value: BigInt) {
    this.set("transferAmount", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class Multiplier extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Multiplier entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Multiplier entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Multiplier", id.toString(), this);
  }

  static load(id: string): Multiplier | null {
    return store.get("Multiplier", id) as Multiplier | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }
}
