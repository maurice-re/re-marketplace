import { Company, OrderItem } from "@prisma/client";
import Head from "next/head";
import { SkuProduct } from "../../../utils/dashboard/dashboardUtils";
import { FullLocation, FullOrder, useServerStore } from "../../server-store";
import OrderWithFilter from "./orderWithFilter";

export default async function Page() {
  const orders: FullOrder[] = await useServerStore.getState().getOrders();
  const orderItems: OrderItem[] = await useServerStore.getState().getOrderItems();
  const locations: FullLocation[] = await useServerStore.getState().getLocations(true);
  const skus: SkuProduct[] = await useServerStore.getState().getSkus();

  const company: Company = {} as Company;

  return (
    <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto">
      <Head>
        <title>Order</title>
        <meta name="tracking" content="Order" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col w-full mx-auto py-6 text-white font-theinhardt">
        <OrderWithFilter company={company} locations={locations} skus={skus} allOrders={orders} allOrderItems={orderItems} />
      </main>
    </div>);

}
