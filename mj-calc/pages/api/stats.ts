import { NextApiRequest, NextApiResponse } from "next";
import { getStatsForPlayers } from "../../src/library/getStatsForPlayers";

const selectHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { stats, gameSummaries } = await getStatsForPlayers(req.query);
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
