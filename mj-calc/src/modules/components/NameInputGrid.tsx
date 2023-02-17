import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Select from "react-select/";

import { NP, WindNumber } from "../util/Wind";
import { ArrayType } from "../util/CustomType";

import PlayerTable from "./PlayerTable";

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
  const prevName = useRef(player);

  useEffect(() => {
    if (prevName.current !== player) {
      setPlayerNameInput(player);
      prevName.current = player;
    }
  }, [player]);
  return (
    <input
      aria-label="Player Name"
      autoComplete="off"
      className="form-control table-item-player-number"
      key={seating}
      onChange={(event) => {
        setPlayerNameInput(event.target.value);
      }}
      disabled={seating >= numPlayers}
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
export default function NameInputGrid({
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
  const PlayerInputCenterCell = useCallback(
    () => (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setNamesReady(true);
        }}
      >
        Game start!
      </button>
    ),
    [setNamesReady],
  );

  const PlayerCell = useCallback(
    (player: string, seating: WindNumber) => (
      <div className="m-3">
        <PlayerInputCell
          seating={seating}
          player={player}
          setPlayers={setPlayerNames}
          numPlayers={numPlayers}
        />
      </div>
    ),
    [numPlayers, setPlayerNames],
  );

  const PlayerNumInputCell = useMemo(
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
            options={[2, 3, 4].map(
              (count) =>
                ({
                  value: count,
                  label: count,
                } as { value: NP; label: NP }),
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
    <>
      <h1 style={{ textAlign: "center" }}>Please enter players&apos; names</h1>
      <div style={{ maxWidth: "510px" }}>
        <PlayerTable<string>
          playerTable={playerNames}
          playerCell={PlayerCell}
          centerCell={PlayerInputCenterCell}
          LTCell={PlayerNumInputCell}
        />
      </div>
    </>
  );
}
