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

export interface MusixmatchLyrics {
  lyrics_id: number
  restricted: boolean
  instrumental: boolean
  lyrics_body: string
  lyrics_language: string
  script_tracking_url: string
  pixel_tracking_url: string
  lyrics_copyright: string
  backlink_url: string
  updated_time: string
}