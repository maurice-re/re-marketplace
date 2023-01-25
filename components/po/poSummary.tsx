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
  company,
  locations,
  orderString,
  products,
  skus,
  type,
  user,
}: POSummaryProps) {
  return (
    <main className="w-full h-full text-white overflow-auto">
      <div className="py-6 flex flex-col items-center w-full justify-center">
        <ReLogo />
        <POItems
          locations={JSON.parse(JSON.stringify(company?.locations))}
          orderString={orderString}
          products={products}
          skus={skus}
          type={CheckoutType.ORDER}
        />
        <POForm orderString={orderString} />
      </div>
    </main>
  );
}
