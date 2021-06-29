const nextConfig = {
  target:
    process.env.NODE_ENV !== 'production'
      ? 'server'
      : 'experimental-serverless-trace',
  dontAutoRegisterSw: true,
  generateSw: false,
  devSwSrc: './public/sw.js',
  workboxOpts: {
    swSrc: './public/sw.js',
    swDest: './public/service-worker.js',
  },
  env: {
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    NEXT_PUBLIC_GRAPHQL_REMOTE_SCHEMA_URL:
      process.env.NEXT_PUBLIC_GRAPHQL_REMOTE_SCHEMA_URL,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_DATABASE_URL:
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_COOKIE_SECURE: process.env.NEXT_PUBLIC_COOKIE_SECURE,
    NEXT_PUBLIC_LASTFM_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_LASTFM_PUBLIC_API_KEY,
  },
}

module.exports = nextConfig
