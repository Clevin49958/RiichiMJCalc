import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { omit } from "lodash";
import { prisma } from "../../prisma/client";
import { gameModes } from "../../src/modules/types/GameSetting";
import {
  fractionaliseStats,
  mergeStats,
  summariseStats,
} from "../../src/library/summariseStats";

const selectHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const querySchema = z.object({
    name: z.string().or(z.array(z.string())),
    mode: z.enum(gameModes).optional(),
  });

  const { name, mode } = querySchema.parse(req.query);
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
  res.status(200).json({
    ...stats,
    gameSummaries,
  });
};

export default async function statsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await selectHandler(req, res);
      break;

    default:
      break;
  }
}
