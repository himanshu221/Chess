import {Chess } from "chess.js";
import { User } from '@chess/commons/definition'
import { BLACK, CHECKMATE, GAME_OVER, INVALID_MOVE, MOVE, RESIGN, STARTED, WHITE} from "@chess/commons/consts"
import { Move } from '@chess/commons/definition'
import { saveMoveToDB, updateGameStatus } from "./store/db";

export class Game {
    id: string
    player1: User;
    player2: User;
    board: Chess
    startTime: Date

    constructor(id: string, player1: User, player2: User, fen: string){
        this.id = id
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess(fen)
        this.startTime  = new Date()
        
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

        opponent.socket?.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))
        saveMoveToDB(this.id, move.from, move.to);

        if(this.board.isGameOver()){
            this.endGame(user, CHECKMATE)
        }else{
            updateGameStatus(this.id, this.board.fen(), "IN_PROGRESS","")
        }
    }

    async endGame(user: User, by: string){
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
        updateGameStatus(this.id, this.board.fen(), "ENDED", result)

        return
    }

}