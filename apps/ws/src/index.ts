import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import cookie from 'cookie'
import { AuthUser } from '@chess/commons/definition';
import jwt from 'jsonwebtoken'
import dotEnv from 'dotenv'

dotEnv.config()
const jwtSecret = process.env.JWT_SECRET || 'secret'

async function main() {
        const wss = new WebSocketServer({ port: 8080 });
        const gameManager = await GameManager.getInstance()
        console.log(gameManager.games)
        wss.on('connection', async function connection(ws, req) {
                const parsedCookies =  cookie.parse(req.headers.cookie || '')
                const token = parsedCookies['token'] || ''
                const user = jwt.verify(token, jwtSecret) as AuthUser
                gameManager.addUser(ws, user)
                console.log(gameManager.users)
                ws.on('close', ()=> gameManager.removeUser(ws))
        });
}

main()
