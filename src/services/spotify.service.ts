import SpotifyWebApi from 'spotify-web-api-node';
import { Track } from '@/interfaces/tracks.interface';

export default class SpotifyService {
  private spotifyApi: SpotifyWebApi;

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
    });
  }

  public async getPlaylistTracks(playlistId: string): Promise<Array<Track>> {
    const limit = 10;

    // get access token from redis
    const accessToken = '';

    // set access token
    this.spotifyApi.setAccessToken(accessToken);

    const res = await this.spotifyApi.getPlaylistTracks(playlistId, {
      offset: 1,
      limit,
      fields: 'items',
    });

    const tracks: Array<Track> = res.body.items.map(item => {
      return item.track;
    });

    return tracks;
  }
}
