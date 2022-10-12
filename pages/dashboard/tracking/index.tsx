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
import { info } from 'console'
import type { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'June Month-by-Month', // TODO: Figure out dynamic title
    },
  },
}

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

  let daysInMonth = getDaysInMonth(6, 2022)
  let itemsBorrowedDayByDay = getItemsByDay(
    6,
    2022,
    daysInMonth,
    events,
    Action.BORROW,
  )
  let itemsReturnedDayByDay = getItemsByDay(
    6,
    2022,
    daysInMonth,
    events,
    Action.RETURN,
  )
  let dayByDayData = {
    labels: daysInMonth,
    datasets: [
      {
        label: 'Borrows',
        data: itemsBorrowedDayByDay,
        borderColor: 'rgb(138, 254, 213)',
        backgroundColor: 'rgba(138, 254, 213, 0.5)',
      },
      {
        label: 'Returns',
        data: itemsReturnedDayByDay,
        borderColor: 'rgb(61, 177, 137)',
        backgroundColor: 'rgba(61, 177, 137, 0.5)',
      },
    ],
  }

  let monthsInYear = getMonthsInYear()
  let itemsBorrowedMonthByMonth = getItemsByMonth(2022, events, Action.BORROW)
  let itemsReturnedMonthByMonth = getItemsByMonth(2022, events, Action.RETURN)
  let monthByMonthData = {
    labels: monthsInYear,
    datasets: [
      {
        label: 'Borrows',
        data: itemsBorrowedMonthByMonth,
        borderColor: 'rgb(138, 254, 213)',
        backgroundColor: 'rgba(138, 254, 213, 0.5)',
      },
      {
        label: 'Returns',
        data: itemsReturnedMonthByMonth,
        borderColor: 'rgb(61, 177, 137)',
        backgroundColor: 'rgba(61, 177, 137, 0.5)',
      },
    ],
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
              <Line options={options} data={monthByMonthData} />
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
