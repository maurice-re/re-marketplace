import { Action, Event, Settings, Sku } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { ChangeEvent, use } from 'react';
import { Line } from 'react-chartjs-2';
import prisma from '../../../constants/prisma';
import {
  UserWithSettings,
} from '../../../utils/tracking/trackingUtils';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import useSWR from 'swr';
import TrackingHome from '../../../pages/dashboard/tracking';

async function getSkus() {
  const skus = await prisma.sku.findMany();
  return skus;
};

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
  });
}

export default function Page() {

  const skus = use(getSkus());
  const user = use(getUser());
  // const user = use(getUser(context))

  return (<div>New Tracking Page WIP</div>);
  {/* <TrackingHome user={user} skus={skus} /> */ }
};
