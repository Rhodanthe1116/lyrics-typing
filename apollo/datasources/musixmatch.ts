import { RESTDataSource } from 'apollo-datasource-rest'
import { Track, MusixmatchTrackWrapperObject, MusixmatchTrack } from '../../interfaces'

const apiKey = process?.env?.NEXT_PUBLIC_MUSIXMATCH_APIKEY || ''

class MusixmatchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.musixmatch.com/ws/1.1/';
  }

  willSendRequest(request: { params: { set: (arg0: string, arg1: string) => void; }; }) {
    request.params.set('format', 'json');
    request.params.set('apikey', apiKey);
  }


  trackReducer(track: MusixmatchTrack) {
    const newTrack: Track = {
      id: track.track_id,
      name: track.track_name,
      artistName: track.artist_name,
      rating: track.track_rating,
      numFavourite: track.num_favourite,
    }
    return newTrack
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
    const response = await this.get('track.search', {
      page_size: 100,
      q_track_artist: query,
      f_has_lyrics: true,
      s_track_rating: 'desc',
    });

    const trackList: MusixmatchTrackWrapperObject[] = JSON.parse(response).message.body.track_list
    return Array.isArray(trackList)
      ? trackList.map((track) => this.trackReducer(track.track))
      : [];
  }

}

module.exports = MusixmatchAPI;