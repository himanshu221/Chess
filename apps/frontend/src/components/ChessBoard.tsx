
import { ChessBoardProps, MOVE } from "@chess/commons/consts";
import { Chessboard } from "react-chessboard"
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
                setGame(game)
                setBoard(game.fen())
                moves.push(targetSquare)
                setMoves(moves)
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
                boardWidth={580} 
                snapToCursor={true}
                onPieceDrop={onDropHandler}
                customBoardStyle={
                    {
                        borderRadius: '5px',
                        boxShadow: '0 0 50px rgba(0, 0, 0, 0.9'
                    }} 
            />
}