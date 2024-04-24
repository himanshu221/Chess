import { useEffect, useState } from "react"
import { useSocket } from "../hooks/socket"
import { GAME_OVER, INIT_GAME, MOVE, MessageType, STARTED } from "@chess/commons/consts"
import { ChessBoard } from "../ChessBoard"
import { Chess } from "chess.js"
import { BoardOrientation } from "react-chessboard/dist/chessboard/types"
import toast, { Toaster } from "react-hot-toast"

export const Game = () => {
    const socket = useSocket()
    const [buttonExist, setButtonExist] = useState<boolean>(true)
    const [startGame, setStartGame] = useState<boolean>(false)
    const [game, setGame] = useState<Chess>(new Chess())
    const [board, setBoard] = useState<string>(game.fen())
    const [playerColor, setPlayerColor] = useState<BoardOrientation>("white")

    function startGameHandler() {
        if(socket){
            socket.send(JSON.stringify({
                type: INIT_GAME
            }))
            setButtonExist(false)
        }
    }

    useEffect(() => {
        if(!socket)
            return
        socket.onmessage = (event) => {
            const message : MessageType = JSON.parse(event.data)
            switch(message.type) {
                case STARTED:
                    if(message.payload){
                        setPlayerColor(message.payload.color)
                        setStartGame(true)
                    }
                    break;
                
                case MOVE:
                    if(message.payload){
                        game.move({
                            from: message.payload.from,
                            to: message.payload.to
                        })
                        setGame(game)
                        setBoard(game.fen())
                    }
                    break;
                case GAME_OVER:
                    if(message.payload){
                        toast(`${message.payload.message} won`,{
                            position: 'top-center',
                        })
                    }
                    
            }
        }   

        }, [socket])

    return <div className="bg-backboard p-5 h-screen flex justify-center overflow-auto">
        <div className="h-auto w-[95%] p-10 md:w-[82%] backdrop-blur-sm backdrop-saturate-150 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 overflow-auto">
            <div className="col-span-1 md:col-span-2 flex justify-center items-center">
                <ChessBoard socket={socket} gameStart={startGame} game={game} setBoard={setBoard} setGame={setGame} board={board} playerColor={playerColor} />
            </div>
                {!buttonExist ? 
                    <div className="col-span-1 md:col-span-1 overflow-y-scroll border-white border flex justify-center rounded-md min-h-20">
                        <table className="table-fixed w-[100%]">
                            <thead className="bg-slate-200 w-[100%] top-0 sticky">
                                <tr>
                                    <th>From</th>
                                    <th>To</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className="flex justify-center items-center">
                        <button onClick={startGameHandler} type="button" className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-3xl px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
                            Start Game
                        </button>
                    </div>
                }
        </div>
        <Toaster />
    </div>
}