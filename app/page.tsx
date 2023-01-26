import { Order, User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "../constants/prisma";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    redirect("/form/location");
  }

  const user = session.user as User;
  const orders: Order[] = await prisma.order.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  if (orders.length === 0) {
    // redirect to shop if they have no orders, including if they just signed in for
    // the first time
    redirect("/dashboard/store");
  }

  redirect("/dashboard");
  return <div>Redirecting...</div>;
}
