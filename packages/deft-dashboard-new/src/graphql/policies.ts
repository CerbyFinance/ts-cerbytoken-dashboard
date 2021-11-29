import { FieldPolicy } from "@apollo/client";

export const numberTypePolicy: FieldPolicy<number, string> = {
  // @ts-ignore
  merge: (_, incoming, a) => {
    return Number(incoming);
  },
};

export const scalarTypePolicies = {
  CachedInterestPerShare: {
    fields: {
      sealedDay: numberTypePolicy,
      sealedCachedDay: numberTypePolicy,
      cachedInterestPerShare: numberTypePolicy,
    },
  },
  MaxSharePrice: {
    fields: {
      sharePrice: numberTypePolicy,
    },
  },
  DailySnapshot: {
    fields: {
      sealedDay: numberTypePolicy,
      inflationAmount: numberTypePolicy,
      totalShares: numberTypePolicy,
      sharePrice: numberTypePolicy,
      totalStaked: numberTypePolicy,
      totalSupply: numberTypePolicy,
    },
  },
  Global: {
    fields: {
      userCount: numberTypePolicy,
      stakeCount: numberTypePolicy,
      stakerCount: numberTypePolicy,
    },
  },
  User: {
    fields: {
      stakedAmount: numberTypePolicy,
    },
  },
  Stake: {
    fields: {
      stakedAmount: numberTypePolicy,
      startDay: numberTypePolicy,
      lockDays: numberTypePolicy,
      endDay: numberTypePolicy,
      interest: numberTypePolicy,
      penalty: numberTypePolicy,
      sharesCount: numberTypePolicy,
      startedAt: numberTypePolicy,
      completedAt: numberTypePolicy,
      canceledAt: numberTypePolicy,
      timestamp: numberTypePolicy,
      blockNumber: numberTypePolicy,
      gasPrice: numberTypePolicy,
      gasUsed: numberTypePolicy,
    },
  },
};
