import { createClient } from 'redis';
import { DB_HOST, DB_PORT, DB_DATABASE, ACCESS_TOKEN_TTL, SPOTIFY_ACCESS_TOKEN_REDIS_KEY } from '@config';
import { getSpotifyAccessToken, setSpotifyAccessTokenToRedis } from '@/utils/spotify';

export const dbConnection = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// const redisClient = createClient({
//   url: REDIS_URL,
// });

export const redisClient = createClient();

export type IRedisClient = typeof redisClient;

export const connectRedis = async () => {
  await redisClient.connect();

  await setSpotifyAccessTokenToRedis(redisClient);

  redisClient.on('error', err => console.log('Redis Client Error', err));
};
