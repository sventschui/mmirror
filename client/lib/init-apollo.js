import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import log from './log';

// eslint-disable-next-line no-undef
const fetch = typeof window !== 'undefined' ? window.fetch : require('node-fetch');

let apolloClient = null;

if (!process.browser) {
  // Polyfill fetch() on the server (used by apollo-client)
  global.fetch = fetch;
}

function create(initialState) {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        log.log('[GraphQL error]: Message: %s, Location: %j, Path: %j', message, locations, path),
      );
    if (networkError) {
      log.log('[Network error]: %j', networkError);
    }
  });

  const httpLink = new HttpLink({
    uri: 'https://localhost:3001/graphql',
    credentials: 'same-origin',
  });

  const networkLink = process.browser
    ? split(
        // split based on operation type
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        new WebSocketLink({
          uri: `wss://localhost:3001/graphql`,
          options: {
            reconnect: true,
          },
        }),
        httpLink,
      )
    : httpLink;

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([errorLink, networkLink]),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
