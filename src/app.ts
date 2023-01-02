import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createServer, Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, SPOTIFY_ACCESS_TOKEN_REDIS_KEY, ACCESS_TOKEN_TTL } from '@config';
import { connectRedis, dbConnection, IRedisClient, redisClient } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { getSpotifyAccessToken, setSpotifyAccessTokenToRedis } from '@utils/spotify';
import cron from 'node-cron';
import { AppConstructorParams } from '@interfaces/app.interface';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketControllerConstructable,
  SocketData,
} from '@interfaces/sockets.interface';

class App {
  public server: Server;
  public app: express.Application;
  public io: SocketServer;
  public env: string;
  public port: string | number;
  public routes: Routes[];
  public sockets: SocketControllerConstructable[];
  private redisClient: IRedisClient;

  constructor({ routes, sockets }: AppConstructorParams) {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(this.server);
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.routes = routes;
    this.sockets = sockets;
    this.redisClient = redisClient;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSocketControllers();
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.spotifyAccessTokenHandler();
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    connect(dbConnection);
    connectRedis();
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    this.routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSocketControllers() {
    this.io.on('connection', socket => {
      this.sockets.forEach(SocketController => {
        new SocketController(this.io, socket).initializeSockets();
      });
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private spotifyAccessTokenHandler() {
    cron.schedule('*/55 * * * *', async () => await setSpotifyAccessTokenToRedis(this.redisClient));
  }
}

export default App;
