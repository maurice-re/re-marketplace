import { useServerStore } from "../../server-store";
import Tracking from "./tracking";

export default async function Page() {
  const ownedLocations = await useServerStore.getState().getLocations(true);
  const viewableLocations = await useServerStore.getState().getLocations(false);

  const locations = [...ownedLocations, ...viewableLocations];

  return (
    <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto px-6">
      {/* <head>
        <title>Tracking</title>
        <meta name="tracking" content="Tracking" />
        <link rel="icon" href="/favicon.ico" />
      </head> */}
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <Tracking
          demo={false}
          // TODO(Suhana): These fields should be fetched based on the filter
          initialSettings={locations[0].settings}
          events={locations[0].events}
        />
      </main>
    </div>
  );
}
