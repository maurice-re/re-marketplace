import { Company, Event, Sku, User, Action } from "@prisma/client";
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
  getDaysInMonth,
  getItemsByDay,
  getItemsByMonth,
  getMonthsInYear,
  getReuseRate,
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
      text: "June Day-by-Day", // TODO: Figure out dynamic title
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
  const reuseRate = getReuseRate(events);
  const returnRate = getReturnRate(events);
  const returnRateBySku = getReturnRateBySku(events, skus[1]);
  let daysInMonth = getDaysInMonth(6, 2022);
  let itemsBorrowedDayByDay = getItemsByDay(
    6,
    2022,
    daysInMonth,
    events,
    Action.BORROW
  );
  let itemsReturnedDayByDay = getItemsByDay(
    6,
    2022,
    daysInMonth,
    events,
    Action.RETURN
  );
  let dayByDayData = {
    labels: daysInMonth,
    datasets: [
      {
        label: "Borrows",
        data: itemsBorrowedDayByDay,
        borderColor: "rgb(138, 254, 213)",
        backgroundColor: "rgba(138, 254, 213, 0.5)",
      },
      {
        label: "Returns",
        data: itemsReturnedDayByDay,
        borderColor: "rgb(61, 177, 137)",
        backgroundColor: "rgba(61, 177, 137, 0.5)",
      },
    ],
  };
  console.log(dayByDayData);

  let monthsInYear = getMonthsInYear();
  let itemsBorrowedMonthByMonth = getItemsByMonth(2022, events, Action.BORROW);
  let itemsReturnedMonthByMonth = getItemsByMonth(2022, events, Action.RETURN);
  let monthByMonthData = {
    labels: monthsInYear,
    datasets: [
      {
        label: "Borrows",
        data: itemsBorrowedMonthByMonth,
        borderColor: "rgb(138, 254, 213)",
        backgroundColor: "rgba(138, 254, 213, 0.5)",
      },
      {
        label: "Returns",
        data: itemsReturnedMonthByMonth,
        borderColor: "rgb(61, 177, 137)",
        backgroundColor: "rgba(61, 177, 137, 0.5)",
      },
    ],
  };

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
          <Line options={options} data={monthByMonthData} />
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
