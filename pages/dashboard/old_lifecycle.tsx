import { Action, Event, User } from "@prisma/client";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  FullContainer,
  HalfContainer,
} from "../../components/dashboard/dashboardContainers";
import Sidebar from "../../components/dashboard/sidebar";
import prisma from "../../constants/prisma";
import {
  calculatePercent,
  getEmissions,
  getSingleUseEmissions,
  productionAndDistributionEmission,
  recyclingEmission,
  washingEmission,
} from "../../utils/lifecycleUtils";
import {
  getEventsByAction,
  getTotalUsed,
} from "../../utils/tracking/trackingUtils";
import { authOptions } from "../api/auth/[...nextauth]";

type LifecycleProps = {
  events: Event[] | null;
};

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Lifecycle: NextPage<LifecycleProps> = ({ events }) => {
  if (!events) {
    return (
      <Sidebar>
        <div className="w-screen h-screen bg-black flex">
          <Head>
            <title>Lifecycle</title>
            <meta name="Lifecycle" content="shop for products" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
            <div className="text-white font-theinhardt text-28">
              Sign up for tracking to see this information
            </div>
          </main>
        </div>
      </Sidebar>
    );
  }
  const totalUsed = getTotalUsed(events);
  const singleUseSaved = getEventsByAction(events, Action.BORROW).length;
  const percentSaved = calculatePercent(events);

  const reuseVsSingleData = {
    labels: ["Reuse", "Single Use"],
    datasets: [
      {
        label: "C02eq Emissions",
        data: [
          getEmissions(events) / 1000,
          getSingleUseEmissions(singleUseSaved) / 1000,
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const reuseVsSingleOptions = {
    aspectRatio: 1,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const stagesData = {
    labels: ["Production", "Use", "Disposal"],
    datasets: [
      {
        label: "C02eq Emissions (kg)",
        data: [
          (productionAndDistributionEmission * totalUsed) / 1000,
          (washingEmission * singleUseSaved) / 1000,
          (recyclingEmission * totalUsed) / 1000,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Sidebar>
      <div className="w-screen h-screen flex bg-black">
        <Head>
          <title>Lifecycle</title>
          <meta name="Lifecycle" content="shop for products" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <h1 className="font-theinhardt text-3xl self-start">Dashboard</h1>
          <FullContainer>
            <div className="stat place-items-center">
              <div className="stat-title">Containers in use</div>
              <div className="stat-value">{totalUsed}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Single-Use containers saved</div>
              <div className="stat-value text-accent">{singleUseSaved}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Carbon Emissions</div>
              <div className="stat-value">
                {(getEmissions(events) / 1000).toFixed(2)} kg
              </div>
              <div className="stat-desc">of C02eq</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">% CO2eq saved</div>
              <div
                className={`stat-value ${
                  percentSaved > 0 ? "text-accent" : "text-error"
                }`}
              >
                {(percentSaved * 100).toFixed(2)}%
              </div>
              <div className="stat-desc">vs. leading single use options</div>
            </div>
          </FullContainer>
          <div className="flex w-full justify-between">
            <HalfContainer>
              <div className="stat-title">Reuse Vs Single Use Emissions</div>
              <Bar
                id="reuse"
                data={reuseVsSingleData}
                options={reuseVsSingleOptions}
              />
            </HalfContainer>
            <HalfContainer>
              <div className="stat-title">CO2eq usage by LCA Stage</div>
              <Doughnut id="stages" data={stagesData} />
            </HalfContainer>
          </div>
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
  if (session && session.user) {
    const events = await prisma.event.findMany({
      where: {
        companyId: (session.user as User).companyId,
      },
    });

    return {
      props: {
        events: JSON.parse(JSON.stringify(events)),
      },
    };
  }
  return { props: {} };
};

export default Lifecycle;
