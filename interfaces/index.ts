// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
    id: string
    name: string
    typingRecords: TrackTypingRecord[] 
    completedTrackIds: number[]
}

export const newUser: User = {
    id: 'local',
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
    timestamp: Date
}