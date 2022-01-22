import React, { useRef, useState } from "react";
import PlayerTable from "./PlayerTable";
import { IPlayerTable, IPlayer } from "./util/IPlayer";
import { getWind, NP, WindNumber } from "./util/Wind";
import { GameStatus, incrementRound, IRichii } from "./util/GameStatus";
import {
  applyScoreChange,
  getDealer,
  getDeltaWithoutWinner,
  getDeltaWithWinner,
} from "./util/Score";
import { HonbaStick, RichiiStick } from "./Icons";
import { DrawRecord, IRecord, WinRecord } from "./util/IRecord";
import RoundHistory from "./RoundHistory";
import Header from "./Header";
import { GameEntrySelector } from "./GameEntrySelector";
import Select from "react-select";
import GameContext from "./util/Context";
import FinalPoints from "./FinalPoints";

const STARTING_POINT = [25000, 35000, 50000];
const STARTING_WIND = 0;
const STARTING_HONBA = 0;
export const StickIconSize = { width: 56, height: 18 };

const DEFAULT_FAN = 3;
const DEFAULT_FU = 30;
const DEFAULT_PLAYER = (gameStatus: GameStatus) => {
  return getDealer(gameStatus);
};

export function GameStatusCenterCell(gameStatus: GameStatus) {
  /** Display Current field wind and honba */
  return (
    <div style={{ textAlign: "center" }}>
      {`${getWind(gameStatus.wind)} ${gameStatus.round}`} <br />
      {`${gameStatus.honba}`} {HonbaStick(StickIconSize)}
      <br />
      {`${gameStatus.richiiStick}`} {RichiiStick(StickIconSize)}
    </div>
  );
}
export function DropdownEntry<T extends string | number>({
  label,
  labels,
  values,
  setter,
  value,
}: {
  label: string;
  labels: string[] | number[];
  values: T[];
  value: T;
  setter: (t: T) => void;
}) {
  const options = labels.map((key, index) => ({
    value: values[index],
    label: key.toString(),
  }));
  interface OptionType {
    value: T;
    label: string;
  }
  return (
    <label>
      <span>{label}: </span>
      <Select<OptionType>
        defaultValue={options.find((obj) => obj.value === value)}
        options={options}
        isMulti={false}
        isClearable={false}
        onChange={(newValue) => {
          setter(newValue!.value);
        }}
      />
    </label>
  );
}

