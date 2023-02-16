import { ReactNode } from "react";

import GameSettingContext from "../context/GameSettingContext";
import { GameSetting } from "../types/GameSetting";

interface GameSettingContextProps {
  setting: GameSetting;
  children: ReactNode;
}

export function GameSettingContextProvider({
  children,
  setting,
}: GameSettingContextProps) {
  return (
    <GameSettingContext.Provider value={setting}>
      {children}
    </GameSettingContext.Provider>
  );
}
