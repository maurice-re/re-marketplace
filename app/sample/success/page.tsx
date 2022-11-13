import Head from "next/head";
import Success from "./success";

export default async function Page() {
  return (
    <div className="h-screen bg-black flex">
      <Head>
        <title>Congrats</title>
        <meta
          name="successful purchase"
          content="Congrats on making a purchase"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Success />
    </div>
  );
};