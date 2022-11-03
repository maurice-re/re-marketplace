import { Company, Settings, User } from '@prisma/client';
import { Session } from 'next-auth';
import Head from 'next/head';
import { use } from 'react';
import prisma from '../../../constants/prisma';
import TrackingContent from './trackingContent';
import { headers } from 'next/headers';

// https://github.com/nextauthjs/next-auth/issues/5647

async function getSkus() {
  const skus = await prisma.sku.findMany();
  return JSON.parse(JSON.stringify(skus));
}

export type UserSettings = (User & {
  company: Company & {
    settings: Settings | null;
  };
}) | null;

async function getUser(session: Session) {
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
  return JSON.parse(JSON.stringify(user));
}

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(
    `${headers().get('x-forwarded-host') ?? 'http://localhost:3000'
    }/api/auth/session`,
    {
      headers: {
        cookie,
      },
    },
  );
  const session = await response.json();
  return Object.keys(session).length > 0 ? session : null;
}

export default function Page() {
  // TODO(Suhana): What should we do here if there isn't a session?
  const session = use(getSession(headers().get('cookie') ?? ''));
  const user: UserSettings = use(getUser(session));
  const skus = use(getSkus());

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
  );
}
