-- DropForeignKey
ALTER TABLE "GameSetting" DROP CONSTRAINT "GameSetting_gameId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerGameScore" DROP CONSTRAINT "PlayerGameScore_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_gameId_fkey";

-- AddForeignKey
ALTER TABLE "GameSetting" ADD CONSTRAINT "GameSetting_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameScore" ADD CONSTRAINT "PlayerGameScore_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
