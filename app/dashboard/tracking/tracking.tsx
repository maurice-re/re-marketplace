"use client";
import { Action, Event, Settings } from "@prisma/client";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { ChangeEvent, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import SettingsForm from "../../../components/tracking/settingsForm";
import {
  getAvgDaysBetweenBorrowAndReturn,
  getBoundingMonthYear,
  getDaysInMonth,
  getItemsByDay,
  getItemsByMonth,
  getItemsInUse,
  getLifetimeUses,
  getMonthsInYear,
  getMonthYearsForDailyDropdown,
  getReturnRate,
  getReuseRate,
  getYearsForMonthlyDropdown,
  sortByDate,
} from "../../../utils/tracking/trackingUtils";
import { FullLocation } from "../../server-store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Statistic = {
  title: string;
  value: number;
  info: string;
  isPercent: boolean;
};

const monthsInYear = getMonthsInYear();

function Tracking({
  demo,
  locations,
}: {
  demo: boolean;
  locations: FullLocation[];
}) {
  const [location, setLocation] = useState<FullLocation>(locations[0]);

  console.log("Have location ");
  console.log(location);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("Looking for ID ", value);
    const selectedLocation = locations.find((location) => location.id === value);
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  };

  // if we select a location, and then just always

  // "Dummy" data that is updated on changes
  const baseData = {
    labels: monthsInYear,
    datasets: [
      {
        label: "Borrows",
        data: [0],
        borderColor: "rgb(84, 89, 234)",
        backgroundColor: "rgba(84, 89, 234, 0.5)",
        fill: true,
      },
      {
        label: "Returns",
        data: [0],
        borderColor: "rgb(0, 222, 163)",
        backgroundColor: "rgba(0, 222, 163, 0.5)",
        fill: true,
      },
    ],
  };

  const [settings, setSettings] = useState<Settings | null>(
    location.settings
  );
  const [graphTimePeriod, setGraphTimePeriod] = useState<string>("monthly");
  const [monthYearForDaily, setMonthYearForDaily] = useState<string>("");
  const [yearForMonthly, setYearForMonthly] = useState<string>("");
  const [latestMonth, setLatestMonth] = useState<number>(0);
  const [latestYear, setLatestYear] = useState<number>(0);
  const [defaultItemsBorrowedMonthly, setDefaultItemsBorrowedMonthly] =
    useState([0]);
  const [defaultItemsReturnedMonthly, setDefaultItemsReturnedMonthly] =
    useState([0]);
  const [defaultItemsBorrowedDaily, setDefaultItemsBorrowedDaily] = useState([
    0,
  ]);
  const [defaultItemsReturnedDaily, setDefaultItemsReturnedDaily] = useState([
    0,
  ]);

  const [defaultDaysInMonth, setDefaultDaysInMonth] = useState([0]);

  const [data, setData] = useState(baseData);

  useEffect(() => {
    if (location?.events && location?.events.length > 0) {
      const sortedEvents = sortByDate(location?.events);
      const latestMonthYear = getBoundingMonthYear(sortedEvents, false);
      setMonthYearForDaily(latestMonthYear.map(String).join(","));
      setYearForMonthly(latestMonthYear[1].toString());
      setLatestMonth(latestMonthYear[0]);
      setLatestYear(latestMonthYear[1]);

      const borrowedMonthly = getItemsByMonth(
        latestYear,
        location?.events,
        Action.BORROW
      );
      const returnedMonthly = getItemsByMonth(
        latestYear,
        location?.events,
        Action.RETURN
      );

      const selectedData = {
        labels: monthsInYear,
        datasets: [
          {
            label: "Borrows",
            data: [0],
            borderColor: "rgb(84, 89, 234)",
            backgroundColor: "rgba(84, 89, 234, 0.5)",
            fill: true,
          },
          {
            label: "Returns",
            data: [0],
            borderColor: "rgb(0, 222, 163)",
            backgroundColor: "rgba(0, 222, 163, 0.5)",
            fill: true,
          },
        ],
      };

      selectedData.datasets[0].data = borrowedMonthly;
      selectedData.datasets[1].data = returnedMonthly;

      setDefaultItemsBorrowedMonthly(borrowedMonthly);
      setDefaultItemsReturnedMonthly(returnedMonthly);

      const daysInMonth = getDaysInMonth(latestMonth, latestYear);
      setDefaultDaysInMonth(daysInMonth);
      const borrowedDaily = getItemsByDay(
        latestMonth,
        latestYear,
        daysInMonth,
        location?.events,
        Action.BORROW
      );
      const returnedDaily = getItemsByDay(
        latestMonth,
        latestYear,
        daysInMonth,
        location?.events,
        Action.RETURN
      );

      setDefaultItemsBorrowedDaily(borrowedDaily);
      setDefaultItemsReturnedDaily(returnedDaily);

      setData(selectedData);
    }
  }, [location?.events, latestMonth, latestYear]);

  const handleTimePeriodChange = (newTimePeriod: string) => {
    setGraphTimePeriod(newTimePeriod);

    if (newTimePeriod === "monthly") {
      baseData.labels = monthsInYear;
      baseData.datasets[0].data = defaultItemsBorrowedMonthly;
      baseData.datasets[1].data = defaultItemsReturnedMonthly;
    } else if (newTimePeriod === "daily") {
      baseData.labels = defaultDaysInMonth.map(String);
      baseData.datasets[0].data = defaultItemsBorrowedDaily;
      baseData.datasets[1].data = defaultItemsReturnedDaily;
    }

    // Set to default values
    setMonthYearForDaily(latestMonth.toString() + "," + latestYear.toString());
    setYearForMonthly(latestYear.toString());

    setData(baseData);
  };

  const handleMonthYearForDailyChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const newMonthYearForDaily = event.target.value;
    setMonthYearForDaily(newMonthYearForDaily);

    const monthYear = newMonthYearForDaily.split(",");
    const month = parseInt(monthYear[0]);
    const year = parseInt(monthYear[1]);

    const daysInMonth = getDaysInMonth(month, year);
    const itemsBorrowedDaily = getItemsByDay(
      month,
      year,
      daysInMonth,
      location?.events,
      Action.BORROW
    );
    const itemsReturnedDaily = getItemsByDay(
      month,
      year,
      daysInMonth,
      location?.events,
      Action.RETURN
    );
    baseData.labels = daysInMonth.map(String);
    baseData.datasets[0].data = itemsBorrowedDaily;
    baseData.datasets[1].data = itemsReturnedDaily;

    setData(baseData);
  };

  const handleYearForMonthlyChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const newYearForMonthly = event.target.value;
    setYearForMonthly(newYearForMonthly);

    const year = parseInt(newYearForMonthly);

    const itemsBorrowedMonthly = getItemsByMonth(year, location?.events, Action.BORROW);
    const itemsReturnedMonthly = getItemsByMonth(year, location?.events, Action.RETURN);

    baseData.datasets[0].data = itemsBorrowedMonthly;
    baseData.datasets[1].data = itemsReturnedMonthly;

    setData(baseData);
  };

  function getFormattedMonthYear(monthYear: string): string {
    // 6,2022 -> June 2022
    const monthYearArr = monthYear.split(",");
    const formattedMonthYear =
      monthsInYear[parseInt(monthYearArr[0]) - 1] +
      " " +
      parseInt(monthYearArr[1]);
    return formattedMonthYear;
  }

  const stats: Statistic[] = [];
  stats.push({
    title: "Items In Use",
    value: getItemsInUse(location?.events),
    info: "currently borrowed",
    isPercent: false,
  });
  stats.push({
    title: "Used",
    value: getLifetimeUses(location?.events),
    info: "lifetime borrows",
    isPercent: false,
  });
  stats.push({
    title: "Reuse Rate",
    value: getReuseRate(location?.events),
    info: "(items used more than once) ÷ (items used)",
    isPercent: true,
  });
  stats.push({
    title: "Return Rate",
    value: getReturnRate(location?.events),
    info: "(items returned) ÷ (items borrowed)",
    isPercent: true,
  });
  stats.push({
    title: "Avg. Days Borrowed",
    value: getAvgDaysBetweenBorrowAndReturn(
      location?.events,
      settings?.borrowReturnBuffer ?? undefined
    ),
    info: "days between borrow and return",
    isPercent: false,
  });
  stats.push({
    title: "Number of Users",
    value: 61,
    info: "unique users",
    isPercent: false,
  });

  // TODO(Suhana): Create interface for toggling by sku and location
