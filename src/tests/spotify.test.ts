import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import { URLSearchParams } from 'url';

let spotifyApi: SpotifyWebApi;
let access_token: string;

test('Init Spoityf Api', () => {
  spotifyApi = new SpotifyWebApi({
    clientId: 'f51b7b209676447e810a666c96879e96',
    clientSecret: '090b1efd0d184acd94e57b1832045a9e',
    redirectUri: 'http://localhots:3000',
  });

  expect(spotifyApi).not.toBeNull();
});

test('Get access token', async () => {
  const client_id = 'f51b7b209676447e810a666c96879e96';
  const client_secret = '090b1efd0d184acd94e57b1832045a9e';
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
