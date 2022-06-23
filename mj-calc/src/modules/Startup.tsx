import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import PlayerTable from "./components/PlayerTable";
import { NP, WindNumber } from "./util/Wind";
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
export function StartUp({
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
    [numPlayers, setPlayerNames]
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
            options={[2, 3, 4].map(
              (count) =>
                ({
                  value: count,
                  label: count,
                } as { value: NP; label: NP })
            )}
            value={{
              value: numPlayers,
              label: numPlayers,
            }}
            onChange={(wrapper) => setNumPlayers(wrapper!.value)}
          />
        </label>
      ) as JSX.Element,
    [numPlayers, setNumPlayers]
  );

  return (
    <React.Fragment>
      <img
        src="/Header.jpg"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="mb-4"
      />
      <h1 style={{ textAlign: "center" }}>Please enter players&apos; names</h1>
      <PlayerTable<string>
        playerTable={playerNames}
        playerCell={PlayerCell}
        centerCell={PlayerInputCenterCell}
        LTCell={PlayerNumInputCell()}
      />
    </React.Fragment>
  );
}
