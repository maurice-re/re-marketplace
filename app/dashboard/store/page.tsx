import prisma from "../../../constants/prisma";
import { useServerStore } from "../../server-store";
import StorePage from "./store";

export default async function Page() {
  const user = await useServerStore.getState().getUser();
  const skus = await prisma.sku.findMany({});
  const products = await prisma.product.findMany({});
  const locations = await useServerStore.getState().getLocations(user.id);

  return (
    <StorePage
      user={user}
      initialLocations={locations}
      products={products}
      skus={skus}
    />
  );
}
