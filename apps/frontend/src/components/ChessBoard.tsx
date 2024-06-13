
import { MOVE } from "@chess/commons/consts";
import MoveSound from "/move-self.mp3"
import CaptureSound from "/capture.mp3"
import CheckSound  from "/move-check.mp3"
import { Chessboard } from "react-chessboard"
import {ChessBoardProps} from "@chess/commons/definition"
import { Square } from "react-chessboard/dist/chessboard/types"

export const ChessBoard  = ({socket, moves, setMoves, game ,gameStart,  setGame,  board, setBoard, playerColor} : ChessBoardProps) => {
    const moveAudio = new Audio(MoveSound);
    const captureAudio = new Audio(CaptureSound);
    const checkAudio = new Audio(CheckSound)

    function onDropHandler(sourceSquare: Square, targetSquare: Square){
        if(game.turn() !== playerColor.charAt(0)){
            return false;
        }
        try{
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            })
            if(socket){
                moves.push(targetSquare)
                if(game.isCheck()){
                    checkAudio.play()
                }
                else if(move.captured){
                    captureAudio.play()
                }else{
                    moveAudio.play()
                }
                setMoves(moves)
                setBoard(game.fen())
                setGame(game)
                socket.send(JSON.stringify({
                    type: MOVE,
                    payload: {
                        from: sourceSquare,
                        to: targetSquare
                    }
                }))
                return true;
            }
        }catch(e){
            return false;
        }

        return false;

    }
    
    return <Chessboard 
                arePiecesDraggable={gameStart}
                animationDuration={100}
                position={board} 
                autoPromoteToQueen={true}
                boardOrientation={playerColor}
                snapToCursor={true}
                onPieceDrop={onDropHandler}
                customBoardStyle={
                    {
                        borderRadius: '5px'
                    }} 
            />
}