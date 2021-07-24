import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { scalarTypePolicies } from "../graphql/graphql-types";

export const noopApollo = new ApolloClient({
  link: new HttpLink({
    uri: ``,
  }),
  cache: new InMemoryCache({}),
});

export const clientByChain = Object.fromEntries(
  ["kovan", "binance-test"].map(chain => {
    // ["ethereum", "binance"].map(chain => {
    const client = new ApolloClient({
      link: new HttpLink({
        // uri: `/subgraphs/name/deft/deft-bridge-${chain}-${token}`,
        // uri: `http://localhost:8000/subgraphs/name/deft/deft-bridge-${chain}`,
        // uri: `http://localhost:8000/subgraphs/name/deft/deft-bridge-${chain}`,
        uri: `https://deft-graph.loca.lt/subgraphs/name/deft/deft-bridge-${chain}`,
      }),
      cache: new InMemoryCache({
        typePolicies: scalarTypePolicies,
      }),
    });

    return [chain, client];
  }),
);
