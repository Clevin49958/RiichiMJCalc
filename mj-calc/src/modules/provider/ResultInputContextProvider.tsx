import React, { useContext, useMemo, useState, useCallback } from "react";

import GameSettingContext from "../context/GameSettingContext";
import { ResultInputContext } from "../context/ResultInputContext";
import { WinRecord } from "../types/Record";
import { DEFAULT_WIN_INFO } from "../util/Constants";

interface ResultInputContextProps {
  children: React.ReactNode;
}
export default function ResultInputContextProvider({
  children,
}: ResultInputContextProps) {
  const { numPlayers } = useContext(GameSettingContext);

  const [winInfo, setWinInfo] = useState<WinRecord[]>([
    { ...DEFAULT_WIN_INFO },
  ]);
  const [tenpai, setTenpai] = useState<boolean[]>(
    Array(numPlayers).fill(false),
  );
  const [endingType, setEndingType] = useState<"Win" | "Draw">("Win");

  const resetWinState = useCallback(() => {
    setWinInfo([{ ...DEFAULT_WIN_INFO }]);
    setTenpai(Array(numPlayers).fill(false));
    setEndingType("Win");
  }, [numPlayers]);

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
    [endingType, resetWinState, tenpai, winInfo],
  );

  return (
    <ResultInputContext.Provider value={contextValue}>
      {children}
    </ResultInputContext.Provider>
  );
}
