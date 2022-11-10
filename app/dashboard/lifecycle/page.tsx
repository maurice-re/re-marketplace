import { Action } from "@prisma/client";

import { use } from "react";
import {
  FullContainer,
  HalfContainer,
} from "../../../components/dashboard/dashboardContainers";
import prisma from "../../../constants/prisma";
import {
  calculatePercent,
  getEmissions,
  getSingleUseEmissions,
  productionAndDistributionEmission,
  recyclingEmission,
  washingEmission,
} from "../../../utils/lifecycleUtils";
import {
  getEventsByAction,
  getTotalUsed,
} from "../../../utils/tracking/trackingUtils";
import LifecycleChart from "./lifecycleChart";

async function getEvents() {
  return await prisma.event.findMany({});
}

export default function Page() {
  const events = use(getEvents());
  if (!events) {
    return (
      <div className="w-screen h-screen bg-black flex">
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">
            Sign up for tracking to see this information
          </div>
        </main>
      </div>
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
    <div className="w-full flex bg-black">
      <head>
        <title>Lifecycle</title>
      </head>
      <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
        <h1 className="font-theinhardt text-3xl self-start text-white">
          Lifecycle
        </h1>
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
            <LifecycleChart
              data={reuseVsSingleData}
              type="bar"
              id="reuse"
              options={reuseVsSingleOptions}
            />
          </HalfContainer>
          <HalfContainer>
            <div className="stat-title">CO2eq usage by LCA Stage</div>
            <LifecycleChart id="stages" data={stagesData} type="doughnut" />
          </HalfContainer>
        </div>
      </main>
    </div>
  );
}
