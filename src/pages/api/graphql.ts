import { ApolloServer } from 'apollo-server-micro'
import typeDefs from 'src/api/schema'
import resolvers from 'src/api/resolvers'

import MusixmatchAPI from 'src/api/datasources/musixmatch'

const apolloServer = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  dataSources: () => ({
    musixmatchAPI: new MusixmatchAPI(process?.env?.MUSIXMATCH_APIKEY),
  }),
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const startServer = apolloServer.start()

const enableCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*') // replace this your actual origin
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  return await fn(req, res)
}

export default enableCors(async (req, res) => {
  // specific logic for the preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  await startServer
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res)
})
