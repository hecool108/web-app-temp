import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from './hasura/apollo';
const apolloClient = getApolloClient()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <ApolloProvider client={apolloClient}>
      <App />
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>
)
