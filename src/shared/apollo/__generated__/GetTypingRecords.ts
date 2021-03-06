/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTypingRecords
// ====================================================

export interface GetTypingRecords_typing_record {
  __typename: "typing_record";
  id: any;
  albumId: string | null;
  albumName: string | null;
  artistId: string | null;
  artistName: string | null;
  correctChar: number;
  createdAt: any | null;
  duration: any;
  errorChar: number;
  textLength: number;
  trackId: string;
  trackName: string | null;
  userId: string;
}

export interface GetTypingRecords {
  /**
   * fetch data from the table: "typing_record"
   */
  typing_record: GetTypingRecords_typing_record[];
}
