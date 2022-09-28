import { Event, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Sidebar from "../../../components/dashboard/sidebar";
import ReLogo from "../../../components/form/re-logo";
import { authOptions } from "../../api/auth/[...nextauth]";

type TrackingProps = {
  events: Event[];
};

const TrackingHome: NextPage<TrackingProps> = ({ events }: TrackingProps) => {
  return (
    <Sidebar>
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Tracking</title>
          <meta name="locations" content="Manage locations" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">
            Track your products
          </div>
        </main>
      </div>
    </Sidebar>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { test } = context.query;
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
  }
  return { props: {} };
};

export default TrackingHome;
