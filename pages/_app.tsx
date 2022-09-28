import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { FormStateProvider } from "../context/form-context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <FormStateProvider>
        <Component {...pageProps} />
      </FormStateProvider>
    </SessionProvider>
  );
}

export default MyApp;
