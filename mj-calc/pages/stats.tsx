import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { getStatsForPlayers } from "../src/library/getStatsForPlayers";
import StatsTable from "../src/modules/components/Stats/StatsTable";
import MjNavBar from "../src/modules/components/MjNavBar";
import GameList from "../src/modules/components/GameList";
// import PlacingPieChart from "../src/modules/components/Stats/placingPieChart";

export default function page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { stats, gameSummaries } = props;
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
  const { stats, gameSummaries } = await getStatsForPlayers(query);
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
      stats,
      gameSummaries,
    },
  };
};
