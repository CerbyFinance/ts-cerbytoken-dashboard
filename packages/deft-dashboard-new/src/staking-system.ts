// all necessary code from contract

import { CachedInterestPerShare, DailySnapshot } from "./graphql/types";

export const START_DATE = 1635552000;
const SECONDS_IN_ONE_DAY = 86400; // 600;

const now = () => Date.now() / 1000;

export const getCurrentDay = () => {
  return (
    Math.floor(now() / SECONDS_IN_ONE_DAY) -
    Math.floor(START_DATE / SECONDS_IN_ONE_DAY) +
    1
  );
};

// const MINIMUM_DAYS_FOR_HIGH_PENALTY = 0;
export const DAYS_IN_ONE_YEAR = 365;
// export const CONTROLLED_APY = 40;

export const MINIMUM_SMALLER_PAYS_BETTER = 1000; // 1000 deft
export const MAXIMUM_SMALLER_PAYS_BETTER = 1000000; // 1 million deft
const INTEREST_PER_SHARE_DENORM = 1e18;
// ---

const SHARE_PRICE_DENORM = 1e18;
const SHARE_MULTIPLIER_NUMERATOR = 300;
const SHARE_MULTIPLIER_DENOMINATOR = 100;
const CACHED_DAYS_INTEREST = 100;
// const END_STAKE_FROM = 30;
// const END_STAKE_TO = 2 * DAYS_IN_ONE_YEAR;

export const APY_DENORM = 1e6;

const MINIMUM_DAYS_FOR_HIGH_PENALTY = 0;
export const CONTROLLED_APY = 4e5; // 40%
const END_STAKE_FROM = 30;
const END_STAKE_TO = 2 * DAYS_IN_ONE_YEAR; // TODO: 5% per month penalty
const MINIMUM_STAKE_DAYS = 1;
const MAXIMUM_STAKE_DAYS = 100 * DAYS_IN_ONE_YEAR;
const LONGER_PAYS_BETTER_BONUS = 3e6; // 3e6/1e6 = 300% shares bonus max
export const SMALLER_PAYS_BETTER_BONUS = 25e4; // 25e4/1e6 = 25% shares bonus max

export const deftShortCurrency = (amount: number, label: string = "Cerby") => {
  let shortAmount = "";
  let absAmount = Math.abs(amount);
  if (absAmount > 1e9) {
    shortAmount = (amount / 1e9).asCurrency(3) + " B-" + label;
  } else if (absAmount > 1e6) {
    shortAmount = (amount / 1e6).asCurrency(3) + " M-" + label;
  } else if (absAmount > 1e3) {
    shortAmount = (amount / 1e3).asCurrency(3) + " K-" + label;
  } else {
    shortAmount = amount.asCurrency(3) + " " + label;
  }

  return shortAmount;
};

export function getSharesCountByStake(
  dailySnapshots: DailySnapshot[],
  stake: {
    lockedForXDays: number;
    startDay: number;
    stakedAmount: number;
  },
  givenDay: number,
) {
  let numberOfDaysServed;
  if (givenDay == 0) {
    numberOfDaysServed = stake.lockedForXDays;
  } else if (givenDay > stake.startDay) {
    numberOfDaysServed = givenDay - stake.startDay;
  } // givenDay > 0 && givenDay < stake.startDay
  else {
    return 0;
  }

  numberOfDaysServed = Math.min(numberOfDaysServed, 10 * DAYS_IN_ONE_YEAR);

  // let startDay = stake.startDay;

  let startDay = Math.min(stake.startDay, dailySnapshots.length - 1);

  // let dayBeforeStakeStart = Math.min(
  //   stake.startDay - 1,
  //   dailySnapshots.length - 1,
  // );

  if (dailySnapshots.length === 0) {
    return 0;
  }

  // prettier-ignore

  let initialSharesCount = 
            (stake.stakedAmount * SHARE_PRICE_DENORM) / dailySnapshots[startDay].sharePrice;
  let longerPaysBetterSharesCount =
    (LONGER_PAYS_BETTER_BONUS *
      numberOfDaysServed *
      stake.stakedAmount *
      SHARE_PRICE_DENORM) /
    (APY_DENORM * 10 * DAYS_IN_ONE_YEAR * dailySnapshots[startDay].sharePrice);

  let smallerPaysBetterSharesCountMultiplier;
  if (stake.stakedAmount <= MINIMUM_SMALLER_PAYS_BETTER) {
    smallerPaysBetterSharesCountMultiplier =
      APY_DENORM + SMALLER_PAYS_BETTER_BONUS;
  } else if (
    MINIMUM_SMALLER_PAYS_BETTER < stake.stakedAmount &&
    stake.stakedAmount < MAXIMUM_SMALLER_PAYS_BETTER
  ) {
    smallerPaysBetterSharesCountMultiplier =
      APY_DENORM +
      (SMALLER_PAYS_BETTER_BONUS *
        (MAXIMUM_SMALLER_PAYS_BETTER - stake.stakedAmount)) /
        (MAXIMUM_SMALLER_PAYS_BETTER - MINIMUM_SMALLER_PAYS_BETTER);
  } // MAXIMUM_SMALLER_PAYS_BETTER >= stake.stakedAmount
  else {
    smallerPaysBetterSharesCountMultiplier = APY_DENORM;
  }

  let sharesCount =
    ((initialSharesCount + longerPaysBetterSharesCount) *
      smallerPaysBetterSharesCountMultiplier) /
    APY_DENORM;

  return sharesCount / 1e18;
}

