import { NextApiRequest, NextApiResponse } from "next";

import { merge } from "lodash";
import { prisma } from "../../prisma/client";
import { GameCreateOneSchema } from "../../prisma/generated/schemas/createOneGame.schema";
import { coerceDate } from "../../src/modules/util/coerceInput";
import { GameFindManySchema } from "../../prisma/generated/schemas/findManyGame.schema";

const createHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = coerceDate(req.body, ["data.startTime", "data.endTime"]);

  const newGameInput = GameCreateOneSchema.parse(body);

  const game = await prisma.game.create(newGameInput);

  res.status(201).json(game);
};

const getHander = async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedBody = GameFindManySchema.parse(req.body || {});

  const findGamesInput = merge(parsedBody, {
    include: {
      gameSetting: true,
      players: true,
    },
  });

  const games = await prisma.game.findMany(findGamesInput);

  res.status(200).json(games);
};

export default async function gamesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await createHandler(req, res);
      break;

    case "GET":
      await getHander(req, res);
      break;

    default:
      break;
  }
}
