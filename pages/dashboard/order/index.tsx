import { User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { GoSearch } from "react-icons/go";
import Sidebar from "../../../components/dashboard/sidebar";
import prisma from "../../../constants/prisma";
import {
  dayMonthYear,
  OrderCustomerLocation,
} from "../../../utils/dashboard/dashboardUtils";
import { authOptions } from "../../api/auth/[...nextauth]";
type OrderProps = {
  orders: OrderCustomerLocation[];
};

const OrderHome: NextPage<OrderProps> = ({ orders }: OrderProps) => {
  if (!orders || orders.length == 0) {
    return (
      <Sidebar>
        <div className="w-screen h-screen bg-black flex">
          <Head>
            <title>Locations</title>
            <meta name="locations" content="Manage locations" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
            <div className="text-white font-theinhardt text-28">
              No Orders Placed
            </div>
          </main>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="w-screen h-screen bg-black flex overflow-hidden">
        <Head>
          <title>Orders</title>
          <meta name="orders" content="Manage your orders" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col container mx-auto py-6 px-1 w-full text-white font-theinhardt">
          <div className="flex justify-between">
            <h1 className="font-theinhardt text-3xl">Orders</h1>
            <h1 className="font-theinhardt text-3xl">
              {orders[0].company.name}
            </h1>
          </div>
          <div className="form-control mx-auto my-4">
            <div className="input-group w-96">
              <input
                type="text"
                placeholder="Search for an order"
                className="input text-md w-5/6"
              />
              <button className="btn btn-square w-1/6">
                <GoSearch size={20} />
              </button>
            </div>
          </div>
          <div className="max-h-full bg-re-gray-500 bg-opacity-70 rounded-10 my-4 px-8 grid grid-cols-3 gap-8 overflow-y-auto py-1 items-stretch">
            {orders.map((order) => (
              <div
                key={order.id}
                className="card w-full h-72 my-3 bg-base-100 shadow-xl font-theinhardt justify-center"
              >
                <div className="card-body justify-center">
                  <h2 className="card-title leading-none">
                    {dayMonthYear(order.createdAt)}
                  </h2>
                  <div className="flex w-full leading-none">{`Order ID: ${order.id}`}</div>
                  <div className="h-px bg-white my-1 w-full" />
                  <div className="flex flex-col w-full">
                    <div>{order.quantity + " " + order.sku.product.name}</div>
                    <div className="font-theinhardt-300 text-sm text-gray-200 leading-none">
                      {order.sku.size + " | " + order.sku.materialShort}
                    </div>
                  </div>
                  <div className="flex w-full">
                    {order.location.displayName ?? order.location.city}
                  </div>
                  <div className="flex items-center text-sm font-theinhardt-300 gap-1">
                    <div className="text-re-green-600">{order.status}</div>
                    <div className="text-gray-200">
                      {` — Est. shipping ${new Date(
                        order.createdAt
                      ).toLocaleDateString("en-us", {
                        day: "numeric",
                        month: "short",
                      })}`}
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <Link
                      href={{
                        pathname: "/dashboard/checkout",
                        query: { orderId: order.id },
                      }}
                    >
                      <button className="btn btn-sm btn-accent btn-outline font-theinhardt-500 text-xs tracking-wide">
                        Re-order
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
    const orders = await prisma.order.findMany({
      where: {
        companyId: (session?.user as User).companyId,
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
            product: true,
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
