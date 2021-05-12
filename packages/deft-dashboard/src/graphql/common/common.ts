import gql from "graphql-tag";

export const someQuery = gql`
  query Multiplier {
    multiplier(id: 1) {
      id
      value
    }
  }

  query UserReferrals2lvl($address: ID!) {
    user(id: $address) {
      id
      createdAt
      referralsCount
      referrer {
        id
        referralsCount
      } # lvl 1
      referrals(first: 1000) {
        id
        createdAt
        referralsCount
        referrer {
          id
          referralsCount
        }
        # lvl 2
        referrals(first: 1000) {
          id
          createdAt
          referralsCount
          referrer {
            id
            referralsCount
          }
        }
      }
    }
  }
`;
