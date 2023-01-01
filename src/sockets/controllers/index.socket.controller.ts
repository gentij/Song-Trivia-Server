import { SocketController } from '@/interfaces/sockets.interface';
import { Server as SocketServer, Socket } from 'socket.io';


export class IndexSocketController implements SocketController {
    io: SocketServer
    socket: Socket
    
    constructor(io: SocketServer, socket: Socket) {
        this.io = io
        
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