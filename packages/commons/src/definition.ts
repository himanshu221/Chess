import { Chess } from "chess.js"
import { WebSocket as wss } from "ws";

export interface MessageType {
    type: string,
    payload : null | Move,
}

export interface Move {
    from: string
    to: string
    color: string,
    message: string,
    gameId: string,
    opponentName: string,
    boardFen: string,
    moves: string[]
}

export interface ChessBoardProps {
    socket: WebSocket | null,
    moves: string[],
    setMoves: React.Dispatch<React.SetStateAction<string[]>>,
    gameStart: boolean
    game: Chess, 
    setGame: React.Dispatch<React.SetStateAction<Chess>>,
    board: string, 
    setBoard:  React.Dispatch<React.SetStateAction<string>>,
    playerColor: string
}

export interface UserSession {
    id: string
}

export interface AuthUser{
    id: string,
    name: string
}

export interface User{
    id: string,
    socket?:  wss,
    gameId? : string,
    color? : string,
    name?: string
}

export interface UserInfo{
    success: boolean,
    payload: {
        id?: string,
        name?: string,
        message?: string
    }
}