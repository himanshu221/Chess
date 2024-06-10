import WebSocket from "ws";
import { AuthUser, User } from '@chess/commons/definition'
import { ACTIVE, INITAL_BOARD, INIT_GAME, MOVE } from "@chess/commons/consts";
import { Game } from "./Game";
import { randomUUID } from "crypto";
import { loadStateFromDb, saveGameToDB, searchActiveGame } from "./store/db";

export class GameManager {
    private static instance: GameManager;
    games: Game[];
    users: User[]
    private pendingUser: User | null
    private constructor() {
        this.games = []
        this.users = []
        this.pendingUser = null
    }

    static async getInstance() {
        if(!this.instance){
            this.instance = new GameManager()
            await this.instance.loadState()
        }
        return this.instance
    }
    getUser(socket: WebSocket){
        const user =  this.users.find(user => user.socket === socket)
        if(user)
            return user;
        return null;
    }
    async addUser(socket: WebSocket, newUser: AuthUser){
        const user = this.users.find(user => user.id === newUser.id)
        const activeGameInfo = await searchActiveGame(newUser.id)
   
        if(!user){
            if(activeGameInfo){
                this.users.push({
                    id: newUser.id,
                    name: newUser.name,
                    socket,
                    gameId: activeGameInfo.id
                })
                this.addHandler(socket)
                return activeGameInfo
            }else{
                this.users.push({
                    id: newUser.id,
                    name: newUser.name,
                    socket
                })
                this.addHandler(socket)
                return null
            }
        }else{
            user.socket = socket
            if(activeGameInfo){
                user.gameId = activeGameInfo.id
                this.addHandler(socket)
                return activeGameInfo
            }
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
                if(message.type === INIT_GAME){

                    if(this.pendingUser){
                        // Start the game
                        const newGameId = randomUUID()
                        user.gameId = newGameId
                        user.color = "b"
                        this.pendingUser.gameId = newGameId
                        this.pendingUser.color = "w"
                        const game = new Game(newGameId, this.pendingUser,user, INITAL_BOARD)
                        this.games.push(game)

                        saveGameToDB(newGameId, this.pendingUser.id, user.id)
                        this.pendingUser = null
                    }else{
                        this.pendingUser = user
                    }
                }
                else if(message.type === MOVE){
                    const game = this.games.find(game => game.getId() === user.gameId)
                    if(game){
                        console.log("game :: ", game)
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

    async loadState(){
        const activeGameInDB : Game[] = await loadStateFromDb()
        this.games = activeGameInDB
    }

}