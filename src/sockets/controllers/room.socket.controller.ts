import { JoinRoomDto, SelectRoomPlaylistDto } from '@/dtos/roomSocket.dto';
import { SocketController, SocketWithUserData } from '@/interfaces/sockets.interface';
import socketValidationMiddleware from '@/middlewares/socketValidation.middleware';
import { Server as SocketServer } from 'socket.io';
import { RoomSocketService } from '../services/room.socket.service';

export class RoomSocketController implements SocketController {
  io: SocketServer;
  socket: SocketWithUserData;
  service: RoomSocketService;

  constructor(io: SocketServer, socket: SocketWithUserData) {
    this.io = io;
    this.socket = socket;
    this.service = new RoomSocketService(this.io, this.socket);
    this.initializeSockets();
  }

  public initializeSockets() {
    this.createRoom();
    this.joinRoom();
    this.selectRoomPlaylist();
  }

  private createRoom() {
    this.socket.on('createRoom', () => {
      return this.service.createRoom();
    });
  }

  private joinRoom() {
    this.socket.on('joinRoom', async (data: JoinRoomDto) => {
      if (await socketValidationMiddleware(this.socket, JoinRoomDto, data)) return;
      return this.service.joinRoom(data);
    });
  }

  private selectRoomPlaylist() {
    this.socket.on('selectRoomPlaylist', async (data: SelectRoomPlaylistDto) => {
      if (await socketValidationMiddleware(this.socket, SelectRoomPlaylistDto, data)) return;
      return this.service.selectRoomPlaylist(data);
    });
  }
}
