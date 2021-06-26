import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { Track, Lyrics } from 'shared/interfaces'
import {
  MusixmatchTrackWrapperObject,
  MusixmatchTrack,
  MusixmatchLyrics,
  MusixmatchAlbum,
} from './interfaces'

const apiKey = process?.env?.MUSIXMATCH_APIKEY || ''

// interface MusixmatchResponse {
//   message: {
//     header: {
//       status_code: number,
//     }
//     body: any
//   }
// }

class MusixmatchAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://api.musixmatch.com/ws/1.1/'
  }

  willSendRequest(request: RequestOptions) {
    request.params.set('format', 'json')
    request.params.set('apikey', apiKey)
  }

  async didReceiveResponse(response: any) {
    const responseJson = await response.json()
    if (responseJson.message.header.status_code !== 200) {
      if (responseJson.message.header.status_code === 401) {
        throw new Error('no more free Musixmatch api call today 😢😢😢')
      }

      console.log(JSON.stringify(responseJson))
      throw new Error('Unknown musixmatch error')
    }

    return responseJson.message.body
  }

  trackReducer(track: MusixmatchTrack) {
    return {
      id: track.track_id.toString(),
      name: track.track_name,
      artistName: track.artist_name,
      rating: track.track_rating,
      numFavourite: track.num_favourite,
      artistId: track.artist_id.toString(),
      albumId: track.album_id.toString(),
    } as Track
  }
  lyricsReducer(lyrics: MusixmatchLyrics) {
    return {
      id: lyrics.lyrics_id.toString(),
      body: lyrics.lyrics_body,
      language: lyrics.lyrics_language,
      copyright: lyrics.lyrics_copyright,
      updatedTime: lyrics.updated_time,
    } as Lyrics
  }
  albumReducer(album: MusixmatchAlbum) {
    return {
      id: album.album_id.toString(),
      name: album.album_name,
      trackCount: album.album_track_count,
      artistId: album.artist_id.toString(),
      coverart: album.album_coverart_100x100,
    }
  }

  async getChartTracks({ country }: { country: string }) {
    try {
      const body = await this.get('chart.tracks.get', {
        page_size: 10,
        country: country,
        f_has_lyrics: true,
      })
      const trackList: MusixmatchTrackWrapperObject[] = body.track_list
      return Array.isArray(trackList)
        ? trackList.map((track) => this.trackReducer(track.track))
        : []
    } catch (err) {
      console.log(err)
      return []
    }
  }

  async searchTracks({ query, artistId }: { query: string; artistId: number }) {
    if (query) {
      const body = await this.get('track.search', {
        page_size: 10,
        q_track_artist: query,
        f_has_lyrics: true,
        s_track_rating: 'desc',
      })
      const trackList: MusixmatchTrackWrapperObject[] = body.track_list
      return Array.isArray(trackList)
        ? trackList.map((track) => this.trackReducer(track.track))
        : []
    } else if (artistId) {
      const body = await this.get('track.search', {
        page_size: 5,
        f_artist_id: artistId,
        f_has_lyrics: true,
        s_track_rating: 'desc',
      })
      const trackList: MusixmatchTrackWrapperObject[] = body.track_list
      return Array.isArray(trackList)
        ? trackList.map((track) => this.trackReducer(track.track))
        : []
    }
  }

  async getTrackById({ trackId }: { trackId: number }) {
    const body = await this.get('track.get', {
      track_id: trackId,
    })

    return this.trackReducer(body.track)
  }

  async getLyricsByTrackId({ trackId }: { trackId: number }) {
    const body = await this.get('track.lyrics.get', {
      track_id: trackId,
    })

    return this.lyricsReducer(body.lyrics)
  }

  async getTracksByAlbumId({ albumId }: { albumId: number }) {
    const body = await this.get('album.tracks.get', {
      page_size: 5,
      album_id: albumId,
      f_has_lyrics: true,
    })

    const trackList: MusixmatchTrackWrapperObject[] = body.track_list
    return Array.isArray(trackList)
      ? trackList.map((track) => this.trackReducer(track.track))
      : []
  }

  async getAlbumById({ albumId }: { albumId: number }) {
    const body = await this.get('album.get', {
      album_id: albumId,
    })

    return this.albumReducer(body.album)
  }
}

module.exports = MusixmatchAPI
