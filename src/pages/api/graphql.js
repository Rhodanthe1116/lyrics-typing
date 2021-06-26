require('dotenv').config()

import { ApolloServer } from 'apollo-server-micro'
import typeDefs from 'src/api/schema'
import resolvers from 'src/api/resolvers'

import MusixmatchAPI from 'src/api/datasources/musixmatch'

const apolloServer = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  dataSources: () => ({
    musixmatchAPI: new MusixmatchAPI(),
  }),
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })
