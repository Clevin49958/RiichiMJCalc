import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { isEqual } from "lodash";
import { getStatsForPlayers } from "../src/library/getStatsForPlayers";
import StatsTable from "../src/modules/components/Stats/StatsTable";
import MjNavBar from "../src/modules/components/MjNavBar";
import GameList from "../src/modules/components/GameList";
import { getAntiStatsForPlayers } from "../src/library/getAntiStatsForPlayer";
import AntiStatsTable from "../src/modules/components/Stats/AntiStatsList";
// import PlacingPieChart from "../src/modules/components/Stats/placingPieChart";

export default function page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { stats, gameSummaries, antiStats } = props;
  return (
    <>
      <MjNavBar />
      <div className="container mt-4">
        <div className="row gy-4">
          {/* <div className="col-12 col-lg-3">
            <PlacingPieChart placing={stats.placingDistributions} />
          </div> */}
          <div className="col-12">
            <StatsTable stats={stats} />
            {isEqual(stats.player, ["PIGGYYO"]) && (
              <AntiStatsTable stats={antiStats} player={stats.player[0]} />
            )}
          </div>
        </div>
        <GameList games={gameSummaries} highlightedPlayers={stats.player} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const [{ stats, gameSummaries }, antiStats] = await Promise.all([
    getStatsForPlayers(query),
    getAntiStatsForPlayers(query),
  ]);
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
      stats,
      antiStats,
      gameSummaries,
    },
  };
};
