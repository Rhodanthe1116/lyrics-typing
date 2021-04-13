import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { Track, Lyrics } from '../../interfaces'
import { MusixmatchTrackWrapperObject, MusixmatchTrack, MusixmatchLyrics } from './interfaces'

const apiKey = process?.env?.NEXT_PUBLIC_MUSIXMATCH_APIKEY || ''

interface MusixmatchResponse {
  message: {
    header: {
      status_code: number,
    }
    body: any
  }
}

class MusixmatchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.musixmatch.com/ws/1.1/';

  }

  willSendRequest(request: RequestOptions) {
    request.params.set('format', 'json');
    request.params.set('apikey', apiKey);
  }

  async didReceiveResponse(response: any) {
    const responseJson = await response.json()
    if (responseJson.message.header.status_code !== 200) {

      if (responseJson.message.header.status_code === 401) {
        throw new Error("no more free Musixmatch api call today 😢😢😢")

      }

      throw new Error(JSON.stringify(responseJson))
    }

    return response
  }

  trackReducer(track: MusixmatchTrack) {
    return {
      id: track.track_id.toString(),
      name: track.track_name,
      artistName: track.artist_name,
      rating: track.track_rating,
      numFavourite: track.num_favourite,
    } as Track
  }
  lyricsReducer(lyrics: MusixmatchLyrics) {
    return {
      id: lyrics.lyrics_id.toString(),
      body: lyrics.lyrics_body,
      language: lyrics.lyrics_language,
      copyright: lyrics.lyrics_copyright,
      updatedTime: lyrics.updated_time
    } as Lyrics
  }

  async getChartTracks({ country }: { country: string }) {
    const response = await this.get('chart.tracks.get', {
      page_size: 100,
      country: country,
      f_has_lyrics: true,
    });

    const trackList: MusixmatchTrackWrapperObject[] = JSON.parse(response).message.body.track_list
    return Array.isArray(trackList)
      ? trackList.map((track) => this.trackReducer(track.track))
      : [];
  }

  async searchTracks({ query }: { query: string }) {
    const responseStr = await this.get('track.search', {
      page_size: 100,
      q_track_artist: query,
      f_has_lyrics: true,
      s_track_rating: 'desc',
    });
    console.log(99999999999999999999)
    const responseJson: MusixmatchResponse = JSON.parse(responseStr)

    const trackList: MusixmatchTrackWrapperObject[] = responseJson.message.body.track_list
    return Array.isArray(trackList)
      ? trackList.map((track) => this.trackReducer(track.track))
      : [];
  }


  async getTrackById({ trackId }: { trackId: number }) {
    const responseStr = await this.get('track.get', {
      track_id: trackId,
    });
    const responseJson: MusixmatchResponse = JSON.parse(responseStr)

    return this.trackReducer(responseJson.message.body.track);
  }

  async getLyricsByTrackId({ trackId }: { trackId: number }) {
    const responseStr = await this.get('track.lyrics.get', {
      track_id: trackId,
    });
    const responseJson: MusixmatchResponse = JSON.parse(responseStr)

    return this.lyricsReducer(responseJson.message.body.lyrics);
  }


}

module.exports = MusixmatchAPI;