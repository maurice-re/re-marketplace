"use client";

import { Company, Product, ProductDevelopment, User } from "@prisma/client";
import { FullLocation, FullSku } from "../../app/server-store";
import { CheckoutType } from "../../utils/checkoutUtils";
import ReLogo from "../form/re-logo";
import POForm from "./poForm";
import POItems from "./poItems";

type POSummaryProps = {
  company?: Company & { locations: FullLocation[] };
  locations?: FullLocation[];
  loggedIn?: boolean;
  orderString: string;
  productDevelopment?: ProductDevelopment;
  products?: Product[];
  skus?: FullSku[];
  type: CheckoutType;
  user?: User;
};

export default function POSummary({
  locations,
  orderString,
  products,
  skus,
}: POSummaryProps) {
  return (
    <div className="w-full h-screen bg-black flex items-start justify-center text-white">
      <ReLogo />
      <div className="w-full flex mt-20">
        <POItems
          locations={locations}
          orderString={orderString}
          products={products}
          skus={skus}
          type={CheckoutType.ORDER}
        />
        <POForm orderString={orderString} />
      </div>
    </div>
  );
}
