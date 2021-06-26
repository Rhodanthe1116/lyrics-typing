// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: string
  name: string
  typingRecords: TrackTypingRecord[]
  completedTrackIds: string[]
}

export const newUser: User = {
  id: '8787878787',
  name: 'local user',
  typingRecords: [],
  completedTrackIds: [],
}

export type TypingResult = {
  wpm: number
  duration: number
  correctChar: number
  errorChar: number
  accuracy: number
  textLength: number
}

export type TrackTypingRecord = {
  trackId: string
  result: TypingResult
  timestamp: string
}

export interface Track {
  id: string
  name: string
  artistName: string
  rating: number
  numFavourite: number
  artistId: string
  albumId: string

  lyrics?: Lyrics
}

export interface Lyrics {
  id: string
  instrumental?: boolean
  body: string
  language?: string
  scriptTrackingUrl?: string
  pixelTrackingUrl?: string
  copyright: string
  backlinkUrl?: string
  updatedTime: string

  track?: Track
}

export interface Album {
  id: string
  name: string
  trackCount: number
  artistId: string
  coverart: string
}
