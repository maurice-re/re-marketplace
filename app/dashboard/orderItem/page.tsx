import { Company, User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { GoSearch } from "react-icons/go";
import prisma from "../../../constants/prisma";
import {
  dayMonthYear,
  ItemLocationSku,
} from "../../../utils/dashboard/dashboardUtils";
import { getOrderString } from "../../../utils/dashboard/orderStringUtils";
import { getItemsFromOrder } from "../../../utils/prisma/dbUtils";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    //TODO: redirect to login
    return <div>Not logged in</div>;
  }

  const user = session.user as User;

  const orders = await prisma.order.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
      company: true,
      items: {
        include: {
          sku: true,
          location: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const company: Company = orders[0].company;
  const orderItems: ItemLocationSku[] = getItemsFromOrder(orders);

  if (!orderItems || orderItems.length == 0 || !company) {
    return (
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
    );
  }

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      <Head>
        <title>Orders</title>
        <meta name="orders" content="Manage your orders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col container mx-auto py-6 px-1 w-full text-white font-theinhardt">
        <div className="flex justify-between">
          <h1 className="font-theinhardt text-3xl">Orders</h1>
          <h1 className="font-theinhardt text-3xl">{company.name}</h1>
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
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="card w-full h-72 my-3 bg-base-100 shadow-xl font-theinhardt justify-center"
            >
              <div className="card-body justify-center">
                <h2 className="card-title leading-none">
                  {dayMonthYear(item.createdAt)}
                </h2>
                <div className="flex w-full leading-none">{`Order Item ID: ${item.id}`}</div>
                <div className="h-px bg-white my-1 w-full" />
                <div className="flex flex-col w-full">
                  <div>
                    {item.quantity +
                      " " +
                      (item.sku.id.startsWith("SC") ? "SwapCup" : "SwapBox")}
                  </div>
                  <div className="font-theinhardt-300 text-sm text-gray-200 leading-none">
                    {item.sku.size + " | " + item.sku.materialShort}
                  </div>
                </div>
                <div className="flex w-full">
                  {item.location.displayName ?? item.location.city}
                </div>
                <div className="flex items-center text-sm font-theinhardt-300 gap-1">
                  <div className="text-re-green-600">{item.status}</div>
                  <div className="text-gray-200">
                    {` — Est. shipping ${new Date(
                      item.createdAt
                    ).toLocaleDateString("en-us", {
                      day: "numeric",
                      month: "short",
                    })}`}
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <Link
                    href={{
                      pathname: "/checkout",
                      query: { orderString: getOrderString(undefined, item) },
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
  );
};