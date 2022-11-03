import { Action, Company, Event, Settings, Sku, User } from '@prisma/client'
import { Session, unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import { ChangeEvent, use } from 'react'
import { Line } from 'react-chartjs-2'
import prisma from '../../../constants/prisma'
import { UserWithSettings } from '../../../utils/tracking/trackingUtils'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import useSWR from 'swr'
import TrackingContent from './trackingContent'
import { headers, cookies } from 'next/headers'

import { NextAuthHandler } from 'next-auth/core'

export const getSession2 = async (options = authOptions) => {
  const session = await NextAuthHandler<Session | {} | string>({
    options,
    req: {
      host: headers().get('x-forwarded-host') ?? 'http://localhost:3000',
      action: 'session',
      method: 'GET',
      cookies: Array.from(cookies().entries()).reduce(
        (acc, [key]) => ({ ...acc, [key]: cookies().get(key) }),
        {},
      ),
      headers: headers(),
    },
  })

  return session
}

async function getSkus() {
  const skus = await prisma.sku.findMany()
  return skus
}

// TODO(Suhana): Fix this type
export type UserSettings =
  | (User & { company: Company & { settings: Settings | null } })
  | null

// TODO(Suhana): Fetch current user
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

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch('http://localhost:3000/api/auth/session', {
    headers: {
      cookie,
    },
  })

  const session = await response.json()

  return Object.keys(session).length > 0 ? session : null
}

export default function Page() {
  const skus = use(getSkus())
  const user: UserSettings = use(getUser())
  const session = use(getSession(headers().get('cookie') ?? ''))
  const session2 = use(getSession2(authOptions))
  // const session2 = use(unstable_getServerSession(headers().get('cookie')));
  console.log("Here's session2:")
  console.log(session2)

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
