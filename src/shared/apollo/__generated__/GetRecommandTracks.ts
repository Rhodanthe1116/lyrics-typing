/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRecommandTracks
// ====================================================

export interface GetRecommandTracks_recommandTracks {
  __typename: "Track";
  id: string;
  name: string;
  artistName: string;
  rating: number;
  numFavourite: number;
  artistId: string;
  albumId: string;
  albumName: string | null;
}

export interface GetRecommandTracks {
  recommandTracks: GetRecommandTracks_recommandTracks[];
}

export interface GetRecommandTracksVariables {
  artistId: string;
  albumId: string;
}
