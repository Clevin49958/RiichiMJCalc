import { nextGameStatus } from "../Calculator";
import GameEntity from "../types/GameEntity";
import { GameSetting } from "../types/GameSetting";
import { GameStatus, RichiiList } from "../types/GameStatus";
import { Player, PlayerList } from "../types/Player";
import { EndingRecord, GameRecord } from "../types/Record";
import { STARTING_POINT } from "./Constants";
import { getDeltas } from "./Score";
import { WindNumber } from "./Wind";

export interface MiniGameEntity {
  settings: GameSetting;
  endTime: Date;
  players: { name: string; score: number }[];
  records: { richii: string; type: "Win" | "Draw"; info: string }[];
}

export function minify(gameEntity: GameEntity): MiniGameEntity {
  const { settings, endTime, players, records } = gameEntity;
  const minified = {
    settings,
    endTime,
    players: players.map((player) => ({
      name: player.name,
      score: player.score,
    })),
    records: records.map((record) => ({
      richii: JSON.stringify(record.richii),
      type: record.type,
      info: JSON.stringify(record.info),
    })),
  };
  return minified;
}

export function bloatGameStatus(minified: MiniGameEntity): GameEntity {
  const {
    settings: gameSettings,
    endTime,
    players: playersFinal,
    records: miniRecords,
  } = minified;

  const players = playersFinal.map<Player>((player, index) => ({
    seating: index as WindNumber,
    name: player.name,
    score: STARTING_POINT[4 - playersFinal.length],
  }));

  let gameStatus: GameStatus = {
    wind: 0,
    round: 1,
    honba: 0,
    richiiStick: 0,
    richii: Array(playersFinal.length).fill(false),
  };

  const records: GameRecord[] = miniRecords.map((record) => {
    // decode ending record
    const endingRecord: EndingRecord = {
      type: record.type,
      info: JSON.parse(record.info),
    };
    const richii: RichiiList = JSON.parse(record.richii);

    gameStatus.richii = richii;
    gameStatus.richiiStick += richii.reduce<number>(
      (prev, curr) => prev + (curr ? 1 : 0),
      0
    );
    richii.forEach((richii, index) => {
      players[index].score -= richii ? 1000 : 0;
    });

    const deltas = getDeltas(endingRecord, gameStatus, gameSettings);

    // Update player running score
    deltas.forEach((delta, index) => {
      players[index].score += delta;
    });

    const newRecord = { ...endingRecord, deltas, ...gameStatus };
    gameStatus = nextGameStatus(endingRecord, gameStatus, gameSettings);

    return newRecord;
  });

  return {
    settings: gameSettings,
    endTime,
    players,
    gameStatus,
    records,
  };
}
