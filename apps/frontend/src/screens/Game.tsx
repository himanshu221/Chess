import { useEffect, useState } from "react"
import { useSocket } from "../hooks/socket"
import { MessageType } from '@chess/commons/definition'
import { ACTIVE, GAME_OVER, INIT_GAME, MOVE, STARTED } from "@chess/commons/consts"
import { ChessBoard } from "../components/ChessBoard"
import { Chess } from "chess.js"
import { BoardOrientation } from "react-chessboard/dist/chessboard/types"
import toast, { Toaster } from "react-hot-toast"
import { MoveTable } from "../components/MoveTable"
import { Button } from "@chess/ui/button"
import { Loader } from "../components/Loader"
import { useNavigate } from "react-router-dom"
import { useUser } from "@chess/store/user"

export const Game = () => {
    const navigate = useNavigate()
    const user = useUser()
    const socket = useSocket()

    const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false)
    const [opponentName, setOpponentName] = useState<string>("")
    const [startGame, setStartGame] = useState<boolean>(false)
    const [game, setGame] = useState<Chess>(new Chess())
    const [board, setBoard] = useState<string>(game.fen())
    const [playerColor, setPlayerColor] = useState<BoardOrientation>("white")
    const [moves, setMoves] = useState<string[]>([])
    
    function startGameHandler() {
        if(socket){
            socket.send(JSON.stringify({type: INIT_GAME}))
            setStartButtonClicked(true)
            setOpponentName("Finding opponent...")
        }
    }

    useEffect(() => {
        if(!user || user.state === 'hasError' || (user.state !== 'loading' && !user.getValue()?.success)){
            navigate('/login')
        }
    },[user])

    useEffect(() => {
        if(!socket)
            return
        socket.onmessage = (event) => {
            const message : MessageType = JSON.parse(event.data)
            switch(message.type) {
                case ACTIVE:
                    if(message.payload){
                        setPlayerColor(message.payload.color)
                        setStartGame(true)
                        navigate(`/game/${message.payload.gameId}`)
                        setOpponentName(message.payload.opponentName)
                        setGame(new Chess(message.payload.boardFen))
                        setBoard(message.payload.boardFen)
                        setMoves(message.payload.moves)
                        setStartButtonClicked(true)
                    }else{
                        navigate('/game/random')
                    }
                    break;
                case STARTED:
                    if(message.payload){
                        setPlayerColor(message.payload.color)
                        setStartGame(true)
                        navigate(`/game/${message.payload.gameId}`)
                        setOpponentName(message.payload.opponentName)
                    }
                    break;
                
                case MOVE:
                    console.log(game)
                    if(message.payload){
                        game.move({
                            from: message.payload.from,
                            to: message.payload.to,
                            promotion: 'q'
                        })
                        console.log(game)
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
                    break;
            }
        }   

        }, [socket])

    if(user.state === "loading"){
        return <div className="bg-backboard h-screen flex justify-center items-center">
            <Loader />
        </div>
    }   

    return <div className="bg-backboard h-screen flex justify-center items-center overflow-auto">
        <div className="h-[90%] w-[60%] lg:w-[60%] lg:h-[90%] backdrop-saturate-90 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 overflow-auto">
            <div className="col-span-1 lg:col-span-2 flex flex-col justify-center items-center">
                <div className="w-[100%] h-16 px-5 flex justify-between items-center text-lg text-white">
                    <div className="flex justify-center items-center gap-5">
                        {startButtonClicked ? <div className="w-10">
                                <img src="/user-image.svg" alt="" />
                            </div> : null}
                        <div>
                            {opponentName}
                        </div>
                    </div>
                </div>
                <div className="w-[100%] h-[100%] flex justify-center items-center">
                    <ChessBoard socket={socket} moves={moves} setMoves={setMoves} gameStart={startGame} game={game} setBoard={setBoard} setGame={setGame} board={board} playerColor={playerColor} />
                </div>
                <div className="w-[100%] h-16 px-5 flex justify-between items-center text-lg text-white">
                    <div className="flex justify-center items-center gap-5">
                        <div className="w-10">
                            <img src="/user-image.svg" alt="" />
                        </div>
                        <div>
                            {user.getValue()?.payload.name}
                        </div>
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