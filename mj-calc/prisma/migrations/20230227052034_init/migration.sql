-- CreateTable
CREATE TABLE "GameSetting" (
    "id" SERIAL NOT NULL,
    "numPlayers" INTEGER NOT NULL,
    "gameMode" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "GameSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerGameScore" (
    "playerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "seating" INTEGER NOT NULL,

    CONSTRAINT "PlayerGameScore_pkey" PRIMARY KEY ("gameId","playerName")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "richii" BOOLEAN[],
    "type" TEXT NOT NULL,
    "info" JSONB NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSetting_gameId_key" ON "GameSetting"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerGameScore_gameId_playerName_key" ON "PlayerGameScore"("gameId", "playerName");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerGameScore_gameId_seating_key" ON "PlayerGameScore"("gameId", "seating");

-- AddForeignKey
ALTER TABLE "GameSetting" ADD CONSTRAINT "GameSetting_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameScore" ADD CONSTRAINT "PlayerGameScore_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
