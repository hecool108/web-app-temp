import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    split,
  } from '@apollo/client';
  import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
  import { setContext } from '@apollo/client/link/context';
  import { createClient } from 'graphql-ws';
  import { getMainDefinition } from '@apollo/client/utilities';
  let client: any;
  
  class AIMWebSocket extends WebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      super(url, protocols);
    }
  }
  
  export const getApolloClient = () => {
    if (client !== undefined) return client;
    const wsLink = new GraphQLWsLink(
      createClient({
        url: import.meta.env.VITE_HASURA_TARGET_WSS,
        webSocketImpl: AIMWebSocket,
      })
    );
  
    const httpLink = createHttpLink({
      uri: import.meta.env.VITE_HASURA_TARGET,
    });
    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem('gb-tk') || '';
      const newHeaders =
        token === ''
          ? {
              ...headers,
              'x-hasura-role': 'public',
            }
          : {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            };
      return {
        headers: newHeaders,
      };
    });
  
    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink)
    );
  
    client = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });
    return client;
  };
  