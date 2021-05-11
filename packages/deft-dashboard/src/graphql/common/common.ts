import gql from "graphql-tag";

export const someQuery = gql`
  query UserReferrals2lvl($address: ID!) {
    user(id: $address) {
      id
      reward
      referrer {
        id
      }
      referrals(first: 1000) {
        id
        reward
        referrals(first: 1000) {
          id
          reward
        }
      }
    }
  }
`;
