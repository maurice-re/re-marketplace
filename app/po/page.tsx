import "tailwindcss/tailwind.css";
import POSummary from "../../components/po/poSummary";
import prisma from "../../constants/prisma";
import { CheckoutType } from "../../utils/checkoutUtils";
import { useServerStore } from "../server-store";

export default async function Page({
  searchParams,
}: {
  searchParams?: { orderString: string };
}) {
  if (!(searchParams && searchParams.orderString)) {
    return <div>An error occurred</div>;
  }

  const { orderString } = searchParams;

  const user = await useServerStore.getState().getUser();
  const company = await useServerStore.getState().getCompany(user.companyId);
  const locations = await useServerStore.getState().getLocations(user.id);
  const products = await prisma.product.findMany({});
  const skus = await prisma.sku.findMany({});

  return (
    <div className="w-full h-screen bg-re-black flex">
      <POSummary
        company={JSON.parse(JSON.stringify(company))}
        locations={JSON.parse(JSON.stringify(locations))}
        orderString={orderString}
        products={products}
        skus={skus}
        type={CheckoutType.ORDER}
      />
    </div>
  );
}
// dimensions, net weight, and gross weight
