"use client";
import { Action } from "@prisma/client";
import { Event } from "@prisma/client";
import { AiOutlineDisconnect } from "react-icons/ai";
import LifecycleChart from "./lifecycleChart";
import {
    calculatePercent,
    getEmissions,
    getSingleUseEmissions,
    getWasteSaved,
    productionAndDistributionEmission,
    recyclingEmission,
    washingEmission,
} from "../../../utils/lifecycleUtils";
import {
    getEventsByAction,
    getTotalUsed,
} from "../../../utils/tracking/trackingUtils";
import { HalfContainer } from "../../../components/dashboard/dashboardContainers";

function Lifecycle({
    events,
}: {
    events: Event[];
}) {
    const totalUsed = getTotalUsed(events);
    const singleUseSaved = getEventsByAction(events, Action.BORROW).length;
    const percentSaved = calculatePercent(events);

    const reuseVsSingleData = {
        labels: ["Single Use", "Reusable"],
        datasets: [
            {
                label: "C02eq Emissions",
                data: [
                    getSingleUseEmissions(singleUseSaved) / 1000,
                    getEmissions(events) / 1000,
                ],
                backgroundColor: ["rgba(84, 89, 234, 0.5)", "rgba(0, 222, 163, 0.5)"],
                borderColor: ["rgba(84, 89, 234, 1)", "rgba(0, 222, 163, 1)"],
                borderWidth: 4,
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
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const byStageData = {
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
                    "rgba(0, 222, 163, 0.5)",
                    "rgba(84, 89, 234, 0.5)",
                    "rgba(212, 12, 152, 0.5)",
                ],
                borderColor: [
                    "rgba(0, 222, 163, 1)",
                    "rgba(84, 89, 234, 1)",
                    "rgba(212, 12, 152, 1)",
                ],
                borderWidth: 2,
            },
        ],
    };

    const byStageOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const stats = [
        {
            title: "Containers in use",
            value: totalUsed,
            tooltip: "Total number of containers in use",
        },
        {
            title: "Single-Use saved",
            value: singleUseSaved,
            tooltip: "Total number of single-use containers saved",
        },
        {
            title: "Carbon Emissions",
            value: (getEmissions(events) / 1000).toFixed(2),
            tooltip: "Total carbon emissions",
        },
        {
            title: "% C02eq saved",
            value: (percentSaved * 100).toFixed(2) + "%",
            tooltip: "Percent of carbon emissions saved",
        },
        {
            title: "Waste Saved",
            value: getWasteSaved(events).toFixed(2) + " kg",
            tooltip: "Total waste saved (kg)",
        },
    ];

    return events && events.length != 0 ? (
        <div className="w-full border-re-gray-300 border-t-1/2">
            <div className="w-full px-6 pt-6">
                <div className="flex justify-between mb-10">
                    {stats.map((stat) => (
                        <div
                            key={stat.title}
                            className="tooltip tooltip-bottom !pb-1 w-48 2xl:w-56"
                            data-tip={stat.tooltip}
                        >
                            <div className="flex items-start items-justify flex-col bg-re-table-odd rounded-md py-4 pl-3 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105  duration-300 hover:bg-re-green-500 text-white hover:text-black">
                                <div className="font-thin text-lg tracking-wide leading-none">
                                    {stat.title}
                                </div>
                                <div className="font-theinhardt text-4xl mt-2">
                                    {stat.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex w-full justify-between">
                    <HalfContainer>
                        <div className="flex h-min pb-[6px] text-white items-center">
                            <div className="text-lg text-white">
                                Single Use vs Reuse Emissions
                            </div>
                            <div className="flex-grow"></div>
                            <div className="w-5 h-5 rounded-full bg-re-graph-blue mr-1 text-sm"></div>
                            <div className="mr-2">Single Use</div>
                            <div className="w-5 h-5 rounded-full bg-re-graph-green mr-1 text-sm"></div>
                            <div>Reusable</div>
                        </div>
                        <div className="pt-3">
                            <LifecycleChart
                                data={reuseVsSingleData}
                                type="bar"
                                id="reuse"
                                options={reuseVsSingleOptions}
                            />
                        </div>
                    </HalfContainer>
                    <HalfContainer>
                        <div className="flex h-min pb-[6px] text-white items-center">
                            <div className="text-lg text-white">C02 Emissions by Stage</div>
                            <div className="flex-grow"></div>
                            <div className="w-5 h-5 rounded-full bg-re-graph-blue mr-1 text-sm"></div>
                            <div className="mr-2">Use</div>
                            <div className="w-5 h-5 rounded-full bg-re-graph-green mr-1 text-sm"></div>
                            <div className="mr-2">Production</div>
                            <div className="w-5 h-5 rounded-full bg-re-graph-pink mr-1 text-sm"></div>
                            <div>Disposal</div>
                        </div>
                        <div className="p-6">
                            <LifecycleChart
                                id="stages"
                                data={byStageData}
                                type="doughnut"
                                options={byStageOptions}
                            />
                        </div>
                    </HalfContainer>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex gap-3 mx-auto h-full items-start justify-start px-6 pt-6 border-re-gray-300 border-t-1/2">
            <AiOutlineDisconnect
                className="text-re-green-500"
                size={40} />
            <div className="text-white font-theinhardt text-28">
                Integrate with our API to see emissions savings
            </div>
        </div>
    );
}

export default Lifecycle;


