import { Company, Event, Location, User } from "@prisma/client";
import { Session, unstable_getServerSession } from "next-auth";
import prisma from "../../../constants/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { LocationSettings, UserCompany } from "../../../utils/dashboard/dashboardUtils";
import Tracking from "./tracking";

async function getSkus() {
  const skus = await prisma.sku.findMany();
  return JSON.parse(JSON.stringify(skus));
}

async function getUser(session: Session) {
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
    include: {
      company: true,
    },
  });
  return JSON.parse(JSON.stringify(user));
}

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    //TODO: redirect to login
    return <div>Not logged in</div>;
  }
  const user: UserCompany = await getUser(session);
  const skus = await getSkus();

  // TODO(Suhana): Implement location selection after switch to location-based, and get location/events from that
  const events: Event[] = await prisma.event.findMany({
    where: { companyId: user?.company.id ?? "" },
  });
  const location: LocationSettings | null = await prisma.location.findUnique({
    where: {
      id: "219"
    },
    include: {
      settings: true,
    }
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
          user={user}
          skus={skus}
          demo={false}
          events={JSON.parse(JSON.stringify(events))}
          location={location ?? {} as LocationSettings}
        />
      </main>
    </div>
  );
}
