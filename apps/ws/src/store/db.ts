import prisma from "@chess/db/client"

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
export async function saveMoveToDB(gameId: string | undefined, from: string, to: string) {
    if(gameId){
        try{
            await prisma.move.create({
                data: {
                    game: {
                        connect: {
                            id: gameId
                        }
                    },
                    to,
                    from
                }
            })
        }catch(e){
            console.error(e)
        }
    }
}

export async function updateGameStatus(gameId: string, status: any){
    if(gameId){
        try{
            await prisma.game.update({
                where: {
                    id: gameId
                },
                data:{
                    status: status
                    

                }
            })
        }
    }
}