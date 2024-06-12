
import { MOVE } from "@chess/commons/consts";
import { Chessboard } from "react-chessboard"
import {ChessBoardProps} from "@chess/commons/definition"
import { Square } from "react-chessboard/dist/chessboard/types"

export const ChessBoard  = ({socket, moves, setMoves, game ,gameStart,  setGame,  board, setBoard, playerColor} : ChessBoardProps) => {

    function onDropHandler(sourceSquare: Square, targetSquare: Square){
        if(game.turn() !== playerColor.charAt(0)){
            return false;
        }
        try{
            game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            })
            if(socket){
                moves.push(targetSquare)
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
                position={board} 
                boardOrientation={playerColor}
                snapToCursor={true}
                onPieceDrop={onDropHandler}
                customBoardStyle={
                    {
                        borderRadius: '5px'
                    }} 
            />
}