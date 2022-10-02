import { Event, Order, OrderItem, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Sidebar from "../../../components/dashboard/sidebar";
import ReLogo from "../../../components/form/re-logo";
import { authOptions } from "../../api/auth/[...nextauth]";
import prisma from "../../../constants/prisma";
import { SkuProduct } from "../../../utils/dashboard/dashboardUtils";
type UserOrderItems = User & {
  company: {
    name: string;
    customerId: string;
  };
  orders: (Order & {
    items: (OrderItem & {
      sku: SkuProduct;
      location: {
        displayName: string | null;
        city: string;
      };
    })[];
  })[];
};
type TrackingProps = {
  events: Event[];
  user: UserOrderItems;
};

const TrackingHome: NextPage<TrackingProps> = ({
  events,
  user,
}: TrackingProps) => {
  console.log(user.orders[0]);

  return (
    <Sidebar>
      <div className="w-screen h-screen bg-black flex">
        <Head>
          <title>Tracking</title>
          <meta name="locations" content="Manage locations" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">
            Track your products {user?.firstName}
          </div>
        </main>
      </div>
    </Sidebar>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { test } = context.query;
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? "",
      },
      include: {
        company: {
          select: {
            name: true,
            customerId: true,
          },
        },
        orders: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            items: {
              include: {
                sku: {
                  include: {
                    product: true,
                  },
                },
                location: {
                  select: {
                    displayName: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log("Index in tracking");
    console.log(user);
    const events = await prisma.event.findMany({
      where: {
        companyId: user?.companyId,
      },
    });
    console.log("Events in user");
    console.log(events);
    return {
      props: {
        events: JSON.parse(JSON.stringify(events)),
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  }
  return { props: {} };
};

export default TrackingHome;
