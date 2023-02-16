import { Game } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma/client";
import { MiniGameEntity } from "../../src/modules/util/Simplify";

const createHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const newGame: MiniGameEntity = req.body;

  const game = await prisma.game.create({
    data: {
      endTime: new Date(),
      playerGameScores: {
        create: newGame.players.map((player, idx) => ({
          seating: idx,
          playerName: player.name,
          score: player.score,
        })),
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
