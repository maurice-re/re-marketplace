import Head from "next/head";
import { FullLocation, useServerStore } from "../../server-store";
import TrackingWithFilter from "./trackingWithFilter";

function getUniqueLocations(locations: FullLocation[]) {
  const uniqueLocations: FullLocation[] = [];
  locations.forEach((location: FullLocation) => {
    if (!uniqueLocations.some(l => l.id === location.id)) {
      uniqueLocations.push(location);
    }
  });
  return uniqueLocations;
}

export default async function Page() {
  const ownedLocations = await useServerStore.getState().getLocations(true);
  const viewableLocations = await useServerStore.getState().getLocations(false);
  const groups = await useServerStore.getState().getGroups(false);
  const skus = await useServerStore.getState().getSkus();
  const orders = await useServerStore.getState().getOrders();

  const locations = getUniqueLocations([...ownedLocations, ...viewableLocations]); // Show both owned and viewable locations on tracking page

  const hasEvents = locations.some((location) => location.events.length > 0);
  if (!hasEvents) {
    return (
      <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto px-6">
        {/* <head>
          <title>Tracking</title>
          <meta name="tracking" content="Tracking" />
          <link rel="icon" href="/favicon.ico" />
        </head> */}
        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
          <div>Integrate with our API and see your system KPIs</div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto px-6">
      <Head>
        <title>Tracking</title>
        <meta name="tracking" content="Tracking" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <TrackingWithFilter
          demo={false}
          locations={locations}
          groups={groups}
          skus={skus}
          orders={orders}
        />
      </main>
    </div>
  );
}
