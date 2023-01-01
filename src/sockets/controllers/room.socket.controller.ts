import { SocketController } from '@/interfaces/sockets.interface';
import { Server as SocketServer, Socket } from 'socket.io';
import { RoomSocketService } from '../services/room.socket.service';


export class RoomSocketController implements SocketController {
    io: SocketServer
    socket: Socket
    service: RoomSocketService
    
    constructor(io: SocketServer, socket: Socket) {
        this.io = io
        this.socket = socket
        this.service = new RoomSocketService(this.io, this.socket)
        this.initializeSockets()
    }
    
    public initializeSockets() {
        this.createRoom()
        this.joinRoom()
    }

    private createRoom() {
        this.socket.on('createRoom', message => {
            return this.service.createRoom(message)
        })
    }

    private joinRoom() {
        this.socket.on('joinRoom', message => {
            return this.service.joinRoom(message)
        })
    }
}