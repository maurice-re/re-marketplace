import { Order, User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import SignInForm from "./signinForm";

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);

  if (session) {
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
    else {
      redirect("/dashboard");
    }
  }

  const emails = await prisma.user
    .findMany({
      select: {
        email: true,
      },
    })
    .then((users) => {
      return users.map((user) => {
        return user.email;
      });
    });
  return (
    <div className="flex flex-col h-screen w-full bg-re-dark-green-500 items-center justify-center font-theinhardt">
      <SignInForm emails={emails} />
    </div>
  );
}
