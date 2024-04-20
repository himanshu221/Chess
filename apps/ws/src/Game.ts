import { Chess } from "chess.js";
import { User } from "./User";
import { INVALID_MOVE, TURN} from "@chess/commons/consts"

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
            message: "game started",
            playload: {
                color: "w"
            }
        }))
        player2.socket.send(JSON.stringify({
            message: "game started",
            playload: {
                color: "b"
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
    makeMove(user: User, move: {
        from: string,
        to: string
    }){
        // validate the turn
        if(this.board.turn() !== user.color){
            return;
        }
        // validate the move
        try{
            this.board.move(move)
        }catch(e){
            console.log(e)
            user.socket.send(JSON.stringify({
                message: INVALID_MOVE
            }))
            return
        }

        if(this.board.isGameOver()){
            this.player1.socket.send(JSON.stringify({
                message: `${this.board.turn} won`
            }))
            this.player2.socket.send(JSON.stringify({
                message: `${this.board.turn} won`
            }))
            return
        }

        const opponent = this.getOpponent(user)

        opponent.socket.send(JSON.stringify({
            message: TURN,
            payload: move
        }))
    }
}