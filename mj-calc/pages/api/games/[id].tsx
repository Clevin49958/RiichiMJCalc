import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getGame } from "../../../src/library/getGame";

const selectHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: idString } = req.query;
  const idSchema = z.coerce.number();
  const id = idSchema.parse(idString);

  const game = await getGame({
    where: {
      id,
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
