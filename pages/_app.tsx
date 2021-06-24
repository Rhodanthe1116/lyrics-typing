import { AppProps } from 'next/app'
import '../globals.css'

import { ApolloProvider } from '@apollo/client'
import client from '../apollo/apolloClient'
import AuthProvider from 'shared/auth/context/authUser'
import AuthLayout from 'shared/auth/components/AuthLayout'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AuthLayout requiredLogin={pageProps.requiredLogin}>
          <Component {...pageProps} />
        </AuthLayout>
      </AuthProvider>
    </ApolloProvider>
  )
}
