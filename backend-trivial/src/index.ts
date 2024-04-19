import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager()
wss.on('connection', function connection(ws) {
        gameManager.addUser(ws)
        ws.on('close', ()=> gameManager.removeUser(ws))
});

// interface user{
//     name: string,
//     age: number
// }

// const arr: user[] = []

// arr.push({
//     name: "himanshu",
//     age: 26
// })
// arr.push({
//     name: "snigdha",
//     age: 25
// })

// const currUser = arr.find(user => user.name === "himanshu")

// if(currUser)
//     currUser.age  = 25

// console.log(arr)

