import GameContext from "../context/GameContext";
import { GameStatus } from "../types/GameStatus";
import GameEntity from "../types/GameEntity";
import { PlayerList } from "../types/Player";
import { GameRecord } from "../types/Record";
import { useContext } from "react";
import { GameSetting } from "../types/GameSetting";
import GameSettingContext from "../context/GameSettingContext";
import { minify } from "../util/Simplify";

export function generateResult(
  gameStatus: GameStatus,
  gameSetting: GameSetting,
  players: PlayerList,
  records: GameRecord[]
) {
  const result: GameEntity = {
    endTime: new Date(),
    gameStatus,
    settings: gameSetting,
    players,
    records,
  };
  return minify(result);
}

export function saveJson(result: { endTime: Date }) {
  const strContent = JSON.stringify(result, null, 2);
  const filename = result.endTime.toLocaleTimeString() + ".json";
  const fileContent = new Blob([strContent], { type: "json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(fileContent);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function ExportResult() {
  const { gameStatus, players, records } = useContext(GameContext);
  const gameSetting = useContext(GameSettingContext);

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
            records
          );
          saveJson(result);
        }}
      >
        Export results
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={async (_event) => {
          const result = generateResult(
            gameStatus,
            gameSetting,
            players,
            records
          );
          console.log(result);
          const resp = await fetch("", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
          });
          console.log(resp.json());
        }}
      >
        Save to database
      </button>
    </>
  );
}
