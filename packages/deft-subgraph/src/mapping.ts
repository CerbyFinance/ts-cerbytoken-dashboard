import {
  BotTransactionDetected,
  MultiplierUpdated,
  ReferralRegistered,
  ReferrerReplaced,
  ReferrerRewardUpdated,
} from "../generated/NoBotsTech/NoBotsTech";
import { BotTransaction, Multiplier, User } from "../generated/schema";
import { ZERO_BI } from "./helpers";

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

export function handleReferrerRewardUpdated(
  event: ReferrerRewardUpdated,
): void {
  let amount = event.params.amount;
  let referrer = event.params.referral;

  let user = User.load(referrer.toHexString());
  if (user === null) {
    user = new User(referrer.toHexString());
    user.referrer = null;
    user.reward = ZERO_BI;
  }

  user.reward = amount;
  user.save();
}

export function handleReferralRegistered(event: ReferralRegistered): void {
  let referral = event.params.referral;
  let referrer = event.params.referrer;

  let _referral = User.load(referral.toHexString());
  if (_referral === null) {
    _referral = new User(referral.toHexString());
    _referral.referrer = null;
    _referral.reward = ZERO_BI;
  }

  let _referrer = User.load(referrer.toHexString());
  if (_referrer === null) {
    _referrer = new User(referrer.toHexString());
    _referrer.referrer = null;
    _referrer.reward = ZERO_BI;
    _referrer.save();
  }

  _referral.referrer = _referrer.id;
  _referral.save();
}

export function handleReferrerReplaced(event: ReferrerReplaced): void {
  let referral = event.params.referral;
  let referrerFrom = event.params.referrerFrom;
  let referrerTo = event.params.referrerTo;

  let user = User.load(referral.toHexString());
  if (user === null) {
    user = new User(referral.toHexString());
    user.referrer = null;
    user.reward = ZERO_BI;
  }

  let _referrer = User.load(referrerTo.toHexString());
  if (_referrer === null) {
    _referrer = new User(referrerTo.toHexString());
    _referrer.referrer = null;
    _referrer.reward = ZERO_BI;
    _referrer.save();
  }

  user.referrer = _referrer.id;
  user.save();
}
