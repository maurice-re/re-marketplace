import { Company, Event, Sku, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Sidebar from "../../../components/dashboard/sidebar";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../constants/prisma";
import { getProductsInUseBySku } from "../../../utils/tracking/trackingUtils";
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
import faker from "faker";

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

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const sample1 = labels.map(() =>
  faker.datatype.number({ min: -1000, max: 1000 })
);
const sample2 = labels.map(() =>
  faker.datatype.number({ min: -1000, max: 1000 })
);
console.log(sample1);
console.log(sample2);
export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: sample1,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: sample2,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
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
  const productsInUse = getProductsInUseBySku(events, skus[1]);

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
          <Line options={options} data={data} />
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
