import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";

export const nobotsClient = new ApolloClient({
  link: from([
    // new RetryLink(),
    // new MyAuthLink(),
    new HttpLink({
      // uri: "http://localhost:8000/subgraphs/name/deft/deft",
      uri: "https://deft-graph.loca.lt/subgraphs/name/deft/deft",
      // uri: "https://strong-crab-5.loca.lt/subgraphs/name/deft/deft",
      // headers: {
      //   "Bypass-Tunnel-Reminder": true,
      // },
    }),
  ]),
  cache: new InMemoryCache({
    // typePolicies: scalarTypePolicies,
  }),
});
