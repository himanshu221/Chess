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
    const [opponentName, setOpponentName] = useState<string>("")
    const [startGame, setStartGame] = useState<boolean>(false)
    const [game, setGame] = useState<Chess>(new Chess())
    const [board, setBoard] = useState<string>(game.fen())
    const [playerColor, setPlayerColor] = useState<BoardOrientation>("white")
    const [moves, setMoves] = useState<string[]>([])

    function startGameHandler() {
        if(socket){
            console.log(user.getValue()?.name)
            socket.send(JSON.stringify({
                type: INIT_GAME,
                payload: {
                    name: user.getValue()?.name
                }

            }))
            setStartButtonClicked(true)
            setOpponentName("Finding opponent...")
        }
    }

    useEffect(() => {
        if(!user || user.state === 'hasError'){
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
                        setOpponentName(message.payload.opponentName)
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

    
    if(user.state === 'loading'){
        return <div className="bg-backboard h-screen flex justify-center items-center overflow-auto">
           <div className="text-center">
            <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    }

    return <div className="bg-backboard h-screen flex justify-center items-center overflow-auto">
        <div className="h-[80%] w-[80%] lg:w-[60%] lg:h-[90%] backdrop-saturate-90 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 overflow-auto">
            <div className="col-span-1 lg:col-span-2 flex flex-col justify-center items-center bg-red-300">
                <div className="w-[100%] h-16 bg-white flex justify-center items-stretch">
                    {opponentName}
                </div>
                <div className="w-[100%] h-[100%] flex justify-center items-center">
                    <ChessBoard socket={socket} moves={moves} setMoves={setMoves} gameStart={startGame} game={game} setBoard={setBoard} setGame={setGame} board={board} playerColor={playerColor} />
                </div>
                <div className="w-[100%] h-16 bg-white flex justify-center items-stretch">
                    <div>
                        {user.getValue()?.name}
                    </div>
                </div>
            </div>
            {startButtonClicked ? <MoveTable moves={moves} /> : 
                <div className="flex justify-center items-center">
                    <Button onClickHandler={startGameHandler} disabled={startButtonClicked} className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 disabled:bg-[#FF9119]/80 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-3xl px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
                        Start Game
                    </ Button>
                </div>
            }
        </div>
        <Toaster />
    </div>
}