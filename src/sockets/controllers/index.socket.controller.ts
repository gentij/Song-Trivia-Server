import { SocketController } from '@/interfaces/sockets.interface';
import { Server as SocketServer } from 'socket.io';


export class IndexSocketController implements SocketController {
    io: SocketServer
    
    constructor(io: SocketServer) {
        this.io = io
        
        this.initializeSockets()
    }
    
    public initializeSockets() {
        this.connection()
    }

    private connection() {
        this.io.on('connection', socket => {
            console.log("user connected");
        })
    }

}