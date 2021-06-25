/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { typing_record_insert_input } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: InsertTypingRecordOne
// ====================================================

export interface InsertTypingRecordOne_insert_typing_record_one {
  __typename: "typing_record";
  albumId: string | null;
  albumName: string | null;
  artistId: string | null;
  artistName: string | null;
  correctChar: number;
  createdAt: any;
  deletedAt: any | null;
  duration: number;
  errorChar: number;
  id: any;
  textLength: number;
  trackId: string;
  trackName: string;
  userId: any;
  updatedAt: any;
}

export interface InsertTypingRecordOne {
  /**
   * insert a single row into the table: "typing_record"
   */
  insert_typing_record_one: InsertTypingRecordOne_insert_typing_record_one | null;
}

export interface InsertTypingRecordOneVariables {
  object: typing_record_insert_input;
}
