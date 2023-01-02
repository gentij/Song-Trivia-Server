import SpotifyWebApi from 'spotify-web-api-node';
import { ACCESS_TOKEN_JWT_KEY, SPOTIFY_ACCESS_TOKEN_REDIS_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from '@/config';
import { IRedisClient, redisClient } from '@/databases';
import jwt from 'jsonwebtoken';

export default class SpotifyService {
  private spotifyApi: SpotifyWebApi;
  private redisClient: IRedisClient;

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
      redirectUri: SPOTIFY_REDIRECT_URI,
    });
    this.redisClient = redisClient;
  }

  public async getPlaylistTracks(playlistId: string): Promise<SpotifyApi.TrackObjectFull[]> {
    await this.setAccessToken();
    const limit = 10;

    const { body } = await this.spotifyApi.getPlaylistTracks(playlistId, {
      offset: 1,
      limit,
      fields: 'items',
    });

    return body.items.map(item => item.track);
  }

  private async setAccessToken() {
    const accessToken = await this.redisClient.get(SPOTIFY_ACCESS_TOKEN_REDIS_KEY);
    this.spotifyApi.setAccessToken(accessToken);
  }

  public async getAccessToken() {
    const accessToken = await this.redisClient.get(SPOTIFY_ACCESS_TOKEN_REDIS_KEY);

    const accessTokenJWT = jwt.sign({ accessToken }, ACCESS_TOKEN_JWT_KEY);

    return accessTokenJWT;
  }
}
