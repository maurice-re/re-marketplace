import { Company, Event, Settings, User } from "@prisma/client";
import { Session, unstable_getServerSession } from "next-auth";
import prisma from "../../../constants/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import Tracking from "./tracking";

// https://github.com/nextauthjs/next-auth/issues/5647

export type UserSettings =
  | (User & {
      company: Company & {
        settings: Settings | null;
      };
    })
  | null;

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
      company: {
        include: {
          settings: true,
        },
      },
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
  const user: UserSettings = await getUser(session);
  const skus = await getSkus();
  const events: Event[] = await prisma.event.findMany({
    where: { companyId: user?.company.id ?? "" },
  });

  return (
    <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto px-6">
      {/* <head>
        <title>Tracking</title>
        <meta name="tracking" content="Tracking" />
        <link rel="icon" href="/favicon.ico" />
      </head> */}
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        {/* TODO: Revert back to non demo */}
        <Tracking
          user={user}
          skus={skus}
          demo={true}
          events={JSON.parse(JSON.stringify(events))}
        />
      </main>
    </div>
  );
}
