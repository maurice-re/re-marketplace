import { Action, Company, Event, Settings, Sku, User } from '@prisma/client'
import { unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import { ChangeEvent, use } from 'react'
import { Line } from 'react-chartjs-2'
import prisma from '../../../constants/prisma'
import { UserWithSettings } from '../../../utils/tracking/trackingUtils'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import useSWR from 'swr'
import TrackingContent from '../../components/dashboard/tracking/trackingContent'

async function getSkus() {
  const skus = await prisma.sku.findMany()
  return skus
}
export type UserSettings =
  | (User & { company: Company & { settings: Settings | null } })
  | null

async function getUser() {
  const user = await prisma.user.findUnique({
    where: {
      email: 'pcoulson@myyahoo.com',
    },
    include: {
      company: {
        include: {
          settings: true,
        },
      },
    },
  })
  return user
}

export default function Page() {
  const skus = use(getSkus())
  const user: UserSettings = use(getUser())
  // const user = use(getUser(context))

  return (
    <div className="w-full h-screen bg-black flex overflow-auto">
      <Head>
        <title>Tracking</title>
        <meta name="tracking" content="Tracking" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <TrackingContent user={user} skus={skus} />
      </main>
    </div>
  )
}
