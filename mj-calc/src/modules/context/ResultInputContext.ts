import React from "react";
import { Dispatch, SetStateAction } from "react";
import { WinRecord } from "../types/Record";

interface ResultInputContextType {
  winInfo: WinRecord[];
  setWinInfo: Dispatch<SetStateAction<WinRecord[]>>;
  endingType: "Win" | "Draw";
  setEndingType: Dispatch<SetStateAction<"Win" | "Draw">>;
  tenpai: boolean[];
  setTenpai: Dispatch<SetStateAction<boolean[]>>;
}

export const ResultInputContext = React.createContext<ResultInputContextType>(
  {} as ResultInputContextType
);
