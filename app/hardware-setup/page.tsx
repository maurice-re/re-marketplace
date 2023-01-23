import { User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import HardwareForm from "./hardwareForm";

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  const user = session.user as User;
  const company = await prisma.company.findUnique({
    where: { id: user.companyId },
    include: { locations: true },
  });

  if (!company) {
    redirect("/signin");
  }
  if (!company.locations) {
    return (
      <div className="flex flex-col h-screen w-full bg-re-dark-green-500 items-center justify-center font-theinhardt">
        <div className="flex">
          <h1 className="text-2xl"> You have no locations.</h1>
          <a
            href="/"
            className="text-2xl hover:underline hover:text-re-purple-500 ml-1"
          >
            Go back
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-re-dark-green-500 items-center justify-center font-theinhardt">
      <HardwareForm locations={company.locations} />
    </div>
  );
}
