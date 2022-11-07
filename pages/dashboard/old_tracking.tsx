import { Action, Event, Settings, Sku } from '@prisma/client';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { ChangeEvent, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Sidebar from '../../components/dashboard/sidebar';
import SettingsForm from '../../components/tracking/settingsForm';
import prisma from '../../constants/prisma';
import {
  getAvgDaysBetweenBorrowAndReturn,
  getBoundingMonthYear,
  getDaysInMonth,
  getEventsBySku,
  getItemIds,
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
  UserWithSettings,
} from '../../utils/tracking/trackingUtils';
import { authOptions } from '../api/auth/[...nextauth]';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, {
  method: "GET",
  headers: { "Content-Type": "application/json" },
}).then((res) => res.json());

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type Statistic = {
  title: string;
  value: number;
  info: string;
  isPercent: boolean;
};

type TrackingProps = {
  user: UserWithSettings;
  skus: Sku[];
};

const monthsInYear = getMonthsInYear();

const TrackingHome: NextPage<TrackingProps> = ({
  user,
  skus,
}: TrackingProps) => {

  // "Dummy" data that is updated on changes
  let baseData = {
    labels: monthsInYear,
    datasets: [
      {
        label: 'Borrows',
        data: [0],
        borderColor: 'rgb(138, 254, 213)',
        backgroundColor: 'rgba(138, 254, 213, 0.5)',
      },
      {
        label: 'Returns',
        data: [0],
        borderColor: 'rgb(61, 177, 137)',
        backgroundColor: 'rgba(61, 177, 137, 0.5)',
      },
    ],
  };

  const [settings, setSettings] = useState<Settings>(user?.company.settings);
  const [graphTimePeriod, setGraphTimePeriod] = useState<string>('monthly');
  const [monthYearForDaily, setMonthYearForDaily] = useState<string>('');
  const [yearForMonthly, setYearForMonthly] = useState<string>('');
  const [latestMonth, setLatestMonth] = useState<number>(0);
  const [latestYear, setLatestYear] = useState<number>(0);
  const [defaultItemsBorrowedMonthly, setDefaultItemsBorrowedMonthly] = useState([0]);
  const [defaultItemsReturnedMonthly, setDefaultItemsReturnedMonthly] = useState([0]);
  const [defaultItemsBorrowedDaily, setDefaultItemsBorrowedDaily] = useState([0]);
  const [defaultItemsReturnedDaily, setDefaultItemsReturnedDaily] = useState([0]);
  const [defaultDaysInMonth, setDefaultDaysInMonth] = useState([0]);

  const { data: eventData } = useSWR(`/api/tracking/get-events?companyId=${user?.companyId}`, fetcher);
  let events = eventData?.events;

  const [data, setData] = useState(baseData);

  useEffect(() => {
    if (events && events.length > 0) {
      const sortedEvents = sortByDate(events);
      const latestMonthYear = getBoundingMonthYear(sortedEvents, false);
      setMonthYearForDaily(latestMonthYear.map(String).join(','));
      setYearForMonthly(latestMonthYear[1].toString());
      setLatestMonth(latestMonthYear[0]);
      setLatestYear(latestMonthYear[1]);

      const borrowedMonthly = getItemsByMonth(
        latestYear,
        events,
        Action.BORROW,
      );
      const returnedMonthly = getItemsByMonth(
        latestYear,
        events,
        Action.RETURN,
      );

      let selectedData = {
        labels: monthsInYear,
        datasets: [
          {
            label: 'Borrows',
            data: [0],
            borderColor: 'rgb(138, 254, 213)',
            backgroundColor: 'rgba(138, 254, 213, 0.5)',
          },
          {
            label: 'Returns',
            data: [0],
            borderColor: 'rgb(61, 177, 137)',
            backgroundColor: 'rgba(61, 177, 137, 0.5)',
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
        events,
        Action.BORROW,
      );
      const returnedDaily = getItemsByDay(
        latestMonth,
        latestYear,
        daysInMonth,
        events,
        Action.RETURN,
      );

      setDefaultItemsBorrowedDaily(borrowedDaily);
      setDefaultItemsReturnedDaily(returnedDaily);

      setData(selectedData);
    }
  }, [events, latestMonth, latestYear]);

  if (!events || events.length == 0) {
    return (
      <Sidebar>
        <div className="w-screen h-screen bg-black flex">
          <Head>
            <title>Tracking</title>
            <meta name="locations" content="Track your items" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
            <div className="text-white font-theinhardt text-28">
              Integrate with our API to track
            </div>
          </main>
        </div>
      </Sidebar>
    );
  }

  const handleTimePeriodChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newGraphTimePeriod = event.target.value;
    setGraphTimePeriod(newGraphTimePeriod);

    if (newGraphTimePeriod === 'monthly') {
      baseData.labels = monthsInYear;
      baseData.datasets[0].data = defaultItemsBorrowedMonthly;
      baseData.datasets[1].data = defaultItemsReturnedMonthly;
    } else if (newGraphTimePeriod === 'daily') {
      baseData.labels = defaultDaysInMonth.map(String);
      baseData.datasets[0].data = defaultItemsBorrowedDaily;
      baseData.datasets[1].data = defaultItemsReturnedDaily;
    }

    // Set to default values
    setMonthYearForDaily(latestMonth.toString() + ',' + latestYear.toString());
    setYearForMonthly(latestYear.toString());

    setData(baseData);
  };

  const handleMonthYearForDailyChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const newMonthYearForDaily = event.target.value;
    setMonthYearForDaily(newMonthYearForDaily);

    const monthYear = newMonthYearForDaily.split(',');
    const month = parseInt(monthYear[0]);
    const year = parseInt(monthYear[1]);

    const daysInMonth = getDaysInMonth(month, year);
    const itemsBorrowedDaily = getItemsByDay(
      month,
      year,
      daysInMonth,
      events,
      Action.BORROW,
    );
    const itemsReturnedDaily = getItemsByDay(
      month,
      year,
      daysInMonth,
      events,
      Action.RETURN,
    );
    baseData.labels = daysInMonth.map(String);
    baseData.datasets[0].data = itemsBorrowedDaily;
    baseData.datasets[1].data = itemsReturnedDaily;

    setData(baseData);
  };

  const handleYearForMonthlyChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const newYearForMonthly = event.target.value;
    setYearForMonthly(newYearForMonthly);

    const year = parseInt(newYearForMonthly);

    let itemsBorrowedMonthly = getItemsByMonth(year, events, Action.BORROW);
    let itemsReturnedMonthly = getItemsByMonth(year, events, Action.RETURN);

    baseData.datasets[0].data = itemsBorrowedMonthly;
    baseData.datasets[1].data = itemsReturnedMonthly;

    setData(baseData);
  };

  function getFormattedMonthYear(monthYear: string): string {
    // 6,2022 -> June 2022
    const monthYearArr = monthYear.split(',');
    const formattedMonthYear =
      monthsInYear[parseInt(monthYearArr[0]) - 1] +
      ' ' +
      parseInt(monthYearArr[1]);
    return formattedMonthYear;
  }

  let stats: Statistic[] = [];
  stats.push({
    title: 'In-use',
    value: getItemsInUse(events),
    info: 'currently borrowed',
    isPercent: false,
  });
  stats.push({
    title: 'Used',
    value: getLifetimeUses(events),
    info: 'lifetime borrows',
    isPercent: false,
  });
  stats.push({
    title: 'Reuse Rate',
    value: getReuseRate(events),
    info: '(items used more than once) ÷ (items used)',
    isPercent: true,
  });
  stats.push({
    title: 'Return Rate',
    value: getReturnRate(events),
    info: '(items returned) ÷ (items borrowed)',
    isPercent: true,
  });
  stats.push({
    title: 'Avg Lifecycle',
    value: getAvgDaysBetweenBorrowAndReturn(
      events,
      settings?.borrowReturnBuffer ?? undefined,
    ),
    info: 'days between borrow and return',
    isPercent: false,
  });

  // TODO(Suhana): Create interface for toggling by sku and location
  const eventsBySku = getEventsBySku(events, skus[1]);
  const itemsInUseBySku = getItemsInUse(eventsBySku);
  const numItemIds = getItemIds(events).length;
  const reuseRateBySku = getReuseRate(eventsBySku);
  const returnRateBySku = getReturnRate(eventsBySku);

  const allMonthYears = getMonthYearsForDailyDropdown(events);
  const allYears = getYearsForMonthlyDropdown(events);

  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text:
          graphTimePeriod === 'monthly'
            ? `Month-by-Month for ${yearForMonthly}`
            : `Day-by-Day for ${getFormattedMonthYear(monthYearForDaily)}`,
      },
    },
  };

  return (
    <Sidebar>
      <div className="w-full h-screen bg-black flex overflow-auto">
        <Head>
          <title>Tracking</title>
          <meta name="locations" content="Manage locations" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
          {events && events.length > 0 ? (
            <div>
              <h1 className="ml-1 font-theinhardt text-3xl">Tracking</h1>
              <h1 className="ml-1 mt-8 font-theinhardt text-2xl">
                Lifetime Statistics
              </h1>
              <div className="flex w-full items-center justify-between mt-4 mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className="tooltip tooltip-bottom !pb-2"
                    data-tip={stat.info}
                  >
                    <button className=" flex items-center items-justify flex-col w-48 2xl:w-64 border-2 rounded-xl py-8 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105  duration-300 hover:border-re-green-300">
                      <div className="font-thin text-md uppercase tracking-wide leading-none">
                        {stat.title}
                      </div>
                      <div className="font-theinhardt text-4xl mt-2 text-re-green-500">
                        {`${Math.round(stat.value * 10) / 10}${stat.isPercent ? `%` : ``
                          }`}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
              <h1 className="ml-1 py-2 font-theinhardt text-2xl">
                Borrows and Returns
              </h1>
              <div className="flex w-full gap-8">
                <div className="flex-col w-1/6">
                  <div onChange={handleTimePeriodChange}>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Monthly</span>
                        <input
                          type="radio"
                          name="radio-6"
                          value="monthly"
                          className="radio checked:bg-re-green-500"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Daily</span>
                        <input
                          type="radio"
                          name="radio-6"
                          value="daily"
                          className="radio checked:bg-re-green-500"
                        />
                      </label>
                    </div>
                  </div>
                  {graphTimePeriod === 'monthly' && (
                    <div className="form-control w-full max-w-xs mt-2">
                      <select
                        className="select w-full max-w-xs"
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
                  {graphTimePeriod === 'daily' && (
                    <div className="form-control w-full max-w-xs mt-2">
                      <select
                        className="select w-full max-w-xs"
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
                </div>

                <div className="w-5/6">
                  <Line options={options} data={data} />
                </div>
              </div>
              <h1 className="pt-8 ml-1 font-theinhardt text-2xl">
                Configure Settings
              </h1>
              <div className="flex w-full gap-8">
                <SettingsForm settings={settings} setSettings={setSettings} />
              </div>
              <div className="py-6"></div>
            </div>
          ) : (
            <div className="text-white font-theinhardt text-28">
              You will see tracking data here once products are in circulation
            </div>
          )}
        </main>
      </div>
    </Sidebar>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? '',
      },
      include: {
        company: {
          include: {
            settings: true,
          },
        },
      },
    });
    const skus = await prisma.sku.findMany();
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        skus: JSON.parse(JSON.stringify(skus)),
      },
    };
  }
  return { props: {} };
};

export default TrackingHome;
