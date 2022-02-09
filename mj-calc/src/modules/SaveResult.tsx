import GameContext from "./util/Context";
import { GameStatus } from "./util/GameStatus";
import IGame from "./util/IGame";
import { IPlayerTable } from "./util/IPlayer";
import { IRecord } from "./util/IRecord";
import { useContext } from "react";

export function generateResult(
  gameStatus: GameStatus,
  players: IPlayerTable,
  records: IRecord[],
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
  console.log(JSON.stringify(result));
}

export function ExportResult() {
  const { gameStatus, players, records } = useContext(GameContext);

  return (
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
  );
}
