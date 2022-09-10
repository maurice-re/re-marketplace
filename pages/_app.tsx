import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient } from "react-query";
import { FormStateProvider } from "../context/form-context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState<QueryClient>(() => new QueryClient());
  return (
    <SessionProvider session={pageProps.session}>
      <FormStateProvider>
        <Component {...pageProps} />
      </FormStateProvider>
    </SessionProvider>
  );
}

export default MyApp;
