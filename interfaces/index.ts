// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
    id: number
    name: string
    typingRecords: TrackTypingRecord[]
    completedTrackIds: number[]
}

export const newUser: User = {
    id: 8787878787,
    name: 'local user',
    typingRecords: [],
    completedTrackIds: []
}

export type TypingResult = {
    wpm: number,
    duration: number,
    correctChar: number,
    errorChar: number,
    accuracy: number,
    textLength: number,
}

export type TrackTypingRecord = {
    trackId: number
    result: TypingResult
    timestamp: string
}

export interface Track {
    id: number,
    name: string,
    artistName: string,
    rating: number,
    numFavourite: number
}

export interface MusixmatchTrackWrapperObject {
    track: MusixmatchTrack
}

export interface MusixmatchTrack {
    track_id: number,
    track_name: string,
    artist_name: string,
    track_rating: number,
    num_favourite: number
}