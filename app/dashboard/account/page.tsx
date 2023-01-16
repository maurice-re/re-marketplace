import { Session, unstable_getServerSession } from "next-auth";
import prisma from "../../../constants/prisma";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { UserCompany } from "../../../utils/dashboard/dashboardUtils";
import Account from "./account";

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

  return <Account user={user} />;
}
