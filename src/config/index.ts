import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const SPOTIFY_ACCESS_TOKEN_REDIS_KEY = 'accessToken:spotify';

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  ACCESS_TOKEN_TTL,
  SPOTIFY_TOKEN_API_URL,
  SPOTIFY_REDIRECT_URI,
  AVATARS_API_URL,
} = process.env;

export const SPOTIFY_TOKEN_API_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Authorization: `Basic ${Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')}`,
};
