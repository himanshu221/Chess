import WebSocket from "ws";
import { User } from "./User";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
    private gameCount: number
    private games: Game[];
    private users: User[]
    private pendingUser: User | null
    constructor() {
        this.games = []
        this.users = []
        this.pendingUser = null
        this.gameCount = 0;
    }
    getUser(socket: WebSocket){
        const user =  this.users.find(user => user.socket === socket)
        if(user)
            return user;
        return null;
    }
    addUser(socket: WebSocket){
        this.users.push({
            socket,
            gameId: null
        })
        this.addHandler(socket)
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user.socket !== socket)
        // Stop the game since the user left
    }

    private addHandler(socket: WebSocket){
        // can use gRPC here, see what is gRPC and how we can use it here
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString())
            const user = this.getUser(socket)
            if(user){
                if(message.type == INIT_GAME){
                    if(this.pendingUser){
                        // Start the game
                        const newGameId = this.gameCount++
                        const game = new Game(newGameId, this.pendingUser,user)
                        this.pendingUser.gameId = newGameId
                        user.gameId = newGameId
                        this.games.push(game)
                        this.pendingUser = null
                    }else{
                        this.pendingUser = {
                            socket,
                            gameId: null
                        }
                    }
                }
                else if(message.type == MOVE){
                    const game = this.games.find(game => game.getId() === user.gameId)
                    if(game){
                        game.makeMove(user, message.move)
                    }
                }
            }
        })
    }

}