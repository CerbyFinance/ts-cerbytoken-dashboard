import { BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/DefiFactoryToken/DefiFactoryToken";
import {
  BotTransactionDetected,
  MultiplierUpdated,
  ReferralRegistered,
  ReferrerReplaced,
  ReferrerRewardUpdated,
} from "../generated/NoBotsTech/NoBotsTech";
import { BotTransaction, Global, Multiplier, User } from "../generated/schema";
import { ONE_BI, ZERO_BI } from "./helpers";

export function handleMultiplierUpdated(event: MultiplierUpdated): void {
  let multiplier = Multiplier.load("1");
  if (multiplier === null) {
    multiplier = new Multiplier("1");
  }
  multiplier.value = event.params.newMultiplier;
  multiplier.save();
}

export function handleBotTransactionDetected(
  event: BotTransactionDetected,
): void {
  let global = Global.load("1");

  if (!global) {
    global = new Global("1");
    global.botTaxed = ZERO_BI;
    global.userTaxed = ZERO_BI;
    global.totalTaxed = ZERO_BI;
  }

  global.botTaxed = global.botTaxed.plus(event.params.taxedAmount);
  global.userTaxed = global.totalTaxed.minus(global.botTaxed);
  global.save();

  let ts = event.block.timestamp;

  let from = event.params.from;
  let to = event.params.to;
  let taxedAmount = event.params.taxedAmount;
  let transferAmount = event.params.transferAmount;

  let botTransaction = new BotTransaction(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );
  botTransaction.timestamp = ts;
  botTransaction.from = from;
  botTransaction.to = to;
  botTransaction.taxedAmount = taxedAmount;
  botTransaction.transferAmount = transferAmount;
  botTransaction.txHash = event.transaction.hash;
  botTransaction.gasPrice = event.transaction.gasPrice;
  botTransaction.gasUsed = event.transaction.gasUsed;
  botTransaction.save();
}

function getOrCreateUser(id: string, blockTs: BigInt): User | null {
  let user = User.load(id);

  if (user === null) {
    user = new User(id);
    user.referrer = null;
    user.reward = ZERO_BI;
    user.referralsCount = ZERO_BI;
    user.createdAt = blockTs;
    user.save();
  }

  return user;
}

export function handleReferrerRewardUpdated(
  event: ReferrerRewardUpdated,
): void {
  let blockTs = event.block.timestamp;

  let amount = event.params.amount;
  let referrer = event.params.referrer.toHexString();

  let _referrer = getOrCreateUser(referrer, blockTs);

  _referrer.reward = amount;
  _referrer.save();
}

export function handleReferralRegistered(event: ReferralRegistered): void {
  let blockTs = event.block.timestamp;

  let referral = event.params.referral.toHexString();
  let referrer = event.params.referrer.toHexString();

  let _referral = getOrCreateUser(referral, blockTs);

  let _referrer = getOrCreateUser(referrer, blockTs);
  _referrer.referralsCount = _referrer.referralsCount.plus(ONE_BI);

  _referral.referrer = _referrer.id;
  _referral.save();
  _referrer.save();
}

export function handleReferrerReplaced(event: ReferrerReplaced): void {
  let blockTs = event.block.timestamp;

  let referral = event.params.referral.toHexString();
  let referrerFrom = event.params.referrerFrom.toHexString();
  let referrerTo = event.params.referrerTo.toHexString();

  let _referral = getOrCreateUser(referral, blockTs);

  let _referrerFrom = getOrCreateUser(referrerFrom, blockTs);
  let _referrerTo = getOrCreateUser(referrerTo, blockTs);

  _referrerFrom.referralsCount = _referrerFrom.referralsCount.minus(ONE_BI);
  _referrerTo.referralsCount = _referrerTo.referralsCount.plus(ONE_BI);

  _referral.referrer = _referrerTo.id;
  _referral.save();
  _referrerFrom.save();
  _referrerTo.save();
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleDefiFactoryTransfer(event: Transfer): void {
  if (event.params.to.toHexString() != ZERO_ADDRESS) {
    return;
  }

  let global = Global.load("1");

  if (!global) {
    global = new Global("1");
    global.botTaxed = ZERO_BI;
    global.userTaxed = ZERO_BI;
    global.totalTaxed = ZERO_BI;
  }

  global.totalTaxed = global.totalTaxed.plus(event.params.value);
  global.userTaxed = global.totalTaxed.minus(global.botTaxed);
  global.save();
}
