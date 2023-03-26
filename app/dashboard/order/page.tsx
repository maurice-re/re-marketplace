import { Company } from "@prisma/client";
import { SkuProduct } from "../../../utils/dashboard/dashboardUtils";
import { FullLocation, FullOrder, useServerStore } from "../../server-store";
import OrderWithFilter from "./orderWithFilter";

export default async function Page() {
  const orders: FullOrder[] = await useServerStore.getState().getOrders();
  const locations: FullLocation[] = await useServerStore.getState().getLocations(true);
  const skus: SkuProduct[] = await useServerStore.getState().getSkus();

  const company: Company = {} as Company;

  return (<OrderWithFilter company={company} locations={locations} skus={skus} allOrders={orders} />);
}
