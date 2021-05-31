require('dotenv').config();

import { ApolloServer } from 'apollo-server-micro'
import typeDefs from '../../apollo/schema'
const resolvers = require('../../apollo/resolvers');
// const { createStore } = require('../../apollo/utils');

const LaunchAPI = require('../../apollo/datasources/launch');
const MusixmatchAPI = require('../../apollo/datasources/musixmatch');
// const UserAPI = require('../../apollo/datasources/user');

// const store = createStore();
const isEmail = require('isemail');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = req.headers && req.headers.authorization || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] || null;
    return { user: { ...user.dataValues } };
    return ctx
  },
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    musixmatchAPI: new MusixmatchAPI(),
    // userAPI: new UserAPI({ store })
  })
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })