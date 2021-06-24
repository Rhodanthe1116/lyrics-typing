# Lyrics Typing

This is a typing game where you can learn lyrics and language!

[Link](https://lyrics-typing.vercel.app/)

## Features

- Multi-language support. (It is now optimized for Japanese.)
- Huge amount of lyrics powered by MusixMatch.
- It's mobile-first so you can learn anywhere, anytime.
- 🚧Track your learning progress with your account.

## Tech Stack

### Frontend

- [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html) (maybe you only need to know the basic concepts in GetStarted)
- [Next.js](https://nextjs.org/docs/getting-started) (SSG + Client side data fetching)
- [Tailwind CSS](https://tailwindcss.com/docs) (like normal CSS)
- 🚧 [Apollo Graphql Client](https://www.apollographql.com/docs/react/)

#### Tutorials

<https://www.apollographql.com/blog/typescript-graphql-code-generator-generate-graphql-types-with-apollo-codegen-tutorial/>

### Backend 🚧

- NestJS
- Postgres
- Graphql

### Service

- [Musixmatch](https://developer.musixmatch.com/documentation/api-reference/track-chart-get) (need API-KEY)

## Start dev.

prepare .env

```
NEXT_PUBLIC_MUSIXMATCH_APIKEY=xxx
APOLLO_KEY=service:xxxxx
APOLLO_GRAPH_VARIANT=current
APOLLO_SCHEMA_REPORTING=true
```

start dev server

```
yarn dev
```

### IMPORTANT

https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html

```
// ❌ Don't use string concatenation to create class names
<div class="text-{{  error  ?  'red'  :  'green'  }}-600"></div>

// ✅ Do dynamically select a complete class name
<div class="{{  error  ?  'text-red-600'  :  'text-green-600'  }}"></div>
```

### Linting & Formatting

```bash
yarn add -D
 @types/eslint
    @typescript-eslint/eslint-plugin
    @typescript-eslint/parser
    eslint
    eslint-config-airbnb
    eslint-config-prettier
    eslint-import-resolver-typescript
    eslint-plugin-import
    eslint-plugin-jsx-a11y
    eslint-plugin-prettier
    eslint-plugin-react
    eslint-plugin-react-hooks
```

### firebase & hasura

#### Tutorial

https://hasura.io/blog/authentication-and-authorization-using-hasura-and-firebase/

Important note: 

- upgrade firebase-admin version
- `admin.initializeApp()`
