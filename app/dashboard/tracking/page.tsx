import { Company, Event, Settings, User } from "@prisma/client";
import prisma from "../../../constants/prisma";
import { useServerStore } from "../../server-store";
import Tracking from "./tracking";

// https://github.com/nextauthjs/next-auth/issues/5647

export type UserSettings =
  | (User & {
    company: Company & {
      settings: Settings | null;
    };
  })
  | null;

export default async function Page() {
  const user = await useServerStore.getState().getUser();
  const skus = await useServerStore.getState().getSkus();

  const ownedLocations = await useServerStore.getState().getLocations(true);
  const viewableLocations = await useServerStore.getState().getLocations(false);

  const locations = [...ownedLocations, ...viewableLocations];

  console.log("Using location with ID ", locations[0].id);

  const events: Event[] = await prisma.event.findMany({
    where: { locationId: locations[0].id },
  });

  return (
    <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto px-6">
      {/* <head>
        <title>Tracking</title>
        <meta name="tracking" content="Tracking" />
        <link rel="icon" href="/favicon.ico" />
      </head> */}
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <Tracking
          skus={skus}
          demo={false}
          locations={locations}
        />
      </main>
    </div>
  );
}
