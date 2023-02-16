import React from "react";
import { GameSetting } from "../types/GameSetting";

const GameSettingContext = React.createContext<GameSetting>({} as GameSetting);

export default GameSettingContext;
