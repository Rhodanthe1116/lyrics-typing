export interface MusixmatchTrackWrapperObject {
  track: MusixmatchTrack
}

export interface MusixmatchTrack {
  track_id: number
  track_name: string
  artist_name: string
  track_rating: number
  num_favourite: number
  artist_id: number
  album_id: number
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

export interface MusixmatchAlbum {
  album_id: number
  album_name: string
  album_track_count: number
  artist_id: number
  album_coverart_100x100: string
}
