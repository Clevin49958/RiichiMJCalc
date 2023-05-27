import { NextApiRequest, NextApiResponse } from "next";
import { getAntiStatsForPlayers } from "../../src/library/getAntiStatsForPlayer";

const selectHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const stats = await getAntiStatsForPlayers(req.query);
  res.status(200).json(stats);
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
