import { AVATARS_API_URL } from '@/config';
import { Player } from '@/interfaces/player.interface';
import { SocketController, SocketWithUserData } from '@/interfaces/sockets.interface';
import { Server as SocketServer, Socket } from 'socket.io';

export class IndexSocketController implements SocketController {
  io: SocketServer;
  socket: SocketWithUserData;

  constructor(io: SocketServer, socket: SocketWithUserData) {
    this.io = io;
    this.socket = socket;
    this.setUserData();
    this.initializeSockets();
  }

  public initializeSockets() {
    this.socketMessage();
  }

  private async setUserData() {
    const player = { id: this.socket.id, name: 'player', avatar: `${AVATARS_API_URL}/${this.socket.id}.svg` } as Player;
    this.socket.data.player = player;
  }

  private socketMessage() {
    this.socket.on('socketMessage', message => {
      console.log('user sent a message ', message);
    });
  }
}
