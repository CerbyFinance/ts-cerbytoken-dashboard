import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { scalarTypePolicies } from "../graphql/policies";

export const stakingClient = new ApolloClient({
  link: from([
    new HttpLink({
      uri: "http://localhost:8000/subgraphs/name/deft/staking",
      // uri: "https://deft-graph.loca.lt/subgraphs/name/deft/staking",
    }),
  ]),
  cache: new InMemoryCache({
    typePolicies: scalarTypePolicies,
  }),
});
