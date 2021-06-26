/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTracksFromAlbum
// ====================================================

export interface GetTracksFromAlbum_tracksByAlbum {
  __typename: "Track";
  id: string;
  name: string;
  artistName: string;
  rating: number;
  numFavourite: number;
  artistId: string;
  albumId: string;
}

export interface GetTracksFromAlbum {
  tracksByAlbum: GetTracksFromAlbum_tracksByAlbum[];
}

export interface GetTracksFromAlbumVariables {
  id: string;
}
