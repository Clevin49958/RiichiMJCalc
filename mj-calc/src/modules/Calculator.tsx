import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import PlayerTable from "./PlayerTable";
import { getWind, NP, WindNumber } from "./util/Wind";
import Select from "react-select/";
import { ArrayType } from "./util/CustomType";

function PlayerInputCell({
  seating,
  player,
  setPlayers,
  numPlayers,
}: {
  seating: WindNumber;
  player: string;
  setPlayers: Dispatch<SetStateAction<string[]>>;
  numPlayers: NP;
}) {
  const [playerNameInput, setPlayerNameInput] = useState(player);
  return (
    <input
      aria-label="Player Name"
      className="form-control table-item-player-number"
      placeholder={getWind(seating)}
      key={seating}
      onChange={(event) => {
        setPlayerNameInput(event.target.value);
      }}
      disabled={numPlayers === 3 && seating === 3}
      onBlur={(_event) => {
        setPlayers((players) => {
          const newPlayerTable = [...players] as ArrayType<4, string>;
          newPlayerTable[seating] = playerNameInput;
          return newPlayerTable;
        });
      }}
      value={playerNameInput}
    />
  );
}

function StartUp({
  numPlayers,
  playerNames,
  setNumPlayers,
  setPlayerNames,
  setNamesReady,
}: {
  numPlayers: NP;
  playerNames: string[];
  setNumPlayers: Dispatch<SetStateAction<NP>>;
  setPlayerNames: Dispatch<SetStateAction<string[]>>;
  setNamesReady: Dispatch<SetStateAction<boolean>>;
}) {
  const PlayerInputCenterCell = () => {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setNamesReady(true);
        }}
      >
        Game start!
      </button>
    );
  };

  const PlayerCell = useCallback(
    (player: string, seating: WindNumber) => (
      <PlayerInputCell
        seating={seating}
        player={player}
        setPlayers={setPlayerNames}
        numPlayers={numPlayers}
      />
    ),
    [numPlayers, setPlayerNames],
  );

  const PlayerNumInputCell = useCallback(
    () =>
      (
        <label
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "lightgrey",
          }}
        >
          Number of players:
          <Select
            options={[3, 4].map(
              (count) =>
                ({
                  value: count,
                  label: count,
                } as { value: 3 | 4; label: 3 | 4 }),
            )}
            value={{
              value: numPlayers,
              label: numPlayers,
            }}
            onChange={(wrapper) => setNumPlayers(wrapper!.value)}
          />
        </label>
      ) as JSX.Element,
    [numPlayers, setNumPlayers],
  );

  return (
    <React.Fragment>
      <h1 style={{ textAlign: "center" }}>Please enter players' names</h1>
      <PlayerTable<string>
        playerTable={playerNames}
        playerCell={PlayerCell}
        centerCell={PlayerInputCenterCell}
        LTCell={PlayerNumInputCell}
      />
    </React.Fragment>
  );
}
export default function Calculator() {
  // 3 or 4 players
  const DEFAULT_N_PLAYERS = 4;
  const [numPlayers, setNumPlayers] = useState<NP>(DEFAULT_N_PLAYERS);

  const [playerNames, setPlayerNames] = useState<string[]>(
    (Array(DEFAULT_N_PLAYERS) as WindNumber[]).map(getWind),
  );

  const [namesReady, setNamesReady] = useState(false);

  const gameReady = namesReady;

  return gameReady ? (
    <></>
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
