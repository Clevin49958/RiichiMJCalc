import GameContext from "../context/GameContext";
import { GameStatus } from "../types/GameStatus";
import GameEntity from "../types/GameEntity";
import { PlayerList } from "../types/Player";
import { Record } from "../types/Record";
import { useContext } from "react";
import { GameSetting } from "../types/GameSetting";
import GameSettingContext from "../context/GameSettingContext";

export function generateResult(
  gameStatus: GameStatus,
  gameSetting: GameSetting,
  players: PlayerList,
  records: Record[]
) {
  const result: GameEntity = {
    endTime: new Date(),
    gameStatus,
    settings: gameSetting,
    players,
    records,
  };
  return result;
}

export function saveJson(result: GameEntity) {
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
    <div className="d-flex align-items-center">
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
    </div>
  );
}
