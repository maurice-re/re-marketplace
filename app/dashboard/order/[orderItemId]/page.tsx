import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../../../constants/prisma";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import {
  OrderItemSku,
  OrderLocation,
} from "../../../../utils/dashboard/dashboardUtils";
import { getOrderString } from "../../../../utils/dashboard/orderStringUtils";

export default async function Page({
  params,
}: {
  params: { orderItemId: string };
}) {
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    //TODO: redirect to login
    return <div>Not logged in</div>;
  }

  const { orderItemId } = params;

  const orderItem: OrderItemSku | null = await prisma.orderItem.findFirst({
    where: {
      id: orderItemId,
    },
    include: {
      sku: {
        include: {
          product: true,
        },
      },
    },
  });

  const orderId = orderItem?.orderId;

  const order: OrderLocation | null = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      location: true,
    },
  });

  if (orderItem == null || order == null) {
    return (
      <div className="w-full h-screen bg-re-black flex overflow-hidden">
        <main className="text-xl text-white flex items-center">
          <h1 className="mx-auto">This orderItem does not exist</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <main className="flex flex-col w-full text-white font-theinhardt bg-re-black">
        <div className="flex w-full border-b-1/2 border-re-gray-300 py-2 px-1">
          <Link href="dashboard/order" replace>
            <div className="pl-6">{`< Orders/${orderItemId}`}</div>
          </Link>
        </div>
        <div className="flex bg-re-dark-green-500 h-full w-full p-6 overflow-scroll">
          <div className="flex flex-col mx-auto font-theinhardt">
            <div className="flex">
              <div className="text-re-gray-text">Order ID:</div>
              <div className="w-1" />
              <div>{orderItem.id}</div>
            </div>
            <div className="flex w-[29rem] bg-re-dark-green-600 rounded justify-between">
              <Image
                src={orderItem.sku.product.mainImage}
                alt={orderItem.sku.product.name}
                width={224}
                height={224}
                className="rounded m-5"
              />
              <div className="flex w-64">
                <div className="h-full w-px bg-re-gray-300" />
                <div className="flex flex-col border-re-gray-300 w-full">
                  <div className="flex justify-between p-3">
                    <div className="text-re-gray-text">Item</div>
                    <div>{orderItem.sku.product.name}</div>
                  </div>
                  <div className="h-px w-full bg-re-gray-300" />
                  <div className="flex flex-col p-3">
                    <div className="flex justify-between">
                      <div className="text-re-gray-text">Size</div>
                      <div>{orderItem.sku.size}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-re-gray-text">Material</div>
                      <div>{orderItem.sku.materialShort}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-re-gray-text">Quantity</div>
                      <div>{orderItem.quantity}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-re-gray-text">Location</div>
                      <div>
                        {order.location.displayName ?? order.location.city}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-re-gray-text">Shipping</div>
                      <div>{orderItem.status}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-re-gray-text">Status</div>
                      <div>{orderItem.status}</div>
                    </div>
                  </div>
                  <Link
                    href={{
                      pathname: "checkout",
                      query: {
                        orderString: getOrderString(undefined, orderItem),
                      },
                    }}
                    className="m-3"
                  >
                    <button className="bg-re-blue-500 hover:bg-re-blue-400 active:bg-re-blue-300 rounded p-2 w-full">
                      Order Again
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
