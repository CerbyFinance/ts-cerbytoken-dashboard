import gql from "graphql-tag";

export const inflationBucketQuery = gql`
  query InflationBucketQuery {
    inflationBuckets(orderBy: idx, orderDirection: asc) {
      id
      idx
      inflations
    }
  }
`;

export const stakesQuery = gql`
  query StakesQuery($address: String!) {
    stakes(
      where: { staker: $address }
      orderBy: startedAt
      orderDirection: desc
    ) {
      id
      staker {
        id
      }
      referrer {
        id
      }
      amountWise
      shares
      cmShares
      currentShares
      daiEquivalent
      reward
      penalty
      scrapedWise
      sharesPenalized
      referrerSharesPenalized
      scrapeCount
      startDay
      closeDay
      lockDays
      lastScrapeDay
      startedAt
      completedAt
      canceledAt
      timestamp
      blockNumber
      gasPrice
      gasUsed
    }
  }
`;
