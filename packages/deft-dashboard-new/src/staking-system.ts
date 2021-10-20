// all necessary code from contract

import { CachedInterestPerShare, DailySnapshot } from "./graphql/types";

export const START_DATE = 1634716660;
const ONE_DAY = 600;

const now = () => Date.now() / 1000;

export const getCurrentDay = () => {
  return Math.floor((now() - START_DATE) / ONE_DAY);
};

const MINIMUM_DAYS_FOR_HIGH_PENALTY = 0;
export const DAYS_IN_ONE_YEAR = 10;
export const CONTROLLED_APY = 40;

const SHARE_PRICE_DENORM = 1e18;
const SHARE_MULTIPLIER_NUMERATOR = 5;
const SHARE_MULTIPLIER_DENOMINATOR = 2;
const CACHED_DAYS_INTEREST = 10;
const INTEREST_PER_SHARE_DENORM = 1e18;
const END_STAKE_FROM = 7;
const END_STAKE_TO = 2 * DAYS_IN_ONE_YEAR;

export const deftShortCurrency = (amount: number, label: string = "DEFT") => {
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

  let dayBeforeStakeStart = Math.min(
    stake.startDay - 1,
    dailySnapshots.length - 1,
  );

  if (dailySnapshots.length === 0) {
    return 0;
  }

  // prettier-ignore
  let sharesCount =
    (stake.stakedAmount * SHARE_PRICE_DENORM) /  dailySnapshots[dayBeforeStakeStart].sharePrice +
    (SHARE_MULTIPLIER_NUMERATOR * numberOfDaysServed * stake.stakedAmount * SHARE_PRICE_DENORM) /
      (SHARE_MULTIPLIER_DENOMINATOR * 10 * DAYS_IN_ONE_YEAR * dailySnapshots[dayBeforeStakeStart].sharePrice);

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
