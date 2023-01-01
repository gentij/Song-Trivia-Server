import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import PlaylistsRoute from '@/routes/playlists.route';
import validateEnv from '@utils/validateEnv';
import { IndexSocketController } from './sockets/controllers/index.socket.controller';

validateEnv();

const app = new App({ routes: [new IndexRoute(), new UsersRoute(), new AuthRoute(), new PlaylistsRoute()], sockets: [IndexSocketController] });

app.listen();
