import { ReactNode, useMemo } from "react";

import GameSettingContext from "../context/GameSettingContext";
import { NP } from "../util/Wind";

interface GameSettingContextProps {
  numPlayers: NP;
  children: ReactNode;
}

export function GameSettingContextProvider({
  children,
  numPlayers,
}: GameSettingContextProps) {
  const gameSettingContext = useMemo(
    () => ({
      numPlayers,
    }),
    [numPlayers]
  );

  return (
    <GameSettingContext.Provider value={gameSettingContext}>
      {children}
    </GameSettingContext.Provider>
  );
}
