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
  artistId: string | null;
  albumId: string | null;
}

export interface GetTracksFromAlbum {
  tracksByAlbum: (GetTracksFromAlbum_tracksByAlbum | null)[] | null;
}

export interface GetTracksFromAlbumVariables {
  id: string;
}
