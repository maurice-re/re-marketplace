import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export default async function Page() {
  const session = await unstable_getServerSession(authOptions);
  if (session == null) {
    redirect("/form/location");
  } else {
    redirect("/dashboard");
  }
}
