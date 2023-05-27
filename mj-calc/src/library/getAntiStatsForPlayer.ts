import { sortBy } from "lodash";
import { ParsedUrlQuery } from "querystring";
import { z } from "zod";
import { prisma } from "../../prisma/client";
import { gameModes, GameSetting } from "../modules/types/GameSetting";

import { bloatGameStatus, deepParseGameEntity } from "../modules/util/Simplify";

import { getDeltaOneWinner } from "../modules/util/Score";
import { SummariseStatsProps } from "./summariseStats";

export type AntiStats = {
  player: string;
  dealInValue: number;
  dealInCount: number;
}[];

export function summariseAntiStats({
  games,
  player,
}: SummariseStatsProps): AntiStats {
  // calculate anti-stats for player

  const antiStatsDict = new Map<string, [number, number]>();
  for (let index = 0; index < games.length; index++) {
    const game = games[index];

    const gameSetting = game.gameSetting! as GameSetting;

    // find player's seating
    const pidx = game.players.findIndex(
      (playerScore) => playerScore.name === player
    );
    if (pidx === -1) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const { seating } = game.players[pidx];

    const gameEntity = bloatGameStatus({
      ...game,
      settings: game.gameSetting! as GameSetting,
    } as ReturnType<typeof deepParseGameEntity>);

    for (let honbaIdx = 0; honbaIdx < gameEntity.records.length; honbaIdx++) {
      const record = gameEntity.records[honbaIdx];

      if (record.type === "Win") {
        for (let recordIdx = 0; recordIdx < record.info.length; recordIdx++) {
          const winInfo = record.info[recordIdx];

          // get hands that player deat in and add hand value to stats
          if (winInfo.dealIn === seating && winInfo.winner !== seating) {
            const winnerName = gameEntity.players[winInfo.winner].name;
            if (winnerName === player) {
              // console.log([record, winInfo, seating]);
            }
            const handValue = getDeltaOneWinner(winInfo, record, gameSetting)[
              winInfo.winner
            ];
            if (antiStatsDict.has(winnerName)) {
              const [dealIn, totalGames] = antiStatsDict.get(winnerName)!;
              antiStatsDict.set(winnerName, [
                handValue + dealIn,
                totalGames + 1,
              ]);
            } else {
              antiStatsDict.set(winnerName, [handValue, 1]);
            }
          }
        }
      }
    }
  }
  return Array.from(antiStatsDict.entries()).map(
    ([player, [dealInValue, dealInCount]]) => ({
      player,
      dealInValue,
      dealInCount,
    })
  );
}

export function mergeAntiStats(stats: AntiStats[]): AntiStats {
  // merge stats by player name
  const mergedStats: AntiStats = [];
  const playerMap = new Map<string, number>();
  for (let index = 0; index < stats.length; index++) {
    const stat = stats[index];
    for (let playerIndex = 0; playerIndex < stat.length; playerIndex++) {
      const { player, dealInValue, dealInCount } = stat[playerIndex];
      if (playerMap.has(player)) {
        const existingIndex = playerMap.get(player)!;
        mergedStats[existingIndex].dealInValue += dealInValue;
        mergedStats[existingIndex].dealInCount += dealInCount;
      } else {
        playerMap.set(player, mergedStats.length);
        mergedStats.push({ player, dealInValue, dealInCount });
      }
    }
  }
  const sortedStats = sortBy(mergedStats, "dealInValue");
  return sortedStats;
}

export async function getAntiStatsForPlayers(query: ParsedUrlQuery) {
  const querySchema = z.object({
    name: z.string().or(z.array(z.string())),
    mode: z.enum(gameModes).optional(),
  });

  const { name, mode } = querySchema.parse(query);
  const names = typeof name === "string" ? [name] : name;

  const games = await prisma.game.findMany({
    include: {
      gameSetting: true,
      players: {
        orderBy: {
          seating: "asc",
        },
      },
      records: {
        orderBy: {
          id: "asc",
        },
      },
    },
    where: {
      players: {
        some: {
          name: {
            in: names,
          },
        },
      },
      AND: {
        gameSetting: {
          gameMode: {
            equals: mode || "default",
          },
        },
      },
    },
    orderBy: {
      endTime: "desc",
    },
  });

  const allStats = names.map((name) =>
    summariseAntiStats({ games, player: name })
  );

  const stats = allStats.length === 1 ? allStats[0] : mergeAntiStats(allStats);

  return stats;
}
