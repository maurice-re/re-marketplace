import { Company, User } from "@prisma/client";
import { FullOrder, useServerStore } from "../server-store";
import Home from "./home/home";

export default async function Page() {
  const user: User = await useServerStore.getState().getUser();
  const orders: FullOrder[] = await useServerStore.getState().getOrders();
  const company = await useServerStore.getState().getCompany();
  const skus = await useServerStore.getState().getSkus();

  return (
    <Home
      company={company ?? ({} as Company)}
      orders={orders}
      user={user}
      skus={skus}
    />
  );
}
