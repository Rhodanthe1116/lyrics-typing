/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrack
// ====================================================

export interface GetTrack_track {
  __typename: "Track";
  id: string;
  name: string;
  artistName: string;
  rating: number;
  numFavourite: number;
}

export interface GetTrack {
  track: GetTrack_track | null;
}

export interface GetTrackVariables {
  id: string;
}
