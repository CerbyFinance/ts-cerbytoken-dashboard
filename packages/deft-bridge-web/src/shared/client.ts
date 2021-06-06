import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { scalarTypePolicies } from "../graphql/graphql-types";

export const clientByChain = Object.fromEntries(
  ["ropsten", "kovan"].map(chain => {
    const client = new ApolloClient({
      link: new HttpLink({
        uri: `http://localhost:8000/subgraphs/name/deft/deft-bridge-${chain}`,
      }),
      cache: new InMemoryCache({
        typePolicies: scalarTypePolicies,
      }),
    });

    return [chain, client];
  }),
);
