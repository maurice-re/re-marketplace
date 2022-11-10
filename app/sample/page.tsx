import ReLogo from "../../components/form/re-logo";
import prisma from "../../constants/prisma";
import { SkuProduct } from "../../utils/dashboard/dashboardUtils";
import SampleOrder from "./sampleOrder";

type SampleProps = {
  skus: SkuProduct[];
};

export default async function Page() {
  const skus = await prisma.sku.findMany({
    include: {
      product: true,
    },
  });

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
      <ReLogo />
      <main className="flex flex-col w-full container mx-auto h-full justify-start py-3 items-start pr-5">
        <div className="ml-1 font-theinhardt text-4xl pt-10 text-left">
          Order Samples
        </div>
        <div className="ml-1 font-theinhardt text-xl py-5 pb-20 text-left">
          Select one or more products to proceed to checkout and try out Re!
        </div>
        <SampleOrder skus={skus} />
      </main>
    </div>
  );
}
