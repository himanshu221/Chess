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
                        ws.send(JSON.stringify({type: ACTIVE,
                                payload :{
                                        gameId: activeGame.id,
                                        opponentName: activeGame.opponentName,
                                        boardFen: activeGame,
                                        color: activeGame.userColor,
                                        moves: activeGame.moves
                                }}))
                }
                ws.on('close', ()=> gameManager.removeUser(ws))
        });
}


main()
