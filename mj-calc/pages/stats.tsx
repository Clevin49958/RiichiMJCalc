import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { getStatsForPlayers } from "../src/library/getStatsForPlayers";
import StatsTable from "../src/modules/components/Stats/StatsTable";
import MjNavBar from "../src/modules/components/MjNavBar";
import GameList from "../src/modules/components/GameList";

export default function page({
  stats,
  gameSummaries,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <MjNavBar />
      <div className="container">
        <StatsTable stats={stats} />
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
