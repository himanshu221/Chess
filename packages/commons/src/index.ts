import { Chess } from "chess.js"
import { BoardOrientation } from "react-chessboard/dist/chessboard/types"
export const INIT_GAME = "init_game"
export const MOVE = "move"
export const INVALID_MOVE = "invalid_move"
export const STARTED = "started"
export const WHITE = "white"
export const BLACK = "black"
export const GAME_OVER = "game_over"

export interface MessageType {
    type: string,
    payload : null | Move,
}

export interface Move {
    from: string
    to: string
    color: BoardOrientation
    message: string
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