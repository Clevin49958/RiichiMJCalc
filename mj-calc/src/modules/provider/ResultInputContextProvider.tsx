import { useContext, useMemo, useState } from "react";
import GameContext from "../context/GameContext";
import { ResultInputContext } from "../context/ResultInputContext";
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

  const contextValue = useMemo(
    () => ({
      winInfo,
      setWinInfo,
      endingType,
      setEndingType,
      tenpai,
      setTenpai,
    }),
    [endingType, tenpai, winInfo]
  );

  return (
    <ResultInputContext.Provider value={contextValue}>
      {children}
    </ResultInputContext.Provider>
  );
}
