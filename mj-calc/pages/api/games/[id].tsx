import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../prisma/client";

const selectHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: idString } = req.query;
  const idSchema = z.coerce.number();
  const id = idSchema.parse(idString);

  const game = await prisma.game.findUnique({
    where: {
      id,
    },
    include: {
      gameSetting: true,
      players: true,
      records: true,
    },
  });

  res.status(200).json(game);
};

export default async function gameHandler(
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
