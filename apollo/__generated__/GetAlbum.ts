/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAlbum
// ====================================================

export interface GetAlbum_album {
  __typename: "Album";
  id: string;
  name: string;
  trackCount: number | null;
  artistId: string | null;
  coverart: string | null;
}

export interface GetAlbum {
  album: GetAlbum_album | null;
}

export interface GetAlbumVariables {
  id: string;
}
