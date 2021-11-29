import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { scalarTypePolicies } from "../graphql/policies";

export const noopApollo = new ApolloClient({
  link: new HttpLink({
    uri: ``,
  }),
  cache: new InMemoryCache({}),
});

const cerbies = ["avalanche", "fantom"];

export const clientByChain = Object.fromEntries(
  // ["kovan", "binance-test"].map(chain => {
  ["binance", "polygon", "avalanche", "fantom"].map(chain => {
    const client = new ApolloClient({
      link: new HttpLink({
        uri: `/subgraphs/name/${
          cerbies.includes(chain) ? "cerby" : "deft"
        }/staking-${chain}`,
        // uri: `https://app.cerby.fi/subgraphs/name/deft/staking-${chain}`,
        // uri: `https://bridge.defifactory.fi/subgraphs/name/deft/deft-bridge-${chain}`,
        // uri: `http://localhost:8000/subgraphs/name/deft/deft-bridge-${chain}`,
        // uri: `http://localhost:8000/subgraphs/name/deft/deft-bridge-${chain}`,
        // uri: `https://deft-graph.loca.lt/subgraphs/name/deft/deft-bridge-${chain}`,
      }),
      cache: new InMemoryCache({
        typePolicies: scalarTypePolicies,
      }),
    });

    return [chain, client];
  }),
);

// export const stakingClient = new ApolloClient({
//   link: from([
//     new HttpLink({
//       // uri: "http://localhost:8000/subgraphs/name/deft/staking",
//       // uri: "/subgraphs/name/deft/staking-kovan",
//       // uri: "https://deft-graph.loca.lt/subgraphs/name/deft/staking",
//       uri: "https://app.defifactory.fi/subgraphs/name/deft/staking-kovan",
//     }),
//   ]),
//   cache: new InMemoryCache({
//     typePolicies: scalarTypePolicies,
//   }),
// });
