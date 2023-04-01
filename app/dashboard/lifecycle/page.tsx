import Head from "next/head";
import { AiOutlineDisconnect } from "react-icons/ai";

import { prisma } from "../../../constants/prisma";
import { getUniqueLocations } from "../../../utils/dashboard/dashboardUtils";
import { useServerStore } from "../../server-store";
import LifecycleWithFilter from "./lifecycleWithFilter";

export default async function Page() {
  const ownedLocations = await useServerStore.getState().getLocations(true);
  const viewableLocations = await useServerStore.getState().getLocations(false);
  const groups = await useServerStore.getState().getGroups(false);
  const skus = await useServerStore.getState().getSkus();
  const orders = await useServerStore.getState().getOrders();

  const locations = getUniqueLocations([
    ...ownedLocations,
    ...viewableLocations,
  ]); // Show both owned and viewable locations on tracking page

  const events = await prisma.event.findMany({});

  // TODO(Suhana): Filters to add here: locations, groups, skus, orders

  const hasEvents = locations.some((location) => location.events.length > 0);
  if (!hasEvents) {
    return (
      <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto">
        <Head>
          <title>Lifecycle</title>
          <meta name="lifecycle" content="Lifecycle" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
          <div className="flex gap-3 mx-auto h-full items-start justify-start px-6 pt-6 border-re-gray-300 border-t-1/2">
            <AiOutlineDisconnect className="text-re-green-500" size={40} />
            <div className="text-white font-theinhardt text-28">
              Integrate with our API to see emissions savings
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full flex bg-re-dark-green-500 h-screen font-theinhardt overflow-auto">
      <Head>
        <title>Lifecycle</title>
        <meta name="lifecycle" content="Lifecycle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col py-6 w-full">
        <LifecycleWithFilter
          locations={locations}
          groups={groups}
          skus={skus}
          orders={orders}
        />
      </main>
    </div>
  );
}
