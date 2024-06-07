/*
  Warnings:

  - The values [DRAW] on the enum `GameStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameStatus_new" AS ENUM ('IN_PROGRESS', 'ABANDONED', 'ENDED');
ALTER TABLE "game" ALTER COLUMN "status" TYPE "GameStatus_new" USING ("status"::text::"GameStatus_new");
ALTER TYPE "GameStatus" RENAME TO "GameStatus_old";
ALTER TYPE "GameStatus_new" RENAME TO "GameStatus";
DROP TYPE "GameStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "game" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS',
ALTER COLUMN "result" DROP NOT NULL,
ALTER COLUMN "currentState" SET DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
ALTER COLUMN "endedAt" DROP NOT NULL;
