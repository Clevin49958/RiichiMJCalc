import { AppProps } from "next/app";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Analytics } from "@vercel/analytics/react";
import "./_app.css";
import "./_index.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <Analytics />
    </>
  );
}

export default MyApp;
