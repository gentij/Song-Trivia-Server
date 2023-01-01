import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import { Track } from '@/interfaces/tracks.interface';

export default class SpotifyService {
  private spotifyApi: SpotifyWebApi;

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
    });
    this.setAccessToken();
  }

  private async setAccessToken(): Promise<any> {
    const url = 'https://accounts.spotify.com/api/token';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')}`,
    };

    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');

    const res: any = await axios.post(url, body, { headers });
    const { data } = res;
    const accessToken = data?.access_token;
    this.spotifyApi.setAccessToken(accessToken);
  }

  public async getPlaylistTracks(playlistId: string): Promise<Array<Track>> {
    const res = await this.spotifyApi.getPlaylistTracks(playlistId, {
      offset: 1,
      limit: 5,
      fields: 'items',
    });

    const tracks: Array<Track> = res.body.items.map(item => {
      return item.track;
    });

    return tracks;
  }
}
