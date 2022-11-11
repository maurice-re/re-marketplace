import { Location, Order, Status } from "@prisma/client";
import { Session, unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import {
  SkuProduct,
  UserOrderItems,
} from "../../utils/dashboard/dashboardUtils";
import HomeContent from "./homeContent";

async function getUser(session: Session): Promise<UserOrderItems> {
  const user = (await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      company: {
        select: {
          name: true,
          customerId: true,
        },
      },
      orders: {
        take: 1,
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
  })) as UserOrderItems;
  return user!;
}
async function getIncompleteOrders(user: UserOrderItems): Promise<Order[]> {
  return await prisma.order.findMany({
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
}

async function getCompleteOrders(user: UserOrderItems): Promise<Order[]> {
  return await prisma.order.findMany({
    where: {
      companyId: user.companyId ?? "",
      status: Status.COMPLETED,
    },
  });
}

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (!session || !session.user) {
    //TODO redirect to signin
    redirect("/form/location");
  }
  const user: UserOrderItems | null = await getUser(session);
  const locations: Location[] = await prisma.location.findMany({
    where: {
      companyId: user?.companyId,
    },
  });
  const skus: SkuProduct[] = await prisma.sku.findMany({
    include: {
      product: true,
    },
  });
  const incompleteOrders: Order[] = await getIncompleteOrders(user);
  const completeOrders: Order[] = await getCompleteOrders(user);

  const hasCompleteOrder: boolean =
    completeOrders.length > 0 || user.companyId === "616";
  const hasIncompleteOrder: boolean = incompleteOrders.length > 0;

  return (
    <HomeContent
      locations={locations}
      user={JSON.parse(JSON.stringify(user))}
      skus={skus}
      hasCompleteOrder={hasCompleteOrder}
      hasIncompleteOrder={hasIncompleteOrder}
    />
  );
}
