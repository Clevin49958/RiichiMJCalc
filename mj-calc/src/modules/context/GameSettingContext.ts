import React from "react";

import { NP } from "../util/Wind";

interface GameSettingContextType {
  numPlayers: NP;
}

const GameSettingContext = React.createContext<GameSettingContextType>(
  {} as GameSettingContextType
);

export default GameSettingContext;
