import { Action, Company, Event, Sku, User } from '@prisma/client'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import type { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import { ChangeEvent, useState } from 'react'
import { Line } from 'react-chartjs-2'
import Sidebar from '../../../components/dashboard/sidebar'
import prisma from '../../../constants/prisma'
import {
  getAvgDaysBetweenBorrowAndReturn,
  getDaysInMonth,
  getEventsBySku,
  getItemIds,
  getItemsByDay,
  getItemsByMonth,
  getItemsInUse,
  getLifetimeUses,
  getMonthsInYear,
  getReturnRate,
  getReuseRate,
} from '../../../utils/tracking/trackingUtils'
import { authOptions } from '../../api/auth/[...nextauth]'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

type Statistic = {
  title: string
  value: number
  info: string
  isPercent: boolean
}

type TrackingProps = {
  events: Event[]
  user: User & {
    company: Company
  }
  skus: Sku[]
}

const TrackingHome: NextPage<TrackingProps> = ({
  events,
  user,
  skus,
}: TrackingProps) => {
  const [graphTimePeriod, setGraphTimePeriod] = useState<string>('monthly')
  const [monthYearForDaily, setMonthYearForDaily] = useState<string>('6,2022')
  const [yearForMonthly, setYearForMonthly] = useState<string>('2022')

  const monthsInYear = getMonthsInYear()
  // TODO(Suhana): Set default year that's shown to the latest one, instead of hard-coded 2022
  const defaultItemsBorrowedMonthly = getItemsByMonth(
    2022,
    events,
    Action.BORROW,
  )
  const defaultItemsReturnedMonthly = getItemsByMonth(
    2022,
    events,
    Action.RETURN,
  )
  // TODO(Suhana): Set default year that's shown to the latest one, instead of hard-coded Sep 2022
  const defaultDaysInMonth = getDaysInMonth(9, 2022)
  const defaultItemsBorrowedDaily = getItemsByDay(
    9,
    2022,
    defaultDaysInMonth,
    events,
    Action.BORROW,
  )
  const defaultItemsReturnedDaily = getItemsByDay(
    9,
    2022,
    defaultDaysInMonth,
    events,
    Action.RETURN,
  )
  let selectedData = {
    labels: monthsInYear,
    datasets: [
      {
        label: 'Borrows',
        data: defaultItemsBorrowedMonthly,
        borderColor: 'rgb(138, 254, 213)',
        backgroundColor: 'rgba(138, 254, 213, 0.5)',
      },
      {
        label: 'Returns',
        data: defaultItemsReturnedMonthly,
        borderColor: 'rgb(61, 177, 137)',
        backgroundColor: 'rgba(61, 177, 137, 0.5)',
      },
    ],
  }

  const [data, setData] = useState(selectedData)

  const handleTimePeriodChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('In handleTimePeriodChange')
    const newGraphTimePeriod = event.target.value
    console.log(newGraphTimePeriod)
    setGraphTimePeriod(newGraphTimePeriod)

    if (newGraphTimePeriod === 'monthly') {
      selectedData.labels = monthsInYear
      selectedData.datasets[0].data = defaultItemsBorrowedMonthly
      selectedData.datasets[1].data = defaultItemsReturnedMonthly
      console.log('Defaulting to monthly data')
    } else if (newGraphTimePeriod === 'daily') {
      selectedData.labels = defaultDaysInMonth //TODO(Suhana): Address that labels can take both string[] and number[]
      selectedData.datasets[0].data = defaultItemsBorrowedDaily
      selectedData.datasets[1].data = defaultItemsReturnedDaily
      console.log('Defaulting to daily data')
    }
    setData(selectedData)
    console.log(data)
  }

  const handleMonthYearForDailyChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    console.log('In handleMonthYearForDailyChange')
    const newMonthYearForDaily = event.target.value
    console.log(newMonthYearForDaily)
    setMonthYearForDaily(newMonthYearForDaily)

    const monthYear = newMonthYearForDaily.split(',')
    const month = parseInt(monthYear[0])
    const year = parseInt(monthYear[1])

    const daysInMonth = getDaysInMonth(month, year)
    const itemsBorrowedDaily = getItemsByDay(
      month,
      year,
      daysInMonth,
      events,
      Action.BORROW,
    )
    const itemsReturnedDaily = getItemsByDay(
      month,
      year,
      daysInMonth,
      events,
      Action.RETURN,
    )
    selectedData.labels = daysInMonth
    selectedData.datasets[0].data = itemsBorrowedDaily
    selectedData.datasets[1].data = itemsReturnedDaily

    console.log('Setting data to dailyData')
    setData(selectedData)
  }

  const handleYearForMonthlyChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    console.log('In handleYearForMonthlyChange')
    const newYearForMonthly = event.target.value
    console.log(newYearForMonthly)
    setYearForMonthly(newYearForMonthly)

    const year = parseInt(newYearForMonthly)

    let itemsBorrowedMonthly = getItemsByMonth(year, events, Action.BORROW)
    let itemsReturnedMonthly = getItemsByMonth(year, events, Action.RETURN)

    selectedData.datasets[0].data = itemsBorrowedMonthly
    selectedData.datasets[1].data = itemsReturnedMonthly

    console.log('Setting data to monthlyData')
    setData(selectedData)
  }

  let stats: Statistic[] = []
  stats.push({
    title: 'In-use',
    value: getItemsInUse(events),
    info: 'currently borrowed',
    isPercent: false,
  })
  stats.push({
    title: 'Used',
    value: getLifetimeUses(events),
    info: 'lifetime borrows',
    isPercent: false,
  })
  stats.push({
    title: 'Reuse Rate',
    value: getReuseRate(events),
    info: '(items used more than once) ÷ (items used)',
    isPercent: true,
  })
  stats.push({
    title: 'Return Rate',
    value: getReturnRate(events),
    info: '(items returned) ÷ (items borrowed)',
    isPercent: true,
  })
  stats.push({
    title: 'Avg Lifecycle',
    value: getAvgDaysBetweenBorrowAndReturn(events),
    info: 'days between borrow and return',
    isPercent: false,
  })

  const eventsBySku = getEventsBySku(events, skus[1])
  const itemsInUseBySku = getItemsInUse(eventsBySku)
  const numItemIds = getItemIds(events).length
  const reuseRateBySku = getReuseRate(eventsBySku)
  const returnRateBySku = getReturnRate(eventsBySku)

  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '2022 Month-by-Month', // TODO: Figure out dynamic title
      },
    },
  }

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
              <div className="flex w-full items-center justify-between my-8">
                {stats.map((stat) => (
                  <div
                    className="tooltip tooltip-bottom !pb-2"
                    data-tip={stat.info}
                  >
                    <button
                      key={stat.title}
                      className=" flex items-center items-justify flex-col w-48 2xl:w-64 border-2 rounded-xl py-8 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105  duration-300 hover:border-re-green-300"
                    >
                      <div className="font-thin text-md uppercase tracking-wide leading-none">
                        {stat.title}
                      </div>
                      <div className="font-theinhardt text-4xl mt-2 text-re-green-500">
                        {`${Math.round(stat.value * 10) / 10}${
                          stat.isPercent ? `%` : ``
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
                  {/* TODO(Suhana): Get these months and days dynamically */}
                  {/* TODO(Suhana): Make the first one shown the latest one */}
                  {graphTimePeriod === 'monthly' && (
                    <div className="form-control w-full max-w-xs">
                      <select
                        className="select w-full max-w-xs"
                        value={yearForMonthly}
                        onChange={handleYearForMonthlyChange}
                      >
                        <option value={'2022'}>2022</option>
                        <option value={'2023'}>2023</option>
                      </select>
                    </div>
                  )}
                  {graphTimePeriod === 'daily' && (
                    <div className="form-control w-full max-w-xs">
                      <select
                        className="select w-full max-w-xs"
                        value={monthYearForDaily}
                        onChange={handleMonthYearForDailyChange}
                      >
                        <option value={'6,2022'}>06/2022</option>
                        <option value={'7,2022'}>07/2022</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="w-5/6">
                  <Line options={options} data={data} />
                </div>
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
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  )
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? '',
      },
      include: {
        company: true,
      },
    })
    const events = await prisma.event.findMany({
      where: {
        companyId: user?.companyId,
      },
    })
    const skus = await prisma.sku.findMany()
    return {
      props: {
        events: JSON.parse(JSON.stringify(events)),
        user: JSON.parse(JSON.stringify(user)),
        skus: JSON.parse(JSON.stringify(skus)),
      },
    }
  }
  return { props: {} }
}

export default TrackingHome
