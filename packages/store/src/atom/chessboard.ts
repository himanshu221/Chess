import { atom} from "recoil";
import { Chess } from "chess.js"
import { BoardOrientation } from "react-chessboard/dist/chessboard/types"


export const opponentNameAtom = atom({
    key: "opponentName",
    default: ""
})

export const startGameAtom = atom({
    key: "startGame",
    default: false
})

export const gameAtom = atom({
    key: "game",
    default: new Chess()
})

export const boardAtom = atom({
    key: "board",
    default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    })

export const playerColorAtom = atom<BoardOrientation>({
    key: "playerColor",
    default: "white"
})

export const movesAtom = atom<string[]>({
    key: "movesAtom",
    default: []
})
