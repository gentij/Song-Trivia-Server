import App from '@/app';
import IndexRoute from '@routes/index.route';
import PlaylistsRoute from '@/routes/playlists.route';
import validateEnv from '@utils/validateEnv';
import { IndexSocketController } from './sockets/controllers/index.socket.controller';
import SpotifyRoute from './routes/spotify.route';

validateEnv();

const app = new App({ routes: [new IndexRoute(), new PlaylistsRoute(), new SpotifyRoute()], sockets: [IndexSocketController] });

app.listen();
