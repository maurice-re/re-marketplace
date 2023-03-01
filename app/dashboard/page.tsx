import { Company, Location, Status, User } from "@prisma/client";
import { FullLocation, OrderWithItems, useServerStore } from "../server-store";
import Home from "./home";

export default async function Page() {
  const user: User = await useServerStore.getState().getUser();
  const locations: FullLocation[] = await useServerStore.getState().getLocations(true);
  const orders: OrderWithItems[] = await useServerStore.getState().getOrders();
  const company = await useServerStore.getState().getCompany();
  const skus = await useServerStore.getState().getSkus();

  const completeOrders = orders.filter(
    (order: OrderWithItems) => order.status === Status.COMPLETED
  );
  const incompleteOrders = orders.filter(
    (order: OrderWithItems) => order.status !== Status.COMPLETED
  );

  const hasCompleteOrder: boolean =
    completeOrders.length > 0 || user.companyId === "616";
  const hasIncompleteOrder: boolean = incompleteOrders.length > 0;

  return (
    <Home
      company={company ?? ({} as Company)}
      locations={locations}
      orders={orders}
      user={user}
      skus={skus}
      hasCompleteOrder={hasCompleteOrder}
      hasIncompleteOrder={hasIncompleteOrder}
    />
  );
}