export function getInterestByStake(
  dailySnapshots: DailySnapshot[],
  cachedInterestPerShare: CachedInterestPerShare[],
  stake: {
    lockedForXDays: number;
    startDay: number;
    stakedAmount: number;
  },
  givenDay: number,
) {
  if (givenDay <= stake.startDay) return 0;

  let interest = 0;

  let endDay = Math.min(givenDay, stake.startDay + stake.lockedForXDays);
  endDay = Math.min(endDay, dailySnapshots.length);

  let sharesCount = getSharesCountByStake(dailySnapshots, stake, endDay);

  let startCachedDay = Math.floor(stake.startDay / CACHED_DAYS_INTEREST + 1);
  let endBeforeFirstCachedDay = Math.min(
    endDay,
    startCachedDay * CACHED_DAYS_INTEREST,
  );

  for (let i = stake.startDay; i < endBeforeFirstCachedDay; i++) {
    if (dailySnapshots[i].totalShares == 0) continue;

    interest +=
      (dailySnapshots[i].inflationAmount * sharesCount) /
      dailySnapshots[i].totalShares;
  }

  // TODO: check first cached day = 0
  let endCachedDay = Math.floor(endDay / CACHED_DAYS_INTEREST);
  for (let i = startCachedDay; i < endCachedDay; i++) {
    interest += cachedInterestPerShare[i].cachedInterestPerShare * sharesCount; // / INTEREST_PER_SHARE_DENORM;
  }

  let startAfterLastCachedDay = endDay - (endDay % CACHED_DAYS_INTEREST);

  if (startAfterLastCachedDay > stake.startDay) {
    // do not double iterate if numberOfDaysServed < CACHED_DAYS_INTEREST
    for (let i = startAfterLastCachedDay; i < endDay; i++) {
      if (dailySnapshots[i].totalShares == 0) continue;

      interest +=
        (dailySnapshots[i].inflationAmount * sharesCount) /
        dailySnapshots[i].totalShares;
    }
  }

  return interest;
}

export function getPenaltyByStake(
  stake: {
    lockedForXDays: number;
    startDay: number;
    stakedAmount: number;
  },
  givenDay: number,
  interest: number,
) {
  /*
0 -- 0 days served => 0% principal back
0 days -- 100% served --> 0-100% principal back
100% + 30 days --> 100% principal back
100% + 30 days -- 100% + 30 days + 30*20 days --> 100-10% (principal+interest) back
> 100% + 30 days + 30*20 days --> 10% (principal+interest) back
*/
  let penalty;
  let howManyDaysServed =
    givenDay > stake.startDay ? givenDay - stake.startDay : 0;
  let riskAmount = stake.stakedAmount + interest;

  if (howManyDaysServed <= MINIMUM_DAYS_FOR_HIGH_PENALTY) {
    // Stake just started or less than 7 days passed)
    penalty = riskAmount; // 100%
  } else if (howManyDaysServed <= stake.lockedForXDays) {
    // 100-0%
    penalty =
      (riskAmount * (stake.lockedForXDays - howManyDaysServed)) /
      (stake.lockedForXDays - MINIMUM_DAYS_FOR_HIGH_PENALTY);
  } else if (howManyDaysServed <= stake.lockedForXDays + END_STAKE_FROM) {
    penalty = 0;
  } else if (
    howManyDaysServed <=
    stake.lockedForXDays + END_STAKE_FROM + END_STAKE_TO
  ) {
    // 0-90%
    penalty =
      (riskAmount *
        9 *
        (howManyDaysServed - stake.lockedForXDays - END_STAKE_FROM)) /
      (10 * END_STAKE_TO);
  } // if (howManyDaysServed > stake.lockedForXDays + END_STAKE_FROM + END_STAKE_TO)
  else {
    // 90%
    penalty = (riskAmount * 9) / 10;
  }

  return penalty;
}
