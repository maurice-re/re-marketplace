import { Company, Event, Settings, User } from "@prisma/client";
import { prisma } from "../../../constants/prisma";
import { LocationSettings } from "../../../utils/dashboard/dashboardUtils";
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

  const events: Event[] = await prisma.event.findMany({
    where: { companyId: user.companyId },
  });

  // TODO(Suhana): URGENT - Implement location selection after switch to location-based, and get location/events from that
  const location: LocationSettings | null = await prisma.location.findUnique({
    where: {
      id: "219",
    },
    include: {
      settings: true,
    },
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
          events={JSON.parse(JSON.stringify(events))}
          location={location ?? ({} as LocationSettings)}
        />
      </main>
    </div>
  );
}
