
import prisma from "@chess/db/client"

export async function saveGameToDB(gameId: string, whitePlayerId: string, blackPlayerId: string) {
    await prisma.game.create({
        data: {
            id: gameId,
            whitePlayer: {
                connect: {
                    id: whitePlayerId
                }
            },
            blackPlayer: {
                connect: {
                    id: blackPlayerId
                }
            }
        }
    })
}