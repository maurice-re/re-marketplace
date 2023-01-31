import { redirect } from "next/navigation";
import { useServerStore } from "./server-store";

export default async function Page() {
  await useServerStore.getState().getUser(false, "/form/location");
  const orders = await useServerStore.getState().getOrders();

  if (orders.length === 0) {
    // redirect to shop if they have no orders, including if they just signed in for
    // the first time
    redirect("/dashboard/store");
  }

  redirect("/dashboard");
  return <div>Redirecting...</div>;
}
