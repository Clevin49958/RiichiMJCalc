-- CreateTable
CREATE TABLE "GameSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numPlayers" INTEGER NOT NULL,
    "gameMode" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    CONSTRAINT "GameSetting_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startTime" DATETIME,
    "endTime" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerGameScore" (
    "playerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    PRIMARY KEY ("gameId", "playerName"),
    CONSTRAINT "PlayerGameScore_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "richii" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    CONSTRAINT "Record_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSetting_gameId_key" ON "GameSetting"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerGameScore_gameId_playerName_key" ON "PlayerGameScore"("gameId", "playerName");
