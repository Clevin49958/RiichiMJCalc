import { Prisma } from "@prisma/client";
import GameEntity from "../types/GameEntity";
import { GameSetting } from "../types/GameSetting";
import { GameStatus, RichiiList } from "../types/GameStatus";
import { Player } from "../types/Player";
import { EndingRecord, EndingType, GameRecord } from "../types/Record";

import { nextGameStatus } from "./GameStatus";
import { STARTING_POINT } from "./Constants";
import { getDeltas } from "./Score";
import { WindNumber } from "./Wind";

export interface MiniGameEntity {
  startTime?: Date | null;
  settings: GameSetting;
  endTime: Date;
  players: { name: string; score: number; seating: number }[];
  records: { richii: string; type: EndingType; info: string }[];
}

export function prismafy(gameEntity: GameEntity): Prisma.GameCreateInput {
  const { settings, endTime, players, records } = gameEntity;
  const minified = {
    gameSetting: { create: settings },
    endTime,
    players: {
      create: players.map((player, idx) => ({
        ...player,
        seating: idx,
      })),
    },
    records: {
      create: records.map((record) => ({
        richii: record.richii,
        type: record.type,
        deltas: record.deltas,
        info: record.info as Prisma.InputJsonValue,
      })),
    },
  };
  return minified;
}

export function minify(gameEntity: GameEntity): MiniGameEntity {
  const { settings, endTime, players, records } = gameEntity;
  const minified = {
    settings,
    endTime,
    players: players.map((player, idx) => ({
      name: player.name,
      score: player.score,
      seating: idx,
    })),
    records: records.map((record) => ({
      richii: JSON.stringify(record.richii),
      type: record.type,
      info: JSON.stringify(record.info),
    })),
  };
  return minified;
}

export function deepParseGameEntity(gameString: string) {
  const minified = JSON.parse(gameString) as MiniGameEntity;
  return {
    ...minified,
    records: minified.records.map(
      (record) =>
        ({
          richii: JSON.parse(record.richii) as RichiiList,
          type: record.type,
          info: JSON.parse(record.info),
        } as EndingRecord & { richii: RichiiList })
    ),
  };
}

export function bloatGameStatus(
  minified: ReturnType<typeof deepParseGameEntity>
): GameEntity {
  const {
    settings: gameSettings,
    endTime,
    players: playersFinal,
    records: miniRecords,
  } = minified;

  const players = playersFinal.map<Player>((player) => ({
    seating: player.seating as WindNumber,
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
    const { richii } = record;

    gameStatus.richii = richii;
    gameStatus.richiiStick += richii.reduce<number>(
      (prev, curr) => prev + (curr ? 1 : 0),
      0
    );
    richii.forEach((richii, index) => {
      players[index].score -= richii ? 1000 : 0;
    });

    const deltas = getDeltas(record, gameStatus, gameSettings);

    // Update player running score
    deltas.forEach((delta, index) => {
      players[index].score += delta;
    });

    const newRecord = { ...record, deltas, ...gameStatus };
    gameStatus = nextGameStatus(record, gameStatus, gameSettings);

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
