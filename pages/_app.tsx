import type { AppProps } from "next/app";
import { FormStateProvider } from "../context/form-context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FormStateProvider>
      <Component {...pageProps} />
    </FormStateProvider>
  );
}

export default MyApp;
