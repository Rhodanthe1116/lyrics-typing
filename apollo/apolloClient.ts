import {
  ApolloClient,
  HttpLink,
  NormalizedCacheObject,
  gql,
  from,
} from '@apollo/client'
import firebase from 'firebase/app'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { logout } from 'shared/auth/utils/firebase'
import { cache } from './cache'

// let idToken

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`

// const requestAccessToken = async () => {
//   if (idToken) return

//   idToken = await firebase.auth().currentUser?.getIdToken()
// }

const authMiddleware = setContext(async () => {
  // await requestAccessToken()
  const idToken = await firebase.auth().currentUser?.getIdToken()
  if (!idToken) {
    return
  }

  return {
    headers: {
      Authorization: `Bearer ${idToken}`,
      'x-hasura-role': 'user',
    },
  }
})

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL || '/api/graphql',
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log('errorLink')
  if (graphQLErrors)
    graphQLErrors.map(({ extensions }) => {
      switch (extensions?.code) {
        case 'invalid-jwt':
          console.log('not authenticated')
          logout()
          break
        default:
          // component-level error.
          // should show snackBar in components.
          console.log(extensions?.code)
      }
    })
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
    // Not important. May be implemented in the future.
    // props.history.push('/network-error') // redirect to network-error route
  }
})

// Initialize ApolloClient
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: from([errorLink, authMiddleware, httpLink]),
  cache,
  typeDefs,
})

export default client
