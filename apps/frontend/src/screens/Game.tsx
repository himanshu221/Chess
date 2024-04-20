import { useState } from "react"
import { Chessboard } from "react-chessboard"
import { useSocket } from "../hooks/socket"
import { INIT_GAME } from "@chess/commons/consts"

export const Game = () => {
    const socket = useSocket()
    const [startGame, setStartGame] = useState<boolean>(false)

    function startGameHandler() {
        if(socket){
            socket.send(JSON.stringify({
                type: INIT_GAME
            }))
            setStartGame(true)
        }
    }

    return <div className="bg-backboard p-5 h-screen flex justify-center overflow-auto">
        <div className="h-auto w-[95%] p-10 md:w-[82%] backdrop-blur-sm backdrop-saturate-150 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 overflow-auto">
            <div className="col-span-1 md:col-span-2 flex justify-center items-center">
                <Chessboard position={'start'} boardWidth={580} customBoardStyle={{borderRadius: '5px', boxShadow: '0 0 50px rgba(0, 0, 0, 0.9'}} />
            </div>
                {startGame ? 
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
    </div>
}