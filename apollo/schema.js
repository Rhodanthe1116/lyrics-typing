import { gql } from 'apollo-server-micro'

const typeDefs = gql`

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }
  
  type Rocket {
    id: ID!
    name: String
    type: String
  }
  
  type User {
    id: ID!
    email: String!
    trips: [Launch]!
    token: String
  }
  
  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }
  
  enum PatchSize {
    SMALL
    LARGE
  }

  type Track {
    id: ID!
    name: String!
    rating: Int!
    numFavourite: Int!
    
    artistName: String!
    artistId:String,
    albumId: String,
    
    album: Album
    artist: Artist
    lyrics: Lyrics
  }

  type Lyrics {
    id: ID!
    instrumental: Boolean
    body: String!
    language: String
    scriptTrackingUrl: String
    pixelTrackingUrl: String
    copyright: String!
    backlinkUrl: String
    updatedTime: String!
  }

  type Artist {
    id: ID!
    mbid: String
    name: String!
    country: String
    rating: Int
    updatedTime: String
  }

  type Album {
    id: ID!
    name: String!
    trackCount: Int
    artistId: ID
    coverart: String

    artist: Artist
  }

  type Query {
    launches( # replace the current launches query with this one.
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User

    chartTracks(country: String): [Track]
    tracks(query: String,artistId: ID): [Track!]!
    track(id: ID!): Track
    artist(id: ID!): Artist
    album(id: ID!): Album
    tracksByAlbum(id: ID!): [Track!]!
    recommandTracks(artistId: ID!, albumId: ID!): [Track!]!
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """
  type LaunchConnection { # add this below the Query type as an additional type.
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): User
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }
`

export default typeDefs