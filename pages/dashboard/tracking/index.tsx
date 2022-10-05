import { Company, Event, Sku, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Sidebar from "../../../components/dashboard/sidebar";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../constants/prisma";
import {
  getItemsInUse,
  getItemsInUseBySku,
  getLifetimeUses,
  getItemIds,
  getReturnRate,
  getReturnRateBySku,
  getDaysInPastMonth,
  getItemsBorrowedByDay,
} from "../../../utils/tracking/trackingUtils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

type TrackingProps = {
  events: Event[];
  user: User & {
    company: Company;
  };
  skus: Sku[];
};

const TrackingHome: NextPage<TrackingProps> = ({
  events,
  user,
  skus,
}: TrackingProps) => {
  const itemsInUseBySku = getItemsInUseBySku(events, skus[1]);
  const itemsInUse = getItemsInUse(events);
  const lifetimeUses = getLifetimeUses(events);
  const numItemIds = getItemIds(events).length;
  const returnRate = getReturnRate(events);
  const returnRateBySku = getReturnRateBySku(events, skus[1]);
  let xAxis = getDaysInPastMonth(6, 2022, events);
  let yAxis = getItemsBorrowedByDay(6, 2022, xAxis, events);

  let dayByDayData = {
    labels: xAxis,
    datasets: [
      {
        label: "Borrows Day-by-Day",
        data: yAxis,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  console.log(dayByDayData);

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
            Track your products here, {user?.firstName}
          </div>
          <Line options={options} data={dayByDayData} />
        </main>
      </div>
    </Sidebar>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? "",
      },
      include: {
        company: true,
      },
    });
    const events = await prisma.event.findMany({
      where: {
        companyId: user?.companyId,
      },
    });
    const skus = await prisma.sku.findMany();
    return {
      props: {
        events: JSON.parse(JSON.stringify(events)),
        user: JSON.parse(JSON.stringify(user)),
        skus: JSON.parse(JSON.stringify(skus)),
      },
    };
  }
  return { props: {} };
};

export default TrackingHome;