<<<<<<< HEAD
  const eventsBySku = getEventsBySku(location?.events, skus[1]);
  const itemsInUseBySku = getItemsInUse(eventsBySku);
  const numItemIds = getItemIds(location?.events).length;
  const reuseRateBySku = getReuseRate(eventsBySku);
  const returnRateBySku = getReturnRate(eventsBySku);
=======
  // const eventsBySku = getEventsBySku(events, skus[1]);
  // const itemsInUseBySku = getItemsInUse(eventsBySku);
  // const numItemIds = getItemIds(events).length;
  // const reuseRateBySku = getReuseRate(eventsBySku);
  // const returnRateBySku = getReturnRate(eventsBySku);
>>>>>>> dev

  const allMonthYears = getMonthYearsForDailyDropdown(location?.events);
  const allYears = getYearsForMonthlyDropdown(location?.events);

  const options = {
    responsive: true,
    scales: {
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
    },
  };

  return location ? (
    // TODO(Suhana): Create more sub-components here
    <div>
      <h1>Select a location:</h1>
      <div className="p-0 my-0">
        <select
          name="location"
          className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
          onChange={handleChange}
          required
          placeholder="Location"
          value={location.id}
        >
          {locations.map((val) => (
            <option key={val.id} value={val.id}>
              {val.id}
            </option>
          ))}
        </select>
      </div>
      {/* <h1 className="ml-1 mb-8 font-theinhardt text-3xl">Tracking</h1> */}
      <div className="flex items-center justify-between mt-4 mb-10 w-full">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="tooltip tooltip-bottom !pb-1 w-48 2xl:w-56"
            data-tip={stat.info}
          >
            <div className=" flex items-start items-justify flex-col bg-re-table-odd rounded-md py-4 pl-3 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105  duration-300 hover:bg-re-green-500 text-white hover:text-black">
              <div className="font-thin text-lg tracking-wide leading-none">
                {stat.title}
              </div>
              <div className="font-theinhardt text-4xl mt-2">
                {`${Math.round(stat.value * 10) / 10}${stat.isPercent ? `%` : ``
                  }`}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full gap-8">
        <div className="flex w-1/3 h-148 overflow-scroll border border-re-gray-300 rounded-md">
          <table className="w-full h-min font-theinhardt-300">
            <thead>
              <tr className="text-re-gray-text text-lg text-left p-4">
                <th className="py-2 pl-2 sticky top-0 bg-re-black">SKU</th>
                <th className="sticky top-0 bg-re-black">Action</th>
                <th className="sticky top-0 bg-re-black">Location</th>
                <th className="sticky top-0 bg-re-black">Company</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {location?.events.map((event) => (
                <tr
                  key={event.id}
                  className="even:bg-re-table-even odd:bg-re-table-odd hover:bg-re-table-hover"
                >
                  <td className="py-3 pl-2">{event.skuId}</td>
                  <td>
                    {event.action[0] + event.action.slice(1).toLowerCase()}
                  </td>
                  <td>{event.locationId ?? "Singapore"}</td>
                  <td>Salad Stop!</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-2/3 flex-col bg-re-dark-green-300 border h-min rounded-md border-re-gray-300 p-4">
          <div className="flex items-center h-min pb-4">
            <h2 className="text-lg mr-4">Borrows and Returns</h2>
            <button
              className={`mr-2 text-sm py-1 px-2 rounded ${graphTimePeriod === "monthly"
                ? "bg-re-gray-active"
                : "bg-re-gray-button"
                }`}
              onClick={() => handleTimePeriodChange("monthly")}
            >
              Monthly
            </button>
            <button
              className={`mr-2 text-sm py-1 px-2 rounded ${graphTimePeriod === "daily"
                ? "bg-re-gray-active"
                : "bg-re-gray-button"
                }`}
              onClick={() => handleTimePeriodChange("daily")}
            >
              Daily
            </button>
            {graphTimePeriod === "monthly" && (
              <div className="form-control text-sm">
                <select
                  className="py-[6px] px-2 bg-re-gray-button rounded"
                  value={yearForMonthly}
                  onChange={handleYearForMonthlyChange}
                >
                  {allYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {graphTimePeriod === "daily" && (
              <div className="form-control text-sm">
                <select
                  className="py-[6px] px-2 bg-re-gray-button rounded"
                  value={monthYearForDaily}
                  onChange={handleMonthYearForDailyChange}
                >
                  {allMonthYears.map((monthYear) => (
                    <option key={monthYear} value={monthYear}>
                      {getFormattedMonthYear(monthYear)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex-grow"></div>
            <div className="w-5 h-5 rounded-full bg-re-graph-blue mr-1"></div>
            <div className="mr-2 ">Borrows</div>
            <div className="w-5 h-5 rounded-full bg-re-graph-green mr-1"></div>
            <div>Returns</div>
          </div>

          <div className="h-120">
            <Line options={options} data={data} />
          </div>
        </div>
      </div>
      {!demo && (
        <>
          <h1 className="pt-8 ml-1 font-theinhardt text-2xl">
            Configure Settings
          </h1>
          <div className="flex w-full gap-8">
            <SettingsForm settings={settings} setSettings={setSettings} />
          </div>
        </>
      )}
      <div className="py-6"></div>
    </div>
  ) : (
    <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
      <div className="text-white font-theinhardt text-28">
        Integrate with our API to track
      </div>
    </main>
  );
}

export default Tracking;
