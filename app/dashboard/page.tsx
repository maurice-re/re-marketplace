import { Location, Order, Status } from "@prisma/client";
import { Session, unstable_getServerSession } from "next-auth";
import prisma from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import {
  SkuProduct,
  UserOrderItems,
} from "../../utils/dashboard/dashboardUtils";
import Home from "./home";

async function getLocations(user: UserOrderItems) {
  const locations = await prisma.location.findMany({
    where: {
      companyId: user?.companyId,
    },
  });
  return JSON.parse(JSON.stringify(locations));
}

async function getUser(session: Session) {
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
  return JSON.parse(JSON.stringify(user));
}

async function getSkus() {
  const skus = await prisma.sku.findMany({
    include: {
      product: true,
    },
  });
  return JSON.parse(JSON.stringify(skus));
}

async function getIncompleteOrders(user: UserOrderItems) {
  const orders = await prisma.order.findMany({
    where: {
      companyId: user.companyId ?? "",
      NOT: {
        status: Status.COMPLETED,
      },
    },
    include: {
      company: true,
    },
  });
  return JSON.parse(JSON.stringify(orders));
}

async function getCompleteOrders(user: UserOrderItems) {
  const orders = await prisma.order.findMany({
    where: {
      companyId: user.companyId ?? "",
      status: Status.COMPLETED,
    },
  });
  return JSON.parse(JSON.stringify(orders));
}

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    //TODO: redirect to login
    return <div>Not logged in</div>;
  }
  const user: UserOrderItems = await getUser(session);
  const locations: Location[] = await getLocations(user);
  const skus: SkuProduct[] = await getSkus();
  const incompleteOrders: [Order] = await getIncompleteOrders(user);
  const completeOrders: [Order] = await getCompleteOrders(user);

  const hasCompleteOrder: boolean =
    completeOrders.length > 0 || user.companyId === "616";
  const hasIncompleteOrder: boolean = incompleteOrders.length > 0;

  return (
    <Home
      locations={locations}
      user={user}
      skus={skus}
      hasCompleteOrder={hasCompleteOrder}
      hasIncompleteOrder={hasIncompleteOrder}
    />
  );
}
