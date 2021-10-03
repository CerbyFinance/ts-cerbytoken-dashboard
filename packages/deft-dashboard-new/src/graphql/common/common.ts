import gql from "graphql-tag";
export const stakesQuery = gql`
  query StakesQuery {
    stakes(orderBy: startedAt, orderDirection: desc) {
      id
      startedAt
      canceledAt
      completedAt
      interest
      stakedAmount
    }
  }
`;
