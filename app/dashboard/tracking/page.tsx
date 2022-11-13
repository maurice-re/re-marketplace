import { Company, Settings, User } from '@prisma/client';
import { Session } from 'next-auth';
import Head from 'next/head';
import { use } from 'react';
import prisma from '../../../constants/prisma';
import Tracking from './tracking';
import { headers } from 'next/headers';
import { getSession } from '../../../utils/sessionUtils';

// https://github.com/nextauthjs/next-auth/issues/5647

export type UserSettings = (User & {
  company: Company & {
    settings: Settings | null;
  };
}) | null;

async function getSkus() {
  const skus = await prisma.sku.findMany();
  return JSON.parse(JSON.stringify(skus));
}

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

export default async function Page() {
  // TODO(Suhana): What should we do here if there isn't a session?
  const session = await getSession(headers().get('cookie') ?? '');
  const user: UserSettings = await getUser(session);
  const skus = await getSkus();

  return (
    <div className="w-full h-screen bg-black flex overflow-auto">
      <Head>
        <title>Tracking</title>
        <meta name="tracking" content="Tracking" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <Tracking user={user} skus={skus} />
      </main>
    </div>
  );
}
