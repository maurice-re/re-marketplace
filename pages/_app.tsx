import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { FormStateProvider } from "../context/form-context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState<QueryClient>(() => new QueryClient());
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <FormStateProvider>
          <Component {...pageProps} />
        </FormStateProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
