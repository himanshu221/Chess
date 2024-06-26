import WebSocket from "ws";
import { Chess } from "chess.js";
import { AuthUser, User } from '@chess/commons/definition'
import { INITAL_BOARD, INIT_GAME, MOVE, RESIGN, WHITE, BLACK } from "@chess/commons/consts";
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
                const game = this.games.find(game => game.id === activeGameInfo.id)
                if(game){
                    let uColor = WHITE
                    if(game.player1.id === newUser.id){
                        game.player1.name = newUser.name
                        game.player1.socket = socket
                        game.player1.gameId = activeGameInfo.id
                        game.player1.color = WHITE
                    }else{
                        game.player2.name = newUser.name
                        game.player2.socket = socket
                        game.player2.gameId = activeGameInfo.id
                        game.player2.color = BLACK
                        uColor = BLACK
                    }
                    game.board = new Chess(activeGameInfo.currentState)
                    this.users.push({
                        id: newUser.id,
                        name: newUser.name,
                        socket,
                        color: uColor,
                        gameId: activeGameInfo.id
                    })
                    this.addHandler(socket)
                    
                    const opponentName = activeGameInfo.whitePlayer.id === newUser.id ? activeGameInfo.blackPlayer.username : activeGameInfo.whitePlayer.username
                    const userColor = activeGameInfo.whitePlayer.id === newUser.id ? WHITE : BLACK;
                    const moveTimestamp = new Date()
                    let whiteTime = game.player1TimeConsumed;
                    let blackTime = game.player2TimeConsumed;
                    if(game.board.turn() === 'b'){
                        blackTime = game.player2TimeConsumed + (moveTimestamp.getTime() - game.lastMoveTime.getTime())
                    }else{
                        whiteTime = game.player1TimeConsumed + (moveTimestamp.getTime() - game.lastMoveTime.getTime())
                    }
                    return {
                        id: activeGameInfo.id,
                        opponentName,
                        state: activeGameInfo.currentState,
                        userColor,
                        whiteTimeConsumed: whiteTime,
                        blackTimeConsumed: blackTime,
                        moves: activeGameInfo.moves.map(moves => moves.to)
                    }
                }
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
            this.addHandler(socket)
            if(activeGameInfo){
                const game = this.games.find(game => game.id === activeGameInfo.id)
                user.gameId = activeGameInfo.id
                if(game){
                    let uColor = WHITE
                    if(game.player1.id === newUser.id){
                        game.player1.name = newUser.name
                        game.player1.socket = socket
                        game.player1.color = WHITE
                        game.player1.gameId = activeGameInfo.id

                    }else{
                        game.player2.name = newUser.name
                        game.player2.socket = socket
                        game.player2.color = BLACK
                        game.player2.gameId = activeGameInfo.id
                        uColor = BLACK

                    }
                    game.board = new Chess(activeGameInfo.currentState)
                    this.users.push({
                        id: newUser.id,
                        name: newUser.name,
                        socket,
                        color: uColor,
                        gameId: activeGameInfo.id
                    })
                    this.addHandler(socket)
                    
                    const opponentName = activeGameInfo.whitePlayer.id === newUser.id ? activeGameInfo.blackPlayer.username : activeGameInfo.whitePlayer.username
                    const userColor = activeGameInfo.whitePlayer.id === newUser.id ? WHITE : BLACK;
                    return {
                        id: activeGameInfo.id,
                        opponentName,
                        state: activeGameInfo.currentState,
                        userColor,
                        whiteTimeConsumed: game.player1TimeConsumed,
                        blackTimeConsumed: game.player2TimeConsumed,
                        moves: activeGameInfo.moves.map(moves => moves.to)
                    }
                }
            }
        }
        return null;
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
                        if(this.pendingUser.id === user.id)
                            return;
                        // Start the game
                        const newGameId = randomUUID()
                        user.gameId = newGameId
                        user.color = BLACK
                        this.pendingUser.gameId = newGameId
                        this.pendingUser.color = WHITE
                        const game = new Game(newGameId, this.pendingUser, user, INITAL_BOARD)
                        this.games.push(game)
                        saveGameToDB(newGameId, this.pendingUser.id, user.id)
                        this.pendingUser = null
                    }else{
                        this.pendingUser = user
                    }
                }
                else if(message.type === MOVE){
                    const game = this.games.find(game => game.id === user.gameId)
                    if(game){
                        game.makeMove(user, message.payload)
                    }
                }
                else if(message.type === RESIGN){
                    const game = this.games.find(game => game.id === user.gameId)
                    if(game){
                        game.endGame(user, RESIGN)
                    }
                }
            }
        })
    }

    removeGame(gameId: string | undefined){
        if(gameId){
            this.games = this.games.filter(game => game.id !== gameId)
        }
        return
    }

    async loadState(){
        const activeGameInDB : Game[] = await loadStateFromDb()
        this.games = activeGameInDB
    }

}