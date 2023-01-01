import { createClient } from 'redis';
import { DB_HOST, DB_PORT, DB_DATABASE } from '@config';

export const dbConnection = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// const redisClient = createClient({
//   url: REDIS_URL,
// });

export const redisClient = createClient();

export type IRedisClient = typeof redisClient;

export const connectRedis = async () => {
  await redisClient.connect();

  redisClient.on('error', err => console.log('Redis Client Error', err));
};

