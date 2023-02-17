import { AppProps } from "next/app";
import React from "react";
import "./_app.css";
import "./_index.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
