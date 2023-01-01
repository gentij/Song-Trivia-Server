import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import { URLSearchParams } from 'url';

let spotifyApi: SpotifyWebApi;
let access_token: string;

test('Init Spoityf Api', () => {
  spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhots:3000',
  });

  expect(spotifyApi).not.toBeNull();
});

test('Get access token', async () => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const url = 'https://accounts.spotify.com/api/token';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(client_id + ':' + client_secret).toString('base64')}`,
  };

  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');

  try {
    const res: any = await axios.post(url, body, { headers });
    const { data } = res;
    access_token = data?.access_token;
    spotifyApi.setAccessToken(access_token);

    expect(data).not.toBeNull();
  } catch (err) {
    console.error(err);
  }
});

test('Get playlist tracks', async () => {
  try {
    const res = await spotifyApi.getPlaylistTracks('42HZjTRhG1eXWu69c2KsLG', {
      offset: 1,
      limit: 5,
      fields: 'items',
    });

    const tracks = res.body.items.map(item => {
      return item.track;
    });

    console.log(tracks);
  } catch (err) {
    console.error(err);
  }
});
