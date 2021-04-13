/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchTracks
// ====================================================

export interface SearchTracks_tracks {
  __typename: "Track";
  id: string;
  name: string;
  artistName: string;
  rating: number;
  numFavourite: number;
}

export interface SearchTracks {
  tracks: (SearchTracks_tracks | null)[] | null;
}

export interface SearchTracksVariables {
  query?: string | null;
}
