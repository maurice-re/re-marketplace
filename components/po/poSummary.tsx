"use client";

import {
  Company,
  Location,
  Product,
  ProductDevelopment,
  Sku,
  User,
} from "@prisma/client";
import { CheckoutType } from "../../utils/checkoutUtils";
import ReLogo from "../form/re-logo";
import POForm from "./poForm";
import POItems from "./poItems";

type POSummaryProps = {
  company?: Company & { locations: Location[] };
  locations?: Location[];
  loggedIn?: boolean;
  orderString: string;
  productDevelopment?: ProductDevelopment;
  products?: Product[];
  skus?: Sku[];
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
      <div className="w-full flex">
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
