import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";

export const nobotsClient = new ApolloClient({
  link: from([
    // new RetryLink(),
    // new MyAuthLink(),
    new HttpLink({
      uri: "http://localhost:8000/subgraphs/name/deft/deft",
    }),
  ]),
  cache: new InMemoryCache({
    // typePolicies: scalarTypePolicies,
  }),
});
