import { AppProps } from 'next/app'
import '../globals.css'

import { ApolloProvider } from "@apollo/client";
import client from "../apollo/apolloClient";


export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}