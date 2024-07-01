import { useEffect, useRef, useState } from "react"
import { useSocket } from "../hooks/socket"
import { MessageType } from '@chess/commons/definition'
import { ACTIVE, GAME_OVER, INIT_GAME, MOVE, RESIGN, STARTED, WHITE } from "@chess/commons/consts"
import { ChessBoard } from "../components/ChessBoard"
import { Chess } from "chess.js"
import { MoveTable } from "../components/MoveTable"
import { Button } from "@chess/ui/button"
import { Loader } from "../components/Loader"
import { useNavigate } from "react-router-dom"
import { useUser } from "@chess/store/user"
import MoveSound from "/move-self.mp3"
import CaptureSound from "/capture.mp3"
import CheckSound  from "/move-check.mp3"
import StartSound from "/start.mp3"
import GameEndSound from "/game-end.webm"
import { GameEndModal } from "../components/GameEndModal"
import Timer from "../components/Timer"
import { Conf } from "../components/Confetti"

export const Game = () => {
    const navigate = useNavigate()
    const user = useUser()
    const socket = useSocket()
    const resignPopUpRef = useRef<HTMLDivElement>(null)
    const moveAudio = new Audio(MoveSound);
    const captureAudio = new Audio(CaptureSound);
    const checkAudio = new Audio(CheckSound)
    const startAudio = new Audio(StartSound)
    const gameEndAudio = new Audio(GameEndSound)

    const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false)
    const [opponentName, setOpponentName] = useState<string>("")
    const [startGame, setStartGame] = useState<boolean>(false)
    const [game, setGame] = useState<Chess>(new Chess())
    const [board, setBoard] = useState<string>(game.fen())
    const [playerColor, setPlayerColor] = useState<string>(WHITE)
    const [moves, setMoves] = useState<string[]>([])
    const [checkedActiveGame, setCheckActiveGame] = useState<boolean>(false);
    const [showEndGameModal, setShowEndGameModal] = useState<boolean>(false)
    const [gameEndMessage, setGameEndMessage] = useState<string>("")
    const [showResignOpt, setShowResignOpt] = useState<boolean>(false)
    const [whiteTimeConsumed, setWhiteTimeConsumed] = useState<number>(0)
    const [blackTimeConsumed, setBlackTimeConsumed] = useState<number>(0)
    const [winnerColor, setWinnerColor] = useState<string>(WHITE)

    function startGameHandler() {
        if(socket){
            socket.send(JSON.stringify({type: INIT_GAME}))
            setStartButtonClicked(true)
            setOpponentName("Finding opponent...")
        }
    }

    function handleGameResign() {
        setShowResignOpt(false)
        socket && socket.send(JSON.stringify({
            type: RESIGN
        }))
    }
    useEffect(() => {
        if(!user || user.state === 'hasError' || (user.state !== 'loading' && !user.getValue()?.success)){
            navigate('/login')
        }
    },[user])

    useEffect(() => {
        if (startGame) {
          const interval = setInterval(() => {
            if (game.turn() === 'w') {
              setWhiteTimeConsumed((p) => p + 500);
            } else {
              setBlackTimeConsumed((p) => p + 500);
            }
          }, 500);
          return () => clearInterval(interval);
        }
      }, [startGame, whiteTimeConsumed, blackTimeConsumed]);

    useEffect(() => {
        if(!socket)
            return
        socket.onmessage = (event) => {
            const message : MessageType = JSON.parse(event.data)
            switch(message.type) {
                case ACTIVE:
                    if(message.payload){
                        navigate(`/game/${message.payload.gameId}`, { replace: true })
                        setPlayerColor(message.payload.color)
                        setStartGame(true)
                        message.payload.moves.forEach(move => moves.push(move))
                        setMoves(moves)
                        setStartButtonClicked(true)
                        setBlackTimeConsumed(message.payload.blackTimeConsumed)
                        setWhiteTimeConsumed(message.payload.whiteTimeConsumed)
                        setOpponentName(message.payload.opponentName)
                        setBoard(message.payload.boardFen)
                        game.load(message.payload.boardFen)
                        setGame(game)
                        setCheckActiveGame(true)
                        startAudio.play()
                    }else{
                        setCheckActiveGame(true)
                        navigate('/game/random')
                    }
                    break;
                case STARTED:
                    if(message.payload){
                        setPlayerColor(message.payload.color)
                        setStartGame(true)
                        navigate(`/game/${message.payload.gameId}`)
                        setOpponentName(message.payload.opponentName)
                        startAudio.play()
                    }
                    break;
                
                case MOVE:
                    if(message.payload){
                        const move = game.move({
                            from: message.payload.from,
                            to: message.payload.to,
                            promotion: 'q'
                        })
                        if(game.isCheck()){
                            checkAudio.play()
                        }else if(move.captured){
                            captureAudio.play()
                        }
                        else{
                            moveAudio.play()
                        }
                        moves.push(message.payload.to)
                        setBlackTimeConsumed(message.payload.blackTimeConsumed)
                        setWhiteTimeConsumed(message.payload.whiteTimeConsumed)
                        setMoves(moves)
                        setBoard(game.fen())
                        setGame(game)
                    }
                    break;
                case GAME_OVER:
                    if(message.payload){
                        setGameEndMessage(message.payload.message)
                        setWinnerColor(message.payload.color)
                        gameEndAudio.play()
                        setShowEndGameModal(true)
                    }
                    break;
            }
        }   

        }, [socket])

    if(user.state === "loading" || !checkedActiveGame){
        return <div className="bg-backboard h-screen flex justify-center items-center">
            <Loader />
        </div>
    }   

    return <div onMouseDown={(event) => {
         if (resignPopUpRef.current && !resignPopUpRef.current.contains(event.target as Node)) {
            setShowResignOpt(false)
          }}} className="bg-backboard h-screen flex justify-center items-center overflow-auto relative">
        <div className="h-[90%] w-[60%] lg:w-[60%] lg:h-[90%] backdrop-saturate-90 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 overflow-auto">
            <div className="col-span-1 lg:col-span-2 flex flex-col justify-center items-center">
                <div className="w-[100%] h-16 px-5 flex justify-between items-center text-lg text-white">
                    <div className="flex justify-center items-center gap-5">
                        {startButtonClicked && <div className="w-10">
                                <img src="/user-image.svg" alt="" />
                            </div>}
                        <div>
                            {opponentName}
                        </div>
                    </div>
                    {startGame && <Timer timePassed={playerColor === WHITE ? blackTimeConsumed : whiteTimeConsumed} />}
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
                        <div className="relative">
                            {showResignOpt && <div ref={resignPopUpRef} className="absolute bottom-10 w-48 flex flex-col justify-center items-start bg-black bg-opacity-80 p-2 rounded-lg">
                                <div className="text-md w-full flex justify-center items-start">
                                    Are you sure ?
                                </div>
                                <div className="flex w-full items-center justify-center">
                                    <div>
                                        <Button onClickHandler={handleGameResign} className="bg-gray-300 text-sm hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-lg mx-3">
                                            Yes
                                        </Button>
                                    </div>
                                    <div>
                                        <Button onClickHandler={() => setShowResignOpt(false)} className="bg-gray-300 text-sm hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-lg mx-3">
                                            No
                                        </Button>
                                    </div>
                                </div>
                            </div>}
                            {startGame && <Button onClickHandler={() => { setShowResignOpt(!showResignOpt)}} className="text-white bg-yellow-700 hover:bg-yellow-800 font-medium rounded-lg text-sm px-3 py-1 text-center me-1 mb-1">
                                Resign
                            </Button>}
                        </div>
                    </div>
                    {startGame && <Timer timePassed={playerColor === WHITE ? whiteTimeConsumed : blackTimeConsumed} />}
                </div>
            </div>
            {startButtonClicked ? <MoveTable moves={moves} /> : 
                <div className="flex justify-center items-center">
                    <Button onClickHandler={startGameHandler} disabled={startButtonClicked} className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 disabled:bg-[#FF9119]/80 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-3xl px-5 py-2.5 text-center inline-flex items-center me-2 mb-2">
                        Start Game
                    </ Button>
                </div>
            }
        </div>
    { showEndGameModal && <GameEndModal message={gameEndMessage} buttonText="New Game" setEndGameModal={setShowEndGameModal} />}
    { showEndGameModal && playerColor === winnerColor && <Conf />}
    </div>
    
}