import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "../../constants/prisma";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { useServerStore } from "../server-store";
import SignInForm from "./signinForm";

export default async function Page() {
  console.log("signin page");
  const session = await unstable_getServerSession(authOptions);

  console.log("session", session);
  if (session) {
    const orders = await useServerStore.getState().getOrders();

    if (orders.length === 0) {
      // redirect to shop if they have no orders, including if they just signed in for
      // the first time
      redirect("/dashboard/store");
    } else {
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
