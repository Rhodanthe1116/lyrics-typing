import { gql } from '@apollo/client'

export const TRACK_TILE_DATA = gql`
  fragment TrackTile on Track {
    __typename
    id
    name
    artistName
    rating
    numFavourite
    artistId
    albumId
  }
`

export const LYRICS_TILE_DATA = gql`
  fragment LyricsTile on Lyrics {
    __typename
    id
    body
    copyright
    updatedTime
  }
`

export const GET_CHART_TRACKS = gql`
  query GetChartTracks($country: String) {
    chartTracks(country: $country) {
      ...TrackTile
    }
  }
  ${TRACK_TILE_DATA}
`

export const SEARCH_TRACKS = gql`
  query SearchTracks($query: String, $artistId: ID) {
    tracks(query: $query, artistId: $artistId) {
      ...TrackTile
    }
  }
  ${TRACK_TILE_DATA}
`

export const GET_TRACK = gql`
  query GetTrack($id: ID!) {
    track(id: $id) {
      ...TrackTile
    }
  }
  ${TRACK_TILE_DATA}
`

export const GET_TRACK_WITH_LYRICS = gql`
  query GetTrackWithLyrics($id: ID!) {
    track(id: $id) {
      ...TrackTile

      lyrics {
        ...LyricsTile
      }
    }
  }
  ${TRACK_TILE_DATA}
  ${LYRICS_TILE_DATA}
`

export const GET_TRACKS_FROM_ALBUM = gql`
  query GetTracksFromAlbum($id: ID!) {
    tracksByAlbum(id: $id) {
      ...TrackTile
    }
  }
  ${TRACK_TILE_DATA}
`

export const GET_ALBUM = gql`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      name
      trackCount
      artistId
      coverart
    }
  }
`

export const GET_RECOMMAND_TRACKS = gql`
  query GetRecommandTracks($artistId: ID!, $albumId: ID!) {
    recommandTracks(artistId: $artistId, albumId: $albumId) {
      ...TrackTile
    }
  }
  ${TRACK_TILE_DATA}
`
export const GET_TYPING_RECORDS = gql`
  query GetTypingRecords {
    typing_record {
      id
      albumId
      albumName
      artistId
      artistName
      correctChar
      createdAt
      duration
      errorChar
      textLength
      trackId
      trackName
      userId
    }
  }
`

export const INSERT_TYPING_RECORD_ONE = gql`
  mutation InsertTypingRecordOne($object: typing_record_insert_input!) {
    insert_typing_record_one(object: $object) {
      albumId
      albumName
      artistId
      artistName
      correctChar
      createdAt
      duration
      errorChar
      id
      textLength
      trackId
      trackName
      userId
    }
  }
`
