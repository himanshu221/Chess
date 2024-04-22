import {Chess } from "chess.js";
import { User } from "./User";
import { BLACK, INVALID_MOVE, MOVE, Move, STARTED, WHITE} from "@chess/commons/consts"

export class Game {
    private id: number
    private player1: User;
    private player2: User;
    private board: Chess
    private startTime: Date

    constructor(id: number, player1: User, player2: User){
        this.id = id
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.startTime  = new Date()

        player1.socket.send(JSON.stringify({
            type: STARTED,
            payload: {
                color: WHITE
            }
        }))
        player2.socket.send(JSON.stringify({
            type: STARTED,
            payload: {
                color: BLACK
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
                to: move.to
            })
        }catch(e){
            console.log(e)
            user.socket.send(JSON.stringify({
                type: INVALID_MOVE
            }))
            return
        }

        if(this.board.isGameOver()){
            this.player1.socket.send(JSON.stringify({
                type: `${this.board.turn} won`
            }))
            this.player2.socket.send(JSON.stringify({
                type: `${this.board.turn} won`
            }))
            return
        }

        const opponent = this.getOpponent(user)

        opponent.socket.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))
    }
}