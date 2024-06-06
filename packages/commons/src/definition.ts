import { UUID } from "crypto";
import { Chess } from "chess.js"
import { WebSocket } from "ws";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types"

export interface MessageType {
    type: string,
    payload : null | Move,
}

export interface Move {
    from: string
    to: string
    color: BoardOrientation
    message: string,
    gameId: string,
    opponentName: string
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
    playerColor: BoardOrientation
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
    socket:  WebSocket,
    gameId? : UUID,
    color? : string,
    name: string
}