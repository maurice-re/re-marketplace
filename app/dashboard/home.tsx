"use client";
import { signOut } from "next-auth/react";
import {
  addDays,
  ItemLocationSku,
  ItemLocationSkuProduct,
  separateByLocationId,
  skuName,
  SkuProduct,
  UserOrderItems,
} from "../../utils/dashboard/dashboardUtils";

import { Location } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { getOrderString } from "../../utils/dashboard/orderStringUtils";
import QuickOrder from "./quickOrder";

function Home({
  locations,
  user,
  skus,
  hasCompleteOrder,
  hasIncompleteOrder,
}: {
  locations: Location[];
  user: UserOrderItems;
  skus: SkuProduct[];
  hasCompleteOrder: boolean;
  hasIncompleteOrder: boolean;
}) {
  //TODO(Suhana): Create sub components once used in app/
  if (hasCompleteOrder) {
    return (
      <div className="w-full h-screen w-7/8 bg-black flex overflow-auto">
        {/* {head} */}
        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
          <div className="flex justify-between px-1">
            <h1 className="ml-1 font-theinhardt text-3xl">{`Hi ${
              user.companyId === "616" ? "Agent Coulson" : user.firstName
            }!`}</h1>
            <div className="flex items-center">
              <h1 className=" font-theinhardt text-3xl">Dashboard</h1>
              <div className="bg-white w-px h-5/6 mx-2" />
              <h1 className=" font-theinhardt text-3xl">{user.company.name}</h1>
              <button
                className="ml-6 px-4 py-1 bg-re-gray-400 rounded-10 text-white hover:bg-re-green-600 hover:text-black"
                onClick={() => signOut({ callbackUrl: "/form/location" })}
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col w-3/5 justify-between pb-4">
              <div className="flex flex-col my-4 mx-1 px-4 py-4 bg-re-gray-500 bg-opacity-70 rounded-2xl items-start">
                <div className="flex justify-between w-full items-start">
                  <h1 className=" text-re-green-500 font-theinhardt text-2xl mb-2">
                    <span>Latest Order</span>
                    <span className="text-xl"> – </span>
                    <span className="text-xl">
                      {`${new Date(user.orders[0].createdAt).toLocaleDateString(
                        "en-us",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}`}
                    </span>
                  </h1>
                  <Link
                    href={{
                      pathname: "/checkout",
                      query: { orderString: getOrderString(user.orders[0]) },
                    }}
                  >
                    <button className=" px-4 py-1 bg-re-gray-400 rounded-10 text-white hover:bg-re-green-600 hover:text-black">
                      Order Again
                    </button>
                  </Link>
                </div>
                <div className="h-px bg-white mb-2 w-full" />
                <div className="flex flex-col w-full">
                  {separateByLocationId(user.orders[0].items).map(
                    (arr, index) => (
                      <div key={arr[0].locationId}>
                        <div className="flex justify-between mt-1 mb-3">
                          <h2 className="text-xl font-theinhardt">
                            {(arr[0] as ItemLocationSku).location.displayName ??
                              (arr[0] as ItemLocationSku).location.city}
                          </h2>
                          <h3 className="text-lg font-theinhardt-300">{`$${arr.reduce(
                            (prev, curr) => prev + curr.amount,
                            0
                          )}`}</h3>
                        </div>
                        {arr.map((item) => (
                          <div
                            className="flex justify-between"
                            key={item.id + "items"}
                          >
                            <div
                              className={`flex items-center ${
                                index + 1 != arr.length ? "mb-3" : ""
                              }`}
                            >
                              <Image
                                src={
                                  (item as ItemLocationSkuProduct).sku.mainImage
                                }
                                height={96}
                                width={96}
                                alt={skuName(
                                  (item as ItemLocationSkuProduct).sku
                                )}
                                className="rounded"
                              />
                              <div className="flex-col text-start ml-4">
                                <div className="text-base font-theinhardt">
                                  {
                                    (item as ItemLocationSkuProduct).sku.product
                                      .name
                                  }
                                </div>
                                <div className="text-sm font-theinhardt-300">
                                  {`${
                                    (item as ItemLocationSkuProduct).sku.size
                                  } | ${
                                    (item as ItemLocationSkuProduct).sku
                                      .materialShort
                                  }`}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center font-theinhardt-300 text-md">{`x ${item.quantity}`}</div>
                            <div className="flex mb-3 items-center">
                              <div className="flex-col justify-center text-center">
                                <div className="font-theinhardt uppercase tracking-wide text-xs text-re-green-600">
                                  {item.status}
                                </div>
                                <div className=" text-xs font-theinhardt-300">
                                  {`Est. shipping ${addDays(
                                    item.createdAt,
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
                                    pathname: "/checkout",
                                    query: {
                                      orderString: getOrderString(
                                        undefined,
                                        item
                                      ),
                                    },
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
                                  onClick={undefined}
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
                companyId={user.companyId}
                customerId={user.company.customerId}
                locations={locations}
                skus={skus}
                userId={user.id}
              />
            </div>
            <div className="flex flex-col my-4 ml-4 mr-1 px-4 py-4 w-2/5 bg-re-gray-500 bg-opacity-70 rounded-2xl justify-center items-center font-theinhardt text-2xl h-5/6 self-center">
              <div>Set up tracking</div>
              <Link href={"/api-doc"}>
                <button className=" bg-re-gray-400 rounded-10 text-white px-2 py-2 font-theinhardt my-2 hover:bg-re-green-600 hover:text-black text-base">
                  Get started
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  } else if (hasIncompleteOrder) {
    return (
      <div className="w-full h-screen w-7/8 bg-black flex overflow-auto">
        {/* {head} */}
        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
          <div className="flex justify-between px-1">
            <h1 className="ml-1 font-theinhardt text-3xl">{`Hi ${
              user.companyId == "616" ? "Agent Coulson" : user.firstName
            }!`}</h1>
            <div className="flex items-center">
              <h1 className=" font-theinhardt text-3xl">Dashboard</h1>
              <div className="bg-white w-px h-5/6 mx-2" />
              <h1 className=" font-theinhardt text-3xl">{user.company.name}</h1>
              <button
                className="ml-6 px-4 py-1 bg-re-gray-400 rounded-10 text-white hover:bg-re-green-600 hover:text-black"
                onClick={() => signOut({ callbackUrl: "/form/location" })}
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="alert alert-success shadow-lg mt-8 mb-6">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Your order has been{" "}
                  {user.orders[user.orders.length - 1].status.toLowerCase()}!
                </span>
              </div>
            </div>
            <div className="flex w-full justify-between pb-4">
              <div className="flex w-3/5 flex-col my-4 mx-1 px-4 py-4 bg-re-gray-500 bg-opacity-70 rounded-2xl items-start">
                <div className="flex justify-between w-full items-start">
                  <h1 className=" text-re-green-500 font-theinhardt text-2xl mb-2">
                    <span>Latest Order</span>
                    <span className="text-xl"> – </span>
                    <span className="text-xl">
                      {`${new Date(user.orders[0].createdAt).toLocaleDateString(
                        "en-us",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}`}
                    </span>
                  </h1>
                  <Link
                    href={{
                      pathname: "/checkout",
                      query: { orderString: getOrderString(user.orders[0]) },
                    }}
                  >
                    <button className=" px-4 py-1 bg-re-gray-400 rounded-10 text-white hover:bg-re-green-600 hover:text-black">
                      Order Again
                    </button>
                  </Link>
                </div>
                <div className="h-px bg-white mb-2 w-full" />
                <div className="flex flex-col w-full">
                  {separateByLocationId(user.orders[0].items).map(
                    (arr, index) => (
                      <div key={arr[0].locationId}>
                        <div className="flex justify-between mt-1 mb-3">
                          <h2 className="text-xl font-theinhardt">
                            {(arr[0] as ItemLocationSku).location.displayName ??
                              (arr[0] as ItemLocationSku).location.city}
                          </h2>
                          <h3 className="text-lg font-theinhardt-300">{`$${arr.reduce(
                            (prev, curr) => prev + curr.amount,
                            0
                          )}`}</h3>
                        </div>
                        {arr.map((item) => (
                          <div
                            className="flex justify-between"
                            key={item.id + "items"}
                          >
                            <div
                              className={`flex items-center ${
                                index + 1 != arr.length ? "mb-3" : ""
                              }`}
                            >
                              <Image
                                src={
                                  (item as ItemLocationSkuProduct).sku.mainImage
                                }
                                height={96}
                                width={96}
                                alt={skuName(
                                  (item as ItemLocationSkuProduct).sku
                                )}
                                className="rounded"
                              />
                              <div className="flex-col text-start ml-4">
                                <div className="text-base font-theinhardt">
                                  {
                                    (item as ItemLocationSkuProduct).sku.product
                                      .name
                                  }
                                </div>
                                <div className="text-sm font-theinhardt-300">
                                  {`${
                                    (item as ItemLocationSkuProduct).sku.size
                                  } | ${
                                    (item as ItemLocationSkuProduct).sku
                                      .materialShort
                                  }`}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center font-theinhardt-300 text-md">{`x ${item.quantity}`}</div>
                            <div className="flex mb-3 items-center">
                              <div className="flex-col justify-center text-center">
                                <div className="font-theinhardt uppercase tracking-wide text-xs text-re-green-600">
                                  {item.status}
                                </div>
                                <div className=" text-xs font-theinhardt-300">
                                  {`Est. shipping ${addDays(
                                    item.createdAt,
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
                                    pathname: "/checkout",
                                    query: {
                                      orderString: getOrderString(
                                        undefined,
                                        item
                                      ),
                                    },
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
                                  onClick={undefined}
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
              <div className="flex mt-4 w-2/5">
                <div className="flex flex-col ml-4 mr-1 px-4 py-4 gap-4 w-full bg-re-gray-500 bg-opacity-70 rounded-2xl justify-center items-center font-theinhardt text-2xl">
                  <div>Demo the tracking experience</div>
                  <button className="btn btn-primary mt-4">Visit</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    return (
      <div className="w-full h-screen w-7/8 bg-black flex overflow-auto">
        {/* {head} */}
        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
          <div className="flex justify-between px-1">
            <h1 className="ml-1 font-theinhardt text-3xl">{`Hi ${
              user.companyId == "616" ? "Agent Coulson" : user.firstName
            }!`}</h1>
            <div className="flex items-center">
              <h1 className=" font-theinhardt text-3xl">Dashboard</h1>
              <div className="bg-white w-px h-5/6 mx-2" />
              <h1 className=" font-theinhardt text-3xl">{user.company.name}</h1>
              <button
                className="ml-6 px-4 py-1 bg-re-gray-400 rounded-10 text-white hover:bg-re-green-600 hover:text-black"
                onClick={() => signOut({ callbackUrl: "/form/location" })}
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex mt-4">
            <div className="flex flex-col w-3/5 justify-between pb-4">
              <QuickOrder
                companyId={user.companyId}
                customerId={user.company.customerId}
                locations={locations}
                skus={skus}
                userId={user.id}
              />
            </div>
            <div className="flex flex-col my-4 ml-4 mr-1 px-4 py-4 w-2/5 bg-re-gray-500 bg-opacity-70 rounded-2xl justify-center items-center font-theinhardt text-2xl">
              <div>Set up tracking</div>
              <Link href={"/api-doc"}>
                <button className=" bg-re-gray-400 rounded-10 text-white px-2 py-2 font-theinhardt my-2 hover:bg-re-green-600 hover:text-black text-base">
                  Get started
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
export default Home;
