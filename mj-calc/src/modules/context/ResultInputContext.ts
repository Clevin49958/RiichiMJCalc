import React, { Dispatch, SetStateAction } from "react";

import { EndingType, WinRecord } from "../types/Record";

interface ResultInputContextType {
  winInfo: WinRecord[];
  setWinInfo: Dispatch<SetStateAction<WinRecord[]>>;
  endingType: EndingType;
  setEndingType: Dispatch<SetStateAction<EndingType>>;
  tenpai: boolean[];
  setTenpai: Dispatch<SetStateAction<boolean[]>>;
  resetWinState: () => void;
}

const ResultInputContext = React.createContext<ResultInputContextType>(
  {} as ResultInputContextType,
);

export default ResultInputContext;
