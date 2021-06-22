/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetChartTracks
// ====================================================

export interface GetChartTracks_chartTracks {
  __typename: "Track";
  id: string;
  name: string;
  artistName: string;
  rating: number;
  numFavourite: number;
  artistId: string | null;
  albumId: string | null;
}

export interface GetChartTracks {
  chartTracks: (GetChartTracks_chartTracks | null)[] | null;
}

export interface GetChartTracksVariables {
  country?: string | null;
}
