import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/price_fetcher/graphql/",
  cache: new InMemoryCache(),
});

export default client;