import { WebSocket } from "ws";

export interface User{
    socket: WebSocket
    gameId: number | null
}