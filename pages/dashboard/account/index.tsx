import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../../../components/dashboard/sidebar";

const AccountHome: NextPage = () => {
  return (
    <Sidebar>
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Account</title>
          <meta name="account" content="Manage your account" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">Coming Soon</div>
        </main>
      </div>
    </Sidebar>
  );
};

export default AccountHome;
