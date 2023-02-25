import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../prisma/client";
import { GameCreateOneSchema } from "../../prisma/generated/schemas/createOneGame.schema";
import { coerceDate } from "../../src/modules/util/coerceInput";

const createHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = coerceDate(req.body, ["data.startTime", "data.endTime"]);

  const newGameInput = GameCreateOneSchema.parse(body);

  const game = await prisma.game.create(newGameInput);

  res.status(201).json(game);
};

export default async function gamesHandler(
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
