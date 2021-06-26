module.exports = {
  client: {
    name: 'Lyrics Typing',
    includes: ['./src/apollo'], // array of glob patterns
    // service: 'My Graph 2',
    service: {
      name: 'My Graph 2',
      //   url: 'http://localhost:3000/api/graphql',

      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
}
