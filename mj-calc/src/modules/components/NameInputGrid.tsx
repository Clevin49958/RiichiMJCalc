import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useTranslation } from "next-i18next";
import { ReactSortable } from "react-sortablejs";
import { NP, WindNumber, getWind } from "../util/Wind";

import PlayerTable from "./PlayerTable";
import { ArrayType } from "../util/CustomType";

type Option<T> = {
  value: T;
  label: T;
};
function PlayerInputCell({
  seating,
  player,
  playerOptions,
  setPlayers,
  numPlayers,
}: {
  seating: WindNumber;
  player: string;
  playerOptions: Option<string>[];
  setPlayers: Dispatch<SetStateAction<string[]>>;
  numPlayers: NP;
}) {
  return (
    <div style={{ width: "150px" }}>
      <CreatableSelect
        options={playerOptions}
        value={{
          value: player,
          label: player,
        }}
        className=" table-item-player-number"
        isDisabled={seating >= numPlayers}
        key={seating}
        onChange={(wrapper) =>
          setPlayers((players) => {
            const newPlayerTable = [...players] as ArrayType<4, string>;
            newPlayerTable[seating] = wrapper!.value;
            return newPlayerTable;
          })
        }
      />
    </div>
  );
}
export default function NameInputGrid({
  numPlayers,
  playerNames,
  playerPool,
  setNumPlayers,
  setPlayerNames,
  setNamesReady,
}: {
  numPlayers: NP;
  playerNames: string[];
  playerPool: string[];
  setNumPlayers: Dispatch<SetStateAction<NP>>;
  setPlayerNames: Dispatch<SetStateAction<string[]>>;
  setNamesReady: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation("common");
  const PlayerInputCenterCell = useCallback(
    () => (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setNamesReady(true);
        }}
      >
        {t("game.start")}
      </button>
    ),
    [setNamesReady, t]
  );

  const playerOptions = useMemo(
    () =>
      playerPool.map(
        (playerName) =>
          ({
            value: playerName,
            label: playerName,
          } as Option<string>)
      ),
    [playerPool]
  );

  const PlayerCell = useCallback(
    (player: string, seating: WindNumber) => (
      <div className="m-3">
        <p
          style={{
            color: seating === 0 ? "red" : "",
          }}
        >
          {getWind(seating)}
        </p>
        <PlayerInputCell
          seating={seating}
          player={player}
          playerOptions={playerOptions}
          setPlayers={setPlayerNames}
          numPlayers={numPlayers}
        />
      </div>
    ),
    [numPlayers, playerOptions, setPlayerNames]
  );

  const PlayerNumInputCell = useMemo(
    () => (
      <label
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "lightgrey",
        }}
      >
        {t("players.num")}
        <Select
          options={[2, 3, 4].map(
            (count) =>
              ({
                value: count,
                label: count,
              } as Option<NP>)
          )}
          value={{
            value: numPlayers,
            label: numPlayers,
          }}
          onChange={(wrapper) => setNumPlayers(wrapper!.value)}
        />
      </label>
    ),
    [numPlayers, setNumPlayers, t]
  );

  const sortableNames = useMemo(
    () => playerNames.map((name, id) => ({ id, name })),
    [playerNames]
  );

  return (
    <>
      <h1 style={{ textAlign: "center" }}>{t("prompt.playerName")}</h1>
      <div style={{ maxWidth: "710px" }}>
        <PlayerTable<string>
          playerTable={playerNames}
          playerCell={PlayerCell}
          centerCell={PlayerInputCenterCell}
          LTCell={PlayerNumInputCell}
        />
      </div>
      <h5 className="mt-4">
        {t("prompt.shuffle")} (
        {(Array.from(Array(numPlayers).keys()) as WindNumber[])
          .map(getWind)
          .join(",")}
        )
      </h5>
      <ReactSortable
        className="d-flex flex-row mb-4"
        group="name-input"
        animation={200}
        list={sortableNames}
        setList={(newState) =>
          setPlayerNames(newState.map((state) => state.name))
        }
      >
        {sortableNames.map((item) => (
          <div
            style={{ backgroundColor: "lightgray" }}
            className="m-1 p-3"
            key={item.id}
          >
            {item.name}
          </div>
        ))}
      </ReactSortable>
    </>
  );
}
