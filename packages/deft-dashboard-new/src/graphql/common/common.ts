import gql from "graphql-tag";
export const stakesQuery = gql`
  query Stakes($address: String!) {
    stakes(
      orderBy: startedAt
      orderDirection: desc
      where: { owner: $address }
    ) {
      id
      startedAt
      canceledAt
      completedAt
      owner {
        id
      }

      startDay
      lockDays
      endDay
      interest
      stakedAmount
      sharesCount
    }
  }
`;

export const snapshotsAndInterestQuery = gql`
  query SnapshotsAndInterest {
    cachedInterestPerShares(
      first: 1000
      orderDirection: asc
      orderBy: sealedDay
    ) {
      id
      sealedDay
      sealedCachedDay
      cachedInterestPerShare
    }

    dailySnapshots(first: 1000, orderDirection: asc, orderBy: sealedDay) {
      id
      sealedDay
      inflationAmount
      totalShares
      sharePrice
      totalStaked
      totalSupply
    }
  }
`;

export const stakeQuery = gql`
  query Stake($id: ID!) {
    stakes(where: { id: $id }) {
      id
    }
  }
`;
