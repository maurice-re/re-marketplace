import { Session, unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "../../../constants/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { UserCompany } from "../../../utils/dashboard/dashboardUtils";
import AccountContent from "./accountContent";

async function getUser(session: Session): Promise<UserCompany | null> {
  return await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
    include: {
      company: true,
    },
  });
}

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (!session || !session.user) {
    //TODO redirect to signin
    redirect("/form/location");
  }

  const user: UserCompany | null = await getUser(session);

  return <AccountContent user={user!} />;
}
