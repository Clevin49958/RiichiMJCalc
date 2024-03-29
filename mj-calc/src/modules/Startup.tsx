import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { getWind, NP, WindNumber } from "./util/Wind";
import Calculator from "./Calculator";
import NameInputGrid from "./components/NameInputGrid";
import GameEntity from "./types/GameEntity";
import useLocalStorage from "./hooks/useLocalStorage";
import GameContextProvider from "./provider/GameContextProvider";
import ResultInputContextProvider from "./provider/ResultInputContextProvider";
import GameSettingContextProvider from "./provider/GameSettingContextProvider";
import { bloatGameStatus, deepParseGameEntity } from "./util/Simplify";
import Header from "./components/Header";
import MjNavBar from "./components/MjNavBar";
import { DEFAULT_N_PLAYERS } from "./types/Player";

interface StartupProps {
  playerPool: string[];
}

export default function Startup({ playerPool }: StartupProps) {
  const { t } = useTranslation("common");
  // 3 or 4 players
  const [numPlayers, setNumPlayers] = useState<NP>(DEFAULT_N_PLAYERS);

  const [playerNames, setPlayerNames] = useLocalStorage<string[]>(
    "names",
    (Array.from(Array(DEFAULT_N_PLAYERS).keys()) as WindNumber[]).map(getWind)
    // Array(DEFAULT_N_PLAYERS).fill("")
  );

  const [namesReady, setNamesReady] = useState(false);

  const [viewOnly, setViewOnly] = useState(false);
  const [viewFile, setViewFile] = useState<GameEntity | undefined>(undefined);

  const gameReady = namesReady;

  const onNextGame = useCallback(
    (names: string[]) => {
      setPlayerNames(
        (Array.from(Array(DEFAULT_N_PLAYERS).keys()) as WindNumber[]).map(
          (idx) => (idx < names.length ? names[idx] : getWind(idx))
        )
      );
      setNamesReady(false);
    },
    [setPlayerNames]
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
      <MjNavBar />
      <div className="d-flex flex-column align-items-center">
        <Header />
        <NameInputGrid
          numPlayers={numPlayers}
          playerNames={playerNames}
          playerPool={playerPool}
          setNumPlayers={setNumPlayers}
          setPlayerNames={setPlayerNames}
          setNamesReady={setNamesReady}
        />
      </div>
      <div className="container" style={{ maxWidth: "380px" }}>
        <label className="form-label center-block" style={{ display: "block" }}>
          <h5>{t("prompt.loadGame")}</h5>
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
                  const miniGameStatus = deepParseGameEntity(stringContent);
                  const bloatedGame = bloatGameStatus(miniGameStatus);
                  // TODO: Maybe verify for json content?
                  setViewFile(bloatedGame);
                  setNumPlayers(bloatedGame.settings.numPlayers);
                  setViewOnly(true);
                  setNamesReady(true);
                  // eslint-disable-next-line no-console
                  console.log(miniGameStatus);
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
