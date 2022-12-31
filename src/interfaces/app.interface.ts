import { Routes } from "./routes.interface";
import { SocketControllerConstructable } from "./sockets.interface";

export interface AppConstructorParams {
    routes: Routes[]
    sockets: SocketControllerConstructable[]
}