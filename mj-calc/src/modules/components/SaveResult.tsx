import React, { useContext, useState } from "react";

import { Prisma } from "@prisma/client";
import { useTranslation } from "next-i18next";
import GameContext from "../context/GameContext";
import { GameStatus } from "../types/GameStatus";
import GameEntity from "../types/GameEntity";
import { PlayerList } from "../types/Player";
import { GameRecord } from "../types/Record";
import { GameSetting } from "../types/GameSetting";
import GameSettingContext from "../context/GameSettingContext";
import { MiniGameEntity, minify, prismafy } from "../util/Simplify";

export function generateResult(
  gameStatus: GameStatus,
  gameSetting: GameSetting,
  players: PlayerList,
  records: GameRecord[],
  target: "json"
): MiniGameEntity;

export function generateResult(
  gameStatus: GameStatus,
  gameSetting: GameSetting,
  players: PlayerList,
  records: GameRecord[],
  target: "database"
): Prisma.GameCreateInput;

export function generateResult(
  gameStatus: GameStatus,
  gameSetting: GameSetting,
  players: PlayerList,
  records: GameRecord[],
  target: "json" | "database"
) {
  const result: GameEntity = {
    endTime: new Date(),
    gameStatus,
    settings: gameSetting,
    players,
    records,
  };
  if (target === "json") {
    return minify(result);
  }
  return prismafy(result);
}

export function saveJson(result: { endTime: Date }) {
  const strContent = JSON.stringify(result, null, 2);
  const filename = `${result.endTime.toLocaleTimeString()}.json`;
  const fileContent = new Blob([strContent], { type: "json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(fileContent);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function ExportResult() {
  const { t } = useTranslation("common");
  const { gameStatus, players, records } = useContext(GameContext);
  const gameSetting = useContext(GameSettingContext);
  const [buttonColor, setButtonColor] = useState("primary");

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={(_event) => {
          const result = generateResult(
            gameStatus,
            gameSetting,
            players,
            records,
            "json"
          );
          saveJson(result);
        }}
      >
        {t("save.exportGame")}
      </button>
      <button
        type="button"
        className={`btn btn-${buttonColor}`}
        style={{
          transition: "all 1s ease-in",
        }}
        onClick={(_event) => {
          const result = generateResult(
            gameStatus,
            gameSetting,
            players,
            records,
            "database"
          );
          fetch("/api/games", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: result }),
          })
            .then(() => setButtonColor("success"))
            .catch(() => setButtonColor("warning"));
        }}
      >
        {t("save.save")}
      </button>
    </>
  );
}
