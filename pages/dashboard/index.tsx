import { Location, Order, Transaction, User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import QuickOrder from "../../components/dashboard/quickOrder";
import Sidebar from "../../components/dashboard/sidebar";
import prisma from "../../constants/prisma";
import {
  addDays,
  separateByLocationId,
  skuName,
  SkuProduct,
} from "../../utils/dashboard/dashboardUtils";
import { make20Ids } from "../../utils/prisma/seedUtils";
import { authOptions } from "../api/auth/[...nextauth]";

type UserTransactionOrder = User & {
  company: {
    name: string;
    customerId: string;
  };
  transactions: (Transaction & {
    orders: (Order & {
      sku: SkuProduct;
      location: {
        displayName: string | null;
        city: string;
      };
    })[];
  })[];
};

type HomeProps = {
  locations: Location[];
  skus: SkuProduct[];
  user: UserTransactionOrder;
};

const Home: NextPage<HomeProps> = ({ locations, skus, user }: HomeProps) => {
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const router = useRouter();

  function handleLogin() {
    signIn("email", { redirect: false, email: email });
  }

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/");
  }

  const locationsOrdered = separateByLocationId(user.transactions[0].orders);
  console.log(locationsOrdered);

  const head = (
    <Head>
      <title>Dashboard</title>
      <meta name="dashboard" content="Manage your dashboard" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
  if (user) {
    return (
      <Sidebar>
        <div className="w-full h-screen bg-black flex overflow-auto">
          {head}
          <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
            <div className="flex justify-between px-1">
              <div className="flex">
                <h1 className=" font-theinhardt text-3xl">{`Hi ${
                  user.firstName == "Phil" ? "Agent Coulson" : user.firstName
                }!`}</h1>
                <button
                  className="ml-4 px-2 bg-re-gray-400 rounded-10 text-white hover:bg-re-green-600 hover:text-black"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
              <div className="flex items-center">
                <h1 className=" font-theinhardt text-3xl">Dashboard</h1>
                <div className="bg-white w-px h-5/6 mx-2" />
                <h1 className=" font-theinhardt text-3xl">
                  {user.company.name}
                </h1>
              </div>
            </div>
            <div className="flex overflow-auto">
              <div className="flex flex-col w-3/5 justify-between pb-4">
                <div className="flex flex-col my-4 mx-1 px-4 py-4 bg-re-gray-500 bg-opacity-70 rounded-2xl items-start">
                  <div className="flex justify-between w-full items-start">
                    <h1 className=" text-re-green-500 font-theinhardt text-2xl mb-2">
                      <span>Latest Transaction</span>
                      <span className="text-xl"> – </span>
                      <span className="text-xl">
                        {`${new Date(
                          user.transactions[0].createdAt
                        ).toLocaleDateString("en-us", {
                          day: "numeric",
                          month: "short",
                        })}`}
                      </span>
                    </h1>
                    <Link
                      href={{
                        pathname: "/dashboard/checkout",
                        query: { transactionId: user.transactions[0].id },
                      }}
                    >
                      <button className=" px-4 py-1 bg-re-gray-400 rounded-10 text-white hover:bg-re-green-600 hover:text-black">
                        Order Again
                      </button>
                    </Link>
                  </div>
                  <div className="h-px bg-white mb-2 w-full" />
                  <div className="flex flex-col w-full">
                    {separateByLocationId(user.transactions[0].orders).map(
                      (arr, index) => (
                        <div key={arr[0].locationId}>
                          <div className="flex justify-between mt-1 mb-3">
                            <h2 className="text-xl font-theinhardt">
                              {arr[0].location.displayName ??
                                arr[0].location.city}
                            </h2>
                            <h3 className="text-lg font-theinhardt-300">{`\$${arr.reduce(
                              (prev, curr) => prev + curr.amount,
                              0
                            )}`}</h3>
                          </div>
                          {arr.map((o, i) => (
                            <div
                              className="flex justify-between"
                              key={o.id + "items"}
                            >
                              <div
                                className={`flex items-center ${
                                  index + 1 != arr.length ? "mb-3" : ""
                                }`}
                              >
                                <Image
                                  src={o.sku.mainImage}
                                  height={96}
                                  width={96}
                                  alt={skuName(o.sku)}
                                  className="rounded"
                                />
                                <div className="flex-col text-start ml-4">
                                  <div className="text-base font-theinhardt">
                                    {o.sku.product.name}
                                  </div>
                                  <div className="text-sm font-theinhardt-300">
                                    {`${o.sku.size} | ${o.sku.materialShort}`}
                                  </div>
                                </div>
                              </div>
                                <div className="flex items-center font-theinhardt-300 text-md">{`x ${o.quantity}`}</div>
                              <div className="flex mb-3 items-center">
                                <div className="flex-col justify-center text-center">
                                  <div className="font-theinhardt uppercase tracking-wide text-xs text-re-green-600">
                                    {o.status}
                                  </div>
                                  <div className=" text-xs font-theinhardt-300">
                                    {`Est. shipping ${addDays(
                                      o.createdAt,
                                      7
                                    ).toLocaleDateString("en-us", {
                                      month: "short",
                                      day: "numeric",
                                    })}`}
                                  </div>
                                </div>
                                <div className="flex items-center mx-6">
                                  <Link
                                    href={{
                                      pathname: "/dashboard/checkout",
                                      query: { orderId: o.id },
                                    }}
                                  >
                                    <button className="px-3 py-2 bg-re-gray-400 rounded-10 text-xs hover:bg-re-green-600 hover:text-black">
                                      Re-order
                                    </button>
                                  </Link>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    className="flex items-center flex-col justify-center px-3 py-2 bg-re-gray-400 rounded-10 text-xs bg-opacity-40"
                                    onClick={() => make20Ids()}
                                    disabled
                                  >
                                    Schedule
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <QuickOrder
                  userId={user.id}
                  customerId={user.company.customerId}
                  locations={locations}
                  skus={skus}
                />
              </div>
              <div className="flex flex-col my-4 ml-4 mr-1 px-4 py-4 w-2/5 bg-re-gray-500 bg-opacity-70 rounded-2xl justify-center items-center font-theinhardt text-2xl h-5/6 self-center">
                <div>Set up tracking</div>
                <button className=" bg-re-gray-400 rounded-10 text-white px-2 py-2 font-theinhardt my-2 hover:bg-re-green-600 hover:text-black text-base">
                  Get started
                </button>
              </div>
            </div>
          </main>
        </div>
      </Sidebar>
    );
  }

  return (
    <div className="w-screen h-screen bg-black flex overflow-hidden">
      {head}

      <main className="flex flex-col container mx-auto my-auto items-center py-4 text-white">
        <div>
          <input
            name={"Email"}
            className="p-1 border-2 text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 rounded mb-4"
            type="text"
            value={email}
            placeholder={"Email"}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className=" w-full px-2 py-3 border-2 rounded-10 hover:border-re-green-500 text-lg"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
        transactions: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            orders: {
              include: {
                company: {
                  select: {
                    customerId: true,
                  },
                },
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
    const skus = await prisma.sku.findMany({
      include: {
        product: true,
      },
    });

    const locations = await prisma.location.findMany({
      where: {
        companyId: user?.companyId,
      },
    });
    return {
      props: {
        locations: JSON.parse(JSON.stringify(locations)),
        skus: JSON.parse(JSON.stringify(skus)),
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  }
  return { props: {} };
};

export default Home;
