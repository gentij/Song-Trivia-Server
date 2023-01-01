import axios from 'axios';

export async function getAccessToken(): Promise<any> {
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

  return accessToken;
}
