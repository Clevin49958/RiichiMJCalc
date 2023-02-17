import React, { useCallback, useState } from "react";

import { getWind, NP, WindNumber } from "./util/Wind";
import { Calculator } from "./Calculator";
import { NameInputGrid } from "./components/NameInputGrid";
import GameEntity from "./types/GameEntity";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { GameContextProvider } from "./provider/GameContextProvider";
import { ResultInputContextProvider } from "./provider/ResultInputContextProvider";
import { GameSettingContextProvider } from "./provider/GameSettingContextProvider";
import { bloatGameStatus, MiniGameEntity } from "./util/Simplify";
import Header from "./components/Header";

const DEFAULT_N_PLAYERS = 4;

export default function Startup() {
  // 3 or 4 players
  const [numPlayers, setNumPlayers] = useState<NP>(DEFAULT_N_PLAYERS);

  const [playerNames, setPlayerNames] = useLocalStorage<string[]>(
    "names",
    (Array.from(Array(DEFAULT_N_PLAYERS).keys()) as WindNumber[]).map(getWind),
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
    [setPlayerNames],
  );

  return gameReady ? (
    <GameSettingContextProvider setting={{ numPlayers, gameMode: "default" }}>
      <GameContextProvider
        playerNames={playerNames.slice(0, numPlayers)}
        state={viewFile}
      >
        <ResultInputContextProvider>
          <Calculator viewOnly={viewOnly} onNextGame={onNextGame} />
        </ResultInputContextProvider>
      </GameContextProvider>
    </GameSettingContextProvider>
  ) : (
    <>
      <div className="d-flex flex-column align-items-center">
        <Header />
        <NameInputGrid
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
                  const json = JSON.parse(stringContent) as MiniGameEntity;
                  // TODO: Maybe verify for json content?
                  setViewFile(bloatGameStatus(json));
                  setViewOnly(true);
                  setNamesReady(true);
                  // eslint-disable-next-line no-console
                  console.log(json);
                } catch (error) {
                  // eslint-disable-next-line no-alert
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