export function CalculatorCore({
  n,
  playerNames,
}: {
  n: NP;
  playerNames: string[];
}) {
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    numPlayers: n,
    wind: STARTING_WIND,
    round: 1,
    honba: STARTING_HONBA,
    richiiStick: 0,
    richii: Array(n).fill(false),
  });

  const prevGameStatus = useRef<GameStatus | undefined>();

  const [players, setPlayers] = useState<IPlayerTable>(
    (Array.from(Array(n).keys()) as WindNumber[]).map((seating) => ({
      name: playerNames[seating],
      seating: seating,
      score: STARTING_POINT[4 - n],
    })) as IPlayerTable,
  );

  const [fan, setFan] = useState<number>(DEFAULT_FAN);
  const [fu, setFu] = useState<number>(DEFAULT_FU);
  const [winner, setWinner] = useState<WindNumber>(DEFAULT_PLAYER(gameStatus));
  const [dealIn, setDealIn] = useState<WindNumber>(DEFAULT_PLAYER(gameStatus));
  const [tenpai, setTenpai] = useState<boolean[]>(Array(n).fill(false));
  const [endingType, setEndingType] = useState<"Win" | "Draw">("Win");
  const [gameRecord, setGameRecord] = useState<IRecord[]>([]);

  const pushRecord = (record: IRecord) => {
    setGameRecord([...gameRecord, record]);
  };

  const [displayDelta, setDisplayDelta] = useState(-1);

  const playersScoreView = players.map((player) => ({
    ...player,
  })) as IPlayerTable;
  if (displayDelta >= 0) {
    playersScoreView.forEach((player, wind) => {
      if (wind !== displayDelta) {
        player.score -= players[displayDelta].score;
      }
    });
  }
  const isReady = true;

  const resetWinState = () => {
    setFan(DEFAULT_FAN);
    setFu(DEFAULT_FU);
    setWinner(DEFAULT_PLAYER(gameStatus));
    setDealIn(DEFAULT_PLAYER(gameStatus));
    setTenpai(Array(n).fill(false));
    setEndingType("Win");
  };

  const saveEntry = () => {
    prevGameStatus.current = {
      ...gameStatus,
    };
    let deltas: number[];
    if (endingType === "Win") {
      deltas = getDeltaWithWinner(
        fan!,
        fu!,
        winner === dealIn,
        winner!,
        gameStatus,
        dealIn!,
      );
    } else {
      deltas = getDeltaWithoutWinner(tenpai);
    }
    applyScoreChange(players, deltas);
    setPlayers([...players]);
    pushRecord({
      type: endingType,
      deltas: deltas,
      wind: gameStatus.wind,
      round: gameStatus.round,
      honba: gameStatus.honba,
      info:
        endingType === "Win"
          ? ({
              winner: winner,
              dealIn: dealIn,
            } as WinRecord)
          : ({
              tenpai: tenpai,
            } as DrawRecord),
    });
    setGameStatus(
      nextGameStatus(
        endingType === "Win" ? winner : null,
        tenpai[getDealer(gameStatus)],
        gameStatus,
      ),
    );
    resetWinState();
  };

  function flipPlayerRichii(seating: WindNumber) {
    const newRichiiList = [...gameStatus.richii] as IRichii;

    newRichiiList[seating] = !newRichiiList[seating];
    gameStatus.richiiStick += newRichiiList[seating] ? 1 : -1;

    const newPlayers = [...players] as IPlayerTable;
    newPlayers[seating].score -= newRichiiList[seating] ? 1000 : -1000;
    setGameStatus({
      ...gameStatus,
      richii: newRichiiList,
    });
  }

  function PlayerInfoCell(player: IPlayer) {
    const richii = gameStatus.richii;
    const hasRichii = richii[player.seating];
    return (
      <div className="container">
        <div className="row mb-2">
          <div
            className="col"
            onMouseDown={() => setDisplayDelta(player.seating)}
            onTouchStart={() => setDisplayDelta(player.seating)}
            onMouseUp={() => setDisplayDelta(-1)}
            onTouchEnd={() => setDisplayDelta(-1)}
          >
            <span
              style={{
                color: getDealer(gameStatus) === player.seating ? "red" : "",
                fontSize: "20px",
              }}
            >
              {player.name}
            </span>
            <br />
            <span>{player.score}</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button
              aria-label="Richii"
              type="button"
              style={{ backgroundColor: hasRichii ? "transparent" : "" }}
              className={`btn ${hasRichii ? "p-0" : "btn-primary"}  border-0`}
              onClick={() => flipPlayerRichii(player.seating)}
            >
              {hasRichii ? RichiiStick(StickIconSize) : <span>Richii!</span>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rewindButton = () => {
    function rewind() {
      if (!prevGameStatus.current) {
        return;
      }

      // reset player score
      players.forEach((player) => {
        player.score = player.lastScore!;
        player.lastScore = undefined;
      });

      setGameStatus({
        ...prevGameStatus.current,
      });
      prevGameStatus.current = undefined;

      setPlayers([...players]);
      gameRecord.pop();
    }
    return (
      <button
        type="button"
        aria-label="rewind"
        className="btn btn-primary"
        disabled={!prevGameStatus.current}
        onClick={rewind}
      >
        Rewind
      </button>
    );
  };

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        players,
        setGameStatus,
        setPlayers,
      }}
    >
      <div className="container">
        {/* <Header /> */}
        <React.Fragment>
          <div className="row">
            <div className="col col-12">
              <PlayerTable
                playerTable={playersScoreView}
                playerCell={PlayerInfoCell}
                centerCell={() => GameStatusCenterCell(gameStatus)}
                RBCell={rewindButton()}
              />
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <GameEntrySelector
                endingType={endingType}
                setEndingType={setEndingType}
                fan={fan}
                setFan={setFan}
                fu={fu}
                setFu={setFu}
                players={players}
                winner={winner}
                setWinner={setWinner}
                dealIn={dealIn}
                setDealIn={setDealIn}
                tenpai={tenpai}
                setTenpai={setTenpai}
                saveEntry={saveEntry}
                isReady={isReady}
              />
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <RoundHistory records={gameRecord} players={players} />
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <FinalPoints startingPoint={STARTING_POINT[4 - n]} />
            </div>
          </div>
        </React.Fragment>
      </div>
    </GameContext.Provider>
  );
}

export function nextGameStatus(
  winner: null | WindNumber,
  isDealerTenpai: boolean,
  gameStatus: GameStatus,
) {
  // update honba
  if (winner === null) {
    gameStatus.honba += 1;
    if (!isDealerTenpai) {
      incrementRound(gameStatus);
    }
  } else {
    if (winner === getDealer(gameStatus)) {
      gameStatus.honba += 1;
    } else {
      incrementRound(gameStatus);
      gameStatus.honba = 0;
    }
    gameStatus.richiiStick = 0;
  }
  // update richii state
  gameStatus.richii = Array(gameStatus.numPlayers).fill(false);

  return { ...gameStatus };
}
