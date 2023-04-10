import { OrderItem, Status } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import {
  SkuProduct,
  addDays,
  skuName,
} from "../../../utils/dashboard/dashboardUtils";
import { getOrderString } from "../../../utils/dashboard/orderStringUtils";
import { FullOrder } from "../../server-store";

export default function OrderTracking({
  orders,
  skus,
}: {
  orders: FullOrder[];
  skus: SkuProduct[];
}) {
  function getEstimation(item: OrderItem): string {
    if (item.status == Status.SUBMITTED) {
      return `Est. manufacturing ${addDays(
        item.createdAt,
        20
      ).toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
      })}`;
    } else {
      return `Est. shipping ${addDays(item.createdAt, 7).toLocaleDateString(
        "en-us",
        {
          month: "short",
          day: "numeric",
        }
      )}`;
    }
  }

  const incompleteOrders = orders.filter(
    (order) => order.status != Status.COMPLETED
  );
  const statuses: Status[] = Object.values(Status).slice(1, -1);

  return (
    <>
      {incompleteOrders.map((order) => {
        const progress: Status[] = statuses
          .slice(0)
          .splice(0, statuses.slice(0).indexOf(incompleteOrders[0].status) + 1);
        return (
          <div
            className="flex flex-col bg-re-dark-green-300 border border-re-gray-300 rounded-md items-start"
            key={order.id}
          >
            <div className="flex justify-between w-full items-center p-4">
              <h1 className=" text-white font-theinhardt text-xl">
                <span>Order In Progress</span>
                <span className="text-xl"> – </span>
                <span className="text-xl">
                  {`${new Date(order.createdAt).toLocaleDateString("en-us", {
                    day: "numeric",
                    month: "short",
                  })}`}
                </span>
              </h1>
              <Link
                href={{
                  pathname: "/checkout",
                  query: {
                    orderString: getOrderString(order),
                  },
                }}
              >
                <button className=" px-4 py-2 bg-re-purple-500 rounded text-white hover:bg-re-purple-600">
                  Order Again
                </button>
              </Link>
            </div>
            <div className="h-px bg-re-gray-300 mb-2 w-full" />
            <ul className="steps w-full my-3">
              {statuses.map((status, index) => (
                <li
                  key={index}
                  className={`step text-xs leading-tight ${
                    progress.includes(status) ? "step-accent" : ""
                  }`}
                >
                  {status.replace(/_/, " ")}
                </li>
              ))}
            </ul>
            <div className="flex flex-col w-full p-4">
              {order.items.map((item: OrderItem, index: number) => {
                const sku = skus.find((sku) => sku.id == item.skuId);
                return (
                  <div key={item.id + "items"}>
                    <div className="flex justify-between mt-1 mb-3">
                      <h2 className="text-xl font-theinhardt">
                        {order.location.displayName ?? order.location.city}
                      </h2>
                      <h3 className="text-lg font-theinhardt-300">{`$${order.items.reduce(
                        (prev: number, curr: OrderItem) => prev + curr.amount,
                        0
                      )}`}</h3>
                    </div>
                    <div className="flex justify-between">
                      <div
                        className={`flex items-center ${
                          index + 1 != order.items.length ? "mb-3" : ""
                        }`}
                      >
                        <Image
                          src={sku?.mainImage ?? ""}
                          height={96}
                          width={96}
                          alt={skuName(sku)}
                          className="rounded"
                        />
                        <div className="flex-col text-start ml-4">
                          <div className="text-base font-theinhardt">
                            {sku?.product.name}
                          </div>
                          <div className="text-sm font-theinhardt-300">
                            {`${sku?.size} | ${sku?.materialShort}`}
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
                            {getEstimation(item)}
                          </div>
                        </div>
                        <div className="flex items-center ml-14">
                          <Link
                            href={{
                              pathname: "/checkout",
                              query: {
                                orderString: getOrderString(
                                  undefined,
                                  item,
                                  order.location.id
                                ),
                              },
                            }}
                          >
                            <button className="px-3 py-2 bg-re-purple-500 text-xs hover:bg-re-purple-600 rounded">
                              Re-order
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
