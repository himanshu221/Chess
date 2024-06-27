import {Chess } from "chess.js";
import { User } from '@chess/commons/definition'
import { BLACK, CHECKMATE, GAME_OVER, INVALID_MOVE, IN_PROGRESS, MOVE, RESIGN, STARTED, WHITE} from "@chess/commons/consts"
import { Move } from '@chess/commons/definition'
import { saveMoveToDB, updateGameStatus } from "./store/db";

export class Game {
    id: string
    player1: User;
    player1TimeConsumed: number
    player2: User;
    player2TimeConsumed: number
    board: Chess
    startTime: Date
    lastMoveTime: Date

    constructor(id: string, player1: User, player2: User, fen: string, startTime: Date = new Date(),
        player1TimeConsumed: number = 0, player2TimeConsumed: number = 0, lastMoveTime: Date = new Date()){
        this.id = id
        this.player1 = player1
        this.player1TimeConsumed = player1TimeConsumed
        this.player2TimeConsumed = player2TimeConsumed
        this.player2 = player2
        this.board = new Chess(fen)
        this.startTime  = startTime
        this.lastMoveTime = lastMoveTime
        
        if(player1.socket){
            player1.socket.send(JSON.stringify({
                type: STARTED,
                payload: {
                    color: WHITE,
                    gameId: this.id,
                    opponentName: player2.name
                }
            }))
        }
        if(player2.socket){
            player2.socket?.send(JSON.stringify({
                type: STARTED,
                payload: {
                    color: BLACK,
                    gameId: this.id,
                    opponentName: player1.name
                }
            }))
        }

    }

    getPlayer(user: User){
        if(user.id === this.player1.id)
            return this.player1;
        else return this.player2.id
    }
    getOpponent(user: User){
        if(user.id !== this.player1.id)
            return this.player1
        else return this.player2
    }
   async makeMove(user: User, move: Move){
        // validate the turn
        if(this.board.turn().toUpperCase() !== user.color?.charAt(0)){
            return;
        }
        // validate the moves
        try{
            this.board.move({
                from: move.from,
                to: move.to,
                promotion: 'q'
            })
        }catch(e){
            console.log(e)
            user.socket?.send(JSON.stringify({
                type: INVALID_MOVE
            }))
            return
        }

        const opponent = this.getOpponent(user)
        const moveTimestamp = new Date()

        if(this.board.turn() === 'w'){
            this.player2TimeConsumed = this.player2TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime())
        }else{
            this.player1TimeConsumed = this.player1TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime())
        }
        
        move.whiteTimeConsumed = this.player1TimeConsumed
        move.blackTimeConsumed = this.player2TimeConsumed
        
        opponent.socket?.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))
        this.lastMoveTime = moveTimestamp
        saveMoveToDB(this.id, move.from, move.to, moveTimestamp);

        if(this.board.isGameOver()){
            this.endGame(user, CHECKMATE, this.player1TimeConsumed, this. player2TimeConsumed, moveTimestamp)
        }else{
            updateGameStatus(this.id, this.board.fen(), IN_PROGRESS, "",
            this.player1TimeConsumed, this. player2TimeConsumed, moveTimestamp)
        }
    }

    async endGame(user: User, by: string, whiteTimeConsumed: number, blackTimeConsumed: number, lastMoveTime: Date){
        let playerColor = ""
        if(by === RESIGN){
            playerColor =  user.color === WHITE ? BLACK : WHITE;
        }else{
            playerColor = this.board.turn() == 'w' ? BLACK : WHITE
        }
        this.player1.socket?.send(JSON.stringify({
            type: GAME_OVER,
            payload: {
                message: `${playerColor} won by ${by}` 
            }
        })) 
        this.player2.socket?.send(JSON.stringify({
            type: GAME_OVER,
            payload: {
                message: `${playerColor} won by ${by}` 
            }
        }))
        const result = this.board.isDraw() ? "DRAW" : playerColor;
        updateGameStatus(this.id, this.board.fen(), "ENDED", result, whiteTimeConsumed, blackTimeConsumed, lastMoveTime)

        return
    }

}