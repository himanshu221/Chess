import { UUID } from "crypto";
import { WebSocket } from "ws";

export interface User{
    socket: WebSocket
    gameId: UUID | null
    color: string
}