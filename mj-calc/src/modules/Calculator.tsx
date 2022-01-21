import { useState } from "react";
import { getWind, NP, WindNumber } from "./util/Wind";
import { CalculatorCore } from "./CalculatorCore";
import { StartUp } from "./Startup";

export default function Calculator() {
  // 3 or 4 players
  const DEFAULT_N_PLAYERS = 4;
  const [numPlayers, setNumPlayers] = useState<NP>(DEFAULT_N_PLAYERS);

  const [playerNames, setPlayerNames] = useState<string[]>(
    (Array.from(Array(DEFAULT_N_PLAYERS).keys()) as WindNumber[]).map(getWind),
  );

  const [namesReady, setNamesReady] = useState(false);

  const gameReady = namesReady;

  return gameReady ? (
    <CalculatorCore
      n={numPlayers}
      playerNames={playerNames.slice(0, numPlayers)}
    />
  ) : (
    <StartUp
      numPlayers={numPlayers}
      playerNames={playerNames}
      setNumPlayers={setNumPlayers}
      setPlayerNames={setPlayerNames}
      setNamesReady={setNamesReady}
    />
  );
}
