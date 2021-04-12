import {
  ApolloClient,
  NormalizedCacheObject,
  gql,  
} from '@apollo/client';
import { cache } from './cache';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`;
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

// Initialize ApolloClient
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  cache,
  uri: 'https://3000-black-bonobo-6oq2sa6m.ws-us03.gitpod.io/api/graphql',
  headers: {
    authorization:  typeof window !== 'undefined' ? (localStorage.getItem('token') || '') : '',
  },
  typeDefs,

});

export default client;
