import {Chess } from "chess.js";
import { User } from "./User";
import { BLACK, GAME_OVER, INVALID_MOVE, MOVE, Move, STARTED, WHITE} from "@chess/commons/consts"
import { UUID } from "crypto";

export class Game {
    private id: UUID
    private player1: User;
    private player2: User;
    private board: Chess
    private startTime: Date

    constructor(id: UUID, player1: User, player2: User){
        this.id = id
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.startTime  = new Date()

        

        player1.socket.send(JSON.stringify({
            type: STARTED,
            payload: {
                color: WHITE,
                gameId: this.getId(),
                opponentName: player2.name
            }
        }))
        player2.socket.send(JSON.stringify({
            type: STARTED,
            payload: {
                color: BLACK,
                gameId: this.getId(),
                opponentName: player1.name
            }
        }))
    }
    getId() {
        return this.id
    }
    getOpponent(user: User){
        if(user.socket !== this.player1.socket)
            return this.player1
        else return this.player2
    }
    makeMove(user: User, move: Move){
        // validate the turn
        if(this.board.turn() !== user.color){
            return;
        }
        // validate the move
        try{
            this.board.move({
                from: move.from,
                to: move.to,
                promotion: 'q'
            })
        }catch(e){
            console.log(e)
            user.socket.send(JSON.stringify({
                type: INVALID_MOVE
            }))
            return
        }

        const opponent = this.getOpponent(user)

        opponent.socket.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))

        if(this.board.isGameOver()){
            const playerColor = this.board.turn() == 'w' ? "black" : "white";
            this.player1.socket.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    message: `${playerColor}` 
                }
            }))
            this.player2.socket.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    message: `${playerColor}` 
                }
            }))
            return
        }
    }
}