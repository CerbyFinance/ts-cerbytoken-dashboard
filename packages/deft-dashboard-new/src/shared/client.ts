import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { scalarTypePolicies } from "../graphql/policies";

export const stakingClient = new ApolloClient({
  link: from([
    new HttpLink({
      // uri: "http://localhost:8000/subgraphs/name/deft/staking",
      // uri: "/subgraphs/name/deft/staking-kovan",
      // uri: "https://deft-graph.loca.lt/subgraphs/name/deft/staking",
      uri: "https://app.defifactory.fi/subgraphs/name/deft/staking-kovan",
    }),
  ]),
  cache: new InMemoryCache({
    typePolicies: scalarTypePolicies,
  }),
});
