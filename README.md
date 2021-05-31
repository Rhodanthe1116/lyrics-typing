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

### Backend 🚧

- NestJS
- Postgres
- Graphql

### Service

- Musixmatch (need API-KEY)

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

```
test
```
