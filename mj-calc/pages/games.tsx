import React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Select from "react-select";
import GameList from "../src/modules/components/GameList";
import { getAllGames } from "../src/library/getAllGames";
import MjNavBar from "../src/modules/components/MjNavBar";
import { getAllPlayerNames } from "../src/library/getAllPlayers";
import { GameSummary } from "../src/modules/types/Game";

type Option<T> = {
  value: T;
  label: T;
};

export default function GameListPage({
  games,
  playerOptions,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("common");
  const router = useRouter();
  return (
    <>
      <MjNavBar />
      <div className="container">
        <h2 className="text-center mt-4">{t("prompt.playerSearch")}</h2>
        <Select
          options={playerOptions}
          onChange={(wrapper) =>
            router.push({ pathname: "/stats", query: { name: wrapper?.value } })
          }
        />
        <GameList games={games} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  games: GameSummary[];
  playerOptions: Option<string>[];
}> = async ({ locale }) => {
  const [games, playerPool] = await Promise.all([
    getAllGames({
      orderBy: {
        endTime: "desc",
      },
    }),
    getAllPlayerNames(),
  ]);
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
      games,
      playerOptions: playerPool.map(
        (playerName) =>
          ({
            value: playerName,
            label: playerName,
          } as Option<string>)
      ),
    },
    revalidate: 10,
  };
};
