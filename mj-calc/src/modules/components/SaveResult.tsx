import GameContext from "../context/GameContext";
import { GameStatus } from "../util/GameStatus";
import IGame from "../util/IGame";
import { IPlayerTable } from "../util/IPlayer";
import { IRecord } from "../util/IRecord";
import { useContext } from "react";

export function generateResult(
  gameStatus: GameStatus,
  players: IPlayerTable,
  records: IRecord[]
) {
  const result: IGame = {
    endTime: new Date(),
    gameStatus,
    players,
    records,
  };
  return result;
}

export function saveJson(result: IGame) {
  const strContent = JSON.stringify(result, null, 2);
  const filename = result.endTime.toLocaleDateString() + ".json";
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

  return (
    <div className="d-flex align-items-center">
      <button
        type="button"
        className="btn btn-primary"
        onClick={(_event) => {
          const result = generateResult(gameStatus, players, records);
          saveJson(result);
        }}
      >
        Export results
      </button>
    </div>
  );
}
