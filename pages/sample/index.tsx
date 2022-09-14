import type { NextPage } from "next";
import Head from "next/head";
import ReLogo from "../../components/form/re-logo";

const SampleHome: NextPage = () => {
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
      <Head>
        <title>Sample</title>
        <meta name="locations" content="Manage locations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReLogo />
      <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
        <div className="text-white font-theinhardt text-28">
          Welcome to sample page
        </div>
      </main>
    </div>
  );
};

export default SampleHome;
