import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { AuthUser } from '@chess/commons/definition';
import jwt from 'jsonwebtoken'
import dotEnv from 'dotenv'
import { ACTIVE } from '@chess/commons/consts';
import url from 'url';

dotEnv.config()
const jwtSecret = process.env.JWT_SECRET || 'secret'

async function main() {
        const wss = new WebSocketServer({ port: 8080 });
        const gameManager = await GameManager.getInstance()

        wss.on('connection', async function connection(ws, req) {
                const token: string = url.parse(req.url || '', true).query.token as string;
                const user = jwt.verify(token, jwtSecret) as AuthUser
                const activeGame = await gameManager.addUser(ws, user)

                if(activeGame){
                        ws.send(JSON.stringify({type: ACTIVE,
                                payload :{
                                        gameId: activeGame.id,
                                        opponentName: activeGame.opponentName,
                                        boardFen: activeGame.state,
                                        color: activeGame.userColor,
                                        moves: activeGame.moves,
                                        whiteTimeConsumed: activeGame.whiteTimeConsumed,
                                        blackTimeConsumed: activeGame.blackTimeConsumed
                                }}))
                }else{
                        ws.send(JSON.stringify({type: ACTIVE}))
                }
                ws.on('close', ()=> gameManager.removeUser(ws))
        });
}


main()
