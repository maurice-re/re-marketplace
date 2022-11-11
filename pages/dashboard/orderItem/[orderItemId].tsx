import { OrderItem } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../constants/prisma";
import { authOptions } from "../../api/auth/[...nextauth]";

type OrderItemProps = {
  orderItem: OrderItem | null;
};

const OrderItemPage: NextPage<OrderItemProps> = ({
  orderItem,
}: OrderItemProps) => {
  if (orderItem == null) {
    return (
      <div className="w-full h-screen bg-black flex overflow-hidden">
        <head>
          <title>Order Not Found</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <main className="text-xl text-white flex items-center">
          <h1 className="mx-auto">This orderItem does not exist</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black flex overflow-hidden">
      <head>
        <title>Find your perfect setup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <main className="flex flex-col container mx-auto my-auto items-center py-4 text-white">
        <h1>{`Order: ${orderItem.id}`}</h1>
        <div>{`Order was placed on ${orderItem.createdAt}`}</div>
        <div>{`Order status is ${orderItem.status.toLowerCase()}`}</div>
        <div>{`Order amount was ${orderItem.amount}`}</div>
        <div>{`Order was for ${orderItem.skuId}`}</div>
        <div>{`Order was sent to ${orderItem.locationId}`}</div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderItemId } = context.query;
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session && typeof orderItemId == "string") {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: orderItemId,
      },
    });
    return {
      props: {
        orderItem: JSON.parse(JSON.stringify(orderItem ?? null)),
      },
    };
  }
  return { props: {} };
};

export default OrderItemPage;
