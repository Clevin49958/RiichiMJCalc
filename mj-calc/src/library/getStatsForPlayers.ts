import { omit } from "lodash";
import { ParsedUrlQuery } from "querystring";
import { z } from "zod";
import { prisma } from "../../prisma/client";
import { gameModes } from "../modules/types/GameSetting";
import {
  summariseStats,
  mergeStats,
  fractionaliseStats,
} from "./summariseStats";

export async function getStatsForPlayers(query: ParsedUrlQuery) {
  const querySchema = z.object({
    name: z.string().or(z.array(z.string())),
    mode: z.enum(gameModes).optional(),
  });

  const { name, mode } = querySchema.parse(query);
  const names = typeof name === "string" ? [name] : name;

  const games = await prisma.game.findMany({
    include: {
      gameSetting: true,
      players: true,
      records: true,
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
  });

  const allStats = names.map((name) => summariseStats({ games, player: name }));
  const statsSum = allStats.length === 1 ? allStats[0] : mergeStats(allStats);
  const stats = fractionaliseStats(statsSum);
  const gameSummaries = games.map((game) => omit(game, "records"));

  return {
    stats,
    gameSummaries,
    games,
  };
}
