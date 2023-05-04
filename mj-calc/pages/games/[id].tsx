import React, { useMemo } from "react";
import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getGame } from "../../src/library/getGame";
import GameSettingContextProvider from "../../src/modules/provider/GameSettingContextProvider";
import GameContextProvider from "../../src/modules/provider/GameContextProvider";
import { GameSetting } from "../../src/modules/types/GameSetting";
import {
  bloatGameStatus,
  deepParseGameEntity,
} from "../../src/modules/util/Simplify";
import ResultInputContextProvider from "../../src/modules/provider/ResultInputContextProvider";
import Calculator from "../../src/modules/Calculator";
import { prisma } from "../../prisma/client";

export default function GameReviewPage({
  game,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const playerNames = useMemo(
    () => game.players.map((player) => player.name),
    [game]
  );

  const GameStatus = useMemo(
    () =>
      bloatGameStatus({
        ...game,
        settings: game.gameSetting! as GameSetting,
      } as ReturnType<typeof deepParseGameEntity>),
    [game]
  );
  return (
    <GameSettingContextProvider setting={game.gameSetting! as GameSetting}>
      <GameContextProvider playerNames={playerNames} state={GameStatus}>
        <ResultInputContextProvider>
          <Calculator viewOnly onNextGame={() => {}} />
        </ResultInputContextProvider>
      </GameContextProvider>
    </GameSettingContextProvider>
  );
}

interface IdParam extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps = async ({
  params,
  locale,
}: {
  params: IdParam;
  locale: string;
}) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  const game = await getGame({
    where: {
      id: parseInt(params.id, 10),
    },
  });

  if (!game) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      game,
    },
  };
};

export const getStaticPaths: GetStaticPaths<IdParam> = async () => {
  const games = await await prisma.game.findMany();
  const paths = games.map((game) => ({ params: { id: game.id.toString() } }));
  return {
    paths,
    fallback: "blocking",
  };
};
