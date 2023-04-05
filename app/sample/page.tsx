import ReLogo from "../../components/form/re-logo";
import { FullSku, useServerStore } from "../server-store";
import Sample from "./sampleOrder";

export default async function Page() {
  const skus: FullSku[] = await useServerStore.getState().getSkus();
  // Only use one color per sku
  const filteredSkus = skus.filter((sku) => sku.color === "gray");

  return (
    <div className="w-full h-screen bg-re-dark-green-500 flex overflow-auto px-6 text-white font-theinhardt">
      <ReLogo />
      <main className="flex flex-col w-full container mx-auto h-full justify-start py-3 items-start pr-5">
        <div className="ml-1 text-4xl pt-10 text-left">Request Samples</div>
        <div className="ml-1 text-xl py-5 pb-10 text-left">
          Select as many products as you would like!
        </div>
        <Sample skus={filteredSkus} />
      </main>
    </div>
  );
}
