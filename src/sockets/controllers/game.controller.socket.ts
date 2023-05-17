import { AVATARS_API_URL } from '@/config';
import { StartGameDto } from '@/dtos/gameSocket.dto';
import { Player } from '@/interfaces/player.interface';
import { SocketController, SocketWithUserData } from '@/interfaces/sockets.interface';
import socketValidationMiddleware from '@/middlewares/socketValidation.middleware';
import { Server as SocketServer, Socket } from 'socket.io';
import { GameSocketService } from '../services/game.socket.service';

export class GameSocketController implements SocketController {
  io: SocketServer;
  socket: SocketWithUserData;
  service: GameSocketService;

  constructor(io: SocketServer, socket: SocketWithUserData) {
    this.io = io;
    this.socket = socket;
    this.service = new GameSocketService(this.io, this.socket);
    this.initializeSockets();
  }

  public initializeSockets() {}

  private async startGame(data: StartGameDto) {
    if (await socketValidationMiddleware(this.socket, StartGameDto, data)) return;

    return this.service.startGame(data.roomId);
  }
}
