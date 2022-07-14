import { useContext, useMemo, useState, useCallback } from "react";
import GameContext from "../context/GameContext";
import { ResultInputContext } from "../context/ResultInputContext";
import { GameStatus } from "../types/GameStatus";
import { WinRecord } from "../types/Record";
import { DEFAULT_WIN_INFO } from "../util/Constants";

interface ResultInputContextProps {
  children: React.ReactNode;
}
export function ResultInputContextProvider({
  children,
}: ResultInputContextProps) {
  const { gameStatus } = useContext(GameContext);

  const [winInfo, setWinInfo] = useState<WinRecord[]>(
    DEFAULT_WIN_INFO(gameStatus)
  );
  const [tenpai, setTenpai] = useState<boolean[]>(
    Array(gameStatus.numPlayers).fill(false)
  );
  const [endingType, setEndingType] = useState<"Win" | "Draw">("Win");

  const resetWinState = useCallback(
    (gameStatus: GameStatus) => {
      setWinInfo(DEFAULT_WIN_INFO(gameStatus));
      setTenpai(Array(gameStatus.numPlayers).fill(false));
      setEndingType("Win");
    },
    [setEndingType, setTenpai, setWinInfo]
  );

  const contextValue = useMemo(
    () => ({
      winInfo,
      setWinInfo,
      endingType,
      setEndingType,
      tenpai,
      setTenpai,
      resetWinState,
    }),
    [endingType, resetWinState, tenpai, winInfo]
  );

  return (
    <ResultInputContext.Provider value={contextValue}>
      {children}
    </ResultInputContext.Provider>
  );
}
