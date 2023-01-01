import { SocketController, SocketWithUserData } from '@/interfaces/sockets.interface';
import { Server as SocketServer } from 'socket.io';
import { RoomSocketService } from '../services/room.socket.service';


export class RoomSocketController implements SocketController {
    io: SocketServer
    socket: SocketWithUserData
    service: RoomSocketService
    
    constructor(io: SocketServer, socket: SocketWithUserData) {
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
        this.socket.on('createRoom', () => {
            return this.service.createRoom()
        })
    }

    private joinRoom() {
        this.socket.on('joinRoom', message => {
            return this.service.joinRoom(message)
        })
    }
}