import { Location, Status } from "@prisma/client";
import { Session, unstable_getServerSession } from "next-auth";
import prisma from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import {
  OrderItemLocationName,
  SkuProduct,
  UserCompany,
} from "../../utils/dashboard/dashboardUtils";
import Home from "./home";

async function getLocations(user: UserCompany) {
  const locations = await prisma.location.findMany({
    where: {
      companyId: user?.companyId,
    },
  });
  return JSON.parse(JSON.stringify(locations));
}

async function getUser(session: Session): Promise<UserCompany> {
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
    include: {
      company: true,
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

async function getOrders(user: UserCompany): Promise<OrderItemLocationName[]> {
  const orders = await prisma.order.findMany({
    where: {
      companyId: user.companyId ?? "",
    },
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
  });
  return JSON.parse(JSON.stringify(orders));
}

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    //TODO: redirect to login
    return <div>Not logged in</div>;
  }
  const user: UserCompany = await getUser(session);
  const locations: Location[] = await getLocations(user);
  const skus: SkuProduct[] = await getSkus();
  const orders = await getOrders(user);

  const completeOrders = orders.filter(
    (order) => order.status === Status.COMPLETED
  );
  const incompleteOrders = orders.filter(
    (order) => order.status !== Status.COMPLETED
  );

  const hasCompleteOrder: boolean =
    completeOrders.length > 0 || user.companyId === "616";
  const hasIncompleteOrder: boolean = incompleteOrders.length > 0;

  return (
    <Home
      locations={locations}
      orders={orders}
      user={user}
      skus={skus}
      hasCompleteOrder={hasCompleteOrder}
      hasIncompleteOrder={hasIncompleteOrder}
    />
  );
}
