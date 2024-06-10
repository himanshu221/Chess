import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import cookie from 'cookie'
import { AuthUser } from '@chess/commons/definition';
import jwt from 'jsonwebtoken'
import dotEnv from 'dotenv'
import { ACTIVE } from '@chess/commons/consts';

dotEnv.config()
const jwtSecret = process.env.JWT_SECRET || 'secret'

async function main() {
        const wss = new WebSocketServer({ port: 8080 });
        const gameManager = await GameManager.getInstance()
        
        wss.on('connection', async function connection(ws, req) {
                const parsedCookies =  cookie.parse(req.headers.cookie || '')
                const token = parsedCookies['token'] || ''
                const user = jwt.verify(token, jwtSecret) as AuthUser
                const activeGame = await gameManager.addUser(ws, user)
  
                if(activeGame){
                        const opponentName = activeGame.whitePlayer.id === user.id ? 
                        activeGame.blackPlayer.username: activeGame.whitePlayer.username
                        const userColor = activeGame.whitePlayer.id === user.id ? "white" : "black";
                        const moves = activeGame.moves.map(move => move.to)
      
                        ws.send(JSON.stringify({type: ACTIVE,
                                payload :{
                                        gameId: activeGame.id,
                                        opponentName: opponentName,
                                        boardFen: activeGame.currentState,
                                        color: userColor,
                                        moves: moves
                                }}))
                }
                ws.on('close', ()=> gameManager.removeUser(ws))
        });
}

main()
