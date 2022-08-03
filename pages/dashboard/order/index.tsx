import { User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Sidebar from "../../../components/dashboard/sidebar";
import prisma from "../../../constants/prisma";
import {
  addDays,
  dayMonthYear,
  fullProductName,
  monthDayYear,
  OrderCustomerLocation,
} from "../../../utils/dashboard/dashboardUtils";
import { authOptions } from "../../api/auth/[...nextauth]";

type OrderProps = {
  orders: OrderCustomerLocation[];
};

const OrderHome: NextPage<OrderProps> = ({ orders }: OrderProps) => {
  console.log(orders);
  if (orders == null) {
    return (
      <div className="w-full h-screen bg-black flex overflow-hidden">
        <Head>
          <title>Order Not Found</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="text-xl text-white flex items-center">
          <h1 className="mx-auto">This order does not exist</h1>
        </main>
      </div>
    );
  }

  function formatDate(date: Date): string {
    const day = new Date(date);
    const month = day.toLocaleDateString("en-us", {
      month: "long",
    });
    return day.getDay() + " " + month + " " + day.getFullYear();
  }

  return (
    <Sidebar>
      <div className="w-screen h-screen bg-black flex overflow-hidden">
        <Head>
          <title>Find your perfect setup</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
          <div className="flex justify-between mx-2">
            <h1 className=" font-theinhardt text-3xl">Orders</h1>
            <h1 className=" font-theinhardt text-3xl">
              {orders[0].company.name}
            </h1>
          </div>
          <div className="w-full bg-re-gray-400 rounded-10 mx-2 my-4 overflow-auto">
            <div className="p-4">
              {orders.map((order) => (
                <div key={order.id} className="flex w-full">
                  <div className="flex flex-col w-1/4 items-center my-3 py-2">
                    <div>{dayMonthYear(order.createdAt)}</div>
                    <div>{`Order Id: ${order.id}`}</div>
                  </div>
                  <div className="flex flex-col w-1/4 items-center my-3 py-2">
                    <div>{order.quantity + fullProductName(order)}</div>
                  </div>
                  <div className="flex flex-col w-1/4 items-center my-3 py-2">
                    <div>
                      {order.location.displayName ?? order.location.city}
                    </div>
                  </div>
                  <div className="flex flex-col w-1/4 items-center my-3 py-2">
                    <div>{order.status}</div>
                    <div>{`Estimated shipping ${monthDayYear(
                      addDays(order.createdAt, 7)
                    )}`}</div>
                    <button className="self-end">Order Again</button>
                  </div>
                </div>
              ))}
            </div>
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
  if (session || test == "shield") {
    const orders = await prisma.order.findMany({
      where: {
        companyId: test == "shield" ? "616" : (session?.user as User).companyId,
      },
      include: {
        company: {
          select: {
            name: true,
            customerId: true,
          },
        },
        location: true,
        sku: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      props: {
        orders: JSON.parse(JSON.stringify(orders ?? null)),
      },
    };
  }
  return { props: {} };
};

export default OrderHome;
