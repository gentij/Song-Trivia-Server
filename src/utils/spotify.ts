import { ACCESS_TOKEN_TTL, SPOTIFY_ACCESS_TOKEN_REDIS_KEY, SPOTIFY_TOKEN_API_HEADERS, SPOTIFY_TOKEN_API_URL } from '@/config';
import { IRedisClient } from '@/databases';
import axios from 'axios';

export const getSpotifyAccessToken = async (): Promise<string> => {
  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');

  const { data } = await axios.post(SPOTIFY_TOKEN_API_URL, body, { headers: SPOTIFY_TOKEN_API_HEADERS });

  const accessToken = data.access_token as string;

  return accessToken;
};

export const setSpotifyAccessTokenToRedis = async (redisClient: IRedisClient): Promise<string> => {
  const spotifyAccessToken = await getSpotifyAccessToken();

  return await redisClient.setEx(SPOTIFY_ACCESS_TOKEN_REDIS_KEY, Number(ACCESS_TOKEN_TTL), spotifyAccessToken);
};
