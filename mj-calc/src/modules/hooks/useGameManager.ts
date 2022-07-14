import { useCallback, useContext } from "react";
import GameContext from "../context/GameContext";
import { RichiiList } from "../types/GameStatus";
import { PlayerList } from "../types/Player";
import { WindNumber } from "../util/Wind";

export function useGameManager() {
  const {
    gameStatus,
    setGameStatus,
    players,
    setPlayers,
    records: gameRecord,
    setRecords: setGameRecord,
  } = useContext(GameContext);

  const togglePlayerRichii = useCallback(
    (seating: WindNumber, isRichiiNow: boolean) => {
      setPlayers((players) => {
        const newPlayers = [...players] as PlayerList;
        newPlayers[seating] = {
          ...newPlayers[seating],
          score: newPlayers[seating].score - (isRichiiNow ? 1000 : -1000),
        };
        return newPlayers;
      });

      setGameStatus(({ richii, richiiStick, ...props }) => {
        const newRichiiList = [...richii] as RichiiList;
        newRichiiList[seating] = isRichiiNow;
        return {
          ...props,
          richiiStick: richiiStick + (newRichiiList[seating] ? 1 : -1),
          richii: newRichiiList,
        };
      });
    },
    [setGameStatus, setPlayers]
  );
  return {
    togglePlayerRichii,
  };
}
