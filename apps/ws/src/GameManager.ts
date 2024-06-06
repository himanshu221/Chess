import WebSocket from "ws";
import { AuthUser, User } from '@chess/commons/definition'
import { INIT_GAME, MOVE } from "@chess/commons/consts";
import { Game } from "./Game";
import { randomUUID } from "crypto";

export class GameManager {
    private static instance: GameManager;
    private games: Game[];
    private users: User[]
    private pendingUser: User | null
    private constructor() {
        this.games = []
        this.users = []
        this.pendingUser = null
    }

    static getInstance() {
        if(!this.instance){
            this.instance = new GameManager()
        }
        return this.instance
    }
    getUser(socket: WebSocket){
        const user =  this.users.find(user => user.socket === socket)
        if(user)
            return user;
        return null;
    }
    addUser(socket: WebSocket, newUser: AuthUser){
        const user = this.users.find(user => user.id === newUser.id)
        if(!user){
            this.users.push({
                id: newUser.id,
                name: newUser.name,
                socket,
            })
            this.addHandler(socket)
        }else{
            user.socket = socket
        }
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user.socket !== socket)
        // Stop the game since the user left
    }

    private addHandler(socket: WebSocket){
        // TODO: can use gRPC here, see what is gRPC and how we can use it here
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString())
            const user = this.getUser(socket)
            if(user){
                if(message.type == INIT_GAME){

                    if(this.pendingUser){
                        // Start the game
                        const newGameId = randomUUID()
                        user.gameId = newGameId
                        user.color = "b"
                        this.pendingUser.gameId = newGameId
                        this.pendingUser.color = "w"
                        const game = new Game(newGameId, this.pendingUser,user)
                        this.games.push(game)
                        this.pendingUser = null
                    }else{
                        this.pendingUser = user
                    }
                }
                else if(message.type == MOVE){
                    const game = this.games.find(game => game.getId() === user.gameId)
                    if(game){
                        game.makeMove(user, message.payload)
                    }
                }
            }
        })
    }

    removeGame(gameId: string | undefined){
        if(gameId){
            this.games = this.games.filter(game => game.getId() !== gameId)
        }
        return
    }

}