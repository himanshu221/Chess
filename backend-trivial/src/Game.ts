import { User } from "./User";

export class Game {
    private id: number
    private player1: User;
    private player2: User;
    private board: string;
    private moves: string[]
    private startTime: Date

    constructor(id: number, player1: User, player2: User){
        this.id = id
        this.player1 = player1
        this.player2 = player2
        this.board = ""
        this.moves = []
        this.startTime  = new Date()
    }
    getId() {
        return this.id
    }
    makeMove(user: User, move: string){
        // validate the move
    }
}