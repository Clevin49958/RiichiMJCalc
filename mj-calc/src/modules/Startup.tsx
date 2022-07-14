import { useCallback, useState } from "react";

import { getWind, NP, WindNumber } from "./util/Wind";
import { CalculatorCore } from "./Calculator";
import { StartUp } from "./components/NameInputGrid";
import GameEntity from "./types/GameEntity";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { GameContextProvider } from "./context/GameContextProvider";

const DEFAULT_N_PLAYERS = 4;

export default function Calculator() {
  // 3 or 4 players
  const [numPlayers, setNumPlayers] = useState<NP>(DEFAULT_N_PLAYERS);

  const [playerNames, setPlayerNames] = useLocalStorage<string[]>(
    "names",
    (Array.from(Array(DEFAULT_N_PLAYERS).keys()) as WindNumber[]).map(getWind)
  );

  const [namesReady, setNamesReady] = useState(false);

  const [viewOnly, setViewOnly] = useState(false);
  const [viewFile, setViewFile] = useState<GameEntity | undefined>(undefined);

  const gameReady = namesReady;

  const onNextGame = useCallback(
    (names: string[]) => {
      setPlayerNames(names);
      setNamesReady(false);
    },
    [setPlayerNames]
  );

  return gameReady ? (
    <GameContextProvider
      n={numPlayers}
      playerNames={playerNames.slice(0, numPlayers)}
      state={viewFile}
    >
      <CalculatorCore viewOnly={viewOnly} onNextGame={onNextGame} />
    </GameContextProvider>
  ) : (
    <>
      <div className="d-flex flex-column align-items-center">
        <StartUp
          numPlayers={numPlayers}
          playerNames={playerNames}
          setNumPlayers={setNumPlayers}
          setPlayerNames={setPlayerNames}
          setNamesReady={setNamesReady}
        />
      </div>
      <div className="container" style={{ maxWidth: "380px" }}>
        <label className="form-label center-block" style={{ display: "block" }}>
          <h5>View an exported game here:</h5>
          <input
            className="form-control"
            type="file"
            onChange={(event) => {
              const file = event.target.files?.item(0);
              const fileReader = new FileReader();
              if (!file) {
                return;
              }
              fileReader.readAsText(file);
              fileReader.onload = (event) => {
                const stringContent = event.target?.result?.toString() ?? "";
                try {
                  const json = JSON.parse(stringContent);
                  // TODO: Maybe verify for json content?
                  setViewFile(json!);
                  setViewOnly(true);
                  setNamesReady(true);
                  console.log(json);
                } catch (error) {
                  alert("Failed to parse result file.");
                }
              };
            }}
          />
        </label>
      </div>
    </>
  );
}
