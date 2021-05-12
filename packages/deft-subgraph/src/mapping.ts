import { BigInt } from "@graphprotocol/graph-ts";
import {
  BotTransactionDetected,
  MultiplierUpdated,
  ReferralRegistered,
  ReferrerReplaced,
  ReferrerRewardUpdated,
} from "../generated/NoBotsTech/NoBotsTech";
import { BotTransaction, Multiplier, User } from "../generated/schema";
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
  let ts = event.block.timestamp;

  let from = event.params.from;
  let to = event.params.to;
  let taxedAmount = event.params.taxedAmount;
  let transferAmount = event.params.transferAmount;

  let botTransaction = new BotTransaction(`${ts}-${from}-${to}`);
  botTransaction.timestamp = ts;
  botTransaction.from = from;
  botTransaction.to = to;
  botTransaction.taxedAmount = taxedAmount;
  botTransaction.transferAmount = transferAmount;
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
