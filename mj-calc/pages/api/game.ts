import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../prisma/client";
import { MiniGameEntity } from "../../src/modules/util/Simplify";

const createHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const newGame: MiniGameEntity = req.body;

  const game = await prisma.game.create({
    data: {
      startTime: newGame.startTime,
      endTime: newGame.endTime,
      players: {
        create: newGame.players,
      },
      gameSetting: {
        create: newGame.settings,
      },

      records: {
        create: newGame.records,
      },
    },
  });

  res.status(201).json(game);
};

export default async function gameHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await createHandler(req, res);
      break;

    default:
      break;
  }
}
