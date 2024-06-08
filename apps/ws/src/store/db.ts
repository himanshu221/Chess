import { IN_PROGRESS } from "@chess/commons/consts";
import prisma from "@chess/db/client"
import { Game } from "../Game";
import { User } from "@chess/commons/definition";

/**
 * Saves a new game to the database.
 *
 * @param gameId - The unique identifier of the game.
 * @param whitePlayerId - The unique identifier of the white player.
 * @param blackPlayerId - The unique identifier of the black player.
 * @returns A Promise that resolves when the game is saved to the database.
 */
export async function saveGameToDB(
  gameId: string,
  whitePlayerId: string,
  blackPlayerId: string
) {
  try {
    await prisma.game.create({
      data: {
        id: gameId,
        whitePlayer: {
          connect: {
            id: whitePlayerId,
          },
        },
        blackPlayer: {
          connect: {
            id: blackPlayerId,
          },
        },
      },
    });
  } catch (e) {
    console.error(e);
  }
}

/**
 * Saves a move in the game database.
 *
 * @param gameId - The ID of the game.
 * @param from - The starting position of the move.
 * @param to - The ending position of the move.
 */
export async function saveMoveToDB(gameId: string, from: string, to: string) {
        try{
            await prisma.move.create({
                data: {
                    game: {
                        connect: {
                            id: gameId
                        },
                        
                    },
                    to,
                    from
                }
            })
        }catch(e){
            console.error(e)
        }
}

/**
 * Updates the status and result of a game.
 *
 * @param gameId - The ID of the game to update.
 * @param status - The new status of the game.
 * @param result - The new result of the game.
 * @returns A Promise that resolves when the game status has been updated.
 */
export async function updateGameStatus(gameId: string, currentState: string, status: any, result: any){
    if(status === "IN_PROGRESS"){
        try{
            await prisma.game.update({
                where: {
                    id: gameId
                },
                data:{
                    status: status,
                    currentState: currentState
                }
            })
        }catch(e){
            console.error(e)
        }
    }else{
        try{
            await prisma.game.update({
                where: {
                    id: gameId
                },
                data:{
                    status: status,
                    currentState: currentState,
                    result
                }
            })
        }catch(e){
            console.error(e)
        }
    }
}

export async function searchActiveGame(userId: string){
    try{
        const gameState = await prisma.game.findFirst({
            where: {
                OR: [{
                    whitePlayerId: userId
                },{
                    blackPlayerId: userId
                }],
                status: IN_PROGRESS
                
            },
            select: {
                id: true,
                whitePlayer: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                blackPlayer: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                moves: {
                    select: {
                        to: true
                    }
                },
                currentState: true
            }
        })

        return gameState
    }catch(e){
        console.error("Error fetching user's active game")
        console.error(e)
        return null;
    }
}

export async function loadStateFromDb(){
    const gameStateFromDb = await prisma.game.findMany({
        where: {
            status: IN_PROGRESS
        }
    })

    const gameState: Game[] = gameStateFromDb.map(game => {
        const player1: User = {
            id: game.whitePlayerId,
        }
        const player2: User = {
            id: game.blackPlayerId
        }
        const gm = new Game(game.id, player1, player2, game.currentState)
        return gm
    })

    return gameState
}