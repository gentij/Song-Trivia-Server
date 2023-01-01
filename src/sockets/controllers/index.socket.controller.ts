import { SocketController, SocketData, SocketWithUserData } from '@/interfaces/sockets.interface';
import { Server as SocketServer, Socket } from 'socket.io';


export class IndexSocketController implements SocketController {
    io: SocketServer
    socket: SocketWithUserData
    
    constructor(io: SocketServer, socket: SocketWithUserData) {
        this.io = io
        this.socket = socket
        this.initializeSockets()
    }
    
    public initializeSockets() {
        this.socketMessage()
    }

    private socketMessage() {
        this.socket.on('socketMessage', message => {
            console.log("user sent a message ", + message);
        })
    }
}