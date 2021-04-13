/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrackWithLyrics
// ====================================================

export interface GetTrackWithLyrics_track_lyrics {
  __typename: "Lyrics";
  id: string;
  body: string;
  copyright: string;
  updatedTime: string;
}

export interface GetTrackWithLyrics_track {
  __typename: "Track";
  id: string;
  name: string;
  artistName: string;
  rating: number;
  numFavourite: number;
  lyrics: GetTrackWithLyrics_track_lyrics | null;
}

export interface GetTrackWithLyrics {
  track: GetTrackWithLyrics_track | null;
}

export interface GetTrackWithLyricsVariables {
  id: string;
}
