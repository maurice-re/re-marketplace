import { FullProduct, useServerStore } from "../server-store";
import StoreManager from "./storeManager";

export default async function Page() {
  const products: FullProduct[] = await useServerStore.getState().getProducts();
  return (
    <div className="flex h-screen flex-grow bg-re-black">
      <StoreManager products={products} />
    </div>
  );
}
