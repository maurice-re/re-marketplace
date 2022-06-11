import type { AppProps } from "next/app";
import { AppWrapper } from "../context/context-provider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
