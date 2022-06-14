import { useState } from "react";
import { getWind, NP, WindNumber } from "./util/Wind";
import { CalculatorCore } from "./CalculatorCore";
import { StartUp } from "./Startup";
import IGame from "./util/IGame";
import { useLocalStorage } from "./util/useLocalStorage";

export default function Calculator() {
  // 3 or 4 players
  const DEFAULT_N_PLAYERS = 4;
  const [numPlayers, setNumPlayers] = useState<NP>(DEFAULT_N_PLAYERS);

  const [playerNames, setPlayerNames] = useLocalStorage<string[]>(
    "names",
    (Array.from(Array(DEFAULT_N_PLAYERS).keys()) as WindNumber[]).map(getWind)
  );

  const [namesReady, setNamesReady] = useState(false);

  const [viewOnly, setViewOnly] = useState(false);
  const [viewFile, setViewFile] = useState<IGame | null>(null);

  const gameReady = namesReady;

  return gameReady ? (
    <CalculatorCore
      n={numPlayers}
      playerNames={playerNames.slice(0, numPlayers)}
      viewOnly={viewOnly}
      state={viewFile}
    />
  ) : (
    <>
      <StartUp
        numPlayers={numPlayers}
        playerNames={playerNames}
        setNumPlayers={setNumPlayers}
        setPlayerNames={setPlayerNames}
        setNamesReady={setNamesReady}
      />
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
                let json = null;
                try {
                  json = JSON.parse(stringContent);
                  // TODO: Maybe verify for json content?
                  setViewFile(json!);
                  setViewOnly(true);
                  setNamesReady(true);
                } catch (error) {}
                console.log(json);
              };
            }}
          />
        </label>
      </div>
    </>
  );
}
