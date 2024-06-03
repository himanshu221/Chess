import { useEffect, useState } from "react"
import { useSocket } from "../hooks/socket"
import { GAME_OVER, INIT_GAME, MOVE, MessageType, STARTED } from "@chess/commons/consts"
import { ChessBoard } from "../components/ChessBoard"
import { Chess } from "chess.js"
import { BoardOrientation } from "react-chessboard/dist/chessboard/types"
import toast, { Toaster } from "react-hot-toast"
import { MoveTable } from "../components/MoveTable"
import { Button } from "@chess/ui/button"
import { useNavigate } from "react-router-dom"
import { useUser } from "@chess/store/user"

export const Game = () => {
    const socket = useSocket()
    const navigate = useNavigate()
    const user = useUser()
    const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false)
    const [startGame, setStartGame] = useState<boolean>(false)
    const [game, setGame] = useState<Chess>(new Chess())
    const [board, setBoard] = useState<string>(game.fen())
    const [playerColor, setPlayerColor] = useState<BoardOrientation>("white")
    const [moves, setMoves] = useState<string[]>([])

    function startGameHandler() {
        if(socket){
            socket.send(JSON.stringify({
                type: INIT_GAME
            }))
            setStartButtonClicked(true)
        }
    }
    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    },[user])
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
                        navigate(`/game/${message.payload.gameId}`)
                    }
                    break;
                
                case MOVE:
                    if(message.payload){
                        game.move({
                            from: message.payload.from,
                            to: message.payload.to,
                            promotion: 'q'
                        })
                        setGame(game)
                        setBoard(game.fen())
                        moves.push(message.payload.to)
                        setMoves(moves)
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
        <div className="h-auto w-[95%] p-10 md:w-[82%] backdrop-saturate-90 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 overflow-auto">
            <div className="col-span-1 md:col-span-2 flex justify-center items-center bg-red-300">
                <ChessBoard socket={socket} moves={moves} setMoves={setMoves} gameStart={startGame} game={game} setBoard={setBoard} setGame={setGame} board={board} playerColor={playerColor} />
            </div>
            {startGame ? <MoveTable moves={moves} /> : 
                <div className="flex justify-center items-center">
                    <Button onClickHandler={startGameHandler} disabled={startButtonClicked} className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 disabled:bg-[#FF9119]/80 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-3xl px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
                        {!startButtonClicked ? "Start Game" : "Finding opponent..."}
                    </ Button>
                </div>
            }
        </div>
        <Toaster />
    </div>
}