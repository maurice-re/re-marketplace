import { Company, Settings, Sku, User } from "@prisma/client";
import { Session, unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "../../../constants/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import TrackingContent from "./trackingContent";

// https://github.com/nextauthjs/next-auth/issues/5647

export type UserSettings =
  | (User & {
      company: Company & {
        settings: Settings | null;
      };
    })
  | null;

async function getSkus(): Promise<Sku[]> {
  return await prisma.sku.findMany();
}

async function getUser(session: Session): Promise<UserSettings | null> {
  return JSON.parse(
    JSON.stringify(
      await prisma.user.findUnique({
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
      })
    )
  );
}

export default async function Page() {
  // TODO(Suhana): What should we do here if there isn't a session?
  const session = await unstable_getServerSession(authOptions);
  if (!session || !session.user) {
    // TODO redirect to signin
    redirect("/form/location");
  }

  const user: UserSettings = await getUser(session);
  const skus = await getSkus();

  return (
    <div className="w-full h-screen bg-black flex overflow-auto">
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt">
        <TrackingContent user={user} skus={skus} />
      </main>
    </div>
  );
}
